'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  FileText,
  ArrowRight,
  Sparkles,
  ClipboardList,
  Bot,
  CheckCircle2,
} from 'lucide-react';

interface Conversacion {
  id: string;
  titulo: string;
  created_at: string;
}

interface ContractCreationSelectorProps {
  userId: string;
  conversaciones: Conversacion[];
}

type CreationMethod = 'chat' | 'form' | null;

/**
 * Componente que permite al usuario elegir cómo crear un contrato:
 * - Flow A (Chat): Analizar conversación existente
 * - Flow B (Form): Wizard de formulario guiado
 */
export default function ContractCreationSelector({
  userId,
  conversaciones,
}: ContractCreationSelectorProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<CreationMethod>(null);
  const [selectedConversacion, setSelectedConversacion] = useState<string>('');

  const handleContinue = () => {
    if (selectedMethod === 'chat') {
      // Redirigir a /abogado (página de chat)
      if (selectedConversacion) {
        // Si hay una conversación seleccionada, ir a ella
        router.push(`/abogado?conversacion=${selectedConversacion}`);
      } else {
        // Si no, ir al chat general
        router.push('/abogado');
      }
    } else if (selectedMethod === 'form') {
      // Redirigir al wizard de formulario
      router.push('/contratos/nuevo/wizard');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Crear Nuevo Contrato
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Elige cómo quieres crear tu contrato legal personalizado
        </p>
      </div>

      {/* Method Selection Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Flow A: Chat-based */}
        <button
          onClick={() => setSelectedMethod('chat')}
          className={`group relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 text-left ${
            selectedMethod === 'chat'
              ? 'border-blue-500 shadow-xl shadow-blue-100 scale-[1.02]'
              : 'border-slate-200 hover:border-blue-300 hover:shadow-lg'
          }`}
        >
          {/* Selection Indicator */}
          {selectedMethod === 'chat' && (
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          )}

          {/* Icon */}
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            Conversación con Lexy
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </h3>

          {/* Description */}
          <p className="text-slate-600 mb-4 leading-relaxed">
            Chatea con Lexy sobre tus necesidades y el sistema detectará automáticamente
            qué contrato necesitas, extraerá los datos y sugerirá cláusulas personalizadas.
          </p>

          {/* Features */}
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <Bot className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Detección automática de necesidades</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Extracción inteligente de datos de la conversación</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Sugerencias de cláusulas según tu situación</span>
            </li>
          </ul>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 rounded-full">
            <span className="text-xs font-semibold text-blue-700">Recomendado</span>
          </div>
        </button>

        {/* Flow B: Form-based */}
        <button
          onClick={() => setSelectedMethod('form')}
          className={`group relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 text-left ${
            selectedMethod === 'form'
              ? 'border-emerald-500 shadow-xl shadow-emerald-100 scale-[1.02]'
              : 'border-slate-200 hover:border-emerald-300 hover:shadow-lg'
          }`}
        >
          {/* Selection Indicator */}
          {selectedMethod === 'form' && (
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          )}

          {/* Icon */}
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ClipboardList className="w-7 h-7 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Formulario Guiado
          </h3>

          {/* Description */}
          <p className="text-slate-600 mb-4 leading-relaxed">
            Completa un formulario paso a paso donde especificarás el tipo de contrato,
            las partes involucradas y el contexto necesario.
          </p>

          {/* Features */}
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Proceso estructurado paso a paso</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Campos claros y organizados</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>Control total sobre la información</span>
            </li>
          </ul>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-1 rounded-full">
            <span className="text-xs font-semibold text-emerald-700">Tradicional</span>
          </div>
        </button>
      </div>

      {/* Conversation Selector (only for chat method) */}
      {selectedMethod === 'chat' && conversaciones.length > 0 && (
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            ¿Quieres usar una conversación existente?
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Opcional: Selecciona una conversación reciente para analizarla y crear el
            contrato basado en ella.
          </p>

          <select
            value={selectedConversacion}
            onChange={(e) => setSelectedConversacion(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Nueva conversación</option>
            {conversaciones.map((conv) => (
              <option key={conv.id} value={conv.id}>
                {conv.titulo} -{' '}
                {new Date(conv.created_at).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Continue Button */}
      {selectedMethod && (
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={handleContinue}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span className="text-lg">Continuar</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Help Text */}
      <div className="max-w-3xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-lg">💡</span>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-1">Consejo</h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              Si tienes dudas sobre qué contrato necesitas o quieres explorar opciones,{' '}
              <strong>te recomendamos empezar con una conversación</strong>. Lexy te
              guiará y detectará automáticamente qué necesitas. Si ya sabes exactamente
              qué contrato quieres, el formulario guiado será más rápido.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
