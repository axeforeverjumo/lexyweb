'use client';

import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  // En el cliente browser, Next.js reemplaza las variables NEXT_PUBLIC_*
  // directamente en tiempo de build. NO necesitamos process.env
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Validación explícita para debugging
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase config missing:', {
      url: supabaseUrl ? 'present' : 'MISSING',
      key: supabaseAnonKey ? 'present' : 'MISSING',
      // Debug: mostrar valores parciales
      urlValue: supabaseUrl?.substring(0, 30),
      keyValue: supabaseAnonKey?.substring(0, 20)
    });
    throw new Error('Missing Supabase environment variables');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
