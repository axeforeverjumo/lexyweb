'use client';

import { use, useState } from 'react';
import { FileText, Lock, CheckCircle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SignatureCanvas from '@/components/contratos/SignatureCanvas';

type Step = 'pin' | 'review' | 'sign' | 'complete';

interface ContractData {
  id: string;
  titulo: string;
  contenido_markdown: string;
  tipo_contrato: string;
}

export default function SignContractPage({
  params,
}: {
  params: Promise<{ id: string; token: string }>;
}) {
  const resolvedParams = use(params);
  const { id: contractId, token } = resolvedParams;

  const [step, setStep] = useState<Step>('pin');
  const [pin, setPin] = useState('');
  const [contract, setContract] = useState<ContractData | null>(null);
  const [role, setRole] = useState<'cliente' | 'contraparte' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [signature, setSignature] = useState('');
  const [bothSigned, setBothSigned] = useState(false);

  // Step 1: Validar PIN
  const handleValidatePin = async () => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/contracts/sign/${token}?pin=${pin}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'PIN incorrecto');
      }

      if (data.already_signed) {
        setError('Ya has firmado este contrato anteriormente');
        setIsLoading(false);
        return;
      }

      setContract(data.contract);
      setRole(data.role);
      setStep('review');
    } catch (err: any) {
      console.error('Error validating PIN:', err);
      setError(err.message || 'Error al validar el PIN');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Guardar firma
  const handleSaveSignature = async (signatureData: string) => {
    setSignature(signatureData);
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/contracts/sign/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin,
          signature: signatureData,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar la firma');
      }

      setBothSigned(data.both_signed);
      setStep('complete');
    } catch (err: any) {
      console.error('Error saving signature:', err);
      setError(err.message || 'Error al guardar la firma');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-indigo-600 px-8 py-6 text-white">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Firma de Contrato</h1>
              <p className="text-blue-100 text-sm">Proceso seguro de firma digital</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step 1: Validación de PIN */}
          {step === 'pin' && (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Introduce tu PIN</h2>
                <p className="text-slate-600">
                  Te enviaron un PIN de 6 dígitos por WhatsApp. Introdúcelo aquí para acceder al
                  contrato.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 text-center">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <input
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full text-center text-3xl font-bold tracking-widest px-4 py-4 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />

                <button
                  onClick={handleValidatePin}
                  disabled={pin.length !== 6 || isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Validando...
                    </>
                  ) : (
                    'Continuar'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Revisión del Contrato */}
          {step === 'review' && contract && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{contract.titulo}</h2>
                <p className="text-slate-600">
                  Lee el contrato completo antes de firmar. Desplázate hacia abajo para revisar
                  todos los términos.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 mb-6 max-h-[60vh] overflow-y-auto">
                <div className="prose prose-slate max-w-none">
                  <ReactMarkdown>{contract.contenido_markdown}</ReactMarkdown>
                </div>
              </div>

              <button
                onClick={() => setStep('sign')}
                className="w-full px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                He leído el contrato - Continuar a Firmar
              </button>
            </div>
          )}

          {/* Step 3: Canvas de Firma */}
          {step === 'sign' && (
            <div>
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Dibuja tu Firma</h2>
                <p className="text-slate-600">
                  Usa el ratón o tu dedo para dibujar tu firma en el recuadro
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 text-center">{error}</p>
                </div>
              )}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-primary-600 mb-4" />
                  <p className="text-slate-600">Guardando tu firma...</p>
                </div>
              ) : (
                <SignatureCanvas
                  onSignature={handleSaveSignature}
                  onCancel={() => setStep('review')}
                />
              )}
            </div>
          )}

          {/* Step 4: Confirmación */}
          {step === 'complete' && (
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>

              <h2 className="text-3xl font-bold text-green-900 mb-3">¡Firma Registrada!</h2>

              {bothSigned ? (
                <div>
                  <p className="text-lg text-green-700 mb-6">
                    Ambas partes han firmado el contrato. El proceso está completado.
                  </p>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✅ El contrato está ahora legalmente firmado y listo para usar. El propietario
                      del contrato recibirá una notificación.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-lg text-slate-700 mb-6">
                    Tu firma ha sido guardada correctamente.
                  </p>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      ⏳ Esperando la firma de la otra parte. Cuando ambas partes firmen, el
                      contrato estará completado.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600">
                  Puedes cerrar esta ventana. No necesitas hacer nada más.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
