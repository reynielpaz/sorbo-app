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

function splitTitle(title: string) {
  const words = title.trim().split(/\s+/);

  if (words.length <= 1) {
    return { mainText: '', accentWord: title };
  }

  const accentWord = words[words.length - 1];
  const mainText = words.slice(0, -1).join(' ');

  return { mainText, accentWord };
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
  const { mainText, accentWord } = splitTitle(promotion.title);

  return (
    <motion.article
      aria-label={promotion.title}
      className="relative h-[200px] w-full shrink-0 snap-center overflow-hidden rounded-[22px] border border-white/[0.08] sm:h-[220px]"
      style={{ background: '#0a0a0a' }}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {/* ========== IMAGEN de fondo ========== */}
      <motion.img
        src={imageUrl}
        alt={promotion.title}
        className="absolute inset-0 h-full w-full object-cover"
        loading={isActive ? 'eager' : 'lazy'}
        fetchPriority={isActive ? 'high' : 'auto'}
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

      {/* ========== CORTINA IZQUIERDA ========== */}
      <div
        className="absolute inset-y-0 left-0 z-[1] w-[75%]"
        style={{
          background: 'linear-gradient(to right, #0a0a0a 0%, #0a0a0a 42%, rgba(10,10,10,0.95) 52%, rgba(10,10,10,0.7) 62%, rgba(10,10,10,0.3) 75%, transparent 100%)',
        }}
      />

      {/* ========== VIÑETA inferior ========== */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 30%)',
        }}
      />

      {/* ========== CONTENIDO ========== */}
      <div className="relative z-[3] flex h-full w-[62%] flex-col justify-between p-4 sm:p-5">
        {/* Badge — naranja sólido pero compacto */}
        <span className="inline-flex w-fit rounded-full bg-[#E8943A] px-2.5 py-[3px] text-[8px] font-bold uppercase tracking-[0.12em] text-white">
          {promotion.badgeLabel}
        </span>

        {/* Texto con última palabra en naranja */}
        <div>
          <h3
            className="font-playfair text-[22px] font-extrabold leading-[1.05] sm:text-[24px]"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
          >
            {mainText ? (
              <>
                <span className="text-white">{mainText} </span>
                <span className="text-[#E8943A]">{accentWord}</span>
              </>
            ) : (
              <span className="text-[#E8943A]">{accentWord}</span>
            )}
          </h3>

          <p
            className="mt-1.5 line-clamp-2 text-[12px] font-medium leading-[1.4] text-white/60 sm:text-[13px]"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
          >
            {description}
          </p>

          {promotion.priceLabel ? (
            <div className="mt-2.5 flex items-center gap-2">
              <span
                className="text-[16px] font-bold text-[#E8943A] sm:text-[17px]"
                style={{ textShadow: '0 2px 8px rgba(232,148,58,0.3)' }}
              >
                {promotion.priceLabel}
              </span>

              {showOriginalPrice ? (
                <span className="text-[11px] text-white/30 line-through">
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
