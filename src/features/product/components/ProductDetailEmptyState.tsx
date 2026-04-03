import { CircleAlert, RefreshCcw } from 'lucide-react';

interface ProductDetailEmptyStateProps {
  title: string;
  description: string;
  onBack: () => void;
  onRetry?: () => void;
}

export function ProductDetailEmptyState({
  title,
  description,
  onBack,
  onRetry,
}: ProductDetailEmptyStateProps) {
  return (
    <div className="px-4 pb-[calc(env(safe-area-inset-bottom,0px)+132px)] pt-[calc(env(safe-area-inset-top,0px)+20px)]">
      <section className="relative overflow-hidden rounded-[32px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(14,17,24,0.98)_0%,rgba(7,9,14,1)_100%)] px-5 py-8 text-center shadow-[0_28px_54px_rgba(0,0,0,0.26)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,233,212,0.08)_0%,rgba(245,233,212,0.02)_24%,transparent_54%)]" />

        <div className="relative z-[1]">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(9,12,18,0.72)_100%)] text-[#E8D6AD] shadow-[0_16px_32px_rgba(0,0,0,0.18)]">
            <CircleAlert size={24} strokeWidth={1.8} />
          </div>

          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4A853]/78">
            Sorbo · Producto
          </p>
          <h1 className="mt-3 font-playfair text-[34px] font-semibold leading-[0.94] tracking-[-0.04em] text-[#FCF8F0]">
            {title}
          </h1>
          <p className="mt-4 text-[14px] leading-7 text-white/68">
            {description}
          </p>

          <div className="mt-7 flex flex-col gap-3">
            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#E8D6AD_0%,#D4A853_52%,#B8923A_100%)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#140F08] shadow-[0_16px_28px_rgba(0,0,0,0.22)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <RefreshCcw size={15} strokeWidth={2.1} />
                Reintentar
              </button>
            ) : null}

            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(10,13,19,0.86)_100%)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/82 transition-[border-color,color] duration-200 hover:border-white/[0.16] hover:text-white"
            >
              Volver a la carta
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
