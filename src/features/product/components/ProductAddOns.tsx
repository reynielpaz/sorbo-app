import type { Product } from '@/types';
import { formatPrice } from '@/utils/formatPrice';

interface ProductAddOnsProps {
  products: Product[];
  selectedAddOnIds: string[];
  loading?: boolean;
  onToggleAddOn: (product: Product) => void;
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0])
    .join('')
    .toUpperCase();
}

export function ProductAddOns({
  products,
  selectedAddOnIds,
  loading = false,
  onToggleAddOn,
}: ProductAddOnsProps) {
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(13,16,22,0.98)_0%,rgba(7,9,14,0.98)_100%)] px-4 py-5 shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4A853]/82">
            Adicionales
          </p>
          <h2 className="mt-2.5 font-playfair text-[28px] font-semibold leading-none tracking-[-0.04em] text-[#FCF8F0]">
            Combina con esto
          </h2>
        </div>

        <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/34">
          Opcional
        </span>
      </div>

      <div className="-mx-1 mt-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`addon-skeleton-${index}`}
                className="min-w-[198px] snap-start overflow-hidden rounded-[22px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(9,12,18,0.78)_100%)] p-2.5 animate-pulse"
              >
                <div className="h-[118px] rounded-[16px] bg-white/8" />
                <div className="mt-3 h-3 w-20 rounded-full bg-white/8" />
                <div className="mt-2 h-4 w-28 rounded-full bg-white/8" />
                <div className="mt-4 h-9 rounded-full bg-white/8" />
              </div>
            ))
          : products.map((product) => {
              const isSelected = selectedAddOnIds.includes(product.id);
              const initials = getInitials(product.name);

              return (
                <article
                  key={product.id}
                  className="flex min-w-[198px] snap-start flex-col overflow-hidden rounded-[22px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(9,12,18,0.78)_100%)] p-2.5 shadow-[0_12px_24px_rgba(0,0,0,0.14)]"
                >
                  <div className="relative h-[118px] overflow-hidden rounded-[16px]">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                        fetchPriority="low"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(18,22,30,1)_0%,rgba(10,13,19,0.96)_48%,rgba(6,8,12,1)_100%)]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,233,212,0.08)_0%,rgba(245,233,212,0.02)_26%,transparent_56%)]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-playfair text-[44px] tracking-[0.1em] text-[#F3E6C7]/12">
                            {initials}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(180deg,rgba(6,8,12,0)_0%,rgba(6,8,12,0.78)_100%)]" />
                    <p className="absolute inset-x-3 bottom-2.5 text-[9px] font-medium uppercase tracking-[0.2em] text-white/44">
                      Sorbo
                    </p>
                  </div>

                  <div className="mt-3 min-h-[86px]">
                    <h3 className="font-playfair text-[22px] leading-[0.98] tracking-[-0.03em] text-[#FCF8F0]">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-[17px] font-semibold tracking-[-0.03em] text-[#F3D7A0]">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleAddOn(product)}
                    className={`mt-auto inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-transform duration-200 hover:-translate-y-0.5 ${
                      isSelected
                        ? 'border border-[rgba(212,168,83,0.24)] bg-[rgba(212,168,83,0.12)] text-[#E8D6AD]'
                        : 'bg-[linear-gradient(135deg,#E8D6AD_0%,#D4A853_50%,#B8923A_100%)] text-[#140F08] shadow-[0_14px_24px_rgba(0,0,0,0.18)]'
                    }`}
                  >
                    {isSelected ? 'Quitar' : 'Añadir'}
                  </button>
                </article>
              );
            })}
      </div>
    </section>
  );
}
