import { HeroBanner } from './HeroBanner';
import { HomeHeader } from './HomeHeader';

export function TopGlassPanel() {
  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[26px] border border-white/[0.025] bg-[#03060A]/84">
      <HomeHeader />
      <HeroBanner />
    </div>
  );
}
