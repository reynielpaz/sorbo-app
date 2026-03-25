import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';

export function HomePage() {
  return (
    <AppShell title="Inicio">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center min-h-[60vh] px-6"
      >
        <h1 className="font-playfair text-3xl font-bold text-sorbo-cream text-center">
          Inicio
        </h1>
        <p className="text-sorbo-cream/50 text-sm mt-2 text-center">
          Próximamente — Fase 1
        </p>
      </motion.div>
    </AppShell>
  );
}
