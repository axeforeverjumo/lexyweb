'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/Button';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Optionally verify session on backend
    setTimeout(() => setLoading(false), 2000);
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

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div className="text-8xl mb-6">🎉</div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          ¡Bienvenido a LEXY PRO!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Tu suscripción se ha activado correctamente.
          Tienes 14 días de prueba gratuita para explorar todas las funcionalidades.
        </p>
        <div className="space-y-4">
          <Button size="lg" href="https://app.lexy.plus/login">
            Acceder a la aplicación
          </Button>
          <p className="text-sm text-gray-500">
            Recibirás un email de confirmación en breve con todos los detalles.
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
