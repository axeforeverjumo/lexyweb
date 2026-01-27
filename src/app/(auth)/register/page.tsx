'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import AuthForm from '@/components/auth/AuthForm';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import AuthError from '@/components/auth/AuthError';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validatePassword = (pwd: string): boolean => {
    if (pwd.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (pwd: string, confirm: string): boolean => {
    if (pwd !== confirm) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length > 0) {
      validatePassword(newPassword);
    } else {
      setPasswordError('');
    }
    if (confirmPassword.length > 0) {
      validateConfirmPassword(newPassword, confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (newConfirmPassword.length > 0) {
      validateConfirmPassword(password, newConfirmPassword);
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!fullName.trim()) {
      setError('Por favor, ingresa tu nombre completo');
      return;
    }

    if (!validatePassword(password)) {
      return;
    }

    if (!validateConfirmPassword(password, confirmPassword)) {
      return;
    }

    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        // Translate Supabase errors to Spanish
        const errorMessages: Record<string, string> = {
          'User already registered': 'Ya existe una cuenta con este email',
          'Invalid email': 'El formato del email no es válido',
          'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
          'Signup requires a valid password': 'La contraseña no es válida',
        };

        setError(errorMessages[signUpError.message] || 'Error al crear la cuenta. Inténtalo de nuevo.');
        setLoading(false);
        return;
      }

      if (data.session) {
        // User is automatically signed in (email confirmation disabled)
        router.push('/dashboard');
        router.refresh();
      } else if (data.user && !data.session) {
        // Email confirmation is required
        setError('');
        alert('¡Cuenta creada! Por favor, revisa tu email para confirmar tu cuenta.');
        router.push('/login');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.');
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Crea tu cuenta"
      subtitle="Comienza a generar contratos en 30 segundos"
      footer={
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-400">
            ¿Ya tienes cuenta?{' '}
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
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <AuthError message={error} onDismiss={() => setError('')} />}

        <AuthInput
          type="text"
          label="Nombre completo"
          placeholder="Juan Pérez"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
          disabled={loading}
        />

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
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={handlePasswordChange}
          required
          autoComplete="new-password"
          disabled={loading}
          error={passwordError}
        />

        <AuthInput
          type="password"
          label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
          autoComplete="new-password"
          disabled={loading}
          error={confirmPasswordError}
        />

        <label className="flex items-start gap-3 text-sm text-gray-400 cursor-pointer group">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-white/10 bg-white/5 text-emerald-600 focus:ring-emerald-500/50 focus:ring-offset-0 transition-colors"
            required
          />
          <span className="group-hover:text-gray-300 transition-colors">
            Acepto los{' '}
            <Link href="/terminos" className="text-emerald-400 hover:text-emerald-300 underline">
              términos y condiciones
            </Link>{' '}
            y la{' '}
            <Link href="/privacidad" className="text-emerald-400 hover:text-emerald-300 underline">
              política de privacidad
            </Link>
          </span>
        </label>

        <AuthButton type="submit" loading={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
        </AuthButton>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            🎁 14 días de prueba gratis · Sin tarjeta de crédito
          </p>
        </div>
      </form>
    </AuthForm>
  );
}
