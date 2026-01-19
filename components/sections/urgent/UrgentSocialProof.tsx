'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const testimonials = [
  {
    name: 'Javier C.',
    role: 'Agente Barcelona - 12 años experiencia',
    quote: 'Antes cerraba 4-5 operaciones/mes por tiempo. Ahora cierro 12-15. La diferencia es que la burocracia legal no me frena. Lexy hizo eso posible.',
    avatar: 'JC',
  },
  {
    name: 'Sofía R.',
    role: 'Gestora Madrid - Startup inmobiliaria',
    quote: 'Cuando los clientes me preguntan \'¿cuándo tengo el contrato?\', antes decía \'mañana\'. Ahora digo \'5 minutos\'. Cierro el 40% más de operaciones.',
    avatar: 'SR',
  },
  {
    name: 'Carlos M.',
    role: 'Agente Girona - Casos urgentes',
    quote: 'El viernes pasado salvé una operación de 800k que casi se pierde. Cliente quería cerrar. Abogado no disponible. Lexy. 30 segundos. Operación cerrada. Sin Lexy, perdía 2,400€ comisión.',
    avatar: 'CM',
  },
];

export default function UrgentSocialProof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-32 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-black leading-tight tracking-tight mb-4">
            Agentes que hoy cierran<br />más operaciones
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Quote */}
              <blockquote className="text-base text-gray-900 leading-relaxed mb-6">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center">
                  {testimonial.avatar}
                </div>
                {/* Name + Role */}
                <div>
                  <div className="font-bold text-black">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
