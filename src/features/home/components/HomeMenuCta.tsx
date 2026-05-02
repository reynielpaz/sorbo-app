import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

export function HomeMenuCta() {
  const navigate = useNavigate();
  return (
    <section className="mt-7 px-5">
      <div className="relative overflow-hidden rounded-[22px] border border-white/[0.04] bg-[#05070B]/72 px-4 py-4 shadow-[0_14px_32px_rgba(0,0,0,0.2)]">
        <div className="absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]" />
        <div className="relative">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#D4A853]/78">Menú Sorbo</p>
          <h2 className="mt-2 max-w-[14ch] font-playfair text-[22px] font-semibold leading-[1.08] text-white/95">
            ¿Listo para pedir?
          </h2>
          <p className="mt-2 max-w-[32ch] text-[12px] leading-5 text-white/54">
            Explora bebidas, postres y lo más pedido de Sorbo en un solo lugar.
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.14em] text-white/38">
            <span className="rounded-full border border-white/[0.04] bg-black/[0.24] px-2.5 py-1">Bebidas</span>
            <span className="rounded-full border border-white/[0.04] bg-black/[0.24] px-2.5 py-1">Postres</span>
            <span className="rounded-full border border-white/[0.04] bg-black/[0.24] px-2.5 py-1">Favoritos</span>
          </div>

          <button
            type="button"
            onClick={() => navigate(ROUTES.MENU, { state: { fromCta: true } })}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4A853] to-[#E8943A] px-4 py-2.5 text-[12px] font-semibold text-[#140F0A] shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-transform duration-200 hover:-translate-y-[1px]"
          >
            Ver menú completo
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
