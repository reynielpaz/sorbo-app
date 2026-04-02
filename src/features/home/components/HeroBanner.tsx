import { useCallback, useEffect, useRef, useState } from 'react';
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

const AUTOPLAY_INTERVAL_MS = 5_000;
const INTERACTION_PAUSE_MS = 4_000;
const PROGRAMMATIC_SCROLL_LOCK_MS = 450;
const HERO_VISIBLE_THRESHOLD = 0.35;

function getTargetScrollLeft(container: HTMLDivElement, targetCard: HTMLElement) {
  const centeredLeft = targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;
  const maxScrollLeft = Math.max(container.scrollWidth - container.clientWidth, 0);

  return Math.min(Math.max(centeredLeft, 0), maxScrollLeft);
}

export function HeroBanner() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoplayPauseUntilRef = useRef(0);
  const isProgrammaticScrollRef = useRef(false);
  const programmaticScrollTimeoutRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const { promotions, loading, error } = usePromotions();
  const shouldReduceMotion = useReducedMotion();
  const items = promotions.length > 0
    ? promotions
    : [error ? ERROR_PROMOTIONS_FALLBACK : EMPTY_PROMOTIONS_FALLBACK];
  const hasMultiplePromotions = promotions.length > 1;
  const showDots = !loading && hasMultiplePromotions;
  const enableAutoplay = hasMultiplePromotions && !shouldReduceMotion;

  const pauseAutoplay = useCallback((duration = INTERACTION_PAUSE_MS) => {
    autoplayPauseUntilRef.current = Date.now() + duration;
  }, []);

  const scrollToIndex = useCallback(
    (
      index: number,
      options?: {
        behavior?: ScrollBehavior;
        pauseAutoplay?: boolean;
      },
    ) => {
      const container = containerRef.current;
      const targetCard = container?.children.item(index) as HTMLElement | null;

      if (!container || !targetCard) return;

      if (options?.pauseAutoplay ?? true) {
        pauseAutoplay();
      }

      if (programmaticScrollTimeoutRef.current !== null) {
        window.clearTimeout(programmaticScrollTimeoutRef.current);
      }

      isProgrammaticScrollRef.current = true;
      container.scrollTo({
        left: getTargetScrollLeft(container, targetCard),
        behavior: options?.behavior ?? (shouldReduceMotion ? 'auto' : 'smooth'),
      });
      setActiveIndex(index);

      programmaticScrollTimeoutRef.current = window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        programmaticScrollTimeoutRef.current = null;
      }, shouldReduceMotion ? 0 : PROGRAMMATIC_SCROLL_LOCK_MS);
    },
    [pauseAutoplay, shouldReduceMotion],
  );

  const handleScroll = useCallback(() => {
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

    if (!isProgrammaticScrollRef.current) {
      pauseAutoplay();
    }

    setActiveIndex(nextIndex);
  }, [pauseAutoplay]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      scrollToIndex(0, { behavior: 'auto', pauseAutoplay: false });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [items.length, scrollToIndex]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting && entry.intersectionRatio >= HERO_VISIBLE_THRESHOLD);
      },
      {
        threshold: [0, HERO_VISIBLE_THRESHOLD, 1],
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!enableAutoplay || !isHeroVisible) return;

    const intervalId = window.setInterval(() => {
      if (Date.now() < autoplayPauseUntilRef.current || isProgrammaticScrollRef.current) {
        return;
      }

      const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;

      scrollToIndex(nextIndex, { pauseAutoplay: false });
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeIndex, enableAutoplay, isHeroVisible, items.length, scrollToIndex]);

  useEffect(() => {
    return () => {
      if (programmaticScrollTimeoutRef.current !== null) {
        window.clearTimeout(programmaticScrollTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <motion.section
        ref={sectionRef}
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
      ref={sectionRef}
      className="mx-3 mb-4 mt-1 space-y-3"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onPointerDown={() => pauseAutoplay()}
        onWheel={() => pauseAutoplay()}
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
