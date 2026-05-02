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
          'flex items-center justify-between gap-4 rounded-[18px] border bg-black/[0.22] px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]',
          isInvalid
            ? 'border-[rgba(212,168,83,0.28)] shadow-[0_0_0_1px_rgba(212,168,83,0.1)]'
            : 'border-white/[0.05]'
        )}
      >
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42">
            Personas
          </p>
          <div className="mt-1 flex items-end gap-2">
            <p className="text-[31px] font-semibold leading-none tracking-[-0.04em] text-[#FCF8F0]">
              {guestCount}
            </p>
            <span className="pb-0.5 text-[11px] uppercase tracking-[0.14em] text-white/40">
              {guestCount === 1 ? 'persona' : 'personas'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDecrease}
            aria-label="Restar persona"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.05] bg-black/[0.22] text-white/64 transition-[border-color,color,transform,background-color] duration-200 hover:-translate-y-0.5 hover:border-white/[0.12] hover:text-[#FCF8F0]"
          >
            <Minus size={15} strokeWidth={2.1} />
          </button>

          <button
            type="button"
            onClick={onIncrease}
            aria-label="Sumar persona"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#D4A853]/16 bg-[#D4A853]/10 text-[#E8C068] transition-[border-color,color,transform,background-color] duration-200 hover:-translate-y-0.5 hover:border-[#D4A853]/24 hover:text-[#FFF4D9]"
          >
            <Plus size={15} strokeWidth={2.1} />
          </button>
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
