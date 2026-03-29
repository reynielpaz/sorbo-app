import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

interface PromoBanner {
  title: string;
  subtitle: string;
}

const PROMO_BANNERS: PromoBanner[] = [
  {
    title: '2x1 en cócteles',
    subtitle: 'Todos los viernes de 7pm a 9pm',
  },
  {
    title: 'Nuevo: Pizza Burguer',
    subtitle: 'Prueba nuestra creación exclusiva',
  },
  {
    title: 'Happy Hour',
    subtitle: 'Bebidas al 2x1 de lunes a jueves',
  },
];

export function HeroBanner() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollToIndex(index: number) {
    const container = containerRef.current;
    const targetCard = container?.children.item(index) as HTMLElement | null;

    if (!targetCard) return;

    targetCard.scrollIntoView({
      behavior: 'smooth',
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
    const intervalId = window.setInterval(() => {
      const nextIndex = activeIndex === PROMO_BANNERS.length - 1 ? 0 : activeIndex + 1;
      scrollToIndex(nextIndex);
    }, 5_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeIndex]);

  return (
    <section className="mx-3 mb-4 mt-1 space-y-3">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto"
      >
        {PROMO_BANNERS.map((banner) => (
          <article
            key={banner.title}
            className={cn(
              'relative h-[185px] w-full shrink-0 snap-center overflow-hidden rounded-[22px] border border-[rgba(255,255,255,0.12)]',
              'bg-[linear-gradient(135deg,#9333EA_0%,#EC4899_40%,#F97316_75%,#EAB308_100%)] px-[18px] py-[16px]'
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(255,255,255,0.25)_0%,transparent_45%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,51,234,0.3)_0%,transparent_40%)]" />

            <div className="relative flex h-full items-end justify-between gap-4">
              <div className="flex h-full max-w-[200px] flex-col justify-between">
                <span className="inline-flex w-fit rounded-full bg-[rgba(0,0,0,0.2)] px-2.5 py-1 text-[9px] font-bold tracking-[0.1em] text-white backdrop-blur-md">
                  PROMO DEL DÍA
                </span>

                <div className="space-y-2">
                  <h2 className="max-w-[200px] font-playfair text-[22px] font-bold leading-[1.05] text-white [text-shadow:0_6px_18px_rgba(0,0,0,0.25)]">
                    {banner.title}
                  </h2>
                  <p className="max-w-[180px] text-[12px] text-white/85">{banner.subtitle}</p>
                </div>
              </div>

              <div className="relative mb-1 mr-1 flex h-[96px] w-[96px] shrink-0 items-center justify-center">
                <div className="absolute h-[90px] w-[90px] rounded-full border border-white/20 bg-white/10 backdrop-blur-xl" />
                <div className="absolute h-[70px] w-[70px] rounded-full border border-white/20 bg-white/12 backdrop-blur-xl" />
                <span className="relative text-[28px]">☕</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        {PROMO_BANNERS.map((banner, index) => (
          <button
            key={banner.title}
            type="button"
            aria-label={`Ir a la promoción ${index + 1}`}
            onClick={() => scrollToIndex(index)}
            className={cn(
              'rounded-full transition-all duration-300',
              activeIndex === index ? 'h-[7px] w-[22px] bg-white' : 'h-[7px] w-[7px] bg-white/30'
            )}
          />
        ))}
      </div>
    </section>
  );
}
