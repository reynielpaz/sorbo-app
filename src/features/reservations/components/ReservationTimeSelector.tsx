import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Clock3, X } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = useMemo(
    () => groups.flatMap((group) => group.options).find((option) => option.value === value),
    [groups, value]
  );
  const canOpenSheet = hasDate && !loading && !isClosed && groups.length > 0;
  const fieldLabel = selectedOption?.label ?? 'Elegir hora';
  const fieldHint = canOpenSheet ? 'Según disponibilidad del día' : '';

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!hasDate) {
    return (
      <>
        <div className="rounded-[18px] border border-white/[0.04] bg-black/[0.18] px-3.5 py-3 text-[13px] text-white/42">
          Elige una fecha primero
        </div>
        {error ? <p className="mt-2 text-[12px] leading-5 text-[#E8C37E]">{error}</p> : null}
      </>
    );
  }

  if (loading) {
    return (
      <div className="rounded-[18px] border border-white/[0.04] bg-black/[0.18] px-3.5 py-3 text-[13px] text-white/42">
        Consultando horarios...
      </div>
    );
  }

  if (isClosed) {
    return (
      <div className="rounded-[18px] border border-white/[0.04] bg-black/[0.18] px-3.5 py-3 text-[13px] text-[#E8C068]">
        Ese día no hay atención disponible
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={!canOpenSheet}
        className="flex w-full items-center gap-3 rounded-[18px] border border-white/[0.05] bg-black/[0.22] px-3.5 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition-colors duration-200 hover:border-white/[0.08] disabled:cursor-not-allowed disabled:text-white/38"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] border border-[#D4A853]/12 bg-black/[0.22] text-[#E8C068]">
          <Clock3 size={17} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-white/36">
            Hora
          </span>
          <span className="mt-0.5 block truncate text-[14px] font-medium text-white/82">
            {fieldLabel}
          </span>
          {fieldHint ? (
            <span className="mt-0.5 block truncate text-[11px] text-white/34">
              {fieldHint}
            </span>
          ) : null}
        </span>
        <ChevronDown size={17} className="shrink-0 text-white/38" strokeWidth={2.1} />
      </button>

      {error ? <p className="mt-2 text-[12px] leading-5 text-[#E8C37E]">{error}</p> : null}

      {isOpen ? (
        <div
          className="fixed inset-0 z-90 bg-black/70"
          role="presentation"
          onClick={() => setIsOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Elige una hora"
            className="fixed inset-x-0 bottom-0 mx-auto max-h-[78dvh] max-w-[720px] overflow-hidden rounded-t-[28px] border border-white/[0.06] bg-[#05070B] px-4 pb-[calc(env(safe-area-inset-bottom,0px)+18px)] pt-4 shadow-[0_-18px_44px_rgba(0,0,0,0.46)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-playfair text-[24px] font-semibold leading-tight text-[#FCF8F0]">
                  Elige una hora
                </h3>
                <p className="mt-1 text-[12px] leading-5 text-white/40">
                  Horarios disponibles para tu visita
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar selector de hora"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.05] bg-black/[0.28] text-white/56 transition-colors duration-200 hover:text-[#E8C068]"
              >
                <X size={16} strokeWidth={2.1} />
              </button>
            </div>

            <div className="mt-4 max-h-[calc(78dvh-112px)] space-y-4 overflow-y-auto pr-1">
              {groups.map((group) => (
                <div key={group.key}>
                  <div className="mb-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4A853]/74">
                      {group.label}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-4 text-white/32">
                      {group.note}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.options.map((option) => {
                      const isSelected = value === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            onChange(option.value);
                            setIsOpen(false);
                          }}
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[12px] font-medium transition-[border-color,transform,background-color,color] duration-200 hover:-translate-y-0.5',
                            isSelected
                              ? 'border-[rgba(212,168,83,0.24)] bg-[#D4A853]/12 text-[#FCF8F0]'
                              : 'border-white/[0.05] bg-black/[0.32] text-white/58 hover:border-white/[0.1] hover:text-white/78'
                          )}
                        >
                          <span
                            className={cn(
                              'inline-flex h-6 w-6 items-center justify-center rounded-full border',
                              isSelected
                                ? 'border-[#D4A853]/18 bg-black/[0.18] text-[#E8C068]'
                                : 'border-white/[0.045] bg-black/[0.2] text-white/42'
                            )}
                          >
                            <Clock3 size={12} />
                          </span>
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
