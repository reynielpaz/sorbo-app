import { HeroBanner } from './HeroBanner';
import { HomeHeader } from './HomeHeader';

export function TopGlassPanel() {
  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[26px] border border-white/[0.07] bg-[rgba(14,18,37,0.6)]">
      <HomeHeader />
      <HeroBanner />
    </div>
  );
}