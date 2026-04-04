import type { KeyboardEvent, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { generatePath, useNavigate } from 'react-router-dom';
import type { Product } from '@/types';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/formatPrice';
import { getCategoryIcon, ROUTES, WHATSAPP_NUMBER } from '@/utils/constants';

interface MenuProductCardProps {
  product: Product;
  index?: number;
}

function getPlaceholderGradient(categorySlug?: string) {
  if (categorySlug === 'hamburguesas') {
    return 'bg-[linear-gradient(145deg,rgba(232,148,58,0.22),rgba(212,168,83,0.14),rgba(11,15,26,0.92))]';
  }

  if (categorySlug === 'cocteles') {
    return 'bg-[linear-gradient(145deg,rgba(212,168,83,0.22),rgba(232,148,58,0.16),rgba(11,15,26,0.92))]';
  }

  if (categorySlug === 'postres') {
    return 'bg-[linear-gradient(145deg,rgba(245,214,162,0.18),rgba(232,148,58,0.14),rgba(11,15,26,0.92))]';
  }

  return 'bg-[linear-gradient(145deg,rgba(232,148,58,0.16),rgba(212,168,83,0.12),rgba(11,15,26,0.94))]';
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

function buildWhatsAppHref(product: Product) {
  const message = `Hola, quiero pedir ${product.name}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function MenuProductCard({ product, index = 0 }: MenuProductCardProps) {
  const navigate = useNavigate();
  const badge = resolveBadge(product.tags);
  const categorySlug = product.category?.slug;
  const categoryIcon = getCategoryIcon(categorySlug);
  const supportingText = resolveSupportingText(product);
  const whatsappHref = buildWhatsAppHref(product);
  const shouldPrioritizeImage = index < 4;

  function handleNavigate() {
    navigate(generatePath(ROUTES.PRODUCT, { id: product.id }), {
      state: {
        productSnapshot: product,
      },
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigate();
    }
  }

  function handleWhatsAppClick(event: MouseEvent<HTMLAnchorElement>) {
    event.stopPropagation();
  }

  return (
    <motion.article
      role="link"
      tabIndex={0}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.988 }}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      className="group relative min-h-[320px] cursor-pointer overflow-hidden rounded-[30px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(12,16,24,0.82)_0%,rgba(8,10,14,0.96)_100%)] shadow-[0_24px_48px_rgba(0,0,0,0.28)] outline-none"
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading={shouldPrioritizeImage ? 'eager' : 'lazy'}
          fetchPriority={shouldPrioritizeImage ? 'high' : 'auto'}
        />
      ) : (
        <div
          className={cn(
            'absolute inset-0 overflow-hidden',
            getPlaceholderGradient(categorySlug)
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08)_0%,transparent_38%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,15,26,0.08)_0%,rgba(11,15,26,0.56)_56%,rgba(11,15,26,0.96)_100%)]" />
          <span className="absolute right-4 top-4 text-[48px] opacity-20 drop-shadow-[0_12px_24px_rgba(0,0,0,0.28)]">
            {categoryIcon}
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,11,0.04)_0%,rgba(5,7,11,0.12)_28%,rgba(5,7,11,0.34)_54%,rgba(5,7,11,0.88)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[68%] bg-[linear-gradient(180deg,rgba(6,8,12,0)_0%,rgba(6,8,12,0.18)_18%,rgba(6,8,12,0.48)_46%,rgba(6,8,12,0.94)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(232,214,173,0.42),transparent)]" />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
        <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#E8D6AD]/78">
          <span className="h-px w-6 bg-[#D4A853]/68" />
          {product.category?.name ?? 'Carta Sorbo'}
        </span>

        {badge ? (
          <span
            className={cn(
              'inline-flex rounded-full border px-2.5 py-1 text-[9px] font-semibold tracking-[0.18em] backdrop-blur-sm',
              badge.className
            )}
          >
            {badge.label}
          </span>
        ) : null}
      </div>

      <div className="relative mt-auto flex min-h-[320px] flex-col justify-end px-4 pb-4 pt-24">
        <h2 className="max-w-[14ch] font-playfair text-[31px] font-semibold leading-[0.96] tracking-[-0.03em] text-white/95">
          {product.name}
        </h2>

        <p className="mt-2 max-w-[28ch] line-clamp-2 text-[13px] leading-6 text-white/72">
          {supportingText}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="text-[24px] font-semibold tracking-[-0.03em] text-[#F3D7A0]">
            {formatPrice(product.price)}
          </p>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            onClick={handleWhatsAppClick}
            className="relative z-[2] inline-flex shrink-0 items-center gap-2 rounded-full bg-[linear-gradient(135deg,#E8D6AD_0%,#D4A853_48%,#B8923A_100%)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#120E09] shadow-[0_16px_28px_rgba(0,0,0,0.24)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            <MessageCircle size={14} strokeWidth={2.2} />
            Pedir
          </a>
        </div>
      </div>
    </motion.article>
  );
}
