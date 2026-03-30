import { motion } from 'framer-motion';
import type { PromotionBannerItem } from '@/types';

interface PromoHeroCardProps {
  promotion: PromotionBannerItem;
  isActive: boolean;
  shouldReduceMotion: boolean;
}

const HERO_FALLBACK_IMAGE = '/images/hero/hero-burger-splash.png';
const HERO_FALLBACK_DESCRIPTION = 'Sabores que merecen repetirse.';

function hasText(value: string | undefined) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function PromoHeroCard({
  promotion,
  isActive,
  shouldReduceMotion,
}: PromoHeroCardProps) {
  const description = hasText(promotion.description)
    ? promotion.description
    : HERO_FALLBACK_DESCRIPTION;
  const imageUrl = hasText(promotion.imageUrl) ? promotion.imageUrl : HERO_FALLBACK_IMAGE;
  const showOriginalPrice = Boolean(promotion.priceLabel && promotion.originalPriceLabel);

  return (
    <motion.article
      aria-label={promotion.title}
      className="relative h-[260px] w-full shrink-0 snap-center overflow-hidden rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:h-[300px]"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* ========== IMAGEN DE FONDO ========== */}
      <motion.img
        src={imageUrl}
        alt={promotion.title}
        className="absolute inset-0 h-full w-full object-cover"
        initial={false}
        animate={
          shouldReduceMotion || !isActive
            ? { scale: 1 }
            : { scale: [1, 1.06, 1] }
        }
        transition={
          shouldReduceMotion || !isActive
            ? { duration: 0 }
            : {
                duration: 16,
                ease: 'easeInOut',
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
              }
        }
      />

      {/* ========== OVERLAY SUTIL - solo oscurece bordes ========== */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

      {/* ========== BORDE EXTERIOR de la card (efecto vidrio) ========== */}
      <div className="absolute inset-0 rounded-[24px] border border-white/15" />

      {/* ========== BADGE flotante arriba-izquierda ========== */}
      <span className="absolute left-3 top-3 z-10 inline-flex rounded-full bg-[#D4A853] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0B0F1A] shadow-[0_4px_15px_rgba(212,168,83,0.4)]">
        {promotion.badgeLabel}
      </span>

      {/* ========== PANEL GLASS INFERIOR ========== */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-2.5">
        <motion.div
          className="rounded-[18px] border border-white/20 px-4 py-3 shadow-[0_-8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          }}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
        >
          <h3 className="font-playfair text-lg font-bold leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] sm:text-xl">
            {promotion.title}
          </h3>

          <p className="mt-0.5 line-clamp-1 text-sm text-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
            {description}
          </p>

          {promotion.priceLabel ? (
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-base font-bold text-[#D4A853] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                {promotion.priceLabel}
              </span>

              {showOriginalPrice ? (
                <span className="text-xs text-white/50 line-through">
                  {promotion.originalPriceLabel}
                </span>
              ) : null}
            </div>
          ) : null}
        </motion.div>
      </div>
    </motion.article>
  );
}