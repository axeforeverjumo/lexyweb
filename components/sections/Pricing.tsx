'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Button from '../Button';
import { useCheckout } from '../useCheckout';

const features = [
  'Contratos ilimitados',
  '97 plantillas legales verificadas',
  'Consultas legales 24/7 ilimitadas',
  'Canvas de edición en tiempo real',
  'Firmas digitales integradas',
  'Validez legal certificada',
  'Soporte prioritario',
  'Actualizaciones normativas automáticas',
];

export default function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { startCheckout, loading } = useCheckout();

  return (
    <section id="precios" ref={ref} className="py-12 px-6 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
          className="text-4xl font-bold text-black text-center mb-4"
        >
          Empieza <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-transparent bg-clip-text">AHORA</span>. Un precio. Todo incluido.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35, delay: 0.1, ease: [0, 0, 0.2, 1] }}
          className="text-lg text-gray-700 text-center mb-10"
        >
          Sin sorpresas · Sin límites · Sin permanencia
        </motion.p>

        {/* Pricing Card - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35, delay: 0.2, ease: [0, 0, 0.2, 1] }}
          className="bg-white rounded-3xl p-10 border-2 border-emerald-500/20 shadow-2xl shadow-emerald-500/10 mb-12 relative overflow-hidden"
        >
          {/* Badge */}
          <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl">
            Popular
          </div>

          <div className="text-center mb-10">
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 text-transparent bg-clip-text">65€</span>
              <span className="text-xl text-gray-600">/mes</span>
            </div>
            <p className="text-sm font-medium text-emerald-600 mb-8">
              Precio de lanzamiento · Cancela cuando quieras
            </p>
            <Button
              size="lg"
              onClick={startCheckout}
              disabled={loading}
              className="px-12 py-4 shadow-xl shadow-emerald-600/30 hover:shadow-emerald-500/40"
            >
              {loading ? 'Procesando...' : 'Empezar AHORA - Gratis 14 días'}
            </Button>
          </div>

          {/* Features - Enhanced grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.25, delay: 0.3 + index * 0.05, ease: [0, 0, 0.2, 1] }}
                className="flex items-start gap-3 bg-emerald-50/50 rounded-xl p-3"
              >
                <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-900 font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Comparativa - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35, delay: 0.6, ease: [0, 0, 0.2, 1] }}
          className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-8 border border-gray-200"
        >
          <p className="text-sm font-medium text-gray-700 text-center mb-6">
            VS. Método tradicional
          </p>
          <div className="flex items-center justify-center gap-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2 line-through opacity-50">300€</div>
              <div className="text-sm text-gray-600">Por contrato</div>
            </div>
            <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 text-transparent bg-clip-text mb-2">65€</div>
              <div className="text-sm text-emerald-600 font-bold">Ilimitados/mes</div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
