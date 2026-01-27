'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import AuthForm from '@/components/auth/AuthForm';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import AuthError from '@/components/auth/AuthError';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        // Translate Supabase errors to Spanish
        const errorMessages: Record<string, string> = {
          'Invalid login credentials': 'Email o contraseña incorrectos',
          'Email not confirmed': 'Debes confirmar tu email antes de iniciar sesión',
          'User not found': 'No existe una cuenta con este email',
          'Invalid email': 'El formato del email no es válido',
        };

        setError(errorMessages[signInError.message] || 'Error al iniciar sesión. Inténtalo de nuevo.');
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.');
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Bienvenido de nuevo"
      subtitle="Inicia sesión para acceder a tu cuenta"
      footer={
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-400">
            ¿No tienes cuenta?{' '}
            <Link
              href="/register"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <AuthError message={error} onDismiss={() => setError('')} />}

        <AuthInput
          type="email"
          label="Email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={loading}
        />

        <AuthInput
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          disabled={loading}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-400 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-white/10 bg-white/5 text-emerald-600 focus:ring-emerald-500/50 focus:ring-offset-0 transition-colors"
            />
            <span className="group-hover:text-gray-300 transition-colors">Recordarme</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <AuthButton type="submit" loading={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </AuthButton>
      </form>
    </AuthForm>
  );
}
