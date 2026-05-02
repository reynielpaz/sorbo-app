import { motion } from 'framer-motion';
import { BottomNav } from '@/components/layout/BottomNav';
import { FeaturedProducts } from '@/features/home/components/FeaturedProducts';
import { HomeCollections } from '@/features/home/components/HomeCollections';
import { HomeCredits } from '@/features/home/components/HomeCredits';
import { HomeMenuCta } from '@/features/home/components/HomeMenuCta';
import { HomeSocialLinks } from '@/features/home/components/HomeSocialLinks';
import { TopGlassPanel } from '@/features/home/components/TopGlassPanel';

const SECTION_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

function getSectionAnimation(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      ease: SECTION_EASE,
      delay,
    },
  };
}

export function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[240px] bg-[linear-gradient(180deg,rgba(3,6,10,0.72)_0%,rgba(3,6,10,0)_100%)]" />
      <div className="relative z-[1] pb-[calc(env(safe-area-inset-bottom)+124px)]">
        <motion.section {...getSectionAnimation(0)}>
          <TopGlassPanel />
        </motion.section>

        <motion.section {...getSectionAnimation(0.08)}>
          <HomeCollections />
        </motion.section>

        <motion.section {...getSectionAnimation(0.16)}>
          <FeaturedProducts />
        </motion.section>

        <motion.section {...getSectionAnimation(0.24)}>
          <HomeMenuCta />
        </motion.section>

        <motion.section {...getSectionAnimation(0.32)}>
          <HomeSocialLinks />
        </motion.section>

        <motion.section {...getSectionAnimation(0.4)}>
          <HomeCredits />
        </motion.section>
      </div>

      <BottomNav />
    </div>
  );
}
