/** Rol del usuario en la aplicación */
export type UserRole = 'guest' | 'user' | 'admin';

/** Perfil del usuario */
export interface User {
  id: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
