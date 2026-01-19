'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Button from '@/components/Button';

export default function UrgentHero() {
  const [counter, setCounter] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    if (counter === 0) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      setCounter(counter - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [counter, isRunning]);

  const startDemo = () => {
    setCounter(30);
    setIsRunning(true);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20 bg-white">
      <div className="max-w-5xl mx-auto text-center">

        {/* Overline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs font-semibold tracking-[0.15em] uppercase text-black mb-8"
        >
          Acceso instantáneo · Sin esperar · Legal garantizado
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold text-black leading-[0.95] tracking-tight mb-8"
        >
          Genera Contratos Inmobiliarios<br />
          <span className="text-emerald-600">en 30 Segundos</span>
        </motion.h1>

        {/* Urgency Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-900 font-medium mb-12 max-w-3xl mx-auto leading-tight"
        >
          Tienes una operación a cerrar. Necesitas el contrato <span className="font-bold text-black">YA</span>.<br />
          En 30 segundos, listo para firmar.
        </motion.p>

        {/* Timer Counter Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="inline-flex flex-col items-center mb-12"
        >
          <div className="relative">
            {/* Timer Circle Background */}
            <div className="w-40 h-40 rounded-full border-4 border-emerald-50 flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="text-6xl font-bold text-emerald-600 tabular-nums">
                  {counter}
                </div>
                <div className="text-sm font-medium text-gray-900 tracking-wide">
                  segundos
                </div>
              </div>
            </div>

            {/* Pulse ring animation when running */}
            {isRunning && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-emerald-600"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </div>

          {!isRunning && (
            <button
              onClick={startDemo}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors underline underline-offset-4"
            >
              Ver demo en tiempo real →
            </button>
          )}
        </motion.div>

        {/* Problem Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-2xl mx-auto mb-12 p-6 bg-gray-50 rounded-2xl"
        >
          <p className="text-base text-gray-900 leading-relaxed">
            Es mediodía. Tu cliente quiere cerrar hoy. El abogado no atiende hasta mañana.
            La operación se pierde. En Lexy, escribes tu caso en el chat. En 30 segundos
            tienes un contrato completo, validado legalmente, listo para firmar digitalmente.
            Todo desde tu móvil.
          </p>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <Button
            variant="primary"
            size="lg"
            href="#urgente-pricing"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-5 text-lg font-semibold rounded-full shadow-lg hover:shadow-emerald-600/20 transition-all"
          >
            Empezar AHORA - 30 segundos
          </Button>
          <p className="text-sm text-gray-600">
            Sin tarjeta de crédito. Acceso inmediato. Contrato listo al instante.
          </p>
        </motion.div>

        {/* Secondary CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <a
            href="#como-funciona-urgente"
            className="text-sm font-medium text-black hover:text-emerald-600 transition-colors"
          >
            ¿Cómo funciona? ↓
          </a>
        </motion.div>

      </div>
    </section>
  );
}
