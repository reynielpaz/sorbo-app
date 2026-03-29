export interface BusinessHourSlot {
  open: string;
  close: string;
}

export type BusinessDayKey =
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat'
  | 'sun';

export type BusinessHours = Record<BusinessDayKey, BusinessHourSlot[]>;
