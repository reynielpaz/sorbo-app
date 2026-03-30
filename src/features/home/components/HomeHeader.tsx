import { useMemo } from 'react';
import { Skeleton } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useBusinessStatus } from '../hooks/useBusinessStatus';

const CARACAS_TIMEZONE = 'America/Caracas';

/** Frases inspiradoras con sabor zuliano para cautivar al usuario */
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

export function HomeHeader() {
  const { profile, isAuthenticated } = useAuth();
  const { isOpen, loading } = useBusinessStatus();

  const firstName = isAuthenticated ? getFirstName(profile?.fullName ?? '') : '';
  const greetingName = firstName || (isAuthenticated ? 'Bienvenido' : 'Bienvenido');

  const phrase = useMemo(() => {
    const index = Math.floor(Math.random() * INSPIRATIONAL_PHRASES.length);
    return INSPIRATIONAL_PHRASES[index];
  }, []);

  return (
    <div className="px-[18px] pb-[10px] pt-[calc(env(safe-area-inset-top)+14px)]">
      {/* Fila 1: Logo + Badge */}
      <div className="flex items-start justify-between">
        <img
          src="/images/brand/logo-sorbo.png"
          alt="Sorbo Café • Bistró"
          className="h-30 w-auto object-contain brightness-0 invert"
        />

        <div className="pt-1">
          {loading ? (
            <Skeleton className="h-[30px] w-[88px]" rounded />
          ) : isOpen ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,220,130,0.25)] bg-[rgba(0,220,130,0.1)] px-3.5 py-1 text-[11px] font-semibold text-[#00DC82]">
              <span className="h-2 w-2 rounded-full bg-[#00DC82] shadow-[0_0_10px_rgba(0,220,130,0.85)]" />
              Abierto
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1 text-[11px] font-semibold text-white/50 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#EF4444]/40 shadow-[0_0_8px_rgba(239,68,68,0.35)]" />
              Cerrado
            </span>
          )}
        </div>
      </div>

      {/* Fila 2: Greeting pegado al logo */}
      <div className="-mt-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40">
          {getGreeting().toUpperCase()}
        </p>
        <h1 className="mt-0.5 line-clamp-1 font-playfair text-[22px] font-bold text-white">
          {firstName ? `Hola, ${greetingName}` : greetingName}
        </h1>
        <p className="mt-1 text-[13px] italic text-[#D4A853]/70">
          {phrase}
        </p>
      </div>
    </div>
  );
}