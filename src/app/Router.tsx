import { lazy, Suspense, useLayoutEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ROUTES } from '@/utils/constants';
import { hideBootScreen } from '@/utils/bootScreen';

const SplashPage = lazy(() =>
  import('@/pages/SplashPage').then((module) => ({ default: module.SplashPage }))
);
const OnboardingPage = lazy(() =>
  import('@/pages/OnboardingPage').then((module) => ({ default: module.OnboardingPage }))
);
const AuthPage = lazy(() =>
  import('@/pages/AuthPage').then((module) => ({ default: module.AuthPage }))
);
const HomePage = lazy(() =>
  import('@/pages/HomePage').then((module) => ({ default: module.HomePage }))
);
const MenuPage = lazy(() =>
  import('@/pages/MenuPage').then((module) => ({ default: module.MenuPage }))
);
const ProductPage = lazy(() =>
  import('@/pages/ProductPage').then((module) => ({ default: module.ProductPage }))
);
const ReservationsPage = lazy(() =>
  import('@/pages/ReservationsPage').then((module) => ({ default: module.ReservationsPage }))
);
const CartPage = lazy(() =>
  import('@/pages/CartPage').then((module) => ({ default: module.CartPage }))
);
const CheckoutPage = lazy(() =>
  import('@/pages/CheckoutPage').then((module) => ({ default: module.CheckoutPage }))
);
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((module) => ({ default: module.ProfilePage }))
);

function RouteFallback() {
  return (
    <div
      role="status"
      aria-label="Cargando página"
      className="fixed inset-0 z-80 bg-black animate-fade-in"
    />
  );
}

export function Router() {
  const location = useLocation();

  useLayoutEffect(() => {
    if (location.pathname !== ROUTES.SPLASH) {
      hideBootScreen();
    }
  }, [location.pathname]);

  return (
    <Suspense fallback={<RouteFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path={ROUTES.SPLASH} element={<SplashPage />} />
          <Route path={ROUTES.ONBOARDING} element={<OnboardingPage />} />
          <Route path={ROUTES.AUTH} element={<AuthPage />} />
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.MENU} element={<MenuPage />} />
          <Route path={ROUTES.PRODUCT} element={<ProductPage />} />
          <Route path={ROUTES.RESERVATIONS} element={<ReservationsPage />} />
          <Route path={ROUTES.CART} element={<CartPage />} />
          <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          {/* Redirige cualquier ruta desconocida al splash */}
          <Route path="*" element={<Navigate to={ROUTES.SPLASH} replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
