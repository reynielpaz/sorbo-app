import { useEffect, useState } from 'react';
import { getBusinessHoursConfig } from '@/services/products';
import { DEFAULT_BUSINESS_HOURS } from '@/utils/businessHours';
import type { BusinessDayKey, BusinessHourSlot, BusinessHours } from '../types';

interface UseBusinessStatusState {
  isOpen: boolean;
  todaySchedule: BusinessHourSlot[];
  loading: boolean;
}

const BUSINESS_TIMEZONE = 'America/Caracas';
function timeToMinutes(time: string) {
  const [hours = '0', minutes = '0'] = time.split(':');
  return Number(hours) * 60 + Number(minutes);
}

function getCurrentBusinessDay() {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: BUSINESS_TIMEZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(new Date());
  const weekday = parts.find((part) => part.type === 'weekday')?.value.toLowerCase() as
    | 'mon'
    | 'tue'
    | 'wed'
    | 'thu'
    | 'fri'
    | 'sat'
    | 'sun'
    | undefined;
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');

  return {
    weekday: (weekday ?? 'mon') as BusinessDayKey,
    currentMinutes: hour * 60 + minute,
  };
}

function resolveBusinessStatus(businessHours: BusinessHours) {
  const { weekday, currentMinutes } = getCurrentBusinessDay();
  const todaySchedule = businessHours[weekday];
  const isOpen = todaySchedule.some((slot) => {
    const openMinutes = timeToMinutes(slot.open);
    const closeMinutes = timeToMinutes(slot.close);
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  });

  return {
    isOpen,
    todaySchedule,
  };
}

export function useBusinessStatus(): UseBusinessStatusState {
  const [businessHours, setBusinessHours] = useState<BusinessHours>(DEFAULT_BUSINESS_HOURS);
  const [status, setStatus] = useState<UseBusinessStatusState>({
    isOpen: false,
    todaySchedule: [],
    loading: true,
  });

  useEffect(() => {
    let active = true;

    async function loadBusinessHours() {
      try {
        const normalizedBusinessHours = await getBusinessHoursConfig();

        if (!active) return;

        setBusinessHours(normalizedBusinessHours);
        setStatus({
          ...resolveBusinessStatus(normalizedBusinessHours),
          loading: false,
        });
      } catch {
        if (!active) return;

        setBusinessHours(DEFAULT_BUSINESS_HOURS);
        setStatus({
          isOpen: false,
          todaySchedule: [],
          loading: false,
        });
      }
    }

    void loadBusinessHours();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setStatus((currentStatus) => ({
        ...resolveBusinessStatus(businessHours),
        loading: currentStatus.loading,
      }));
    }, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [businessHours]);

  return status;
}
