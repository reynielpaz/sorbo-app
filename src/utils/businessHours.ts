import type { BusinessDayKey, BusinessHourSlot, BusinessHours } from '@/features/home/types';

const BUSINESS_TIMEZONE = 'America/Caracas';
const DEFAULT_RESERVATION_INTERVAL_MINUTES = 30;

export interface BusinessScheduleOption {
  value: string;
  label: string;
}

export interface BusinessScheduleGroup {
  key: string;
  label: string;
  note: string;
  options: BusinessScheduleOption[];
}

export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  mon: [],
  tue: [],
  wed: [],
  thu: [],
  fri: [],
  sat: [],
  sun: [],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isBusinessHourSlot(value: unknown): value is BusinessHourSlot {
  if (!isRecord(value)) return false;
  return typeof value.open === 'string' && typeof value.close === 'string';
}

export function normalizeBusinessHours(value: unknown): BusinessHours {
  if (!isRecord(value)) {
    return DEFAULT_BUSINESS_HOURS;
  }

  return {
    mon: Array.isArray(value.mon) ? value.mon.filter(isBusinessHourSlot) : [],
    tue: Array.isArray(value.tue) ? value.tue.filter(isBusinessHourSlot) : [],
    wed: Array.isArray(value.wed) ? value.wed.filter(isBusinessHourSlot) : [],
    thu: Array.isArray(value.thu) ? value.thu.filter(isBusinessHourSlot) : [],
    fri: Array.isArray(value.fri) ? value.fri.filter(isBusinessHourSlot) : [],
    sat: Array.isArray(value.sat) ? value.sat.filter(isBusinessHourSlot) : [],
    sun: Array.isArray(value.sun) ? value.sun.filter(isBusinessHourSlot) : [],
  };
}

export function timeToMinutes(time: string) {
  const [hours = '0', minutes = '0'] = time.split(':');
  return Number(hours) * 60 + Number(minutes);
}

function minutesToTimeValue(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function formatBusinessTimeLabel(timeValue: string) {
  const [hours = '0', minutes = '0'] = timeValue.split(':');
  const date = new Date(Date.UTC(2000, 0, 1, Number(hours), Number(minutes)));

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).format(date);
}

export function getBusinessDayKeyFromDate(dateValue: string): BusinessDayKey | null {
  if (!dateValue) {
    return null;
  }

  const date = new Date(`${dateValue}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: BUSINESS_TIMEZONE,
    weekday: 'short',
  });

  const weekday = formatter.format(date).toLowerCase();
  const weekdayMap: Record<string, BusinessDayKey> = {
    mon: 'mon',
    tue: 'tue',
    wed: 'wed',
    thu: 'thu',
    fri: 'fri',
    sat: 'sat',
    sun: 'sun',
  };

  return weekdayMap[weekday] ?? null;
}

function getScheduleGroupLabel(slot: BusinessHourSlot, slotIndex: number, totalSlots: number) {
  if (totalSlots === 2) {
    return slotIndex === 0 ? 'Turno mañana' : 'Turno tarde / noche';
  }

  return timeToMinutes(slot.open) < 15 * 60 ? 'Turno mañana' : 'Turno tarde / noche';
}

function buildScheduleOptions(slot: BusinessHourSlot, stepMinutes = DEFAULT_RESERVATION_INTERVAL_MINUTES) {
  const openMinutes = timeToMinutes(slot.open);
  const closeMinutes = timeToMinutes(slot.close);

  if (closeMinutes <= openMinutes) {
    return [];
  }

  const lastStartMinutes = Math.max(openMinutes, closeMinutes - stepMinutes);
  const options: BusinessScheduleOption[] = [];

  for (let currentMinutes = openMinutes; currentMinutes <= lastStartMinutes; currentMinutes += stepMinutes) {
    const value = minutesToTimeValue(currentMinutes);
    options.push({
      value,
      label: formatBusinessTimeLabel(value),
    });
  }

  return options;
}

export function formatBusinessScheduleSummary(schedule: BusinessHourSlot[]) {
  return schedule
    .map((slot) => `${formatBusinessTimeLabel(slot.open)} - ${formatBusinessTimeLabel(slot.close)}`)
    .join(' · ');
}

export function buildBusinessScheduleGroups(
  schedule: BusinessHourSlot[],
  stepMinutes = DEFAULT_RESERVATION_INTERVAL_MINUTES
): BusinessScheduleGroup[] {
  return schedule
    .map((slot, index) => ({
      key: `${slot.open}-${slot.close}-${index}`,
      label: getScheduleGroupLabel(slot, index, schedule.length),
      note: `${formatBusinessTimeLabel(slot.open)} - ${formatBusinessTimeLabel(slot.close)}`,
      options: buildScheduleOptions(slot, stepMinutes),
    }))
    .filter((group) => group.options.length > 0);
}
