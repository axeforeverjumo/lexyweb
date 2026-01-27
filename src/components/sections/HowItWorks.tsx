'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Button from '../Button';
import Image from 'next/image';

const steps = [
  {
    number: '01',
    title: 'Abre Lexy',
    description: 'Acceso instantáneo. No descargas. No instalaciones.',
    details: 'Abres Lexy en navegador o app. Tu panel aparece. Todos tus chats anteriores, tus contratos, tu historial. Listo para crear uno nuevo.',
    image: '/images/dashboard.png',
    alt: 'Dashboard de Lexy - Acceso instantáneo',
  },
  {
    number: '02',
    title: 'Escribe tu caso',
    description: '"Necesito compraventa de vivienda, 450k euros, Barcelona, con garantía de que no hay cargas."',
    details: 'Eso es todo. IA entiende EXACTAMENTE qué necesitas. No necesitas explicar normativa, cláusulas legales, o formato. Escribe como si hablaras con un abogado. Lexy lo entiende.',
    image: '/images/chat-con-lexy.png',
    alt: 'Chat con Lexy - Interfaz conversacional',
  },
  {
    number: '03',
    title: 'Recibe contrato validado',
    description: 'BOOM. Contrato completo. Todas las cláusulas necesarias.',
    details: 'Protección vendedor y comprador. Normativa actualizada 2026. Listo para leer. Todo en tu Canvas editor. ¿Necesitas cambiar algo? Edita directamente. ¿Necesita firma? Un click.',
    image: '/images/canvas.png',
    alt: 'Canvas editor - Contrato generado y validado',
  },
  {
    number: '04',
    title: 'Genera firma y cierra',
    description: 'Link de firma. El cliente entra desde WhatsApp/email.',
    details: 'Lee. Firma digitalmente. Contrato archivado. Listo para entregar, registrar o guardar. Operación completamente cerrada. De consulta a contrato archivado y firmado.',
    image: '/images/firma-digital.png',
    alt: 'Sistema de firma digital - Cierre completo',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="como-funciona" ref={ref} className="py-12 px-6 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Decorative gradient mesh */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
          className="text-4xl font-bold text-center text-white mb-10 leading-tight"
        >
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-transparent bg-clip-text">4 pasos.</span> Desde la duda hasta
          <br />
          el contrato firmado.
        </motion.h2>

        {/* Steps - Alternating */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: index * 0.15, ease: [0, 0, 0.2, 1] }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center gap-12`}
            >
              {/* Content */}
              <div className="flex-1">
                <div className="text-7xl font-bold text-emerald-400 mb-6 opacity-10 leading-none">
                  {step.number}
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {step.title}
                </h3>
                <div className="bg-emerald-500/10 border-l-4 border-emerald-400 p-4 rounded-r-lg mb-6">
                  <p className="text-base text-emerald-300 font-medium italic">
                    "{step.description}"
                  </p>
                </div>
                <p className="text-base text-gray-400 leading-relaxed">
                  {step.details}
                </p>
              </div>

              {/* Image */}
              <div className="flex-1 group">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/20 ring-1 ring-white/5 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Image
                    src={step.image}
                    alt={step.alt}
                    width={700}
                    height={500}
                    className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35, delay: 0.8, ease: [0, 0, 0.2, 1] }}
          className="text-center mt-20"
        >
          <Button
            size="lg"
            href="#precios"
            className="shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/40"
          >
            Probar gratis 14 días
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
