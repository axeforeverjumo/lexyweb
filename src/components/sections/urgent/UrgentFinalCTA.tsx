'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function UrgentFinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 px-6 bg-black text-white">
      <div className="max-w-4xl mx-auto text-center">

        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-8"
        >
          Tu próxima operación urgente<br />
          está a{' '}
          <span className="text-emerald-400">30 segundos</span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          No esperes a perder la próxima operación. Construye tu primer contrato AHORA.
        </motion.p>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-400 mb-2">30s</div>
            <div className="text-sm text-gray-400">De consulta a contrato</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-400 mb-2">24/7</div>
            <div className="text-sm text-gray-400">Disponible siempre</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-400 mb-2">100%</div>
            <div className="text-sm text-gray-400">Validez legal</div>
          </div>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <button className="inline-flex items-center justify-center px-12 py-6 bg-emerald-600 hover:bg-emerald-500 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-emerald-600/50 transition-all">
            Construye tu primer contrato AHORA
          </button>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm text-gray-400 mb-16"
        >
          Sin tarjeta. Sin esperas. Legal garantizado. Acceso instantáneo.
        </motion.p>

        {/* Trust Line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-12 border-t border-gray-800"
        >
          <p className="text-lg text-gray-400">
            Confianza legal. Especificidad española. Precio disruptivo.{' '}
            <span className="font-bold text-white">Lexy.</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
