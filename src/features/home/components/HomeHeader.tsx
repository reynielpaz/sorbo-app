import { Skeleton } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useBusinessStatus } from '../hooks/useBusinessStatus';

const CARACAS_TIMEZONE = 'America/Caracas';

function getGreeting() {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: CARACAS_TIMEZONE,
    hour: '2-digit',
    hourCycle: 'h23',
  });
  const hour = Number(formatter.formatToParts(new Date()).find((part) => part.type === 'hour')?.value ?? '0');

  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

function getInitials(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function HomeHeader() {
  const { profile, isAuthenticated } = useAuth();
  const { isOpen, loading } = useBusinessStatus();
  const displayName = isAuthenticated ? profile?.fullName?.trim() || 'Bienvenido' : 'Bienvenido';
  const avatarLabel = isAuthenticated ? profile?.fullName?.trim() || 'Bienvenido' : 'Invitado';

  return (
    <div className="flex items-start justify-between gap-4 px-[18px] pb-[14px] pt-[calc(env(safe-area-inset-top)+18px)]">
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40">
          {getGreeting().toUpperCase()}
        </p>
        <h1 className="mt-1 line-clamp-1 font-playfair text-[22px] font-bold text-white">
          {displayName}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {loading ? (
          <Skeleton className="h-[30px] w-[88px]" rounded />
        ) : (
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-[11px] font-semibold ${
              isOpen
                ? 'border-[rgba(0,220,130,0.25)] bg-[rgba(0,220,130,0.1)] text-[#00DC82]'
                : 'border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.1)] text-[#EF4444]'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isOpen
                  ? 'bg-[#00DC82] shadow-[0_0_10px_rgba(0,220,130,0.85)]'
                  : 'bg-[#EF4444] shadow-[0_0_10px_rgba(239,68,68,0.75)]'
              }`}
            />
            {isOpen ? 'Abierto' : 'Cerrado'}
          </span>
        )}

        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[13px] bg-gradient-to-br from-[#4F46E5] to-[#3730A3] text-[12px] font-bold text-white shadow-[0_4px_12px_rgba(55,48,163,0.3)]">
          {getInitials(avatarLabel)}
        </div>
      </div>
    </div>
  );
}
