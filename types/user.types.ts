// Profile ahora está en subscription.types.ts con campos extendidos
export type { Profile } from './subscription.types';

export interface Cliente {
  id: string;
  user_id: string;
  nombre: string;
  apellidos: string | null;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  dni_nie: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}
