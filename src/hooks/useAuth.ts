import { authStore, GUEST_MODE_STORAGE_KEY } from '@/store/authStore';

export function useAuth() {
  const user = authStore((state) => state.user);
  const profile = authStore((state) => state.profile);
  const loading = authStore((state) => state.loading);
  const initialized = authStore((state) => state.initialized);

  const isAuthenticated = user !== null;
  const isGuest =
    user === null &&
    typeof window !== 'undefined' &&
    localStorage.getItem(GUEST_MODE_STORAGE_KEY) === 'true';
  const isAdmin = profile?.role === 'admin';

  return {
    user,
    profile,
    loading,
    initialized,
    isAuthenticated,
    isGuest,
    isAdmin,
  };
}
