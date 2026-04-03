import { ChevronLeft } from 'lucide-react';

interface MenuTopBarProps {
  subtitle: string;
  resultsValue: string;
  onBack: () => void;
}

export function MenuTopBar({ subtitle, resultsValue, onBack }: MenuTopBarProps) {
  void subtitle;

  const resultsLabel =
    resultsValue === '...' ? 'Cargando selección' : `${resultsValue} disponibles ahora`;
  const heroSubtitle = 'Lo mejor de Sorbo, servido con estilo.';

  return (
    <div className="relative min-h-[224px] overflow-hidden rounded-[30px] border border-white/[0.06] bg-[linear-gradient(140deg,rgba(14,16,22,0.98)_0%,rgba(8,10,15,0.96)_48%,rgba(5,7,11,0.92)_100%)] shadow-[0_28px_54px_rgba(0,0,0,0.32)]">
      <div className="absolute inset-y-0 right-0 w-[54%] overflow-hidden">
        <img
          src="/images/menu/menu-hero-sorbo.jpeg"
          alt="Ambiente de Sorbo Café • Bistró"
          className="h-full w-full object-cover object-[62%_center] brightness-[1.04] saturate-[1.05]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,5,9,0.08)_0%,rgba(4,5,9,0.2)_38%,rgba(4,5,9,0.36)_100%)]" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,11,0.98)_0%,rgba(5,7,11,0.93)_20%,rgba(5,7,11,0.76)_42%,rgba(5,7,11,0.4)_72%,rgba(5,7,11,0.12)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.024)_28%,transparent_56%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-[linear-gradient(180deg,rgba(6,8,12,0)_0%,rgba(6,8,12,0.34)_100%)]" />

      <div className="relative z-[1] px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.065)_0%,rgba(12,14,20,0.74)_100%)] text-white/82 shadow-[0_10px_20px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.05)] transition-[border-color,background,color] duration-200 hover:border-white/[0.14] hover:text-white"
          >
            <ChevronLeft size={17} />
          </button>

          <span className="pt-1 text-[8px] font-medium uppercase tracking-[0.26em] text-[#E7D3AA]/36">
            {resultsLabel}
          </span>
        </div>

        <div className="mt-8 max-w-[52%] min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#E8D6AD]/82">
            Sorbo · Carta
          </p>
          <h1 className="mt-2.5 font-playfair text-[37px] font-semibold leading-[0.9] tracking-[-0.045em] text-[#FCF8F0]">
            Menú
          </h1>
          <p className="mt-3.5 text-[12px] leading-[1.6] text-[rgba(255,255,255,0.68)]">
            {heroSubtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
