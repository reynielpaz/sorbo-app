import { ChevronLeft } from 'lucide-react';
import type { Product } from '@/types';

interface ProductHeroProps {
  product: Product;
  onBack: () => void;
}

function resolveBadge(tags: Product['tags']) {
  if (tags.includes('popular')) {
    return {
      label: 'POPULAR',
      className: 'border-[rgba(212,168,83,0.2)] bg-[rgba(212,168,83,0.12)] text-[#E8C068]',
    };
  }

  if (tags.includes('nuevo')) {
    return {
      label: 'NUEVO',
      className: 'border-[rgba(232,148,58,0.2)] bg-[rgba(232,148,58,0.12)] text-[#F0B060]',
    };
  }

  if (tags.includes('promo')) {
    return {
      label: 'PROMO',
      className: 'border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.12)] text-[#F27B7B]',
    };
  }

  return null;
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

export function ProductHero({ product, onBack }: ProductHeroProps) {
  const badge = resolveBadge(product.tags);
  const initials = getInitials(product.name);

  return (
    <section className="relative">
      <div className="relative min-h-[420px] overflow-hidden rounded-b-[36px] border-b border-white/[0.06] bg-[linear-gradient(180deg,rgba(9,12,18,0.98)_0%,rgba(5,7,11,1)_100%)] shadow-[0_32px_64px_rgba(0,0,0,0.3)]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
          />
        ) : (
          <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,rgba(14,17,24,1)_0%,rgba(11,15,26,0.96)_42%,rgba(5,7,11,1)_100%)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,233,212,0.11)_0%,rgba(245,233,212,0.03)_24%,transparent_52%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(212,168,83,0.14)_0%,rgba(212,168,83,0.02)_28%,transparent_54%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-playfair text-[96px] tracking-[0.12em] text-[#F3E6C7]/10">
                {initials}
              </span>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,11,0.46)_0%,rgba(5,7,11,0.12)_30%,rgba(5,7,11,0.22)_58%,rgba(5,7,11,0.94)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,11,0.14)_0%,rgba(5,7,11,0.06)_22%,rgba(5,7,11,0.08)_46%,rgba(5,7,11,0.34)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-[linear-gradient(180deg,rgba(6,8,12,0)_0%,rgba(6,8,12,0.76)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)]" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 px-4 pb-4 pt-[calc(env(safe-area-inset-top,0px)+16px)]">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(12,14,20,0.72)_100%)] text-white/84 shadow-[0_14px_24px_rgba(0,0,0,0.18)] backdrop-blur-md transition-[border-color,transform,color] duration-200 hover:-translate-y-0.5 hover:border-white/[0.16] hover:text-white"
          >
            <ChevronLeft size={18} />
          </button>

          {badge ? (
            <span
              className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] backdrop-blur-sm ${badge.className}`}
            >
              {badge.label}
            </span>
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-0 px-4 pb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#E8D6AD]/82">
            {product.category?.name ?? 'Carta Sorbo'}
          </p>
        </div>
      </div>
    </section>
  );
}
