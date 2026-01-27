'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/Button';

interface SessionData {
  success: boolean;
  tier: string;
  planName: string;
  maxUsers: number;
  customerEmail: string;
  trialEnd?: number;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setError('No se encontró el ID de sesión');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setSessionData(data);
        }
      } catch (err) {
        console.error('Error verifying session:', err);
        setError('Error al verificar la sesión');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Verificando tu suscripción...</p>
        </div>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <div className="text-8xl mb-6">⚠️</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Error al verificar la suscripción
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {error || 'No se pudo verificar tu suscripción. Por favor, contacta con soporte.'}
          </p>
          <Button size="lg" href="/#precios">
            Volver a precios
          </Button>
        </div>
      </div>
    );
  }

  const tierEmojis: Record<string, string> = {
    pro: '🚀',
    team: '👥',
    business: '💼',
    enterprise: '🏆',
  };

  const tierColors: Record<string, string> = {
    pro: 'from-slate-600 to-slate-500',
    team: 'from-emerald-600 to-emerald-500',
    business: 'from-indigo-600 to-indigo-500',
    enterprise: 'from-amber-600 to-amber-500',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div className="text-8xl mb-6">{tierEmojis[sessionData.tier] || '🎉'}</div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          ¡Bienvenido a LEXY{' '}
          <span className={`bg-gradient-to-r ${tierColors[sessionData.tier] || 'from-emerald-600 to-emerald-500'} text-transparent bg-clip-text`}>
            {sessionData.planName}
          </span>!
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Tu suscripción se ha activado correctamente.
        </p>
        <p className="text-lg text-gray-500 mb-8">
          Tienes <span className="font-bold text-emerald-600">14 días de prueba gratuita</span> para explorar todas las funcionalidades.
        </p>

        {sessionData.maxUsers > 1 && (
          <div className="mb-8 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
            <p className="text-emerald-900 font-semibold">
              👥 Hasta {sessionData.maxUsers} usuarios incluidos
            </p>
            <p className="text-sm text-emerald-700 mt-1">
              Podrás invitar a tu equipo desde el panel de administración
            </p>
          </div>
        )}

        <div className="space-y-4">
          <Button size="lg" href="https://app.lexy.plus/login">
            Acceder a la aplicación
          </Button>
          <p className="text-sm text-gray-500">
            Recibirás un email de confirmación en <span className="font-medium">{sessionData.customerEmail}</span>
          </p>
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            ¿Qué sigue?
          </h2>
          <ul className="text-left space-y-2 text-gray-600">
            <li>✓ Accede a la plataforma con tu email</li>
            <li>✓ Crea tu primer contrato en 30 segundos</li>
            <li>✓ Pregunta cualquier duda legal a Lexy</li>
            <li>✓ Explora las 97 plantillas profesionales</li>
            {sessionData.maxUsers > 1 && (
              <li>✓ Invita a tu equipo desde configuración</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
