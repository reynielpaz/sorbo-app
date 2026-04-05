import { useEffect, useMemo, useState } from 'react';
import type { BusinessHours } from '@/features/home/types';
import { getBusinessHoursConfig } from '@/services/products';
import { APP_NAME, WHATSAPP_NUMBER } from '@/utils/constants';
import {
  buildBusinessScheduleGroups,
  DEFAULT_BUSINESS_HOURS,
  formatBusinessScheduleSummary,
  formatBusinessTimeLabel,
  getBusinessDayKeyFromDate,
} from '@/utils/businessHours';

export interface ReservationTimeOption {
  value: string;
  label: string;
}

export interface ReservationTimeGroup {
  key: string;
  label: string;
  note: string;
  options: ReservationTimeOption[];
}

export type ReservationOccasion = 'Cumpleaños' | 'Cita' | 'Negocios' | 'Otro';

export interface ReservationOccasionOption {
  value: ReservationOccasion;
  label: string;
  description: string;
}

export interface ReservationFieldErrors {
  visitDate?: string;
  visitTime?: string;
  guestCount?: string;
  customerName?: string;
}

type ReservationFieldName = keyof ReservationFieldErrors;

interface UseReservationFormOptions {
  initialCustomerName?: string | null;
  initialCustomerPhone?: string | null;
}

const CUSTOMER_NAME_LIMIT = 80;
const CUSTOMER_PHONE_LIMIT = 24;
const SPECIAL_NOTES_LIMIT = 280;

export const RESERVATION_OCCASION_OPTIONS: readonly ReservationOccasionOption[] = [
  {
    value: 'Cumpleaños',
    label: 'Cumpleaños',
    description: 'Para celebrar.',
  },
  {
    value: 'Cita',
    label: 'Cita',
    description: 'Para una noche especial.',
  },
  {
    value: 'Negocios',
    label: 'Negocios',
    description: 'Para conversar con calma.',
  },
  {
    value: 'Otro',
    label: 'Otro',
    description: 'Otro motivo.',
  },
];

function getTodayDateValue() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

