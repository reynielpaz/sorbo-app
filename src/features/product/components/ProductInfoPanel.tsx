import type { Product } from '@/types';
import { formatPrice } from '@/utils/formatPrice';

interface ProductInfoPanelProps {
  product: Product;
}

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-white/[0.035] bg-[#05070B]/70 px-5 py-5 shadow-[0_10px_24px_rgba(0,0,0,0.14)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4A853]/82">
            Detalle Sorbo
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] ${
            product.isAvailable
              ? 'border-[rgba(212,168,83,0.18)] bg-black/[0.28] text-[#F3D7A0]'
              : 'border-white/[0.045] bg-black/[0.24] text-white/52'
          }`}
        >
          {product.isAvailable ? 'Disponible' : 'No disponible'}
        </span>
      </div>

      <div className="mt-5 border-t border-white/[0.035] pt-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/42">
          Precio base
        </p>
        <p className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-[#F3D7A0]">
          {formatPrice(product.price)}
        </p>

        {product.description?.trim() ? (
          <p className="mt-5 text-[14px] leading-7 text-white/72">
            {product.description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
