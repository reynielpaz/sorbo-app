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
    <div className="shrink-0 rounded-[24px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(8,10,15,0.82)_100%)] px-3 py-3 shadow-[0_12px_24px_rgba(0,0,0,0.16)]">
      <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-white/36">
        Cantidad
      </p>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrease}
          aria-label="Restar cantidad"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-[rgba(255,255,255,0.04)] text-white/74 transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.16] hover:text-white"
        >
          <Minus size={16} strokeWidth={2.1} />
        </button>

        <span className="min-w-[40px] text-center text-[22px] font-semibold tracking-[-0.03em] text-[#FCF8F0]">
          {quantity}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          aria-label="Sumar cantidad"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-[rgba(255,255,255,0.04)] text-white/74 transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.16] hover:text-white"
        >
          <Plus size={16} strokeWidth={2.1} />
        </button>
      </div>
    </div>
  );
}
