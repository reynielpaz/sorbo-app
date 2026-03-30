import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { PromotionBannerItem } from '@/types';
import { cn } from '@/utils/cn';
import { usePromotions } from '../hooks/usePromotions';
import { PromoHeroCard } from './PromoHeroCard';

const HERO_FALLBACK_IMAGE = '/images/hero/hero-burger-splash.png';

const EMPTY_PROMOTIONS_FALLBACK: PromotionBannerItem = {
  id: 'promotions-empty',
  title: 'Nuevas promociones muy pronto',
  description: 'Sabores que merecen repetirse.',
  imageUrl: HERO_FALLBACK_IMAGE,
  badgeLabel: 'PROMO',
};

const ERROR_PROMOTIONS_FALLBACK: PromotionBannerItem = {
  id: 'promotions-error',
  title: 'Promociones en actualización',
  description: 'Sabores que merecen repetirse.',
  imageUrl: HERO_FALLBACK_IMAGE,
  badgeLabel: 'PROMO',
};

export function HeroBanner() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { promotions, loading, error } = usePromotions();
  const shouldReduceMotion = useReducedMotion();
  const items = promotions.length > 0
    ? promotions
    : [error ? ERROR_PROMOTIONS_FALLBACK : EMPTY_PROMOTIONS_FALLBACK];
  const hasMultiplePromotions = promotions.length > 1;
  const showDots = !loading && hasMultiplePromotions;
  const enableAutoplay = hasMultiplePromotions && !shouldReduceMotion;

  function scrollToIndex(index: number) {
    const container = containerRef.current;
    const targetCard = container?.children.item(index) as HTMLElement | null;

    if (!targetCard) return;

    targetCard.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      inline: 'center',
      block: 'nearest',
    });
    setActiveIndex(index);
  }

  function handleScroll() {
    const container = containerRef.current;

    if (!container) return;

    const cards = Array.from(container.children) as HTMLElement[];
    const viewportCenter = container.scrollLeft + container.clientWidth / 2;

    let nextIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(cardCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        nextIndex = index;
      }
    });

    setActiveIndex(nextIndex);
  }

  useEffect(() => {
    setActiveIndex(0);

    const container = containerRef.current;
    const firstCard = container?.children.item(0) as HTMLElement | null;

    if (!firstCard) return;

    firstCard.scrollIntoView({
      behavior: 'auto',
      inline: 'center',
      block: 'nearest',
    });
  }, [items.length]);

  useEffect(() => {
    if (!enableAutoplay) return;

    const intervalId = window.setInterval(() => {
      const nextIndex = activeIndex === promotions.length - 1 ? 0 : activeIndex + 1;
      const container = containerRef.current;
      const targetCard = container?.children.item(nextIndex) as HTMLElement | null;

      if (!targetCard) return;

      targetCard.scrollIntoView({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
        inline: 'center',
        block: 'nearest',
      });
      setActiveIndex(nextIndex);
    }, 5_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeIndex, enableAutoplay, promotions.length, shouldReduceMotion]);

  if (loading) {
    return (
      <motion.section
        className="mx-3 mb-4 mt-1"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? undefined : { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="h-[210px] w-full animate-pulse rounded-[24px] border border-white/10 bg-white/5 shadow-[0_18px_50px_rgba(0,0,0,0.35)] sm:h-[240px]" />
      </motion.section>
    );
  }

  return (
    <motion.section
      className="mx-3 mb-4 mt-1 space-y-3"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto"
      >
        {items.map((promotion, index) => (
          <PromoHeroCard
            key={promotion.id}
            promotion={promotion}
            isActive={activeIndex === index}
            shouldReduceMotion={Boolean(shouldReduceMotion)}
          />
        ))}
      </div>

      {showDots ? (
        <div className="flex items-center justify-center gap-2">
          {promotions.map((promotion, index) => (
            <button
              key={promotion.id}
              type="button"
              aria-label={`Ir a promoción ${index + 1}`}
              onClick={() => scrollToIndex(index)}
              className={cn(
                'rounded-full transition-all duration-300',
                activeIndex === index
                  ? 'h-2 w-6 bg-[#D4A853]'
                  : 'h-2 w-2 bg-white/30'
              )}
            />
          ))}
        </div>
      ) : null}
    </motion.section>
  );
}
