import { ChevronLeft } from 'lucide-react';

interface MenuTopBarProps {
  subtitle: string;
  resultsValue: string;
  onBack: () => void;
}

export function MenuTopBar({ subtitle, resultsValue, onBack }: MenuTopBarProps) {
  const resultsLabel =
    resultsValue === '...' ? 'Cargando selección' : `${resultsValue} disponibles ahora`;

  return (
    <div className="rounded-[22px] border border-white/[0.035] bg-[#05070B]/70 px-3 py-3 shadow-[0_6px_14px_rgba(0,0,0,0.12)]">
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] border border-white/[0.045] bg-black/[0.24] text-white/72 transition-[border-color,background,color] duration-200 hover:border-white/[0.045] hover:bg-black/[0.32] hover:text-white"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[8px] font-medium uppercase tracking-[0.26em] text-white/36">
              Sorbo · Carta
            </p>

            <span className="shrink-0 pt-0.5 text-[8px] font-medium uppercase tracking-[0.16em] text-white/32">
              {resultsLabel}
            </span>
          </div>

          <h1 className="mt-1.5 font-playfair text-[29px] font-semibold leading-none tracking-[-0.03em] text-[#FCF8F0]">
            Menú
          </h1>

          <p className="mt-1.5 line-clamp-1 text-[11px] leading-5 text-white/50">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
