import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  ChevronLeft,
  LogIn,
  LogOut,
  ShoppingBag,
  UtensilsCrossed,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { useCartStore } from '@/features/cart/store/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { GUEST_MODE_STORAGE_KEY, authStore } from '@/store/authStore';
import { ROUTES } from '@/utils/constants';

interface QuickAction {
  label: string;
  copy: string;
  icon: typeof UtensilsCrossed;
  route: string;
}

function exitGuestModeForLogin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(GUEST_MODE_STORAGE_KEY);
  }
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile, isAuthenticated, isGuest } = useAuth();
  const signOut = authStore((state) => state.signOut);
  const clearCart = useCartStore((state) => state.clearCart);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const profileName = profile?.fullName?.trim();
  const displayName = isAuthenticated
    ? profileName || user?.email || 'Cliente Sorbo'
    : isGuest
      ? 'Invitado Sorbo'
      : 'Bienvenido';
  const supportingCopy = isAuthenticated
    ? 'Gestiona tu experiencia Sorbo.'
    : isGuest
      ? 'Inicia sesión para guardar mejor tu experiencia.'
      : 'Inicia sesión para personalizar tu experiencia.';
  const quickActions: QuickAction[] = [
    {
      label: 'Mi pedido',
      copy: 'Carrito actual',
      icon: ShoppingBag,
      route: ROUTES.CART,
    },
    {
      label: 'Reservas',
      copy: 'Planifica tu visita',
      icon: CalendarDays,
      route: ROUTES.RESERVATIONS,
    },
    {
      label: 'Menú',
      copy: 'Explora la carta',
      icon: UtensilsCrossed,
      route: ROUTES.MENU,
    },
  ];

  function handleBack() {
    const historyIndex = typeof window.history.state?.idx === 'number' ? window.history.state.idx : 0;

    if (historyIndex > 0) {
      navigate(-1);
      return;
    }

    navigate(ROUTES.HOME);
  }

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    try {
      setIsSigningOut(true);
      setFeedbackMessage(null);
      await signOut();
      clearCart();
      navigate(ROUTES.AUTH, { replace: true });
    } catch (error) {
      console.error('[Sorbo] No pudimos cerrar sesión.', error);
      setFeedbackMessage('No pudimos cerrar sesión. Intenta de nuevo.');
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <AppShell showHeader={false} showBottomNav={true}>
      <div className="relative isolate mx-auto flex min-h-full max-w-[720px] flex-col px-4 pb-[calc(env(safe-area-inset-bottom,0px)+124px)] pt-[calc(env(safe-area-inset-top,0px)+24px)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(0,0,0,0.55),transparent_48%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_70%,rgba(11,15,26,0.45),transparent_42%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_60%,rgba(11,15,26,0.35),transparent_42%)]" />
        </div>

        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="relative z-10"
        >
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.04] bg-black/[0.28] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/56 transition-colors duration-200 hover:text-[#F3D7A0]"
          >
            <ChevronLeft size={15} strokeWidth={2.1} />
            Volver
          </button>

          <div className="mt-6">
            <h1 className="font-playfair text-[34px] font-semibold leading-tight text-sorbo-cream">
              Perfil
            </h1>
            <p className="mt-2 max-w-[360px] text-[14px] leading-6 text-white/52">
              Tu espacio dentro de Sorbo.
            </p>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.04 }}
          className="relative z-10 mt-7 space-y-5"
        >
          <section className="rounded-[20px] border border-white/[0.04] bg-[#05070B]/68 p-5 shadow-[0_14px_34px_rgba(0,0,0,0.2)]">
            <h2 className="truncate text-[26px] font-semibold leading-tight text-white">
              {displayName}
            </h2>
            {user?.email ? (
              <p className="mt-1 truncate text-[13px] text-white/58">{user.email}</p>
            ) : null}
            {profile?.phone ? (
              <p className="mt-1 truncate text-[13px] text-white/48">{profile.phone}</p>
            ) : null}
            <p className="mt-3 text-[13px] leading-5 text-white/48">{supportingCopy}</p>
          </section>

          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4A853]/72">
              Accesos rápidos
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {quickActions.map((action) => {
                const ActionIcon = action.icon;

                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => navigate(action.route)}
                    className="flex min-h-[62px] items-center gap-3 rounded-[16px] border border-white/[0.04] bg-[#05070B]/62 p-3 text-left transition-colors duration-200 hover:border-[rgba(212,168,83,0.16)]"
                  >
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[14px] border border-white/[0.05] bg-black/[0.24] text-[#D4A853]">
                      <ActionIcon size={19} strokeWidth={1.9} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-semibold text-white">
                        {action.label}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-white/42">
                        {action.copy}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3 pt-1">
            {feedbackMessage ? (
              <p
                role="status"
                aria-live="polite"
                className="rounded-full border border-[rgba(212,168,83,0.16)] bg-black/[0.28] px-4 py-2 text-center text-[12px] font-medium text-[#F3D7A0]"
              >
                {feedbackMessage}
              </p>
            ) : null}

            {isAuthenticated ? (
              <button
                type="button"
                disabled={isSigningOut}
                aria-busy={isSigningOut}
                onClick={handleSignOut}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.05] bg-black/[0.22] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/58 transition-colors duration-200 hover:text-[#F3D7A0] disabled:text-white/34"
              >
                <LogOut size={16} strokeWidth={2.1} />
                {isSigningOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    exitGuestModeForLogin();
                    navigate(ROUTES.AUTH, { replace: true });
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#F3D7A0_0%,#D4A853_100%)] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#050505] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <LogIn size={16} strokeWidth={2.1} />
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.MENU)}
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/[0.05] bg-black/[0.28] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/62 transition-colors duration-200 hover:text-[#F3D7A0]"
                >
                  Seguir explorando
                </button>
              </>
            )}
          </section>
        </motion.div>
      </div>
    </AppShell>
  );
}
