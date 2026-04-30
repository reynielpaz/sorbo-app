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
            Detalle Sorbo
          </p>
          <p className="mt-3 max-w-[26ch] text-[13px] leading-6 text-white/56">
            Revisa los ingredientes, personaliza tu selección y agrégala al pedido.
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] ${
            product.isAvailable
              ? 'border-[rgba(212,168,83,0.2)] bg-[rgba(212,168,83,0.1)] text-[#E8D6AD]'
              : 'border-white/[0.08] bg-white/[0.04] text-white/52'
          }`}
        >
          {product.isAvailable ? 'Disponible' : 'No disponible'}
        </span>
      </div>

      <div className="mt-5 border-t border-white/[0.06] pt-5">
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

        <p className="mt-4 text-[12px] leading-6 text-white/46">
          Ajusta cantidad y deja tu selección lista para agregar al pedido.
        </p>
      </div>
    </section>
  );
}
