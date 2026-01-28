'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    verifySession();
  }, [sessionId]);

  useEffect(() => {
    if (verificationStatus === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      router.push('/dashboard');
    }
  }, [countdown, verificationStatus]);

  const verifySession = async () => {
    if (!sessionId) {
      setVerificationStatus('error');
      return;
    }

    try {
      const response = await fetch('/api/stripe/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        setVerificationStatus('success');
      } else {
        setVerificationStatus('error');
      }
    } catch (error) {
      console.error('Error verifying session:', error);
      setVerificationStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {verificationStatus === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verificando pago...</h1>
            <p className="text-gray-600">Un momento mientras confirmamos tu suscripción</p>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-20 animate-pulse" />
              <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto relative" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Pago exitoso!</h1>
            <p className="text-gray-600 mb-6">
              Tu suscripción ha sido activada correctamente
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-emerald-800">
                Redirigiendo al dashboard en <span className="font-bold">{countdown}</span> segundos...
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
            >
              Ir al Dashboard
            </button>
          </>
        )}

        {verificationStatus === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error en la verificación</h1>
            <p className="text-gray-600 mb-6">
              No pudimos verificar tu pago. Por favor, contacta con soporte.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
              >
                Ir al Dashboard
              </button>
              <a
                href="mailto:soporte@lexy.plus"
                className="block w-full px-6 py-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Contactar Soporte
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cargando...</h1>
          <p className="text-gray-600">Preparando la página</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
