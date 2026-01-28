'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifySession(sessionId);
    } else {
      setError('No se encontró información de la sesión');
      setIsVerifying(false);
    }
  }, [searchParams]);

  const verifySession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
      } else {
        setError('Error al verificar el pago');
      }
    } catch (error) {
      console.error('Error verifying session:', error);
      setError('Error al verificar el pago');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Verificando tu pago...</h2>
          <p className="text-gray-600">Por favor espera un momento</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-red-200">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">❌</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={handleGoToDashboard}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-4">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full mx-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-emerald-200">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              ¡Pago Exitoso!
            </h1>
            <p className="text-emerald-100">
              Tu suscripción ha sido activada correctamente
            </p>
          </div>

          {/* Details */}
          <div className="p-8 space-y-6">
            {subscription && (
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Plan {subscription.tier.toUpperCase()}
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className="font-semibold text-emerald-700 capitalize">
                      {subscription.status === 'trialing' ? 'Periodo de prueba' : 'Activo'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-lg">¿Qué sigue?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Accede a todas las funcionalidades</p>
                    <p className="text-sm text-gray-600">Ya puedes usar todas las características de tu plan</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Crea tu primer contrato con IA</p>
                    <p className="text-sm text-gray-600">Usa nuestros templates profesionales</p>
                  </div>
                </li>
                {subscription?.tier !== 'pro' && (
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Invita a tu equipo</p>
                      <p className="text-sm text-gray-600">Comparte chats y colabora en tiempo real</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleGoToDashboard}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Ir al Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Support Info */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                ¿Necesitas ayuda?{' '}
                <a href="mailto:soporte@lexyapp.com" className="text-emerald-600 hover:underline font-medium">
                  Contacta con soporte
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Cargando...</h2>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
