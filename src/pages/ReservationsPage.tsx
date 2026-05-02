import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ChevronDown, MessageSquareText, Phone, UserRound } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ReservationActionBar } from '@/features/reservations/components/ReservationActionBar';
import { ReservationGuestStepper } from '@/features/reservations/components/ReservationGuestStepper';
import { ReservationHero } from '@/features/reservations/components/ReservationHero';
import { ReservationOccasionSelector } from '@/features/reservations/components/ReservationOccasionSelector';
import { ReservationSectionCard } from '@/features/reservations/components/ReservationSectionCard';
import { ReservationTimeSelector } from '@/features/reservations/components/ReservationTimeSelector';
import { useReservationForm } from '@/features/reservations/hooks/useReservationForm';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';
import { VENEZUELAN_MOBILE_PREFIXES } from '@/utils/constants';

const fieldSurfaceClassName =
  'group relative flex items-center gap-3 overflow-hidden rounded-[18px] border bg-[#05070B]/72 px-3.5 py-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition-[border-color,box-shadow] duration-200';
const fieldIconClassName =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] border border-[#D4A853]/12 bg-black/[0.22] text-[#E8C068]';
const labelClassName =
  'mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42';
const DEFAULT_PHONE_PREFIX = VENEZUELAN_MOBILE_PREFIXES[0].value;
const AUTOFILL_DARK_FIELD_CLASS =
  'caret-[#D4A853] [color-scheme:dark] [&:-webkit-autofill]:[-webkit-text-fill-color:#FFFFFF] [&:-webkit-autofill]:[box-shadow:0_0_0px_1000px_#05070B_inset] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]';

type VenezuelanMobilePrefix = (typeof VENEZUELAN_MOBILE_PREFIXES)[number]['value'];

function isVenezuelanMobilePrefix(value: string): value is VenezuelanMobilePrefix {
  return VENEZUELAN_MOBILE_PREFIXES.some((prefix) => prefix.value === value);
}

function normalizeReservationPhoneDigits(value: string) {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('58') && digits.length === 12) {
    digits = `0${digits.slice(2)}`;
  }

  return digits;
}

function sanitizeLocalPhoneNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 7);
}

function parseReservationPhone(value?: string | null) {
  const phone = normalizeReservationPhoneDigits(value ?? '');
  const prefix = phone.slice(0, 4);
  const localNumber = phone.slice(4, 11);

  if (phone.length !== 11 || !isVenezuelanMobilePrefix(prefix) || localNumber.length !== 7) {
    return { prefix: null, localNumber: '' };
  }

  return { prefix, localNumber };
}

function buildOptionalPhone(prefix: VenezuelanMobilePrefix, localNumber: string) {
  return localNumber ? `${prefix}${localNumber}` : '';
}

