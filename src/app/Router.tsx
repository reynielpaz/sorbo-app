import { useLayoutEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ROUTES } from '@/utils/constants';
import { hideBootScreen } from '@/utils/bootScreen';
import { SplashPage } from '@/pages/SplashPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { AuthPage } from '@/pages/AuthPage';
import { HomePage } from '@/pages/HomePage';
import { MenuPage } from '@/pages/MenuPage';
import { ProductPage } from '@/pages/ProductPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { ReservationsPage } from '@/pages/ReservationsPage';
import { ProfilePage } from '@/pages/ProfilePage';

export function Router() {
  const location = useLocation();

  useLayoutEffect(() => {
    if (location.pathname !== ROUTES.SPLASH) {
      hideBootScreen();
    }
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes>
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
  );
}
