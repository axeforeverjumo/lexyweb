import { NextResponse } from 'next/server';

/**
 * API Route para diagnosticar la configuración de variables de entorno
 * Visita: /api/debug-env
 */
export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,

    // Verificar variables de entorno (solo mostramos si existen, no sus valores)
    envVars: {
      NEXT_PUBLIC_SUPABASE_URL: {
        defined: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        value: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...`
          : 'MISSING',
        length: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0
      },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: {
        defined: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
          : 'MISSING',
        length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
      },
      NEXT_PUBLIC_APP_URL: {
        defined: !!process.env.NEXT_PUBLIC_APP_URL,
        value: process.env.NEXT_PUBLIC_APP_URL || 'MISSING'
      }
    },

    // Información adicional de diagnóstico
    deployment: {
      region: process.env.VERCEL_REGION || 'local',
      url: process.env.VERCEL_URL || 'localhost',
      gitCommit: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 'unknown'
    },

    // Test de conectividad (sin credenciales)
    supabaseStatus: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? 'URL configured'
      : 'URL MISSING - Authentication will fail',

    recommendation: !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? 'CRITICAL: Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to Vercel project settings'
      : 'All environment variables are configured correctly'
  };

  return NextResponse.json(diagnostics, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    }
  });
}
