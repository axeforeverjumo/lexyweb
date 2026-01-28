'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Scale,
  Send,
  MessageSquare,
  Sparkles,
  Clock,
  CheckCircle2,
  Brain,
  FileText,
  Shield,
  Zap
} from 'lucide-react';

const mockConversations = [
  {
    id: 1,
    title: 'Consulta sobre contrato de arrendamiento',
    date: '2024-01-15',
    messages: 3,
    status: 'Resuelta',
  },
];

const features = [
  {
    icon: Brain,
    title: 'IA Especializada',
    description: 'Modelo entrenado con legislación española actualizada',
  },
  {
    icon: Zap,
    title: 'Respuestas Rápidas',
    description: 'Obtén respuestas legales en segundos, no en días',
  },
  {
    icon: Shield,
    title: 'Información Verificada',
    description: 'Todas las respuestas basadas en fuentes legales confiables',
  },
];

export default function AbogadoPage() {
  const [message, setMessage] = useState('');

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Abogado IA
              </h1>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                IA
              </span>
            </div>
            <p className="text-gray-600">
              Consulta tus dudas legales con inteligencia artificial
            </p>
          </div>
        </div>
      </motion.div>

      {/* Coming Soon Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tu Asistente Legal con IA
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Estamos desarrollando un asistente legal inteligente que podrá resolver tus dudas jurídicas
                al instante. Basado en legislación española y actualizado constantemente.
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                <Clock className="w-4 h-4" />
                Próximamente disponible
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Funcionalidades
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Chat Interface Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Interfaz de Consulta
        </h2>
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Asistente Legal IA</h3>
                <p className="text-sm text-emerald-50">Listo para ayudarte</p>
              </div>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="h-96 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Interfaz en Desarrollo
              </h3>
              <p className="text-sm text-gray-600">
                Pronto podrás hacer consultas legales y recibir respuestas instantáneas de nuestro asistente con IA.
              </p>
            </div>
          </div>

          {/* Chat Input Area */}
          <div className="border-t border-gray-200 p-6 bg-white">
            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu consulta legal... (próximamente disponible)"
                disabled
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                disabled
                className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Tus consultas serán confidenciales y protegidas
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Historial de Consultas
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-gray-500">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">0</p>
            <p className="text-sm text-gray-600">Consultas realizadas</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-gray-500">Resueltas</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">0</p>
            <p className="text-sm text-gray-600">Respuestas obtenidas</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-gray-500">Tiempo ahorrado</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">0h</p>
            <p className="text-sm text-gray-600">Vs consulta tradicional</p>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