function capitalizeText(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function normalizeSingleLine(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function normalizePhone(value: string) {
  return value.trim().replace(/\s{2,}/g, ' ');
}

function normalizeNotes(value: string) {
  return value
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ');
}

function formatReservationDate(value: string, mode: 'long' | 'short') {
  if (!value) {
    return '';
  }

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const formatter = new Intl.DateTimeFormat(
    'es-VE',
    mode === 'long'
      ? {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }
      : {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }
  );

  return capitalizeText(formatter.format(date));
}

function buildRequiredErrors(values: {
  visitDate: string;
  visitTime: string;
  guestCount: number;
  customerName: string;
  minDate: string;
}) {
  const errors: ReservationFieldErrors = {};

  if (!values.visitDate) {
    errors.visitDate = 'Selecciona la fecha de tu visita.';
  } else if (values.visitDate < values.minDate) {
    errors.visitDate = 'Elige una fecha desde hoy en adelante.';
  }

  if (!values.visitTime) {
    errors.visitTime = 'Selecciona una hora sugerida.';
  }

  if (!Number.isFinite(values.guestCount) || values.guestCount < 1) {
    errors.guestCount = 'Indica cuántas personas serán.';
  }

  if (values.customerName.length < 2) {
    errors.customerName = 'Ingresa el nombre para la reserva.';
  }

  return errors;
}

function joinLabels(items: string[]) {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} y ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

function buildSupportCopy(errors: ReservationFieldErrors) {
  const missingFields: string[] = [];

  if (errors.visitDate) missingFields.push('fecha');
  if (errors.visitTime) missingFields.push('hora');
  if (errors.guestCount) missingFields.push('personas');
  if (errors.customerName) missingFields.push('nombre');

  if (missingFields.length === 0) {
    return 'Se abrirá en WhatsApp lista para enviar.';
  }

  return `Completa ${joinLabels(missingFields)} para continuar.`;
}

function buildWhatsAppMessage(options: {
  visitDateLabel: string;
  visitTimeLabel: string;
  guestCount: number;
  occasionLabel: string;
  specialNotes: string;
  customerName: string;
  customerPhone: string;
}) {
  const lines = [
    `Hola, equipo de ${APP_NAME} 👋`,
    '',
    'Quiero solicitar una reserva:',
    '',
    `📅 Fecha: ${options.visitDateLabel}`,
    `🕖 Hora: ${options.visitTimeLabel}`,
    `👥 Comensales: ${options.guestCount}`,
    '',
    'Ocasión:',
    `- ${options.occasionLabel}`,
    '',
    'Notas especiales:',
    `- ${options.specialNotes}`,
    '',
    'Cliente:',
    `- Nombre: ${options.customerName}`,
  ];

  if (options.customerPhone) {
    lines.push(`- Teléfono: ${options.customerPhone}`);
  }

  lines.push('', '¿Me confirman disponibilidad, por favor?', 'Gracias.');

  return lines.join('\n');
}

export function useReservationForm(options?: UseReservationFormOptions) {
  const [businessHours, setBusinessHours] = useState<BusinessHours>(DEFAULT_BUSINESS_HOURS);
  const [businessHoursLoading, setBusinessHoursLoading] = useState(true);
  const [visitDate, setVisitDateState] = useState('');
  const [visitTime, setVisitTimeState] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [occasion, setOccasionState] = useState<ReservationOccasion | ''>('');
  const [specialNotes, setSpecialNotesState] = useState('');
  const [customerName, setCustomerNameState] = useState(options?.initialCustomerName?.trim() ?? '');
  const [customerPhone, setCustomerPhoneState] = useState(options?.initialCustomerPhone?.trim() ?? '');
  const [touchedFields, setTouchedFields] = useState<Partial<Record<ReservationFieldName, boolean>>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [hasEditedCustomerName, setHasEditedCustomerName] = useState(false);
  const [hasEditedCustomerPhone, setHasEditedCustomerPhone] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadBusinessHours() {
      try {
        const nextBusinessHours = await getBusinessHoursConfig();

        if (!active) {
          return;
        }

        setBusinessHours(nextBusinessHours);
        setBusinessHoursLoading(false);
      } catch {
        if (!active) {
          return;
        }

        setBusinessHours(DEFAULT_BUSINESS_HOURS);
        setBusinessHoursLoading(false);
      }
    }

    void loadBusinessHours();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const initialCustomerName = options?.initialCustomerName?.trim() ?? '';

    if (!hasEditedCustomerName && initialCustomerName) {
      setCustomerNameState((currentValue) => currentValue || initialCustomerName);
    }
  }, [hasEditedCustomerName, options?.initialCustomerName]);

  useEffect(() => {
    const initialCustomerPhone = options?.initialCustomerPhone?.trim() ?? '';

    if (!hasEditedCustomerPhone && initialCustomerPhone) {
      setCustomerPhoneState((currentValue) => currentValue || initialCustomerPhone);
    }
  }, [hasEditedCustomerPhone, options?.initialCustomerPhone]);

  const minDate = getTodayDateValue();
  const selectedBusinessDay = useMemo(() => getBusinessDayKeyFromDate(visitDate), [visitDate]);
  const selectedDaySchedule = useMemo(
    () => (selectedBusinessDay ? businessHours[selectedBusinessDay] : []),
    [businessHours, selectedBusinessDay]
  );
  const timeGroups = useMemo<ReservationTimeGroup[]>(
    () => (visitDate ? buildBusinessScheduleGroups(selectedDaySchedule) : []),
    [selectedDaySchedule, visitDate]
  );
  const availableTimeValues = useMemo(
    () => new Set(timeGroups.flatMap((group) => group.options.map((option) => option.value))),
    [timeGroups]
  );
  const sanitizedCustomerName = normalizeSingleLine(customerName);
  const sanitizedCustomerPhone = normalizePhone(customerPhone);
  const sanitizedSpecialNotes = normalizeNotes(specialNotes);
  const formattedDateLabel = formatReservationDate(visitDate, 'long');
  const formattedDateShortLabel = formatReservationDate(visitDate, 'short');
  const formattedTimeLabel = visitTime ? formatBusinessTimeLabel(visitTime) : '';
  const selectedDayScheduleSummary = formatBusinessScheduleSummary(selectedDaySchedule);
  const isClosedForSelectedDate =
    Boolean(visitDate) && !businessHoursLoading && selectedDaySchedule.length === 0;
  const occasionLabel = occasion || 'Sin ocasión especial indicada.';
  const notesLabel = sanitizedSpecialNotes || 'Sin peticiones especiales por ahora.';
  const errors = buildRequiredErrors({
    visitDate,
    visitTime,
    guestCount,
    customerName: sanitizedCustomerName,
    minDate,
  });
  const isValid = Object.keys(errors).length === 0;

  const visibleErrors: ReservationFieldErrors = {
    visitDate: hasAttemptedSubmit || touchedFields.visitDate ? errors.visitDate : undefined,
    visitTime: hasAttemptedSubmit || touchedFields.visitTime ? errors.visitTime : undefined,
    guestCount: hasAttemptedSubmit || touchedFields.guestCount ? errors.guestCount : undefined,
    customerName: hasAttemptedSubmit || touchedFields.customerName ? errors.customerName : undefined,
  };

  const supportCopy = buildSupportCopy(errors);
  const summaryLabel = [
    `${guestCount} ${guestCount === 1 ? 'persona' : 'personas'}`,
    formattedDateShortLabel || 'Fecha por definir',
    formattedTimeLabel || 'Hora por definir',
  ].join(' · ');

  const whatsappMessage = buildWhatsAppMessage({
    visitDateLabel: formattedDateLabel || 'Por definir',
    visitTimeLabel: formattedTimeLabel || 'Por definir',
    guestCount,
    occasionLabel,
    specialNotes: notesLabel,
    customerName: sanitizedCustomerName || 'Por definir',
    customerPhone: sanitizedCustomerPhone,
  });

  const whatsappHref = isValid
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  useEffect(() => {
    if (visitTime && !availableTimeValues.has(visitTime)) {
      setVisitTimeState('');
    }
  }, [availableTimeValues, visitTime]);

  function markFieldAsTouched(field: ReservationFieldName) {
    setTouchedFields((currentFields) =>
      currentFields[field]
        ? currentFields
        : {
            ...currentFields,
            [field]: true,
          }
    );
  }

  function setVisitDate(nextValue: string) {
    setVisitDateState(nextValue);
  }

  function touchVisitDate() {
    markFieldAsTouched('visitDate');
  }

  function setVisitTime(nextValue: string) {
    markFieldAsTouched('visitTime');
    setVisitTimeState(nextValue);
  }

  function incrementGuestCount() {
    markFieldAsTouched('guestCount');
    setGuestCount((currentValue) => Math.min(20, currentValue + 1));
  }

  function decrementGuestCount() {
    markFieldAsTouched('guestCount');
    setGuestCount((currentValue) => Math.max(1, currentValue - 1));
  }

  function setOccasion(nextValue: ReservationOccasion) {
    setOccasionState((currentValue) => (currentValue === nextValue ? '' : nextValue));
  }

  function setSpecialNotes(nextValue: string) {
    setSpecialNotesState(nextValue.slice(0, SPECIAL_NOTES_LIMIT));
  }

  function setCustomerName(nextValue: string) {
    setHasEditedCustomerName(true);
    setCustomerNameState(nextValue.slice(0, CUSTOMER_NAME_LIMIT));
  }

  function touchCustomerName() {
    markFieldAsTouched('customerName');
  }

  function setCustomerPhone(nextValue: string) {
    setHasEditedCustomerPhone(true);
    setCustomerPhoneState(nextValue.slice(0, CUSTOMER_PHONE_LIMIT));
  }

  function submitReservation() {
    setHasAttemptedSubmit(true);
    setTouchedFields((currentFields) => ({
      ...currentFields,
      visitDate: true,
      visitTime: true,
      guestCount: true,
      customerName: true,
    }));

    if (!whatsappHref) {
      return false;
    }

    const popup = window.open(whatsappHref, '_blank', 'noopener,noreferrer');

    if (!popup) {
      window.location.href = whatsappHref;
    }

    return true;
  }

  return {
    visitDate,
    visitTime,
    guestCount,
    occasion,
    specialNotes,
    customerName,
    customerPhone,
    minDate,
    notesLimit: SPECIAL_NOTES_LIMIT,
    specialNotesCount: specialNotes.length,
    businessHoursLoading,
    timeGroups,
    isClosedForSelectedDate,
    selectedDayScheduleSummary,
    occasionOptions: RESERVATION_OCCASION_OPTIONS,
    visibleErrors,
    isValid,
    supportCopy,
    summaryLabel,
    whatsappMessage,
    whatsappHref,
    formattedDateLabel,
    formattedTimeLabel,
    setVisitDate,
    touchVisitDate,
    setVisitTime,
    incrementGuestCount,
    decrementGuestCount,
    setOccasion,
    setSpecialNotes,
    setCustomerName,
    touchCustomerName,
    setCustomerPhone,
    submitReservation,
  };
}
