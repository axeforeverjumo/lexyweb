'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const steps = [
  {
    time: '5s',
    title: 'Abre Lexy',
    description: 'Acceso instantáneo. No descargas. No instalaciones. Abres Lexy en navegador o app. Tu panel aparece. Todos tus chats anteriores, tus contratos, tu historial. Listo para crear uno nuevo.',
    visual: '/images/dashboard.png',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    time: '20s',
    title: 'Escribe tu caso',
    description: '"Necesito compraventa de vivienda, 450k euros, Barcelona, con garantía de que no hay cargas." Eso es todo. IA entiende EXACTAMENTE qué necesitas. No necesitas explicar normativa, cláusulas legales, o formato. Escribe como si hablaras con un abogado. Lexy lo entiende.',
    visual: '/images/chat-con-lexy.png',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    time: '5s',
    title: 'Recibe contrato validado',
    description: 'BOOM. Contrato completo. Todas las cláusulas necesarias. Protección vendedor y comprador. Normativa Barcelona 2026. Listo para leer. Todo en tu Canvas editor. ¿Necesitas cambiar algo? Edita directamente. ¿Necesita firma? Un click.',
    visual: '/images/generacion-del-contrato.png',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    time: '¿s?',
    title: 'Genera firma y cierra',
    description: 'Link de firma. El cliente entra desde WhatsApp/email. Lee. Firma digitalmente. Contrato archivado. Listo para entregar, registrar o guardar. Operación completamente cerrada. De consulta a contrato archivado y firmado.',
    visual: '/images/firma-digital.png',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
  },
];

export default function UrgentHowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="como-funciona-urgente" ref={ref} className="py-32 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-black leading-tight tracking-tight mb-6">
            30 Segundos, 4 Pasos Críticos
          </h2>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            Mientras lees esto (20 segundos), Lexy habría generado un contrato completo.
            Aquí está cómo:
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-24 mt-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center gap-12`}
            >
              {/* Content Side */}
              <div className="flex-1">
                {/* Time Badge */}
                <div className="inline-flex items-center gap-2 mb-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div className="text-4xl font-bold text-emerald-600 tabular-nums">
                    {step.time}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold text-black mb-4">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-base text-gray-900 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Visual Side */}
              <div className="flex-1 w-full">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-black/5">
                  <Image
                    src={step.visual}
                    alt={step.title}
                    width={700}
                    height={500}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-20 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#urgente-pricing"
            className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-lg transition-all"
          >
            Probar ahora - 30 segundos
          </a>
          <a
            href="#urgente-casos"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-black font-medium rounded-full transition-all"
          >
            Ver casos reales
          </a>
        </motion.div>

      </div>
    </section>
  );
}
