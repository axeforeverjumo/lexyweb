import { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Autenticación - LEXY',
  description: 'Inicia sesión o regístrate en LEXY para generar contratos en 30 segundos',
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
