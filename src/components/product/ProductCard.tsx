import { motion } from 'framer-motion';
import { generatePath, useNavigate } from 'react-router-dom';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/formatPrice';
import { cn } from '@/utils/cn';
import { getCategoryIcon, ROUTES } from '@/utils/constants';

interface ProductCardProps {
  product: Product;
}

function resolveBadge(tags: Product['tags']) {
  if (tags.includes('popular')) {
    return {
      label: 'POPULAR',
      className: 'border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.3)] text-[#D8B4FE]',
    };
  }

  if (tags.includes('nuevo')) {
    return {
      label: 'NUEVO',
      className: 'border border-[rgba(236,72,153,0.2)] bg-[rgba(236,72,153,0.3)] text-[#FBCFE8]',
    };
  }

  return null;
}

function getPlaceholderGradient(categorySlug?: string) {
  if (categorySlug === 'hamburguesas') {
    return 'bg-[linear-gradient(145deg,rgba(147,51,234,0.15),rgba(99,102,241,0.08))]';
  }

  if (categorySlug === 'cocteles') {
    return 'bg-[linear-gradient(145deg,rgba(236,72,153,0.15),rgba(244,114,182,0.08))]';
  }

  return 'bg-[linear-gradient(145deg,rgba(139,92,246,0.1),rgba(99,102,241,0.05))]';
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const badge = resolveBadge(product.tags);
  const categorySlug = product.category?.slug;
  const categoryIcon = getCategoryIcon(categorySlug);

  function handleNavigate() {
    navigate(generatePath(ROUTES.PRODUCT, { id: product.id }));
  }

  function handleAddToCart(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    if (import.meta.env.DEV) {
      console.log('add to cart', product.id);
    }
  }

  return (
    <motion.article
      whileTap={{ scale: 0.98 }}
      onClick={handleNavigate}
      className={cn(
        'cursor-pointer overflow-hidden rounded-[18px] border border-white/8 bg-[rgba(255,255,255,0.05)]',
        'transition-colors duration-300 hover:border-white/14'
      )}
    >
      <div className="relative h-[110px]">
        {product.imageUrl ? (
          <>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(11,15,26,0.8)_0%,transparent_60%)]" />
          </>
        ) : (
          <div className={cn('flex h-full items-center justify-center', getPlaceholderGradient(categorySlug))}>
            <span className="text-[42px]">{categoryIcon}</span>
          </div>
        )}

        {badge ? (
          <span
            className={cn(
              'absolute right-2 top-2 inline-flex rounded-[10px] px-2.5 py-0.5 text-[8px] font-bold tracking-[0.14em]',
              badge.className
            )}
          >
            {badge.label}
          </span>
        ) : null}
      </div>

      <div className="relative px-[11px] pb-[13px] pt-[10px] pr-12">
        <h3 className="line-clamp-1 text-[13px] font-semibold text-white">{product.name}</h3>
        <p className="mb-2 mt-1 line-clamp-1 text-[9px] text-white/35">
          {product.description ?? 'Sin descripción disponible'}
        </p>
        <p className="text-[15px] font-bold text-white">{formatPrice(product.price)}</p>

        <button
          type="button"
          aria-label={`Agregar ${product.name}`}
          onClick={handleAddToCart}
          className={cn(
            'absolute bottom-[13px] right-[11px] flex h-[28px] w-[28px] items-center justify-center rounded-[9px]',
            'bg-gradient-to-br from-[#6366F1] to-[#4F46E5] text-sm font-bold text-white shadow-[0_3px_10px_rgba(79,70,229,0.3)]'
          )}
        >
          +
        </button>
      </div>
    </motion.article>
  );
}
