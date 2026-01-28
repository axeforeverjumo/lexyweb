'use client';

import { use, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { FileSignature, Download, Check, X, RotateCcw } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';

interface ContractGeneration {
  id: string;
  titulo: string;
  contenido_markdown: string;
  estado: string;
  firmado_por_cliente: boolean;
  firmado_por_contraparte: boolean;
}

export default function ContractSignPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const supabase = createClient();

  const [contract, setContract] = useState<ContractGeneration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  
  const sigPadCliente = useRef<SignatureCanvas>(null);
  const sigPadContraparte = useRef<SignatureCanvas>(null);

  useEffect(() => {
    loadContract();
  }, [resolvedParams.id]);

  const loadContract = async () => {
    try {
      const { data, error } = await supabase
        .from('contract_generations')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

      if (error) throw error;
      setContract(data);
    } catch (error) {
      console.error('Error loading contract:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSign = async () => {
    if (!contract) return;

    const clienteSigned = !sigPadCliente.current?.isEmpty();
    const contraparteSigned = !sigPadContraparte.current?.isEmpty();

    if (!clienteSigned && !contraparteSigned) {
      alert('Debe firmar al menos una de las partes');
      return;
    }

    setIsSigning(true);
    try {
      const { error } = await supabase
        .from('contract_generations')
        .update({
          firmado_por_cliente: clienteSigned,
          firmado_por_contraparte: contraparteSigned,
          fecha_firma: new Date().toISOString(),
          estado: 'firmado',
        })
        .eq('id', contract.id);

      if (error) throw error;

      alert('Contrato firmado correctamente');
      router.push(`/contratos/${contract.id}`);
    } catch (error) {
      console.error('Error signing contract:', error);
      alert('Error al firmar el contrato');
    } finally {
      setIsSigning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-600">Contrato no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileSignature className="w-6 h-6 text-primary-600" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">Firma del Contrato</h1>
                <p className="text-sm text-slate-500">{contract.titulo}</p>
              </div>
            </div>

            <button
              onClick={() => router.push(`/contratos/${contract.id}`)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Firma Cliente */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Firma del Cliente</h2>
              <button
                onClick={() => sigPadCliente.current?.clear()}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                <RotateCcw className="w-4 h-4" />
                Limpiar
              </button>
            </div>
            <div className="border-2 border-slate-300 rounded-lg bg-white">
              <SignatureCanvas
                ref={sigPadCliente}
                canvasProps={{
                  className: 'w-full h-48',
                }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Firme en el recuadro superior usando el ratón o pantalla táctil
            </p>
          </div>

          {/* Firma Contraparte */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Firma de la Contraparte</h2>
              <button
                onClick={() => sigPadContraparte.current?.clear()}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                <RotateCcw className="w-4 h-4" />
                Limpiar
              </button>
            </div>
            <div className="border-2 border-slate-300 rounded-lg bg-white">
              <SignatureCanvas
                ref={sigPadContraparte}
                canvasProps={{
                  className: 'w-full h-48',
                }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Firme en el recuadro superior usando el ratón o pantalla táctil
            </p>
          </div>

          {/* Certificación */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Certificación</h3>
            <p className="text-sm text-blue-800">
              Al firmar este documento, las partes certifican que:
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
              <li>Han leído y comprendido el contenido completo del contrato</li>
              <li>Aceptan todos los términos y condiciones establecidos</li>
              <li>La firma digital tiene la misma validez que la firma manuscrita</li>
              <li>El documento queda registrado con fecha y hora exactas</li>
            </ul>
          </div>

          {/* Botón Finalizar */}
          <button
            onClick={handleSign}
            disabled={isSigning}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-blue-600 rounded-lg hover:from-primary-700 hover:to-blue-700 transition-all disabled:opacity-50"
          >
            <Check className="w-5 h-5" />
            {isSigning ? 'Firmando...' : 'Finalizar Firma'}
          </button>
        </div>
      </div>
    </div>
  );
}
