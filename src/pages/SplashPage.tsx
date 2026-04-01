import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { preloadHomeData } from '@/services/preloader';
import { hideBootScreen } from '@/utils/bootScreen';
import { ROUTES } from '@/utils/constants';

const LOGO_LETTERS = ['S', 'O', 'R', 'B', 'O'] as const;
const ONBOARDING_STORAGE_KEY = 'sorbo_onboarding_done';

const PARTICLES = [
  { id: 1, left: '8%', top: '84%', size: '2px', duration: '18s', delay: '-11s', opacity: '0.06', drift: '8px' },
  { id: 2, left: '16%', top: '92%', size: '3px', duration: '15s', delay: '-6s', opacity: '0.1', drift: '-6px' },
  { id: 3, left: '23%', top: '76%', size: '2px', duration: '17s', delay: '-13s', opacity: '0.08', drift: '10px' },
  { id: 4, left: '29%', top: '88%', size: '1px', duration: '14s', delay: '-8s', opacity: '0.05', drift: '-4px' },
  { id: 5, left: '34%', top: '70%', size: '2px', duration: '19s', delay: '-3s', opacity: '0.07', drift: '6px' },
  { id: 6, left: '41%', top: '96%', size: '3px', duration: '16s', delay: '-12s', opacity: '0.11', drift: '-8px' },
  { id: 7, left: '47%', top: '82%', size: '2px', duration: '18s', delay: '-2s', opacity: '0.09', drift: '7px' },
  { id: 8, left: '53%', top: '90%', size: '2px', duration: '15s', delay: '-9s', opacity: '0.12', drift: '-10px' },
  { id: 9, left: '59%', top: '74%', size: '1px', duration: '20s', delay: '-7s', opacity: '0.05', drift: '5px' },
  { id: 10, left: '64%', top: '86%', size: '3px', duration: '17s', delay: '-14s', opacity: '0.13', drift: '-7px' },
  { id: 11, left: '69%', top: '95%', size: '2px', duration: '18s', delay: '-5s', opacity: '0.08', drift: '4px' },
  { id: 12, left: '74%', top: '79%', size: '2px', duration: '16s', delay: '-10s', opacity: '0.07', drift: '-5px' },
  { id: 13, left: '78%', top: '89%', size: '1px', duration: '14s', delay: '-4s', opacity: '0.05', drift: '9px' },
  { id: 14, left: '82%', top: '68%', size: '2px', duration: '19s', delay: '-15s', opacity: '0.06', drift: '-9px' },
  { id: 15, left: '86%', top: '93%', size: '3px', duration: '15s', delay: '-1s', opacity: '0.14', drift: '6px' },
  { id: 16, left: '12%', top: '62%', size: '2px', duration: '21s', delay: '-16s', opacity: '0.05', drift: '-3px' },
  { id: 17, left: '27%', top: '58%', size: '1px', duration: '22s', delay: '-18s', opacity: '0.04', drift: '4px' },
  { id: 18, left: '46%', top: '64%', size: '2px', duration: '20s', delay: '-17s', opacity: '0.06', drift: '-6px' },
  { id: 19, left: '67%', top: '56%', size: '1px', duration: '24s', delay: '-20s', opacity: '0.04', drift: '3px' },
  { id: 20, left: '88%', top: '60%', size: '2px', duration: '21s', delay: '-19s', opacity: '0.05', drift: '-4px' },
] as const;

type ParticleStyle = CSSProperties & Record<string, string>;

