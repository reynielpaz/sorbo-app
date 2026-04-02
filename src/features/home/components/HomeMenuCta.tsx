import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

export function HomeMenuCta() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="mt-8 px-5">
      <div className="relative overflow-hidden rounded-[30px] border border-[rgba(212,168,83,0.18)] bg-[radial-gradient(circle_at_top_right,rgba(212,168,83,0.14),transparent_32%),linear-gradient(180deg,rgba(24,18,13,0.96)_0%,rgba(10,10,12,0.98)_100%)] px-5 py-6 shadow-[0_26px_60px_rgba(0,0,0,0.32)]">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(232,214,173,0.46),transparent)]" />
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-[-18%] bottom-[-6.5rem] h-40 rounded-full bg-[radial-gradient(circle,rgba(212,168,83,0.18)_0%,rgba(212,168,83,0.08)_34%,transparent_72%)] blur-3xl"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: [0.36, 0.56, 0.36],
                  scale: [0.98, 1.03, 0.98],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 6.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        />
        <div className="absolute -right-12 bottom-[-4rem] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(212,168,83,0.12)_0%,transparent_72%)] blur-2xl" />

        <div className="relative">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#D4A853]/78">Menú Sorbo</p>
          <h2 className="mt-3 max-w-[12ch] font-playfair text-[28px] font-semibold leading-[1.05] text-white/95">
            ¿Listo para pedir?
          </h2>
          <p className="mt-3 max-w-[30ch] text-[14px] leading-6 text-white/65">
            Explora bebidas, postres y lo más pedido de Sorbo en un solo lugar.
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-white/42">
            <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">Bebidas</span>
            <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">Postres</span>
            <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">Favoritos</span>
          </div>

          <Link
            to={ROUTES.MENU}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4A853] to-[#E8943A] px-5 py-3 text-[13px] font-semibold text-[#140F0A] shadow-[0_16px_30px_rgba(0,0,0,0.26)] transition-transform duration-200 hover:-translate-y-[1px]"
          >
            Ver menú completo
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
