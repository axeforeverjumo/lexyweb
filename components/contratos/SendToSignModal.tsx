'use client';

import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';

interface SendToSignModalProps {
  contractId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: {
    token: string;
    pin_cliente: string;
    pin_contraparte: string;
    link_firma: string;
    telefono_cliente: string;
    telefono_contraparte: string;
  }) => void;
}

export default function SendToSignModal({
  contractId,
  isOpen,
  onClose,
  onSuccess,
}: SendToSignModalProps) {
  const [emailCliente, setEmailCliente] = useState('');
  const [emailContraparte, setEmailContraparte] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [telefonoContraparte, setTelefonoContraparte] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/contracts/${contractId}/prepare-signature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_cliente: emailCliente,
          email_contraparte: emailContraparte,
          telefono_cliente: telefonoCliente,
          telefono_contraparte: telefonoContraparte,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al preparar la firma');
      }

      // Llamar al callback de éxito
      onSuccess({
        token: data.token,
        pin_cliente: data.pin_cliente,
        pin_contraparte: data.pin_contraparte,
        link_firma: data.link_firma,
        telefono_cliente: telefonoCliente,
        telefono_contraparte: telefonoContraparte,
      });

      // Resetear formulario
      setEmailCliente('');
      setEmailContraparte('');
      setTelefonoCliente('');
      setTelefonoContraparte('');

      onClose();
    } catch (err: any) {
      console.error('Error preparing signature:', err);
      setError(err.message || 'Error al preparar la firma');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Preparar para Firma</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-slate-600 mb-6">
            Introduce los datos de contacto de ambas partes. Se generarán PINs únicos que deberás
            compartir por WhatsApp junto con el link de firma.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Cliente */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Datos del Cliente</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email del cliente *
                </label>
                <input
                  type="email"
                  value={emailCliente}
                  onChange={(e) => setEmailCliente(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="cliente@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Teléfono del cliente *
                </label>
                <input
                  type="tel"
                  value={telefonoCliente}
                  onChange={(e) => setTelefonoCliente(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+34 612 345 678"
                />
              </div>
            </div>
          </div>

          {/* Contraparte */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Datos de la Contraparte</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email de la contraparte *
                </label>
                <input
                  type="email"
                  value={emailContraparte}
                  onChange={(e) => setEmailContraparte(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="contraparte@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Teléfono de la contraparte *
                </label>
                <input
                  type="tel"
                  value={telefonoContraparte}
                  onChange={(e) => setTelefonoContraparte(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+34 612 345 678"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Preparando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Generar PINs y Link
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
