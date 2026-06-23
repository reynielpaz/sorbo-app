import type { TargetAndTransition, Variants } from 'framer-motion';

/**
 * Curva de easing del sistema de diseño (suave, sin rebote).
 * Coincide con el ease usado en las animaciones de secciones del home.
 */
const PAGE_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/**
 * Salida de página: desvanecimiento con un microdesplazamiento hacia arriba.
 * Se expone como objetivo independiente para reutilizarla en páginas que ya
 * tienen su propia animación de entrada (p. ej. ProductPage, ReservationsPage).
 */
export const pageExit: TargetAndTransition = {
  opacity: 0,
  y: -8,
  transition: { duration: 0.2, ease: PAGE_EASE },
};

/**
 * Preset de transición de página: desvanecimiento suave con un
 * microdesplazamiento vertical. Se consume con <AnimatePresence mode="wait">
 * en el Router para animar la entrada y la salida de cada ruta.
 *
 * El contenido entra desde abajo (+y) y sale hacia arriba (-y), de modo que
 * la navegación se siente como un flujo vertical continuo.
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: PAGE_EASE },
  },
  exit: pageExit,
};
