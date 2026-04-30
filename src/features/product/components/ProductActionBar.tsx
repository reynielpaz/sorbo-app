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
  const ctaLabel = !product.isAvailable
    ? 'Producto no disponible'
    : canSubmit
      ? 'Agregar al pedido'
      : 'Completa tu selección';
  const supportCopy =
    disabledReason ??
    'Agrega esta selección al pedido. El carrito se activará en la siguiente fase.';

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+14px)] pt-5">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(5,7,11,0)_0%,rgba(5,7,11,0.82)_42%,rgba(5,7,11,0.98)_100%)]" />

      <section className="relative mx-auto max-w-[720px] overflow-hidden rounded-[28px] border border-white/[0.035] bg-[#05070B]/95 p-3.5 shadow-[0_14px_30px_rgba(0,0,0,0.28)]">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(232,192,104,0.14),transparent)]" />

        <div className="flex items-end gap-3">
          <ProductQuantitySelector
            quantity={quantity}
            onDecrease={onDecreaseQuantity}
            onIncrease={onIncreaseQuantity}
          />

          <div className="min-w-0 flex-1 px-2 py-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-white/36">
              Total estimado
            </p>
            <p className="mt-2 truncate text-[14px] font-medium text-white/82">
              {product.name}
            </p>
            <p className="mt-1 text-[28px] font-semibold tracking-[-0.03em] text-[#F3D7A0]">
              {formatPrice(totalEstimate)}
            </p>
            <p className="mt-2 text-[11px] leading-5 text-white/46">
              Base {formatPrice(product.price)} x {quantity}
              {extrasPerUnit > 0 ? ` · +${formatPrice(extrasPerUnit)} en extras por unidad` : ''}
              {addOnsTotal > 0 ? ` · +${formatPrice(addOnsTotal)} en adicionales` : ''}
            </p>
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-5 text-white/52">
          {supportCopy}
        </p>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={onAddToOrder}
          className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] shadow-[0_8px_16px_rgba(0,0,0,0.14)] transition-transform duration-200 ${
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
