import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';

export function ProductPage() {
  return (
    <AppShell title="Producto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex min-h-[60vh] flex-col items-center justify-center px-6"
      >
        <h1 className="text-center font-playfair text-3xl font-bold text-sorbo-cream">
          Producto
        </h1>
        <p className="mt-2 text-center text-sm text-sorbo-cream/50">
          Próximamente — detalle de producto
        </p>
      </motion.div>
    </AppShell>
  );
}
