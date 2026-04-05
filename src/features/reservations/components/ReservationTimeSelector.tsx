import { Clock3 } from 'lucide-react';
import type { ReservationTimeGroup } from '@/features/reservations/hooks/useReservationForm';
import { cn } from '@/utils/cn';

interface ReservationTimeSelectorProps {
  hasDate: boolean;
  loading: boolean;
  isClosed: boolean;
  groups: ReservationTimeGroup[];
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export function ReservationTimeSelector({
  hasDate,
  loading,
  isClosed,
  groups,
  value,
  error,
  onChange,
}: ReservationTimeSelectorProps) {
  if (!hasDate) {
    return (
      <div className="rounded-[22px] border border-white/[0.08] bg-[rgba(255,255,255,0.022)] px-4 py-3.5 text-[12px] leading-6 text-white/42 backdrop-blur-[10px]">
        Selecciona primero la fecha para ver los horarios disponibles.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-[22px] border border-white/[0.08] bg-[rgba(255,255,255,0.022)] px-4 py-3.5 text-[12px] leading-6 text-white/42 backdrop-blur-[10px]">
        Consultando horarios disponibles.
      </div>
    );
  }

  if (isClosed) {
    return (
      <div className="rounded-[22px] border border-white/[0.08] bg-[rgba(255,255,255,0.022)] px-4 py-3.5 text-[12px] leading-6 text-white/54 backdrop-blur-[10px]">
        Ese día no hay atención disponible.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.key}>
          <div className="mb-2.5 flex items-center gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4A853]/76">
                {group.label}
              </p>
              <p className="mt-1 text-[12px] leading-5 text-white/40">
                {group.note}
              </p>
            </div>
            <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]" />
          </div>

          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => {
              const isSelected = value === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange(option.value)}
                  className={cn(
                    'group inline-flex items-center gap-2 rounded-full border px-3.5 py-2.5 text-[13px] font-medium transition-[border-color,transform,background-color,box-shadow,color] duration-200 hover:-translate-y-0.5',
                    isSelected
                      ? 'border-[rgba(212,168,83,0.22)] bg-[linear-gradient(180deg,rgba(212,168,83,0.12)_0%,rgba(212,168,83,0.05)_100%)] text-[#FCF8F0] shadow-[0_10px_20px_rgba(0,0,0,0.16)]'
                      : 'border-white/[0.08] bg-[rgba(255,255,255,0.028)] text-white/64 hover:border-white/[0.12] hover:text-white/80'
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors duration-200',
                      isSelected
                        ? 'border-[#D4A853]/18 bg-[#D4A853]/12 text-[#E9C982]'
                        : 'border-white/[0.08] bg-white/[0.025] text-white/44 group-hover:text-white/64'
                    )}
                  >
                    <Clock3 size={13} />
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {error ? (
        <p className="text-[12px] leading-5 text-[#E8C37E]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
