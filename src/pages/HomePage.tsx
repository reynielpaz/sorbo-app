import { motion } from 'framer-motion';
import { BottomNav } from '@/components/layout/BottomNav';
import { CategorySlider } from '@/features/home/components/CategorySlider';
import { FeaturedProducts } from '@/features/home/components/FeaturedProducts';
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
      <div className="relative z-[1] pb-24">
        <motion.section {...getSectionAnimation(0)}>
          <TopGlassPanel />
        </motion.section>

        <motion.section {...getSectionAnimation(0.1)}>
          <CategorySlider />
        </motion.section>

        <motion.section {...getSectionAnimation(0.2)}>
          <FeaturedProducts />
        </motion.section>
      </div>

      <BottomNav />
    </div>
  );
}