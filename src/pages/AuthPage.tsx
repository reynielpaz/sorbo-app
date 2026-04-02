import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { authStore } from '@/store/authStore';
import { ROUTES } from '@/utils/constants';

type AuthMode = 'login' | 'register';

interface FormState {
  fullName: string;
  email: string;
  password: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="#EA4335" d="M12.24 10.285v3.821h5.445c-.24 1.24-.96 2.29-2.04 2.995l3.3 2.56c1.92-1.77 3.03-4.38 3.03-7.486 0-.71-.06-1.39-.17-2.05z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.615-2.435l-3.3-2.56c-.915.615-2.085.985-3.315.985-2.55 0-4.71-1.72-5.48-4.035H3.11v2.635A9.997 9.997 0 0 0 12 22z" />
      <path fill="#4A90E2" d="M6.52 13.955A5.998 5.998 0 0 1 6.21 12c0-.68.12-1.34.31-1.955V7.41H3.11A9.997 9.997 0 0 0 2 12c0 1.61.39 3.13 1.11 4.59z" />
      <path fill="#FBBC05" d="M12 5.99c1.47 0 2.79.505 3.825 1.495l2.865-2.865C16.955 2.98 14.7 2 12 2 8.09 2 4.73 4.24 3.11 7.41l3.41 2.635C7.29 7.71 9.45 5.99 12 5.99z" />
    </svg>
  );
}

function validateForm(mode: AuthMode, form: FormState) {
  const errors: FormErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (mode === 'register' && form.fullName.trim().length === 0) {
    errors.fullName = 'Tu nombre es obligatorio.';
  }

  if (!emailRegex.test(form.email.trim())) {
    errors.email = 'Ingresa un email válido.';
  }

  if (form.password.trim().length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  }

  return errors;
}

