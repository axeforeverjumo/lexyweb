'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const useCases = [
  {
    number: '01',
    title: 'Cierre de Emergencia',
    situation: 'Es viernes a las 16:00. Mi cliente cerraba compraventa pero el vendedor cambió de abogado. El nuevo abogado no envía contrato hasta lunes. Mi cliente se va a otra ciudad el fin de semana. Pierdo operación.',
    withLexy: 'En 30 segundos, genero el contrato. Mi cliente y el vendedor firman digitalmente. Fin de semana tranquilo. Lunes registro la firma en notaría. Operación cerrada.',
    savings: '1,200€ en comisión + reputación salvada',
  },
  {
    number: '02',
    title: 'Múltiples Operaciones en un Día',
    situation: 'Tengo 3 operaciones para cerrar hoy. Normalmente cada una me tomaría 1-2 horas esperando documentos, llamadas, emails. Abogado solo maneja 1-2 al día.',
    withLexy: '30 segundos × 3 = 1 minuto 30 segundos total. He generado 3 contratos legales mientras tomo café. Mis clientes firman al mediodía. Todas cerradas a las 15:00.',
    savings: '3-6 horas de tiempo. 3 operaciones = 2,400-3,600€ comisiones',
  },
  {
    number: '03',
    title: 'Cliente Impaciente',
    situation: 'Mi cliente quiere "el contrato YA". La típica pregunta: \'¿Cuándo tengo el documento?\' Explicar que espere 3-5 días mata la venta.',
    withLexy: 'Cliente pregunta a las 11:00. Respondo a las 11:00:30. "Aquí está tu contrato. Listo para firmar. Eres vendedor o comprador, ¿qué necesitas cambiar?" Cliente: "Wow, increíble."',
    savings: 'Cliente impresionado. Reputación de profesional moderno',
  },
  {
    number: '04',
    title: 'Dudas Legales Urgentes',
    situation: 'Es mediodía. Un cliente me pregunta: \'¿Puedo incluir una cláusula de rescisión a los 3 años?\' Normalmente llamaría al abogado. Espero respuesta. 2 horas perdidas.',
    withLexy: 'Escribo al chat: "¿Es legal una cláusula de rescisión en compraventa a los 3 años en Barcelona?" Respuesta inmediata (verificada por abogados): "Sí, legal. Aquí está cómo redactarla: ..." Cliente: "Perfecto, adelante."',
    savings: 'Consulta legal resuelta en 30 segundos. Cliente feliz',
  },
  {
    number: '05',
    title: 'Agente Freelance, Sin Asistente',
    situation: 'Soy agente solo. No puedo contratar asistente (10k/año). Tampoco puedo usar abogado interno (25k/año). Pero sin soporte legal, no puedo escalar.',
    withLexy: 'Tengo un asistente legal 24/7 por 65€/mes. Contratos. Firma digitales. Ediciones. Consultas legales. TODO. Ahora sí puedo escalar sin contratar personal.',
    savings: 'Escalabilidad sin costos fijos. Negocio más rentable',
  },
];

export default function UrgentUseCases() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="urgente-casos" ref={ref} className="py-32 px-6 bg-white">
      <div className="max-w-5xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-black leading-tight tracking-tight mb-6">
            Casos Reales:<br />¿En Cuál te Reconoces?
          </h2>
        </motion.div>

        {/* Use Cases */}
        <div className="space-y-12">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-8 bg-gray-50 rounded-2xl border border-gray-200"
            >
              {/* Number Badge */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-600 text-white font-bold text-lg flex items-center justify-center rounded-full shadow-lg">
                {useCase.number}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-black mb-6 pl-8">
                {useCase.title}
              </h3>

              {/* Situation */}
              <div className="mb-6">
                <div className="text-xs font-semibold tracking-wider uppercase text-gray-600 mb-2">
                  Situación
                </div>
                <p className="text-base text-gray-900 leading-relaxed italic">
                  "{useCase.situation}"
                </p>
              </div>

              {/* With Lexy */}
              <div className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-xs font-semibold tracking-wider uppercase text-emerald-700 mb-2">
                  Con Lexy
                </div>
                <p className="text-base text-gray-900 leading-relaxed">
                  {useCase.withLexy}
                </p>
              </div>

              {/* Savings */}
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-emerald-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-bold text-emerald-700">
                  {useCase.savings}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
