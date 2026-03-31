import { HeroBanner } from './HeroBanner';
import { HomeHeader } from './HomeHeader';

export function TopGlassPanel() {
  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[26px] border border-white/[0.04] bg-white/[0.02]">
      <HomeHeader />
      <HeroBanner />
    </div>
  );
}
