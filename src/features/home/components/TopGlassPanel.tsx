import { HeroBanner } from './HeroBanner';
import { HomeHeader } from './HomeHeader';

export function TopGlassPanel() {
  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[26px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl">
      <HomeHeader />
      <HeroBanner />
    </div>
  );
}
