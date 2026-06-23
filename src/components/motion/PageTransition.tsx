import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { pageVariants } from './transitions';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Envoltura de transición de página. Aplica las variantes initial/animate/exit
 * del sistema de diseño al contenido desplazable de cada página.
 *
 * IMPORTANTE: no debe envolver elementos con `position: fixed`
 * (BottomNav, barras de acción, modales). La animación aplica un `transform`,
 * lo que crea un nuevo bloque contenedor y rompería su posicionamiento.
 * Esos elementos deben quedar como hermanos, fuera de esta envoltura.
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}
