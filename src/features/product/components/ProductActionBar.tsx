import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/formatPrice';
import { ProductQuantitySelector } from './ProductQuantitySelector';

interface ProductActionBarProps {
  product: Product;
  quantity: number;
  totalEstimate: number;
  extrasPerUnit: number;
  addOnsTotal: number;
  canSubmit: boolean;
  disabledReason: string | null;
  onAddToOrder: () => void;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
}

export function ProductActionBar({
  product,
  quantity,
  totalEstimate,
  extrasPerUnit,
  addOnsTotal,
  canSubmit,
  disabledReason,
  onAddToOrder,
  onDecreaseQuantity,
  onIncreaseQuantity,
}: ProductActionBarProps) {
  const hasAdjustments = extrasPerUnit > 0 || addOnsTotal > 0;
  const ctaLabel = !product.isAvailable
    ? 'Producto no disponible'
    : canSubmit
      ? 'Agregar al pedido'
      : 'Completa tu selección';
  const supportCopy = disabledReason ?? 'Listo para agregar.';

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+10px)] pt-3">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(5,7,11,0)_0%,rgba(5,7,11,0.88)_48%,rgba(5,7,11,0.98)_100%)]" />

      <section className="relative mx-auto max-w-[720px] overflow-hidden rounded-[24px] border border-white/[0.035] bg-[#05070B]/95 p-3 shadow-[0_12px_24px_rgba(0,0,0,0.24)]">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(232,192,104,0.14),transparent)]" />

        <div className="flex items-center gap-3">
          <ProductQuantitySelector
            quantity={quantity}
            onDecrease={onDecreaseQuantity}
            onIncrease={onIncreaseQuantity}
          />

          <div className="min-w-0 flex-1 text-right">
            <p className="truncate text-[12px] font-medium text-white/58">
              {product.name}
            </p>
            <p className="mt-0.5 text-[24px] font-semibold tracking-[-0.03em] text-[#F3D7A0]">
              {formatPrice(totalEstimate)}
            </p>
            {hasAdjustments ? (
              <p className="mt-0.5 text-[10px] leading-4 text-white/42">
                Incluye extras seleccionados
              </p>
            ) : null}
          </div>
        </div>

        <p className="mt-2 text-[10px] leading-4 text-white/46">
          {supportCopy}
        </p>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={onAddToOrder}
          className={`mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] shadow-[0_8px_16px_rgba(0,0,0,0.14)] transition-transform duration-200 ${
            canSubmit
              ? 'bg-[linear-gradient(135deg,#E8C068_0%,#D4A853_48%,#B8923A_100%)] text-[#120E09] hover:-translate-y-0.5'
              : 'border border-white/[0.04] bg-black/[0.24] text-white/36'
          }`}
        >
          <ShoppingBag size={16} strokeWidth={2.2} />
          {ctaLabel}
        </button>
      </section>
    </div>
  );
}
