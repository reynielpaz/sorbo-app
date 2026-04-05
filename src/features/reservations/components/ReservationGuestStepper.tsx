import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ReservationGuestStepperProps {
  guestCount: number;
  isInvalid?: boolean;
  error?: string;
  onDecrease: () => void;
  onIncrease: () => void;
}

export function ReservationGuestStepper({
  guestCount,
  isInvalid = false,
  error,
  onDecrease,
  onIncrease,
}: ReservationGuestStepperProps) {
  return (
    <div>
      <div
        className={cn(
          'relative overflow-hidden rounded-[26px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(10,13,19,0.72)_100%)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[10px]',
          isInvalid
            ? 'border-[rgba(212,168,83,0.28)] shadow-[0_0_0_1px_rgba(212,168,83,0.1)]'
            : 'border-white/[0.08]'
        )}
      >
        <div className="relative flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
              Personas
            </p>
            <div className="mt-3 inline-flex items-end gap-2 rounded-[18px] border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 backdrop-blur-sm">
              <p className="text-[31px] font-semibold tracking-[-0.05em] text-[#FCF8F0]">
                {guestCount}
              </p>
              <span className="pb-1 text-[11px] uppercase tracking-[0.16em] text-white/42">
                {guestCount === 1 ? 'persona' : 'personas'}
              </span>
            </div>
            <p className="mt-2.5 text-[12px] leading-5 text-white/42">
              Cantidad para la reserva.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] p-1.5 backdrop-blur-sm">
            <button
              type="button"
              onClick={onDecrease}
              aria-label="Restar persona"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.015)_100%)] text-white/72 transition-[border-color,color,transform,background-color] duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:text-[#FCF8F0]"
            >
              <Minus size={16} strokeWidth={2.1} />
            </button>

            <button
              type="button"
              onClick={onIncrease}
              aria-label="Sumar persona"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D4A853]/16 bg-[linear-gradient(180deg,rgba(212,168,83,0.15)_0%,rgba(212,168,83,0.06)_100%)] text-[#F0D8A2] transition-[border-color,color,transform,background-color] duration-200 hover:-translate-y-0.5 hover:border-[#D4A853]/24 hover:text-[#FFF4D9]"
            >
              <Plus size={16} strokeWidth={2.1} />
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <p className="mt-2 text-[12px] leading-5 text-[#E8C37E]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
