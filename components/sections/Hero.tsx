'use client';

import Button from '../Button';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-32">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
        >
          De conversación a contrato firmado
          <br />
          <span className="text-primary-500">En 3 pasos</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
        >
          IA legal especializada para agentes inmobiliarios.
          <br />
          Genera contratos profesionales en 30 segundos.
        </motion.p>

        {/* Pricing Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center space-x-3 bg-gray-50 rounded-full px-6 py-3 mb-12"
        >
          <span className="text-2xl font-bold text-gray-900">65€/mes</span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-600">Contratos ilimitados</span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-600">Sin permanencia</span>
          <span className="ml-2 bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded-full">
            Precio de lanzamiento
          </span>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center space-y-4"
        >
          <Button size="lg" href="#precios" className="text-lg">
            Construye tus primeros contratos gratis
          </Button>
          <p className="text-sm text-gray-500">
            Sin tarjeta de crédito · 14 días de prueba
          </p>
        </motion.div>

        {/* Demo Visual Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 h-96 flex items-center justify-center shadow-2xl"
        >
          <p className="text-gray-400 text-lg">
            [Canvas Demo Screenshot]
          </p>
        </motion.div>
      </div>
    </section>
  );
}
