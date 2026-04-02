import { create } from 'zustand';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Profile, UserRole } from '@/types';
import { ROUTES } from '@/utils/constants';

interface ProfileRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole | null;
  created_at: string;
  updated_at: string;
}

interface SignUpWithEmailResult {
  requiresEmailConfirmation: boolean;
}

interface AuthState {
  user: SupabaseUser | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<SignUpWithEmailResult>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

export const GUEST_MODE_STORAGE_KEY = 'sorbo_guest_mode';

let authSubscription: ReturnType<typeof supabase.auth.onAuthStateChange>['data']['subscription'] | null = null;
let initializePromise: Promise<void> | null = null;

function clearGuestMode() {
  localStorage.removeItem(GUEST_MODE_STORAGE_KEY);
}

function translateAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes('invalid login credentials')) return 'Email o contraseña incorrectos.';
  if (normalized.includes('email not confirmed')) return 'Debes confirmar tu email antes de iniciar sesión.';
  if (normalized.includes('user already registered')) return 'Ya existe una cuenta con ese email.';
  if (normalized.includes('password should be at least 6 characters')) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (normalized.includes('signup requires a valid password')) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (normalized.includes('oauth provider is not enabled')) {
    return 'Google no está configurado todavía.';
  }
  if (normalized.includes('unable to validate email address')) return 'Ingresa un email válido.';
  if (normalized.includes('email rate limit exceeded')) return 'Demasiados intentos. Intenta de nuevo en unos minutos.';

  return 'Ocurrió un error al autenticarte. Intenta de nuevo.';
}

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    avatarUrl: row.avatar_url,
    role: row.role ?? 'user',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone, avatar_url, role, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) return null;
  return data ? mapProfile(data as ProfileRow) : null;
}

async function syncAuthState(user: SupabaseUser | null) {
  if (user) clearGuestMode();

  const profile = user ? await fetchProfile(user.id) : null;
  authStore.setState({
    user,
    profile,
    loading: false,
    initialized: true,
  });
}

export const authStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  async initialize() {
    if (get().initialized) return;
    if (initializePromise) return initializePromise;

    set({ loading: true });

    initializePromise = (async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        set({ user: null, profile: null, loading: false, initialized: true });
        return;
      }

      if (!authSubscription) {
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          authStore.setState({ loading: true });
          void syncAuthState(session?.user ?? null);
        });

        authSubscription = authListener.subscription;
      }

      await syncAuthState(data.session?.user ?? null);
    })().finally(() => {
      initializePromise = null;
    });

    return initializePromise;
  },

  async signInWithEmail(email, password) {
    set({ loading: true });
    clearGuestMode();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      set({ loading: false });
      throw new Error(translateAuthError(error.message));
    }

    await syncAuthState(data.session?.user ?? null);
  },

  async signUpWithEmail(email, password, fullName) {
    set({ loading: true });
    clearGuestMode();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      set({ loading: false });
      throw new Error(translateAuthError(error.message));
    }

    if (data.session) {
      await syncAuthState(data.session.user);
      return { requiresEmailConfirmation: false };
    }

    set({
      user: null,
      profile: null,
      loading: false,
      initialized: true,
    });

    return { requiresEmailConfirmation: true };
  },

  async signInWithGoogle() {
    set({ loading: true });
    clearGuestMode();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${ROUTES.HOME}`,
      },
    });

    if (error) {
      set({ loading: false });
      throw new Error(translateAuthError(error.message));
    }
  },

  async signOut() {
    set({ loading: true });
    clearGuestMode();

    const { error } = await supabase.auth.signOut();

    if (error) {
      set({ loading: false });
      throw new Error(translateAuthError(error.message));
    }

    set({ user: null, profile: null, loading: false, initialized: true });
  },

  continueAsGuest() {
    localStorage.setItem(GUEST_MODE_STORAGE_KEY, 'true');
    set({ user: null, profile: null, loading: false, initialized: true });
  },
}));
