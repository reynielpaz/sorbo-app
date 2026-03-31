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
      className="relative h-[200px] w-full shrink-0 snap-center overflow-hidden rounded-[22px] border border-white/[0.08] sm:h-[220px]"
      style={{ background: '#110c06' }}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {/* ========== IMAGEN (capa base, ocupa todo) ========== */}
      <motion.img
        src={imageUrl}
        alt={promotion.title}
        className="absolute inset-0 h-full w-full object-cover"
        initial={false}
        animate={
          shouldReduceMotion || !isActive
            ? { scale: 1 }
            : { scale: [1, 1.04, 1] }
        }
        transition={
          shouldReduceMotion || !isActive
            ? { duration: 0 }
            : {
                duration: 14,
                ease: 'easeInOut',
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
              }
        }
      />

      {/* ========== CORTINA IZQUIERDA: naranja apetito cálido ========== */}
      <div
        className="absolute inset-y-0 left-0 z-[1] w-[72%]"
        style={{
          background: 'linear-gradient(to right, #110c06 0%, #1a0e04 30%, rgba(180,100,20,0.25) 60%, rgba(180,100,20,0.08) 75%, transparent 100%)',
        }}
      />

      {/* ========== GLOW NARANJA ambiente inferior ========== */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_bottom_left,rgba(200,120,30,0.10)_0%,transparent_50%)]" />

      {/* ========== VIÑETA inferior ========== */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background: 'linear-gradient(to top, #110c06 0%, transparent 30%)',
        }}
      />

      {/* ========== CONTENIDO ========== */}
      <div className="relative z-[3] flex h-full w-[58%] flex-col justify-between p-4 sm:p-5">
        {/* Badge — dorado cálido sobre fondo oscuro */}
        <span className="inline-flex w-fit rounded-full border border-[#D4A853]/30 bg-[#D4A853]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#0B0F1A] shadow-[0_4px_14px_rgba(212,168,83,0.3)]">
          {promotion.badgeLabel}
        </span>

        {/* Texto */}
        <div>
          <h3
            className="font-playfair text-[22px] font-extrabold leading-[1.05] text-white sm:text-[24px]"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
          >
            {promotion.title}
          </h3>

          <p
            className="mt-1 line-clamp-2 text-[12px] font-medium leading-[1.4] text-white/70 sm:text-[13px]"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
          >
            {description}
          </p>

          {promotion.priceLabel ? (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[15px] font-bold text-[#D4A853] sm:text-base">
                {promotion.priceLabel}
              </span>

              {showOriginalPrice ? (
                <span className="text-[11px] text-white/35 line-through">
                  {promotion.originalPriceLabel}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}