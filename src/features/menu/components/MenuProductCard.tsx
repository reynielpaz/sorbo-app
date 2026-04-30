import type { KeyboardEvent, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { generatePath, useNavigate } from 'react-router-dom';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/formatPrice';
import { getCategoryIcon, ROUTES } from '@/utils/constants';

interface MenuProductCardProps {
  product: Product;
  index?: number;
}

function resolveBadgeLabel(tags: Product['tags']) {
  if (tags.includes('popular')) {
    return 'POPULAR';
  }

  if (tags.includes('nuevo')) {
    return 'NUEVO';
  }

  if (tags.includes('promo')) {
    return 'PROMO';
  }

  return null;
}

function resolveSupportingText(product: Product) {
  if (product.description?.trim()) {
    return product.description;
  }

  if (product.ingredients && product.ingredients.length > 0) {
    return product.ingredients.slice(0, 3).join(' • ');
  }

  if (product.tags.includes('popular')) {
    return 'Uno de los favoritos de la casa para pedir sin pensarlo demasiado.';
  }

  if (product.category?.name) {
    return `Una selección de ${product.category.name.toLowerCase()} con firma Sorbo.`;
  }

  return 'Una elección pensada para saborearla con calma.';
}

export function MenuProductCard({ product, index = 0 }: MenuProductCardProps) {
  const navigate = useNavigate();
  const badgeLabel = resolveBadgeLabel(product.tags);
  const categorySlug = product.category?.slug;
  const categoryIcon = getCategoryIcon(categorySlug);
  const categoryName = product.category?.name ?? 'Carta Sorbo';
  const supportingText = resolveSupportingText(product);
  const shouldPrioritizeImage = index < 4;

  function handleNavigate() {
    navigate(generatePath(ROUTES.PRODUCT, { id: product.id }), {
      state: {
        productSnapshot: product,
      },
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigate();
    }
  }

  function handleViewClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    handleNavigate();
  }

  return (
    <motion.article
      role="link"
      aria-label={`Ver ${product.name}`}
      tabIndex={0}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.996 }}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      className="group relative flex min-h-[144px] cursor-pointer overflow-hidden rounded-[22px] border border-white/[0.045] bg-[#05070B]/70 p-2.5 shadow-[0_8px_18px_rgba(0,0,0,0.14)] outline-none transition-[border-color,background] duration-200 hover:border-white/[0.045] hover:bg-black/[0.32] focus-visible:border-[rgba(212,168,83,0.24)] focus-visible:ring-2 focus-visible:ring-[rgba(212,168,83,0.1)]"
    >
      <div className="relative h-[124px] w-[108px] shrink-0 overflow-hidden rounded-[18px] border border-white/[0.04] bg-black/[0.32] sm:w-[116px]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            loading={shouldPrioritizeImage ? 'eager' : 'lazy'}
            fetchPriority={shouldPrioritizeImage ? 'high' : 'auto'}
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[linear-gradient(145deg,rgba(3,4,7,0.98)_0%,rgba(7,9,14,0.94)_52%,rgba(0,0,0,0.98)_100%)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_32%_22%,rgba(232,192,104,0.12)_0%,rgba(212,168,83,0.045)_28%,transparent_56%)]" />
            <div className="pointer-events-none absolute inset-x-3 top-3 h-px bg-[linear-gradient(90deg,transparent,rgba(232,192,104,0.28),transparent)]" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(232,192,104,0.12)] bg-black/[0.24]">
              <span className="text-[18px] opacity-55 saturate-0">{categoryIcon}</span>
            </div>
            <span className="absolute inset-x-3 bottom-3 text-center text-[8px] font-medium uppercase tracking-[0.22em] text-[#E8C068]/42">
              Sorbo
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.035]" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col px-2.5 py-1">
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-[9px] font-semibold uppercase tracking-[0.2em] text-white/42">
            {categoryName}
          </p>

          {badgeLabel ? (
            <span className="shrink-0 rounded-full border border-white/[0.04] bg-black/[0.24] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-white/52">
              {badgeLabel}
            </span>
          ) : null}
        </div>

        <h2 className="mt-1.5 line-clamp-2 text-[16px] font-semibold leading-[1.16] text-white/92">
          {product.name}
        </h2>

        <p className="mt-1.5 line-clamp-2 text-[12px] leading-5 text-white/58">
          {supportingText}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <p className="min-w-0 truncate text-[17px] font-semibold tracking-[-0.02em] text-[#F3D7A0]">
            {formatPrice(product.price)}
          </p>

          <button
            type="button"
            onClick={handleViewClick}
            className="relative z-[2] inline-flex shrink-0 items-center rounded-full bg-[linear-gradient(135deg,#E8C068_0%,#D4A853_48%,#B8923A_100%)] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#120E09] shadow-[0_6px_12px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Ver
          </button>
        </div>
      </div>
    </motion.article>
  );
}
