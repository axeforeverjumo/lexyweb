'use client';

import Button from '../Button';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center px-6 pt-24 pb-12 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-hidden">

      {/* Animated gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="max-w-5xl mx-auto text-center relative z-10">

        {/* Overline - Pill style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
          className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6"
        >
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-emerald-400">Disponible 24/7 · Legal garantizado</span>
        </motion.div>

        {/* Headline - DRAMATIC with gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0, 0, 0.2, 1] }}
          className="text-6xl md:text-7xl font-bold text-white leading-[0.95] tracking-tight mb-4"
        >
          Tu próxima operación urgente
          <br />
          está a <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">30 segundos</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0, 0, 0.2, 1] }}
          className="text-lg md:text-xl text-gray-400 font-medium mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          Tienes una operación a cerrar. Necesitas el contrato <span className="font-bold text-white">YA</span>.<br />
          En 30 segundos, listo para firmar.
        </motion.p>

        {/* CTA Group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0, 0, 0.2, 1] }}
          className="flex flex-col items-center gap-3 mb-10"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              size="lg"
              href="/register"
              className="px-10 py-4 text-base bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/40 border border-emerald-400/20"
            >
              Empezar AHORA - 30 segundos →
            </Button>
            <Button
              size="lg"
              variant="secondary"
              href="/login"
              className="px-8 py-4 text-base bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30"
            >
              Iniciar sesión
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Sin tarjeta · Acceso inmediato · 14 días gratis
          </p>
        </motion.div>

        {/* Stats mini - Better design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: [0, 0, 0.2, 1] }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <div className="text-2xl font-bold text-emerald-400">30s</div>
            <div className="text-xs text-gray-400">Generación</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <div className="text-2xl font-bold text-emerald-400">97</div>
            <div className="text-xs text-gray-400">Plantillas</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            <div className="text-2xl font-bold text-emerald-400">100%</div>
            <div className="text-xs text-gray-400">Legal</div>
          </div>
        </motion.div>

        {/* Demo Visual - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0, 0, 0.2, 1] }}
          className="rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/20 ring-1 ring-white/10 relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Image
            src="/images/dashboard.png"
            alt="LEXY Dashboard - Interfaz de gestión de contratos"
            width={1400}
            height={700}
            className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
            priority
          />
        </motion.div>

      </div>
    </section>
  );
}