export function SplashPage() {
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const exitTweenRef = useRef<gsap.core.Tween | null>(null);
  const exitingRef = useRef(false);

  const runExit = () => {
    if (exitingRef.current || !containerRef.current) {
      return;
    }

    exitingRef.current = true;
    introTimelineRef.current?.kill();
    exitTweenRef.current?.kill();

    exitTweenRef.current = gsap.to(containerRef.current, {
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        const targetRoute = localStorage.getItem(ONBOARDING_STORAGE_KEY)
          ? ROUTES.HOME
          : ROUTES.ONBOARDING;

        navigate(targetRoute, { replace: true });
      },
    });
  };

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const letters = letterRefs.current.filter(
        (letter): letter is HTMLSpanElement => letter !== null
      );

      gsap.set(logoRef.current, { autoAlpha: 0, y: -20 });
      gsap.set(heroRef.current, { autoAlpha: 0, x: 80 });
      gsap.set(dividerRef.current, { autoAlpha: 0 });
      gsap.set(subtitleRef.current, { autoAlpha: 0 });

      if (letters.length > 0) {
        gsap.set(letters, { autoAlpha: 0, y: 40 });
      }

      hideBootScreen();
      void preloadHomeData();
      introTimelineRef.current = gsap.timeline();

      introTimelineRef.current
        .fromTo(
          containerRef.current,
          { backgroundColor: '#000000' },
          { backgroundColor: '#000000', duration: 0.6, ease: 'power2.out' },
          0
        )
        .to(logoRef.current, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.3)
        .to(heroRef.current, { autoAlpha: 1, x: 0, duration: 1, ease: 'power3.out' }, 0.5);

      if (letters.length > 0) {
        introTimelineRef.current.to(
          letters,
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' },
          0.7
        );
      }

      introTimelineRef.current
        .to(dividerRef.current, { autoAlpha: 0.25, duration: 0.8, ease: 'power2.out' }, 1.8)
        .to(subtitleRef.current, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, 2.0)
        .to(
          containerRef.current,
          {
            autoAlpha: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onStart: () => {
              exitingRef.current = true;
            },
            onComplete: () => {
              const targetRoute = localStorage.getItem(ONBOARDING_STORAGE_KEY)
                ? ROUTES.HOME
                : ROUTES.ONBOARDING;

              navigate(targetRoute, { replace: true });
            },
          },
          3.6
        );
    }, containerRef);

    return () => {
      introTimelineRef.current?.kill();
      exitTweenRef.current?.kill();
      context.revert();
    };
  }, [navigate]);

  return (
    <div
      ref={containerRef}
      onClick={runExit}
      className="fixed inset-0 z-[90] overflow-hidden bg-black cursor-pointer"
    >
      <div className="pointer-events-none absolute inset-0 z-[1]">
        {PARTICLES.map((particle) => {
          const particleStyle: ParticleStyle = {
            '--particle-left': particle.left,
            '--particle-top': particle.top,
            '--particle-size': particle.size,
            '--particle-duration': particle.duration,
            '--particle-delay': particle.delay,
            '--particle-opacity': particle.opacity,
            '--particle-drift': particle.drift,
          };

          return <span key={particle.id} className="splash-particle" style={particleStyle} />;
        })}
      </div>

      <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-[#000000]">
        <div
          className="relative z-[2] flex h-full flex-col items-center px-2 text-center"
          style={{
            paddingTop: 'calc(env(safe-area-inset-top, 0px) + 4vh)',
            paddingBottom: 'max(12vh, 88px)',
          }}
        >
          <img
            ref={logoRef}
            src="/images/brand/logo-sorbo.png"
            alt="Sorbo Café • Bistró"
            className="object-contain"
            style={{
              width: 'clamp(80px, 22vw, 128px)',
              filter: 'brightness(0) invert(1) sepia(0.2)',
            }}
          />

          <div
            className="mt-4 flex flex-1 flex-col items-center justify-center leading-[0.85]"
            style={{ marginTop: 'max(2.5vh, 18px)' }}
          >
            {LOGO_LETTERS.map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                ref={(element) => {
                  letterRefs.current[index] = element;
                }}
                className="splash-letter font-playfair font-bold text-[#F5E6C8]"
                style={{ letterSpacing: '-0.04em' }}
              >
                {letter}
              </span>
            ))}

            <p
              ref={subtitleRef}
              className="relative z-[2] font-sans text-[11px] uppercase md:text-xs"
              style={{
                marginTop: 'max(1.4vh, 10px)',
                letterSpacing: '0.3em',
                color: 'rgba(245, 230, 200, 0.5)',
              }}
            >
              CAFÉ • BISTRÓ
            </p>
          </div>
        </div>
      </div>

      <div ref={heroRef} className="absolute inset-y-0 right-0 w-1/2">
        <img
          src="/images/hero/hero-coffee-splash.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          style={{ objectPosition: 'center 30%' }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(to right, #000000 0%, transparent 15%, transparent 85%, #000000 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, #000000 0%, transparent 10%, transparent 85%, #000000 100%)',
          }}
        />
      </div>

      <div
        ref={dividerRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-[3] w-px -translate-x-1/2 -translate-y-1/2 bg-[#D4A853]"
        style={{ height: '70vh' }}
      />
    </div>
  );
}
