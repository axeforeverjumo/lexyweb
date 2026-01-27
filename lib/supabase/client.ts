'use client';

import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  // Las variables NEXT_PUBLIC_ se embeben en tiempo de build
  // En el cliente, se acceden directamente, no desde process.env
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Validación explícita para debugging
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase config missing:', {
      url: supabaseUrl ? 'present' : 'MISSING',
      key: supabaseAnonKey ? 'present' : 'MISSING'
    });
    throw new Error('Missing Supabase environment variables');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};
