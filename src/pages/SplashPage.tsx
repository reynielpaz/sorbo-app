import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES, APP_NAME, APP_SLOGAN } from '@/utils/constants';

export function SplashPage() {
  const navigate = useNavigate();

  // Redirige a /home después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(ROUTES.HOME, { replace: true });
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-sorbo-black flex flex-col items-center justify-center z-90">
      {/* Fondo con gradiente */}
      <div
        className="absolute inset-0"
        style={{ background: 'var(--sorbo-gradient-hero)' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Logo / Nombre */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-playfair text-5xl font-bold text-sorbo-cream tracking-widest uppercase"
        >
          SORBO
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-sorbo-gold text-sm tracking-[0.3em] uppercase"
        >
          Café • Bistró
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-sorbo-cream text-xs mt-6 tracking-wider"
        >
          {APP_SLOGAN}
        </motion.p>
      </div>

      {/* Indicador de carga */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-16 flex gap-1"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-sorbo-gold"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>

      {/* Crédito discreto */}
      <p className="absolute bottom-6 text-sorbo-cream/20 text-[10px]">
        {APP_NAME}
      </p>
    </div>
  );
}
