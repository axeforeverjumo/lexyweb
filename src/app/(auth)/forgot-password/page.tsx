'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import AuthForm from '@/components/auth/AuthForm';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import AuthError from '@/components/auth/AuthError';
import { CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        setError('Error al enviar el email. Verifica que tu dirección sea correcta.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.');
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Recuperar contraseña"
      subtitle="Ingresa tu email y te enviaremos instrucciones"
      footer={
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-400">
            ¿Recordaste tu contraseña?{' '}
            <Link
              href="/login"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      }
    >
      {success ? (
        <div className="space-y-5 text-center">
          <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Email enviado</h3>
            <p className="text-sm text-gray-400">
              Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            </p>
          </div>
          <Link href="/login">
            <AuthButton variant="primary">
              Volver al inicio de sesión
            </AuthButton>
          </Link>
        </div>
      ) : (
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

          <AuthButton type="submit" loading={loading}>
            {loading ? 'Enviando...' : 'Enviar instrucciones'}
          </AuthButton>
        </form>
      )}
    </AuthForm>
  );
}
