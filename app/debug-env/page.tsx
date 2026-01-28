'use client';

import { useEffect, useState } from 'react';

/**
 * Página de diagnóstico de variables de entorno
 * Visita: /debug-env
 */
export default function DebugEnvPage() {
  const [serverDiagnostics, setServerDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/debug-env')
      .then(res => res.json())
      .then(data => {
        setServerDiagnostics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch diagnostics:', err);
        setLoading(false);
      });
  }, []);

  // Diagnóstico del cliente (browser)
  const clientDiagnostics = {
    NEXT_PUBLIC_SUPABASE_URL: {
      defined: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      value: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...`
        : 'MISSING',
    },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: {
      defined: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
        : 'MISSING',
    },
  };

  const allOk =
    clientDiagnostics.NEXT_PUBLIC_SUPABASE_URL.defined &&
    clientDiagnostics.NEXT_PUBLIC_SUPABASE_ANON_KEY.defined &&
    serverDiagnostics?.envVars?.NEXT_PUBLIC_SUPABASE_URL?.defined &&
    serverDiagnostics?.envVars?.NEXT_PUBLIC_SUPABASE_ANON_KEY?.defined;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🔍 Environment Variables Diagnostics</h1>
        <p className="text-gray-400 mb-8">Debug page for Supabase configuration</p>

        {/* Status Badge */}
        <div className="mb-8">
          {loading ? (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-blue-400">⏳ Loading diagnostics...</p>
            </div>
          ) : allOk ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-400">✅ All environment variables configured correctly!</p>
            </div>
          ) : (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 font-semibold">❌ CRITICAL: Missing environment variables</p>
              <p className="text-red-300 text-sm mt-2">
                Authentication will fail. Configure variables in Vercel project settings.
              </p>
            </div>
          )}
        </div>

        {/* Client Side */}
        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>🌐</span> Client-Side (Browser)
          </h2>
          <div className="space-y-3">
            {Object.entries(clientDiagnostics).map(([key, data]) => (
              <div key={key} className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <code className="text-emerald-400">{key}</code>
                  <p className="text-xs text-gray-500 mt-1">{data.value}</p>
                </div>
                <span className={data.defined ? 'text-green-400' : 'text-red-400'}>
                  {data.defined ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Server Side */}
        {serverDiagnostics && (
          <div className="bg-white/5 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>⚙️</span> Server-Side (API Routes)
            </h2>
            <div className="space-y-3">
              {Object.entries(serverDiagnostics.envVars).map(([key, data]: [string, any]) => (
                <div key={key} className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div>
                    <code className="text-emerald-400">{key}</code>
                    <p className="text-xs text-gray-500 mt-1">
                      {data.value} ({data.length} chars)
                    </p>
                  </div>
                  <span className={data.defined ? 'text-green-400' : 'text-red-400'}>
                    {data.defined ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deployment Info */}
        {serverDiagnostics?.deployment && (
          <div className="bg-white/5 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">📦 Deployment Info</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">Environment:</span> {serverDiagnostics.environment}</p>
              <p><span className="text-gray-400">Region:</span> {serverDiagnostics.deployment.region}</p>
              <p><span className="text-gray-400">URL:</span> {serverDiagnostics.deployment.url}</p>
              <p><span className="text-gray-400">Commit:</span> {serverDiagnostics.deployment.gitCommit}</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!allOk && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
            <h3 className="text-yellow-400 font-semibold mb-3">🛠️ How to Fix</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>Go to your Vercel project dashboard</li>
              <li>Navigate to Settings → Environment Variables</li>
              <li>Add the following variables for Production, Preview, and Development:</li>
            </ol>
            <div className="mt-4 bg-black/30 rounded p-4 font-mono text-xs space-y-1">
              <p className="text-emerald-400">NEXT_PUBLIC_SUPABASE_URL</p>
              <p className="text-gray-500">→ https://supabase.odoo.barcelona</p>
              <p className="text-emerald-400 mt-2">NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
              <p className="text-gray-500">→ (Your Supabase anon key from .env.local)</p>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Or run: <code className="bg-black/30 px-2 py-1 rounded">./scripts/configure-vercel-env.sh</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