export function AuthPage() {
  const navigate = useNavigate();
  const { loading, isAuthenticated, isGuest } = useAuth();
  const signInWithEmail = authStore((state) => state.signInWithEmail);
  const signUpWithEmail = authStore((state) => state.signUpWithEmail);
  const signInWithGoogle = authStore((state) => state.signInWithGoogle);
  const continueAsGuest = authStore((state) => state.continueAsGuest);

  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<FormState>({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated || isGuest) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, isGuest, navigate]);

  const updateField =
    (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setAuthError('');
      setSuccessMessage('');
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm(mode, form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setAuthError('');
    setSuccessMessage('');

    try {
      if (mode === 'login') {
        await signInWithEmail(form.email.trim(), form.password);
        navigate(ROUTES.HOME, { replace: true });
        return;
      }

      const { requiresEmailConfirmation } = await signUpWithEmail(
        form.email.trim(),
        form.password,
        form.fullName.trim(),
      );

      if (requiresEmailConfirmation) {
        setMode('login');
        setForm((current) => ({ ...current, password: '' }));
        setErrors({});
        setAuthError('');
        setShowPassword(false);
        setSuccessMessage(
          'Te enviamos un correo de confirmación. Revisa tu bandeja e inicia sesión cuando actives tu cuenta.',
        );
        return;
      }

      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    }
  };

  const handleGoogle = async () => {
    setAuthError('');
    setSuccessMessage('');

    try {
      await signInWithGoogle();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    }
  };

  const handleGuest = () => {
    setSuccessMessage('');
    continueAsGuest();
    navigate(ROUTES.HOME, { replace: true });
  };

  const authInputContainerClassName = 'relative';
  const authInputClassName =
    'h-14 rounded-2xl !bg-[rgba(10,10,12,0.72)] text-sorbo-cream shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm caret-sorbo-gold';
  const authLabelClassName =
    'font-sans uppercase tracking-[0.16em] text-[rgba(245,230,200,0.52)]';
  const fullNameFieldTransition = {
    duration: 0.18,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-sorbo-black">
      <img
        src="/images/auth/auth-hero.jpeg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[29%_center]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.66)_0%,rgba(0,0,0,0.76)_40%,rgba(0,0,0,0.9)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[42dvh] bg-[radial-gradient(circle_at_bottom,rgba(212,168,83,0.16)_0%,transparent_62%)]" />

      <div className="relative z-[1] flex min-h-[100dvh] flex-col">
        <div className="flex min-h-[25dvh] flex-col items-center justify-center px-8 pt-[calc(env(safe-area-inset-top,0px)+24px)] text-center">
          <img
            src="/images/brand/logo-sorbo.png"
            alt="Sorbo Café • Bistró"
            className="w-24 object-contain"
            style={{ filter: 'brightness(0) invert(1) sepia(0.2)' }}
          />
          <p className="mt-4 font-sans text-sm uppercase tracking-[0.2em] text-[rgba(245,230,200,0.66)]">
            Tu rincón para saborear
          </p>
        </div>

        <div className="relative mt-auto overflow-hidden rounded-t-[32px] border border-white/10 bg-[rgba(8,8,10,0.78)] px-6 pb-[calc(env(safe-area-inset-bottom,0px)+24px)] pt-5 shadow-[0_-26px_70px_rgba(0,0,0,0.56)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_16%,rgba(255,255,255,0.01)_100%)]" />
          <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(232,214,173,0.56),transparent)]" />
          <div className="absolute -right-12 top-[-5.5rem] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(212,168,83,0.16)_0%,transparent_72%)] blur-3xl" />

          <div
            role="tablist"
            aria-label="Seleccionar modo de autenticación"
            className="relative z-[1] flex rounded-full border border-white/8 bg-white/[0.03] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          >
            {(['login', 'register'] as const).map((value) => {
              const active = mode === value;

              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  id={`auth-tab-${value}`}
                  aria-selected={active}
                  aria-controls="auth-panel"
                  onClick={() => {
                    setMode(value);
                    setErrors({});
                    setAuthError('');
                    setSuccessMessage('');
                  }}
                  className={`flex-1 rounded-full px-4 py-3 text-center font-sans text-[0.82rem] uppercase tracking-[0.18em] transition-[background,border-color,color,box-shadow] duration-150 ${
                    active
                      ? 'border border-[rgba(212,168,83,0.2)] bg-[linear-gradient(180deg,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0.03)_100%)] text-sorbo-cream shadow-[0_10px_24px_rgba(0,0,0,0.26)]'
                      : 'text-[rgba(245,230,200,0.46)] hover:text-[rgba(245,230,200,0.82)]'
                  }`}
                >
                  {value === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                </button>
              );
            })}
          </div>

          <form
            id="auth-panel"
            role="tabpanel"
            aria-labelledby={`auth-tab-${mode}`}
            onSubmit={handleSubmit}
            className="relative z-[1] mt-6"
          >
            <AnimatePresence initial={false}>
              {mode === 'register' ? (
                <motion.div
                  key="full-name-field"
                  initial={{ opacity: 0, height: 0, y: -4 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -4 }}
                  transition={fullNameFieldTransition}
                  className="overflow-hidden pb-4"
                >
                  <Input
                    label="Nombre completo"
                    value={form.fullName}
                    onChange={updateField('fullName')}
                    error={errors.fullName}
                    autoComplete="name"
                    containerClassName={authInputContainerClassName}
                    inputClassName={authInputClassName}
                    labelClassName={authLabelClassName}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            <motion.div layout className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={updateField('email')}
                error={errors.email}
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                containerClassName={authInputContainerClassName}
                inputClassName={authInputClassName}
                labelClassName={authLabelClassName}
              />

              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={updateField('password')}
                error={errors.password}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                containerClassName={authInputContainerClassName}
                inputClassName={authInputClassName}
                labelClassName={authLabelClassName}
                rightAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="font-sans text-[11px] uppercase tracking-[0.16em] text-[rgba(245,230,200,0.52)] transition-colors hover:text-sorbo-cream"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                }
              />

              {successMessage ? (
                <p className="rounded-2xl border border-[#BFE6C4]/20 bg-[#BFE6C4]/10 px-4 py-3 text-sm text-[#D9F0DD]">
                  {successMessage}
                </p>
              ) : null}
              {authError ? (
                <p className="rounded-2xl border border-[#E53935]/20 bg-[#E53935]/10 px-4 py-3 text-sm text-[#FFB3AC]">
                  {authError}
                </p>
              ) : null}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full rounded-2xl border border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.16)]"
              >
                {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </Button>

              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(245,230,200,0.16),rgba(245,230,200,0.03))]" />
                <span className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-[rgba(245,230,200,0.54)]">
                  o continúa con
                </span>
                <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(245,230,200,0.03),rgba(245,230,200,0.16),transparent)]" />
              </div>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full rounded-2xl border-white/10 !bg-[rgba(11,11,13,0.72)] text-sorbo-cream shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-[rgba(212,168,83,0.22)] hover:!bg-[rgba(16,16,18,0.82)]"
                onClick={handleGoogle}
              >
                <GoogleIcon />
                Google
              </Button>

              <button
                type="button"
                onClick={handleGuest}
                className="w-full rounded-2xl border border-transparent px-4 py-3 text-center font-sans text-sm tracking-[0.08em] text-[rgba(245,230,200,0.68)] transition-all duration-200 hover:border-white/8 hover:bg-white/[0.035] hover:text-sorbo-cream"
              >
                Continuar como invitado
              </button>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
}
