'use client';

import { useState } from 'react';
import { X, Copy, Check, MessageCircle } from 'lucide-react';

interface ShareSignatureLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: string;
  pinCliente: string;
  pinContraparte: string;
  telefonoCliente?: string;
  telefonoContraparte?: string;
}

export default function ShareSignatureLinkModal({
  isOpen,
  onClose,
  link,
  pinCliente,
  pinContraparte,
  telefonoCliente,
  telefonoContraparte,
}: ShareSignatureLinkModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPinCliente, setCopiedPinCliente] = useState(false);
  const [copiedPinContraparte, setCopiedPinContraparte] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = async (text: string, setter: (value: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const shareViaWhatsApp = (phone: string, pin: string) => {
    const message = `Hola! Te envío el link para firmar el contrato:\n\n${link}\n\nTu PIN de acceso es: ${pin}\n\nGracias!`;
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-green-50">
          <div>
            <h2 className="text-xl font-semibold text-green-900">¡Listo para Firmar!</h2>
            <p className="text-sm text-green-700 mt-1">
              Comparte el link y los PINs con ambas partes
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-green-600 hover:text-green-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Link de Firma */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Link de Firma (compartir con ambas partes)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={link}
                readOnly
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm font-mono"
              />
              <button
                onClick={() => copyToClipboard(link, setCopiedLink)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* PIN Cliente */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">PIN del Cliente</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={pinCliente}
                readOnly
                className="flex-1 px-3 py-2 border border-blue-300 rounded-lg bg-white text-lg font-bold text-center tracking-wider"
              />
              <button
                onClick={() => copyToClipboard(pinCliente, setCopiedPinCliente)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {copiedPinCliente ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>
            {telefonoCliente && (
              <button
                onClick={() => shareViaWhatsApp(telefonoCliente, pinCliente)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Enviar por WhatsApp a {telefonoCliente}
              </button>
            )}
          </div>

          {/* PIN Contraparte */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="text-sm font-semibold text-purple-900 mb-3">PIN de la Contraparte</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={pinContraparte}
                readOnly
                className="flex-1 px-3 py-2 border border-purple-300 rounded-lg bg-white text-lg font-bold text-center tracking-wider"
              />
              <button
                onClick={() => copyToClipboard(pinContraparte, setCopiedPinContraparte)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
              >
                {copiedPinContraparte ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>
            {telefonoContraparte && (
              <button
                onClick={() => shareViaWhatsApp(telefonoContraparte, pinContraparte)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Enviar por WhatsApp a {telefonoContraparte}
              </button>
            )}
          </div>

          {/* Instrucciones */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="text-sm font-semibold text-amber-900 mb-2">📋 Instrucciones</h3>
            <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
              <li>Copia el link de firma y compártelo con ambas partes</li>
              <li>Envía el PIN del cliente al cliente (por WhatsApp o email)</li>
              <li>Envía el PIN de la contraparte a la contraparte</li>
              <li>Cada parte abrirá el link e introducirá su PIN</li>
              <li>Una vez ambas partes firmen, el contrato estará completo</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