export function ReservationsPage() {
  const { profile } = useAuth();
  const parsedProfilePhone = parseReservationPhone(profile?.phone);
  const reservationForm = useReservationForm({
    initialCustomerName: profile?.fullName,
    initialCustomerPhone: profile?.phone,
  });
  const [phonePrefix, setPhonePrefix] = useState<VenezuelanMobilePrefix>(
    parsedProfilePhone.prefix ?? DEFAULT_PHONE_PREFIX
  );
  const [phoneLocalNumber, setPhoneLocalNumber] = useState(parsedProfilePhone.localNumber);
  const [hasEditedPhone, setHasEditedPhone] = useState(false);
  const [isPhonePrefixOpen, setIsPhonePrefixOpen] = useState(false);
  const [areOptionalsOpen, setAreOptionalsOpen] = useState(
    Boolean(reservationForm.occasion || reservationForm.specialNotes.trim())
  );
  const reservationCustomerPhone = reservationForm.customerPhone;
  const setReservationCustomerPhone = reservationForm.setCustomerPhone;

  useEffect(() => {
    if (hasEditedPhone || phoneLocalNumber) {
      return;
    }

    const parsedPhone = parseReservationPhone(reservationCustomerPhone);

    if (!parsedPhone.prefix) {
      return;
    }

    setPhonePrefix(parsedPhone.prefix);
    setPhoneLocalNumber(parsedPhone.localNumber);
  }, [hasEditedPhone, phoneLocalNumber, reservationCustomerPhone]);

  useEffect(() => {
    if (hasEditedPhone || !phoneLocalNumber) {
      return;
    }

    const normalizedPhone = buildOptionalPhone(phonePrefix, phoneLocalNumber);

    if (reservationCustomerPhone !== normalizedPhone) {
      setReservationCustomerPhone(normalizedPhone);
    }
  }, [
    hasEditedPhone,
    phoneLocalNumber,
    phonePrefix,
    reservationCustomerPhone,
    setReservationCustomerPhone,
  ]);

  useEffect(() => {
    if (reservationForm.occasion || reservationForm.specialNotes.trim()) {
      setAreOptionalsOpen(true);
    }
  }, [reservationForm.occasion, reservationForm.specialNotes]);

  function handlePhonePrefixChange(nextPrefix: VenezuelanMobilePrefix) {
    setHasEditedPhone(true);
    setPhonePrefix(nextPrefix);
    setIsPhonePrefixOpen(false);
    setReservationCustomerPhone(buildOptionalPhone(nextPrefix, phoneLocalNumber));
  }

  function handlePhoneLocalNumberChange(value: string) {
    const nextLocalNumber = sanitizeLocalPhoneNumber(value);

    setHasEditedPhone(true);
    setPhoneLocalNumber(nextLocalNumber);
    setReservationCustomerPhone(buildOptionalPhone(phonePrefix, nextLocalNumber));
  }

  return (
    <AppShell showHeader={false}>
      <div className="relative min-h-full overflow-x-hidden pb-[calc(env(safe-area-inset-bottom,0px)+224px)]">
        <ReservationHero />

        <div className="relative z-[1] mx-auto -mt-3 max-w-[720px]">
          <form
            id="reservations-form"
            onSubmit={(event) => {
              event.preventDefault();
              reservationForm.submitReservation();
            }}
            className="px-4 pt-1"
          >
            <div className="space-y-3.5">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06 }}
                className="relative z-10"
              >
                <ReservationSectionCard
                  title="Datos de la visita"
                  description="Selecciona los detalles principales."
                >
                  <div className="space-y-4">
                    <label className="block">
                      <span className={labelClassName}>Fecha de visita</span>
                      <div
                        className={cn(
                          fieldSurfaceClassName,
                          reservationForm.visibleErrors.visitDate
                            ? 'border-[rgba(212,168,83,0.3)] shadow-[0_0_0_1px_rgba(212,168,83,0.12)]'
                            : 'border-white/[0.05] focus-within:border-[#D4A853]/18 focus-within:shadow-[0_0_0_1px_rgba(212,168,83,0.08)]'
                        )}
                      >
                        <div className={fieldIconClassName}>
                          <CalendarDays size={17} className="shrink-0" />
                        </div>
                        <input
                          type="date"
                          min={reservationForm.minDate}
                          value={reservationForm.visitDate}
                          onChange={(event) => reservationForm.setVisitDate(event.target.value)}
                          onBlur={reservationForm.touchVisitDate}
                          className={`w-full bg-transparent text-[14px] outline-none ${AUTOFILL_DARK_FIELD_CLASS}`}
                        />
                      </div>
                      {reservationForm.visitDate ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full border border-white/[0.045] bg-black/[0.16] px-2.5 py-1 text-[11px] text-white/56">
                            {reservationForm.formattedDateLabel}
                          </span>
                          {!reservationForm.businessHoursLoading && reservationForm.selectedDayScheduleSummary ? (
                            <span className="rounded-full border border-white/[0.045] bg-black/[0.16] px-2.5 py-1 text-[11px] text-white/46">
                              {reservationForm.selectedDayScheduleSummary}
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                      {reservationForm.visibleErrors.visitDate ? (
                        <p className="mt-2 text-[12px] leading-5 text-[#E8C37E]">
                          {reservationForm.visibleErrors.visitDate}
                        </p>
                      ) : null}
                    </label>

                    <div>
                      <span className={labelClassName}>Hora sugerida</span>
                      <ReservationTimeSelector
                        hasDate={Boolean(reservationForm.visitDate)}
                        loading={reservationForm.businessHoursLoading}
                        isClosed={reservationForm.isClosedForSelectedDate}
                        groups={reservationForm.timeGroups}
                        value={reservationForm.visitTime}
                        error={reservationForm.visibleErrors.visitTime}
                        onChange={reservationForm.setVisitTime}
                      />
                    </div>

                    <ReservationGuestStepper
                      guestCount={reservationForm.guestCount}
                      isInvalid={Boolean(reservationForm.visibleErrors.guestCount)}
                      error={reservationForm.visibleErrors.guestCount}
                      onDecrease={reservationForm.decrementGuestCount}
                      onIncrease={reservationForm.incrementGuestCount}
                    />
                  </div>
                </ReservationSectionCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
                className={cn('relative z-20', isPhonePrefixOpen && 'z-50')}
              >
                <ReservationSectionCard
                  eyebrow="CONTACTO"
                  title="Tus datos"
                  description="Para confirmar por WhatsApp."
                  allowOverflow
                >
                  <div className="space-y-3">
                    <label className="block">
                      <span className={labelClassName}>Nombre</span>
                      <div
                        className={cn(
                          fieldSurfaceClassName,
                          reservationForm.visibleErrors.customerName
                            ? 'border-[rgba(212,168,83,0.3)] shadow-[0_0_0_1px_rgba(212,168,83,0.12)]'
                            : 'border-white/[0.05] focus-within:border-[#D4A853]/18 focus-within:shadow-[0_0_0_1px_rgba(212,168,83,0.08)]'
                        )}
                      >
                        <div className={fieldIconClassName}>
                          <UserRound size={17} className="shrink-0" />
                        </div>
                        <input
                          type="text"
                          autoComplete="name"
                          value={reservationForm.customerName}
                          onChange={(event) => reservationForm.setCustomerName(event.target.value)}
                          onBlur={reservationForm.touchCustomerName}
                          placeholder="Tu nombre"
                          className={`min-w-0 flex-1 bg-[#05070B]/72 text-[14px] text-white outline-none placeholder:text-white/28 ${AUTOFILL_DARK_FIELD_CLASS}`}
                        />
                      </div>
                      {reservationForm.visibleErrors.customerName ? (
                        <p className="mt-2 text-[12px] leading-5 text-[#E8C37E]">
                          {reservationForm.visibleErrors.customerName}
                        </p>
                      ) : null}
                    </label>

                    <label className="block">
                      <span className={labelClassName}>Teléfono</span>
                      <div
                        className={cn(
                          'relative flex h-12 w-full items-center rounded-[18px] border border-white/[0.05] bg-[#05070B]/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition-[border-color,box-shadow] duration-200 focus-within:border-[#D4A853]/18 focus-within:shadow-[0_0_0_1px_rgba(212,168,83,0.08)]',
                          isPhonePrefixOpen && 'z-50'
                        )}
                        onBlur={(event) => {
                          const nextFocusTarget = event.relatedTarget as Node | null;

                          if (!event.currentTarget.contains(nextFocusTarget)) {
                            setIsPhonePrefixOpen(false);
                          }
                        }}
                      >
                        <div className={`${fieldIconClassName} ml-3`}>
                          <Phone size={17} className="shrink-0" />
                        </div>
                        <button
                          type="button"
                          className="flex h-full min-w-[82px] items-center justify-center gap-1.5 border-x border-white/[0.05] bg-black/[0.26] px-3 text-[13px] font-semibold text-[#F3D7A0] transition-colors duration-200 hover:bg-black/[0.36]"
                          aria-haspopup="listbox"
                          aria-expanded={isPhonePrefixOpen}
                          onClick={(event) => {
                            event.preventDefault();
                            setIsPhonePrefixOpen((isOpen) => !isOpen);
                          }}
                        >
                          {phonePrefix}
                          <ChevronDown
                            size={14}
                            strokeWidth={2.1}
                            className={`transition-transform duration-200 ${
                              isPhonePrefixOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {isPhonePrefixOpen ? (
                          <div
                            role="listbox"
                            className="absolute left-12 top-[calc(100%+8px)] z-[80] w-[104px] overflow-hidden rounded-[14px] border border-white/[0.06] bg-[#05070B] p-1 shadow-[0_20px_38px_rgba(0,0,0,0.52)]"
                          >
                            {VENEZUELAN_MOBILE_PREFIXES.map((prefix) => {
                              const isSelected = phonePrefix === prefix.value;

                              return (
                                <button
                                  key={prefix.value}
                                  type="button"
                                  role="option"
                                  aria-selected={isSelected}
                                  className={`flex h-9 w-full items-center rounded-[10px] px-3 text-[12px] font-semibold transition-colors duration-200 ${
                                    isSelected
                                      ? 'bg-[#D4A853]/14 text-[#F3D7A0]'
                                      : 'text-white/60 hover:bg-white/[0.04] hover:text-white/82'
                                  }`}
                                  onClick={() => handlePhonePrefixChange(prefix.value)}
                                >
                                  {prefix.label}
                                </button>
                              );
                            })}
                          </div>
                        ) : null}

                        <input
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          value={phoneLocalNumber}
                          onChange={(event) => handlePhoneLocalNumberChange(event.target.value)}
                          placeholder="1234567"
                          maxLength={7}
                          className={`h-full min-w-0 flex-1 rounded-r-[17px] bg-[#05070B]/72 px-3.5 text-[14px] text-white outline-none placeholder:text-white/24 ${AUTOFILL_DARK_FIELD_CLASS}`}
                        />
                      </div>
                    </label>
                  </div>
                </ReservationSectionCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                className="relative z-0"
              >
                <section className="overflow-hidden rounded-[18px] border border-white/[0.035] bg-[#05070B]/50">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setAreOptionalsOpen((isOpen) => !isOpen);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-200 hover:bg-black/[0.14]"
                    aria-expanded={areOptionalsOpen}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] border border-[#D4A853]/12 bg-black/[0.22] text-[#E8C068]">
                      <MessageSquareText size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold text-white/82">
                        {areOptionalsOpen ? 'Ocultar opcionales' : 'Agregar motivo o nota'}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-white/36">
                        Opcional
                      </span>
                    </span>
                    <ChevronDown
                      size={17}
                      strokeWidth={2.1}
                      className={`shrink-0 text-white/38 transition-transform duration-200 ${
                        areOptionalsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {areOptionalsOpen ? (
                    <div className="space-y-3 border-t border-white/[0.035] px-4 pb-4 pt-3">
                      <div>
                        <span className={labelClassName}>Motivo</span>
                        <ReservationOccasionSelector
                          options={reservationForm.occasionOptions}
                          value={reservationForm.occasion}
                          onChange={reservationForm.setOccasion}
                        />
                      </div>

                      <label className="block">
                        <span className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42">
                            Detalles
                          </span>
                          <span className="text-[10px] font-medium text-white/30">
                            {reservationForm.specialNotesCount}/{reservationForm.notesLimit}
                          </span>
                        </span>
                        <textarea
                          value={reservationForm.specialNotes}
                          onChange={(event) => reservationForm.setSpecialNotes(event.target.value)}
                          rows={2}
                          maxLength={reservationForm.notesLimit}
                          placeholder="Ej. cumpleaños, mesa tranquila..."
                          className={`min-h-[76px] w-full resize-none rounded-[18px] border border-white/[0.05] bg-[#05070B]/72 px-3.5 py-3 text-[14px] leading-6 text-white outline-none placeholder:text-white/28 focus:border-[#D4A853]/18 focus:shadow-[0_0_0_1px_rgba(212,168,83,0.08)] ${AUTOFILL_DARK_FIELD_CLASS}`}
                        />
                      </label>
                    </div>
                  ) : null}
                </section>
              </motion.div>
            </div>
          </form>

          <ReservationActionBar
            formId="reservations-form"
            isValid={reservationForm.isValid}
            supportCopy={reservationForm.supportCopy}
            summaryLabel={reservationForm.summaryLabel}
          />
        </div>
      </div>
    </AppShell>
  );
}
