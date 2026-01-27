'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  'Contratos ilimitados (sin límites)',
  'Respuestas legales urgentes 24/7',
  'Canvas editor profesional',
  'Firma digital integrada',
  'Almacenamiento ilimitado',
  'Acceso 24/7 desde móvil',
  'Validez legal certificada',
];

export default function UrgentPricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="urgente-pricing" ref={ref} className="py-32 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-black leading-tight tracking-tight mb-6">
            65€/mes. Contratos ilimitados.<br />Cuando urgencia llama.
          </h2>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            En inmobiliario, una operación de emergencia que cierras YA vale 600-1200€ comisión.
          </p>
        </motion.div>

        {/* ROI Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 p-8 bg-emerald-50 rounded-2xl border-2 border-emerald-200"
        >
          <p className="text-lg text-gray-900 leading-relaxed mb-4">
            Si Lexy te permite cerrar <span className="font-bold text-emerald-700">2-3 operaciones urgentes al mes</span>{' '}
            (que antes perdías), ya recuperaste el año completo de suscripción en el <span className="font-bold text-emerald-700">PRIMER MES</span>.
          </p>
          <p className="text-lg text-gray-900 leading-relaxed">
            Y eso sin contar el ahorro de no contratar abogado. O no esperar abogado externo.
          </p>
          <div className="mt-6 text-center">
            <div className="text-4xl font-bold text-emerald-600">
              ROI: Positivo en 30 días
            </div>
          </div>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative p-10 bg-white rounded-3xl border-2 border-emerald-600 shadow-2xl mb-12"
        >
          {/* Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
            ACCESO INSTANTÁNEO
          </div>

          {/* Price */}
          <div className="text-center mb-8 mt-4">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-7xl font-bold text-black">65€</span>
              <span className="text-2xl text-gray-600">/mes</span>
            </div>
            <p className="text-sm font-medium text-gray-600">
              Contratos ilimitados · Cancela cuando quieras
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-10">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base text-gray-900">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <button className="w-full md:w-auto px-12 py-5 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-emerald-600/30 transition-all">
              Empezar gratis 14 días
            </button>
            <p className="text-sm text-gray-600 mt-4">
              Sin tarjeta. Sin esperas. Legal garantizado. Acceso instantáneo.
            </p>
          </div>
        </motion.div>

        {/* Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          {/* Traditional Method */}
          <div className="p-8 bg-white rounded-2xl border-2 border-gray-200">
            <div className="text-3xl mb-4 text-center">🏛️</div>
            <h3 className="text-2xl font-bold text-black text-center mb-6">
              Método Tradicional
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Por contrato</span>
                <span className="text-xl font-bold text-black">300€</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Tiempo de espera</span>
                <span className="text-xl font-bold text-black">3-5 días</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Disponibilidad</span>
                <span className="text-xl font-bold text-black">9-18h</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Urgencias</span>
                <span className="text-xl font-bold text-red-600">Pierdes operación</span>
              </div>
            </div>
          </div>

          {/* Lexy Method */}
          <div className="p-8 bg-emerald-50 rounded-2xl border-2 border-emerald-600">
            <div className="text-3xl mb-4 text-center">⚡</div>
            <h3 className="text-2xl font-bold text-emerald-700 text-center mb-6">
              Con Lexy
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-emerald-200">
                <span className="text-gray-900">Ilimitados/mes</span>
                <span className="text-xl font-bold text-emerald-600">65€</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-emerald-200">
                <span className="text-gray-900">Tiempo de espera</span>
                <span className="text-xl font-bold text-emerald-600">30 seg</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-emerald-200">
                <span className="text-gray-900">Disponibilidad</span>
                <span className="text-xl font-bold text-emerald-600">24/7</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-900">Urgencias</span>
                <span className="text-xl font-bold text-emerald-600">Cierras YA</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Money Back */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center p-6 bg-white rounded-xl border border-gray-200"
        >
          <p className="text-lg text-gray-900">
            <span className="font-bold text-black">Garantía:</span> Si no te convence en 14 días, 0€ pagado. Sin preguntas.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
