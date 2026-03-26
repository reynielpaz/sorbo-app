import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { authStore } from '@/store/authStore';
import { APP_SLOGAN, ROUTES } from '@/utils/constants';

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

    try {
      if (mode === 'login') {
        await signInWithEmail(form.email.trim(), form.password);
      } else {
        await signUpWithEmail(form.email.trim(), form.password, form.fullName.trim());
      }

      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    }
  };

  const handleGoogle = async () => {
    setAuthError('');

    try {
      await signInWithGoogle();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-sorbo-black">
      <img
        src="/images/hero/onboarding-1.jpeg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-[1] flex min-h-[100dvh] flex-col">
        <div className="flex min-h-[25dvh] flex-col items-center justify-center px-8 pt-[calc(env(safe-area-inset-top,0px)+24px)] text-center">
          <img
            src="/images/brand/logo-sorbo.png"
            alt="Sorbo Café • Bistró"
            className="w-24 object-contain"
            style={{ filter: 'brightness(0) invert(1) sepia(0.2)' }}
          />
          <p className="mt-4 font-sans text-sm uppercase tracking-[0.2em] text-[rgba(245,230,200,0.6)]">
            {APP_SLOGAN}
          </p>
        </div>

        <div className="mt-auto rounded-t-3xl border border-[rgba(212,168,83,0.15)] bg-[rgba(26,22,18,0.8)] px-6 pb-[calc(env(safe-area-inset-bottom,0px)+24px)] pt-6 backdrop-blur-md">
          <div className="flex gap-6 border-b border-[rgba(212,168,83,0.1)]">
            {(['login', 'register'] as const).map((value) => {
              const active = mode === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setMode(value);
                    setErrors({});
                    setAuthError('');
                  }}
                  className={`pb-3 font-sans text-sm transition-colors ${
                    active
                      ? 'border-b-2 border-sorbo-gold text-sorbo-cream'
                      : 'text-[rgba(245,230,200,0.4)]'
                  }`}
                >
                  {value === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'register' ? (
              <Input
                label="Nombre completo"
                value={form.fullName}
                onChange={updateField('fullName')}
                error={errors.fullName}
                autoComplete="name"
              />
            ) : null}

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={updateField('email')}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={updateField('password')}
              error={errors.password}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              rightAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="font-sans text-xs text-[rgba(245,230,200,0.5)] transition-colors hover:text-sorbo-cream"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              }
            />

            {authError ? <p className="text-sm text-[#E53935]">{authError}</p> : null}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </Button>

            <div className="flex items-center gap-3 py-2">
              <div className="h-px flex-1 bg-[rgba(212,168,83,0.15)]" />
              <span className="font-sans text-sm text-[rgba(245,230,200,0.5)]">o continúa con</span>
              <div className="h-px flex-1 bg-[rgba(212,168,83,0.15)]" />
            </div>

            <Button type="button" variant="secondary" size="lg" className="w-full" onClick={handleGoogle}>
              <GoogleIcon />
              Google
            </Button>

            <button
              type="button"
              onClick={handleGuest}
              className="w-full pt-2 text-center font-sans text-sm text-[rgba(245,230,200,0.5)]"
            >
              Continuar como invitado
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
