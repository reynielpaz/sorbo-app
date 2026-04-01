import { useState } from 'react';
import { motion } from 'framer-motion';
import { generatePath, useNavigate } from 'react-router-dom';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/formatPrice';
import { cn } from '@/utils/cn';
import { getCategoryIcon, ROUTES } from '@/utils/constants';

interface ProductCardProps {
  product: Product;
  index?: number;
}

/** Frases apetitosas que inspiran a comprar */
const APPETITE_PHRASES = [
  'El más pedido',
  'Te va a encantar',
  'Probarlo es repetir',
  'No te lo pierdas',
  'Favorito de la casa',
  'Sabor irresistible',
  'Lo piden todos',
  'Tienes que probarlo',
  'Éxito de ventas',
  'Sabor que enamora',
];

function getAppetitePhrase(index: number) {
  return APPETITE_PHRASES[index % APPETITE_PHRASES.length];
}

function getPlaceholderGradient(categorySlug?: string) {
  if (categorySlug === 'hamburguesas') {
    return 'bg-[linear-gradient(145deg,rgba(232,148,58,0.24),rgba(212,168,83,0.16),rgba(11,15,26,0.92))]';
  }

  if (categorySlug === 'cocteles') {
    return 'bg-[linear-gradient(145deg,rgba(212,168,83,0.24),rgba(232,148,58,0.16),rgba(11,15,26,0.92))]';
  }

  return 'bg-[linear-gradient(145deg,rgba(232,148,58,0.18),rgba(212,168,83,0.14),rgba(11,15,26,0.94))]';
}

function resolveBadge(tags: Product['tags']) {
  if (tags.includes('popular')) {
    return {
      label: 'POPULAR',
      className: 'border border-[rgba(212,168,83,0.25)] bg-[rgba(212,168,83,0.15)] text-[#E8C068]',
    };
  }

  if (tags.includes('nuevo')) {
    return {
      label: 'NUEVO',
      className: 'border border-[rgba(232,148,58,0.25)] bg-[rgba(232,148,58,0.15)] text-[#F0B060]',
    };
  }

  return null;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const badge = resolveBadge(product.tags);
  const categorySlug = product.category?.slug;
  const categoryIcon = getCategoryIcon(categorySlug);
  const rating = (4.5 + (index % 5) * 0.1).toFixed(1);
  const shouldPrioritizeImage = index < 4;

  function handleNavigate() {
    navigate(generatePath(ROUTES.PRODUCT, { id: product.id }));
  }

  function handleFavorite(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setIsFavorite((current) => !current);
  }

  function handleAddToCart(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    if (import.meta.env.DEV) {
      console.log('add to cart', product.id);
    }
  }

  return (
    <motion.article
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleNavigate}
      className="group w-[80vw] max-w-[340px] shrink-0 cursor-pointer overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.04]"
    >
      <div className="relative h-[160px] overflow-hidden rounded-t-[20px]">
        {product.imageUrl ? (
          <>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading={shouldPrioritizeImage ? 'eager' : 'lazy'}
              fetchPriority={shouldPrioritizeImage ? 'high' : 'auto'}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </>
        ) : (
          <div
            className={cn(
              'flex h-full items-center justify-center transition-transform duration-500 group-hover:scale-[1.03]',
              getPlaceholderGradient(categorySlug)
            )}
          >
            <span className="text-[48px] drop-shadow-[0_10px_24px_rgba(0,0,0,0.28)]">{categoryIcon}</span>
          </div>
        )}

        <div className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="#E8943A"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-[11px] font-semibold text-white">{rating}</span>
        </div>

        <button
          type="button"
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          onClick={handleFavorite}
          className="absolute right-2.5 top-2.5 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-black/40"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isFavorite ? '#E8943A' : 'none'}
            stroke={isFavorite ? '#E8943A' : 'rgba(255,255,255,0.5)'}
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {badge ? (
          <span
            className={cn(
              'absolute bottom-2.5 left-2.5 inline-flex rounded-[8px] px-2 py-0.5 text-[8px] font-bold tracking-[0.1em]',
              badge.className
            )}
          >
            {badge.label}
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 font-playfair text-[14px] font-bold text-white">{product.name}</h3>
          <p className="mt-0.5 text-[10px] italic text-white/35">{getAppetitePhrase(index)}</p>
          <span className="mt-1 block text-[16px] font-extrabold text-[#E8943A]">{formatPrice(product.price)}</span>
        </div>

        <button
          type="button"
          aria-label={`Agregar ${product.name}`}
          onClick={handleAddToCart}
          className="ml-3 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#D4A853] to-[#B8923A] text-[13px] font-bold text-[#0B0F1A]"
        >
          +
        </button>
      </div>
    </motion.article>
  );
}
