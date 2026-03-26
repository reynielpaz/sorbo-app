/** Rol del usuario en la aplicación */
export type UserRole = 'guest' | 'user' | 'admin';

/** Perfil del usuario autenticado */
export interface Profile {
  id: string;
  fullName?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/** Alias temporal para compatibilidad con tipos existentes */
export type User = Profile;
