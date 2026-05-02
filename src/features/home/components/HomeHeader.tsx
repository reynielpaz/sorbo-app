import { useMemo } from 'react';
import { Skeleton } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useBusinessStatus } from '../hooks/useBusinessStatus';
import type { BusinessHourSlot } from '../types';

const CARACAS_TIMEZONE = 'America/Caracas';

const INSPIRATIONAL_PHRASES = [
  'El sabor que te hace volver',
  'Aquí se come con el alma',
  'Donde cada bocado cuenta una historia',
  'Tu mesa te está esperando',
  'Hecho con amor, servido con pasión',
  'El rincón que tu paladar necesita',
  'Sabores que abrazan el corazón',
  'Más que comida, una experiencia',
  'Donde el buen gusto se siente en casa',
  'Tu momento favorito del día empieza aquí',
  'El lugar donde los recuerdos saben bien',
  'Cada plato tiene su historia, ven a probarla',
  'Aquí no solo se come, se disfruta',
  'Pa\' los que saben lo bueno de la vida',
  'Donde el café sabe a encuentro',
  'Un sorbo de felicidad te espera',
  'El sabor del Zulia en cada bocado',
  'Aquí se vive, se ríe y se come brutal',
  'Pa\' qué cocinar si aquí lo hacemos mejor',
  'Tu segundo hogar con mejor sazón',
  'Donde cada visita es una celebración',
  'Comida que te hace sonreír sin querer',
  'El secreto mejor guardado de Los Puertos',
  'Ven por la comida, quédate por el ambiente',
  'Aquí hasta el café te saluda',
  'Sabores que no se olvidan, momentos que se repiten',
  'Lo bueno se comparte, y aquí sobra lo bueno',
  'Tu excusa perfecta para salir de casa',
  'Donde el hambre se convierte en alegría',
  'Cada día un motivo nuevo para venir',
  'Cocina con alma, servicio con corazón',
  'Aquí se come como en casa, pero mejor',
  'El lugar donde siempre hay un puesto para ti',
  'Sabor, amor y buena vibra en cada mesa',
  'Donde los amigos se reúnen a comer bien',
  'Tu paladar merece esto y más',
  'Aquí las porciones son tan grandes como el cariño',
  'Ven con hambre, vete con una sonrisa',
  'El sabor que le faltaba a tu semana',
  'Más que un restaurante, tu lugar favorito',
  'Donde cada sorbo sabe a buena vida',
  'Pa\' los que no negocian con el sabor',
  'Aquí el menú cambia, la calidad nunca',
  'Tu dosis diaria de felicidad gastronómica',
  'Donde comer bien es la mejor decisión',
];

function getGreeting() {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: CARACAS_TIMEZONE,
    hour: '2-digit',
    hourCycle: 'h23',
  });
  const hour = Number(
    formatter.formatToParts(new Date()).find((part) => part.type === 'hour')?.value ?? '0'
  );

  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

function getFirstName(fullName: string) {
  const first = fullName.trim().split(/\s+/)[0];
  return first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : '';
}

function timeToMinutes(time: string) {
  const [hours = '0', minutes = '0'] = time.split(':');
  return Number(hours) * 60 + Number(minutes);
}

function getCurrentCaracasMinutes() {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: CARACAS_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(new Date());
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');

  return hour * 60 + minute;
}

function formatBusinessTime(time: string) {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  const normalizedHour = ((hours + 11) % 12) + 1;
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  return `${normalizedHour}:${String(minutes).padStart(2, '0')} ${meridiem}`;
}

function getStatusHint(isOpen: boolean, todaySchedule: BusinessHourSlot[]) {
  if (todaySchedule.length === 0) return null;

  const currentMinutes = getCurrentCaracasMinutes();

  if (isOpen) {
    const activeSlot = todaySchedule.find((slot) => {
      const openMinutes = timeToMinutes(slot.open);
      const closeMinutes = timeToMinutes(slot.close);

      return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    });

    return activeSlot ? `Hasta ${formatBusinessTime(activeSlot.close)}` : null;
  }

  const nextSlot = todaySchedule.find((slot) => currentMinutes < timeToMinutes(slot.open));
  return nextSlot ? `Abre ${formatBusinessTime(nextSlot.open)}` : null;
}

export function HomeHeader() {
  const { profile, isAuthenticated } = useAuth();
  const { isOpen, todaySchedule, loading } = useBusinessStatus();

  const firstName = isAuthenticated ? getFirstName(profile?.fullName ?? '') : '';
  const greetingName = firstName || (isAuthenticated ? 'Bienvenido' : 'Bienvenido');

  const phrase = useMemo(() => {
    const index = Math.floor(Math.random() * INSPIRATIONAL_PHRASES.length);
    return INSPIRATIONAL_PHRASES[index];
  }, []);
  const statusHint = loading ? null : getStatusHint(isOpen, todaySchedule);

  return (
    <div className="px-[18px] pb-2 pt-[calc(env(safe-area-inset-top)+12px)]">
      {/* Fila 1: Logo + Badge — compacta */}
      <div className="flex items-center justify-between">
        <img
          src="/images/brand/logo-sorbo.png"
          alt="Sorbo Café • Bistró"
          className="h-[72px] w-auto object-contain brightness-0 invert"
        />

        <div>
          {loading ? (
            <Skeleton className="h-8 w-[92px] rounded-full" rounded />
          ) : (
            <div
              aria-live="polite"
              className={`inline-flex min-w-[92px] items-center gap-2 rounded-full border px-2.5 py-1.5 ${
                isOpen
                  ? 'border-white/[0.05] bg-[#05070B]/88 text-white/72 shadow-[0_16px_36px_rgba(0,0,0,0.38)]'
                  : 'border-white/[0.04] bg-[#03060A]/90 text-white/50 shadow-[0_16px_36px_rgba(0,0,0,0.38)]'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  isOpen
                    ? 'bg-[#54C78C]/80 shadow-[0_0_8px_rgba(84,199,140,0.36)]'
                    : 'bg-[#EF4444]/40 shadow-[0_0_8px_rgba(239,68,68,0.35)]'
                }`}
              />
              <span className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                  {isOpen ? 'Abierto' : 'Cerrado'}
                </span>
                {statusHint ? <span className="text-[9px] leading-3 text-white/42">{statusHint}</span> : null}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Fila 2: Greeting + frase — compacto */}
      <div className="mt-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/35">
          {getGreeting().toUpperCase()}
        </p>
        <h1 className="line-clamp-1 font-playfair text-xl font-bold text-white">
          {firstName ? `Hola, ${greetingName}` : greetingName}
        </h1>
        <p className="mt-0.5 text-[12px] italic text-[#D4A853]/60">
          {phrase}
        </p>
      </div>
    </div>
  );
}
