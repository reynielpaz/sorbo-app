import type { Product } from '@/types';
import { formatPrice } from '@/utils/formatPrice';

interface ProductInfoPanelProps {
  product: Product;
}

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(15,18,25,0.98)_0%,rgba(8,10,15,0.98)_100%)] px-5 py-6 shadow-[0_26px_54px_rgba(0,0,0,0.22)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4A853]/82">
            {product.category?.name ?? 'Carta Sorbo'}
          </p>
          <h1 className="mt-3 font-playfair text-[42px] font-semibold leading-[0.92] tracking-[-0.045em] text-[#FCF8F0]">
            {product.name}
          </h1>
        </div>
      </div>

      <div className="mt-5 border-t border-white/[0.06] pt-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/42">
          Precio
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
