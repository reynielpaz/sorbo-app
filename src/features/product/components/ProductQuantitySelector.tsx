import { Minus, Plus } from 'lucide-react';

interface ProductQuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export function ProductQuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
}: ProductQuantitySelectorProps) {
  return (
    <div className="shrink-0 rounded-[20px] border border-white/[0.04] bg-black/[0.24] px-2.5 py-2">
      <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-white/36">
        Cantidad
      </p>

      <div className="mt-2 flex items-center gap-1.5">
        <button
          type="button"
          onClick={onDecrease}
          aria-label="Restar cantidad"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.04] bg-black/[0.22] text-white/74 transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.08] hover:text-white"
        >
          <Minus size={14} strokeWidth={2.1} />
        </button>

        <span className="min-w-[32px] text-center text-[19px] font-semibold tracking-[-0.03em] text-[#FCF8F0]">
          {quantity}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          aria-label="Sumar cantidad"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.04] bg-black/[0.22] text-white/74 transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.08] hover:text-white"
        >
          <Plus size={14} strokeWidth={2.1} />
        </button>
      </div>
    </div>
  );
}
