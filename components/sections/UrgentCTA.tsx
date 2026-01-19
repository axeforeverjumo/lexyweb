'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Button from '../Button';

export default function UrgentCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-12 px-6 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Multiple gradient layers for depth */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="max-w-4xl mx-auto text-center relative z-10">

        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-400/30 rounded-full px-4 py-2 mb-6"
        >
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-emerald-300">Urgente · Rápido · Efectivo</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4"
        >
          ¿Necesitas el contrato{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">AHORA</span>?
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          No esperes 3 días. No pierdas la operación.<br />
          Genera tu contrato en <span className="font-bold text-white">30 segundos</span>.
        </motion.p>

        {/* Stats Row - Enhanced glassmorphic cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="text-3xl font-bold text-emerald-400 mb-1">30s</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Generación</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="text-3xl font-bold text-emerald-400 mb-1">24/7</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Disponible</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="text-3xl font-bold text-emerald-400 mb-1">100%</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Legal</div>
          </div>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-4"
        >
          <Button
            size="lg"
            href="#precios"
            className="px-12 py-4 text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 shadow-2xl shadow-emerald-600/40 hover:shadow-emerald-500/50 border border-emerald-400/20"
          >
            Empezar AHORA →
          </Button>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="text-sm text-gray-500"
        >
          Sin tarjeta · Sin esperas · Listo para firmar
        </motion.p>

      </div>
    </section>
  );
}
