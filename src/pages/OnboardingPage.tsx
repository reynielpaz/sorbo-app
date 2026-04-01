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
  imagePosition: string;
}

const SLIDES: SlideData[] = [
  {
    id: 0,
    title: 'Bienvenido a Sorbo',
    subtitle: 'Donde cada antojo se siente especial.',
    imageSrc: '/images/hero/onboarding-1.jpeg',
    imagePosition: 'center 32%',
  },
  {
    id: 1,
    title: 'Tu pedido, sin rodeos',
    subtitle: 'Explora el menú y elige tus favoritos en segundos.',
    imageSrc: '/images/hero/onboarding-2.jpeg',
    imagePosition: 'center 44%',
  },
  {
    id: 2,
    title: 'Listo para disfrutar',
    subtitle: 'Pide para llevar o quédate a saborearlo aquí.',
    imageSrc: '/images/hero/onboarding-3.jpeg',
    imagePosition: 'center 38%',
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
        className="absolute right-4 z-[20] border-none bg-transparent px-3 py-2 font-sans text-[13px] font-medium tracking-[0.02em] cursor-pointer"
        style={{ top: 'calc(env(safe-area-inset-top, 0px) + 16px)', color: 'rgba(245,230,200,0.56)' }}
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
              style={{ objectPosition: slide.imagePosition }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.24) 34%, rgba(0,0,0,0.56) 72%, rgba(0,0,0,0.82) 100%), linear-gradient(to right, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.14) 38%, rgba(0,0,0,0) 68%)',
              }}
            />

            <div
              className="pointer-events-none absolute inset-0 z-[9] flex flex-col items-start justify-end px-8 text-left"
              style={{ paddingBottom: '25vh' }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-full font-playfair text-3xl font-bold leading-[1.02] tracking-[-0.025em] text-sorbo-cream"
                style={{ maxWidth: 'min(88vw, 420px)' }}
              >
                {slide.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 font-sans text-[15px] leading-[1.55]"
                style={{ maxWidth: 'min(72vw, 318px)', color: 'rgba(245,230,200,0.76)' }}
              >
                {slide.subtitle}
              </motion.p>

              {isLastSlide && (
                <motion.button
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  onClick={handleFinish}
                  className="pointer-events-auto mt-7 w-fit rounded-[14px] bg-gradient-to-r from-[#D4A853] to-[#E8943A] px-8 py-3 font-sans text-sm font-bold tracking-[0.01em] text-[#0B0F1A]"
                  style={{
                    border: '1px solid rgba(255,255,255,0.14)',
                    boxShadow: '0 10px 24px rgba(212,168,83,0.16), inset 0 1px 0 rgba(255,255,255,0.22)',
                  }}
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
                width: i === currentSlide ? '22px' : '7px',
                height: '7px',
                background: i === currentSlide
                  ? 'linear-gradient(90deg, #D4A853 0%, #E8C068 100%)'
                  : 'rgba(245,230,200,0.16)',
                boxShadow: i === currentSlide
                  ? '0 0 14px rgba(212,168,83,0.22), inset 0 1px 0 rgba(255,255,255,0.14)'
                  : 'none',
                opacity: i === currentSlide ? 1 : 0.8,
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
              className="cursor-pointer rounded-xl px-6 py-2.5 font-sans text-sm font-medium transition-[border-color,color,background-color,box-shadow]"
              style={{
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(212,168,83,0.22)',
                color: 'rgba(245,230,200,0.86)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
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
