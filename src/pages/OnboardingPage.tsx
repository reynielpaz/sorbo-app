import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  imageSrc: string;
}

const SLIDES: SlideData[] = [
  {
    id: 0,
    title: 'Bienvenido a Sorbo',
    subtitle: 'Tu experiencia gastronómica premium',
    imageSrc: '/images/hero/onboarding-1.jpeg',
  },
  {
    id: 1,
    title: 'Menú a un toque',
    subtitle: 'Explora nuestro menú y pide desde tu celular',
    imageSrc: '/images/hero/onboarding-2.jpeg',
  },
  {
    id: 2,
    title: 'Pide y disfruta',
    subtitle: 'Ordena para llevar o para comer aquí',
    imageSrc: '/images/hero/onboarding-3.jpeg',
  },
] as const;

const slideVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export function OnboardingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide]);

  const handleNext = useCallback(() => {
    if (currentSlide < SLIDES.length - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide]);

  const handleFinish = useCallback(() => {
    localStorage.setItem('sorbo_onboarding_done', 'true');
    navigate(isAuthenticated ? ROUTES.HOME : ROUTES.AUTH, { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSkip = useCallback(() => {
    localStorage.setItem('sorbo_onboarding_done', 'true');
    navigate(isAuthenticated ? ROUTES.HOME : ROUTES.AUTH, { replace: true });
  }, [isAuthenticated, navigate]);

  const slide = SLIDES[currentSlide];
  const isLastSlide = currentSlide === SLIDES.length - 1;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-[90]">

      {/* Botón Omitir — siempre visible arriba a la derecha */}
      <button
        onClick={handleSkip}
        className="absolute right-4 z-[20] font-sans text-sm px-3 py-2 bg-transparent border-none cursor-pointer"
        style={{ top: 'calc(env(safe-area-inset-top, 0px) + 16px)', color: 'rgba(245,230,200,0.5)' }}
      >
        Omitir
      </button>

      {/* Manejador de swipe — capa invisible sobre el contenido */}
      <motion.div
        key="drag-handler"
        className="absolute inset-0 z-[8]"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60 && currentSlide < SLIDES.length - 1) {
            setDirection(1);
            setCurrentSlide((prev) => prev + 1);
          } else if (info.offset.x > 60 && currentSlide > 0) {
            setDirection(-1);
            setCurrentSlide((prev) => prev - 1);
          }
        }}
      />

      {/* Slides con AnimatePresence */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
          style={{ background: '#000000' }}
        >
          <div className="relative h-full w-full">
            <motion.img
              src={slide.imageSrc}
              alt=""
              aria-hidden="true"
              initial={{ scale: 1.06, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />

            <div
              className="pointer-events-none absolute inset-0 z-[9] flex flex-col justify-end px-8 text-left"
              style={{ paddingBottom: '25vh' }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                className="font-playfair text-3xl font-bold text-sorbo-cream"
              >
                {slide.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 font-sans text-base leading-relaxed"
                style={{ color: 'rgba(245,230,200,0.7)' }}
              >
                {slide.subtitle}
              </motion.p>

              {isLastSlide && (
                <motion.button
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  onClick={handleFinish}
                  className="pointer-events-auto mt-6 w-fit rounded-xl bg-gradient-to-r from-[#D4A853] to-[#E8943A] px-8 py-3 font-sans text-sm font-bold text-[#0A0908]"
                >
                  Comenzar
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controles inferiores — sobre el swipe handler */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[10] px-6 pb-10 flex flex-col items-center gap-6"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 40px)' }}
      >
        {/* Dots indicadores */}
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="rounded-full border-none cursor-pointer transition-all duration-300"
              aria-label={`Ir al slide ${i + 1}`}
              style={{
                width: i === currentSlide ? '20px' : '8px',
                height: '8px',
                backgroundColor: i === currentSlide ? '#D4A853' : 'rgba(245,230,200,0.3)',
              }}
            />
          ))}
        </div>

        {/* Botón Siguiente */}
        <div className="w-full flex justify-between items-center">
          {/* Contador discreto */}
          <span
            className="font-sans text-xs"
            style={{ color: 'rgba(245,230,200,0.3)' }}
          >
            {currentSlide + 1} / {SLIDES.length}
          </span>

          {isLastSlide ? (
            <div className="h-[48px] w-[128px]" aria-hidden="true" />
          ) : (
            <button
              onClick={handleNext}
              className="font-sans text-sm font-medium px-6 py-2.5 rounded-xl cursor-pointer"
              style={{
                background: 'transparent',
                border: '1px solid rgba(212,168,83,0.25)',
                color: '#F5E6C8',
              }}
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
