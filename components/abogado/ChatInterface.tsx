'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/lib/store/chatStore';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import ContractDataSidebar from './ContractDataSidebar';
import ContractSuggestion from './ContractSuggestion';
import ConversationContractsSidebar from './ConversationContractsSidebar';
import ShareChatModal from '@/components/chat/ShareChatModal';
import { FileText, Sparkles, Share2 } from 'lucide-react';
import type { ContractIntentDetection } from '@/lib/gemini/prompts/contract-intent-detector';
import type { ContractDeepAnalysis } from '@/lib/gemini/prompts/contract-deep-analyzer';
import type { ConversacionParticipant } from '@/types/subscription.types';

interface DatoCampo {
  valor: string;
  confianza: number;
  contexto?: string;
  campoContrato?: string;
}

interface ContractData {
  tipoContrato: string;
  templateId?: string;
  datosBasicos: {
    arrendador?: Record<string, DatoCampo>;
    arrendatario?: Record<string, DatoCampo>;
    inmueble?: Record<string, DatoCampo>;
    economicos?: Record<string, DatoCampo>;
    temporales?: Record<string, DatoCampo>;
  };
  circunstanciasEspeciales?: Array<{
    tipo: string;
    descripcion: string;
  }>;
  completitud: number;
}

export default function ChatInterface() {
  const router = useRouter();
  const {
    conversacionActiva,
    mensajes,
    isTyping,
    enviarMensaje,
    conversaciones,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Estado para detección automática de contratos
  const [contractIntent, setContractIntent] = useState<ContractIntentDetection | null>(null);
  const [contractAnalysis, setContractAnalysis] = useState<ContractDeepAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const lastAnalyzedMessageId = useRef<string | null>(null);

  // NUEVO: Estado para modo contrato
  const [contractMode, setContractMode] = useState(false);
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [isGeneratingContract, setIsGeneratingContract] = useState(false);
  const [isConsultMode, setIsConsultMode] = useState(false);

  // Estado para compartir chat
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentShares, setCurrentShares] = useState<ConversacionParticipant[]>([]);

  // Auto-scroll al final cuando llegan nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  // Cargar participantes cuando cambia la conversación
  useEffect(() => {
    if (conversacionActiva) {
      fetchParticipants();
    }
  }, [conversacionActiva]);

  const fetchParticipants = async () => {
    if (!conversacionActiva) return;

    try {
      const response = await fetch(`/api/conversaciones/${conversacionActiva}/participants`);
      if (response.ok) {
        const { participants } = await response.json();
        setCurrentShares(participants.filter((p: ConversacionParticipant) => p.role !== 'owner'));
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  // Resetear modo contrato al cambiar de conversación
  useEffect(() => {
    // Si hay modo contrato activo, cerrarlo al cambiar de conversación
    if (contractMode || contractData) {
      setContractMode(false);
      setContractData(null);
      setContractIntent(null);
      setContractAnalysis(null);
      setShowSuggestion(false);
      setIsConsultMode(false);
      console.log('[ChatInterface] Modo contrato reseteado al cambiar de conversación');
    }
  }, [conversacionActiva]);

  // Detectar intención de contrato después de cada respuesta de Lexy
  useEffect(() => {
    const detectContractIntent = async () => {
      // No detectar si ya estamos en modo contrato
      if (contractMode) return;

      // Solo analizar si hay mensajes y no estamos escribiendo
      if (mensajes.length === 0 || isTyping) return;

      // Obtener el último mensaje
      const lastMessage = mensajes[mensajes.length - 1];

      // Solo analizar mensajes del asistente que no hemos analizado aún
      if (
        lastMessage.role !== 'assistant' ||
        lastMessage.id === lastAnalyzedMessageId.current
      ) {
        return;
      }

      // Marcar como analizado
      lastAnalyzedMessageId.current = lastMessage.id;

      try {
        // Preparar mensajes para análisis (últimos 10 para contexto)
        const recentMessages = mensajes.slice(-10).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        // Llamar API de detección de intención
        const intentResponse = await fetch('/api/contracts/detect-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lastResponse: lastMessage.content,
            conversacionId: conversacionActiva,
          }),
        });

        if (!intentResponse.ok) {
          console.error('Error detecting intent:', await intentResponse.text());
          return;
        }

        const intentData: ContractIntentDetection = await intentResponse.json();

        console.log('[ChatInterface] Intent detected:', intentData);

        // ⭐ NUEVO FLUJO: Si se detecta necesidad con alta confianza, hacer análisis inmediato
        if (intentData.needsContract && intentData.confidence >= 0.7) {
          setContractIntent(intentData);

          // Si la confianza es ALTA (>=0.85), hacer análisis profundo automáticamente
          // Esto incluye búsqueda de template y extracción de datos
          if (intentData.confidence >= 0.85) {
            setIsAnalyzing(true);

            const analysisResponse = await fetch('/api/contracts/analyze-conversation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                conversacionId: conversacionActiva,
                mensajes: recentMessages,
              }),
            });

            if (analysisResponse.ok) {
              const analysisData: ContractDeepAnalysis = await analysisResponse.json();
              console.log('[ChatInterface] Deep analysis complete:', {
                tipo: analysisData.resumenAnalisis.tipoContrato,
                template: analysisData.suggestedTemplate?.nombre || 'No template',
                datos: analysisData.resumenAnalisis.datosCompletos || 0,
              });
              setContractAnalysis(analysisData);

              // ⭐ NUEVO: Mostrar sugerencia CON análisis completo
              setShowSuggestion(true);
            } else {
              // Si falla el análisis, mostrar sugerencia básica
              setShowSuggestion(true);
            }

            setIsAnalyzing(false);
          } else {
            // Confianza media (0.7-0.85): mostrar sugerencia sin análisis previo
            setShowSuggestion(true);
          }
        }
      } catch (error) {
        console.error('Error in contract detection:', error);
      }
    };

    detectContractIntent();
  }, [mensajes, isTyping, conversacionActiva, contractMode]);

  // NUEVO: Actualizar datos del contrato cuando hay análisis profundo
  useEffect(() => {
    if (contractMode && contractAnalysis) {
      updateContractDataFromAnalysis(contractAnalysis);
    }
  }, [contractAnalysis, contractMode]);

  // NUEVO: Convertir análisis a datos del contrato
  const updateContractDataFromAnalysis = (analysis: ContractDeepAnalysis) => {
    const totalFields = Object.values(analysis.datosBasicos).reduce(
      (acc, section: any) => acc + Object.keys(section || {}).length,
      0
    );
    const filledFields = Object.values(analysis.datosBasicos).reduce(
      (acc, section: any) =>
        acc + Object.values(section || {}).filter((field: any) => field?.valor).length,
      0
    );

    const completitud = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

    setContractData({
      tipoContrato: analysis.resumenAnalisis.tipoContrato,
      templateId: analysis.suggestedTemplate?.id,
      datosBasicos: analysis.datosBasicos,
      circunstanciasEspeciales: analysis.circunstanciasEspeciales,
      completitud,
      conversacionId: conversacionActiva, // Guardar conversacionId para asociar el contrato
    } as any);
  };

  // NUEVO: Activar modo contrato (FLUJO UNIFICADO)
  const activateContractMode = async (analysis: ContractDeepAnalysis | null) => {
    // ⭐ CAMBIO: NO activar modo hasta tener datos
    setShowSuggestion(false);
    setIsAnalyzing(true);

    try {
      // PASO 1: Si no hay análisis, hacerlo PRIMERO (incluye template selection)
      if (!analysis) {
        const recentMessages = mensajes.slice(-10).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const analysisResponse = await fetch('/api/contracts/analyze-conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversacionId: conversacionActiva,
            mensajes: recentMessages,
          }),
        });

        if (analysisResponse.ok) {
          const analysisData: ContractDeepAnalysis = await analysisResponse.json();
          setContractAnalysis(analysisData);
          analysis = analysisData;
        } else {
          throw new Error('Error al analizar conversación');
        }
      }

      // PASO 2: Extraer datos del análisis
      if (!analysis) {
        throw new Error('No se pudo obtener análisis');
      }

      updateContractDataFromAnalysis(analysis);

      // PASO 3: AHORA SÍ activar modo contrato (con datos ya listos)
      setContractMode(true);

      console.log('[Contract Mode] Activated with data:', {
        tipo: analysis.resumenAnalisis.tipoContrato,
        template: analysis.suggestedTemplate?.nombre || 'No template',
        completitud: '0%', // Se actualizará con datos
      });
    } catch (error) {
      console.error('[Contract Mode] Error activating:', error);
      // Mostrar error al usuario
      if (conversacionActiva) {
        await enviarMensaje(
          conversacionActiva,
          '❌ Error al activar modo contrato. Por favor, intenta nuevamente.',
          'assistant'
        );
      }
    } finally {
      setIsAnalyzing(false);
    }

    // Hacer que Lexy empiece a preguntar por los datos faltantes
    if (conversacionActiva && analysis) {
      const datosFaltantes = analysis.resumenAnalisis.datosFaltantes || [];

      // Preparar instrucciones para Lexy sobre el modo contrato
      const datosRecopilados: string[] = [];
      Object.entries(analysis.datosBasicos).forEach(([section, fields]: [string, any]) => {
        if (fields && Object.keys(fields).length > 0) {
          Object.entries(fields).forEach(([fieldName, fieldData]: [string, any]) => {
            if (fieldData?.valor) {
              datosRecopilados.push(`${section}.${fieldName}: ${fieldData.valor}`);
            }
          });
        }
      });

      // Crear prompt del sistema para modo contrato
      const systemPrompt = `
🔵 MODO CONTRATO ACTIVADO

Estás ayudando al usuario a crear un contrato de tipo: **${analysis.resumenAnalisis.tipoContrato}**

⚠️ **REGLAS CRÍTICAS:**
- ❌ NO GENERES TEXTO DE CONTRATO
- ❌ NO ESCRIBAS CLÁUSULAS
- ❌ NO REDACTES DOCUMENTOS
- ✅ SOLO HAZ PREGUNTAS para recopilar datos
- ✅ SÉ BREVE (máximo 2 líneas por mensaje)

**DATOS YA RECOPILADOS:**
${datosRecopilados.length > 0 ? datosRecopilados.map(d => `- ${d}`).join('\n') : '- Ninguno aún'}

**DATOS FALTANTES QUE DEBES PREGUNTAR:**
${datosFaltantes.length > 0 ? datosFaltantes.map(d => `- ${d}`).join('\n') : '- Todos completos'}

**CIRCUNSTANCIAS ESPECIALES DETECTADAS:**
${analysis.circunstanciasEspeciales && analysis.circunstanciasEspeciales.length > 0
  ? analysis.circunstanciasEspeciales.map(c => `- ${c.tipo}: ${c.descripcion}`).join('\n')
  : '- Ninguna'}

**TU ROL:**
Eres un asistente que SOLO recopila información. El contrato lo generará Lexy después.

**CÓMO PREGUNTAR:**
1. Saluda brevemente: "Perfecto, vamos a crear el contrato juntos."
2. Haz UNA pregunta específica por mensaje
3. Máximo 2 líneas por respuesta
4. NO expliques el contrato, NO des contexto legal
5. Cuando tengas todos los datos, confirma: "Datos completos. Puedes generar el contrato cuando quieras."

✅ Ejemplo correcto:
"¿Cuál es el DNI del vendedor?"

❌ Ejemplo incorrecto (demasiado texto):
"Para el contrato de arras penitenciales necesitamos identificar a las partes. Esto es importante porque según el artículo 1454 del Código Civil... ¿Cuál es tu DNI?"

Empieza preguntando por el primer dato faltante. SÉ BREVE.
      `;

      // Enviar el system prompt como mensaje del usuario (para que Lexy lo vea)
      // Nota: Esto es un hack, idealmente debería ir en el system prompt de la API
      await enviarMensaje(conversacionActiva, systemPrompt, 'system');
    }
  };

  // Handler para aceptar la sugerencia de contrato
  const handleAcceptSuggestion = async (analysis: ContractDeepAnalysis | null) => {
    await activateContractMode(analysis);
  };

  // Handler para rechazar la sugerencia
  const handleDismissSuggestion = () => {
    setShowSuggestion(false);
    setContractIntent(null);
    setContractAnalysis(null);
  };

  // NUEVO: Handler para crear contrato desde el banner
  const handleCreateContractFromBanner = async () => {
    await activateContractMode(contractAnalysis);
  };

  // NUEVO: Handler para actualizar campo del contrato
  const handleUpdateField = (section: string, field: string, value: string) => {
    if (!contractData) return;

    setContractData((prev) => {
      if (!prev) return prev;

      const newData = { ...prev };
      const sectionData = newData.datosBasicos[section as keyof typeof newData.datosBasicos];

      if (sectionData) {
        (sectionData as any)[field] = {
          ...(sectionData as any)[field],
          valor: value,
          confianza: 1.0, // Editado manualmente = 100% confianza
        };
      }

      // Recalcular completitud
      const totalFields = Object.values(newData.datosBasicos).reduce(
        (acc, sec: any) => acc + Object.keys(sec || {}).length,
        0
      );
      const filledFields = Object.values(newData.datosBasicos).reduce(
        (acc, sec: any) =>
          acc + Object.values(sec || {}).filter((f: any) => f?.valor).length,
        0
      );

      newData.completitud = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

      return newData;
    });
  };

  // NUEVO: Handler para generar contrato final con Claude
  const handleGenerateContract = async () => {
    if (!contractData) {
      console.error('No contract data');
      return;
    }

    setIsGeneratingContract(true);

    try {
      // Determinar el tipo de contrato para los settings
      const contractType = determineContractType(contractData.tipoContrato);

      console.log('[ChatInterface] Generating contract with Lexy:', {
        contractType,
        completitud: contractData.completitud,
      });

      // Llamar a la API de Lexy para generar el documento profesional
      const response = await fetch('/api/contracts/generate-with-claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType,
          contractData,
          deepAnalysis: contractAnalysis,
          templateId: contractData.templateId,
          conversacionId: conversacionActiva, // Para poder volver a esta conversación
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('[ChatInterface] Contract generated successfully:', result.contract.id);

        // Mostrar mensaje de éxito en el chat
        if (conversacionActiva) {
          await enviarMensaje(
            conversacionActiva,
            `✅ ¡Contrato generado exitosamente con Lexy!

He creado un documento PROFESIONAL y COMPLETO con:
- ${result.usage?.input_tokens || 0} tokens de entrada (datos + template)
- ${result.usage?.output_tokens || 0} tokens generados (documento final)

El contrato incluye:
✓ Todas las cláusulas legales necesarias
✓ Personalizaciones basadas en tus circunstancias
✓ Referencias legales específicas
✓ Listo para firmar

Puedes verlo y descargarlo en la sección de Contratos.`,
            'assistant'
          );
        }

        // Salir del modo contrato
        setContractMode(false);
        setContractData(null);

        // Redirigir al contrato generado
        router.push(`/contratos/${result.contract.id}`);
      } else {
        const error = await response.json();
        console.error('[ChatInterface] Error generating contract:', error);

        if (conversacionActiva) {
          await enviarMensaje(
            conversacionActiva,
            `❌ Error al generar el contrato: ${error.error}. Por favor, intenta nuevamente o contacta con soporte.`,
            'assistant'
          );
        }
      }
    } catch (error) {
      console.error('[ChatInterface] Error generating contract:', error);

      if (conversacionActiva) {
        await enviarMensaje(
          conversacionActiva,
          `❌ Error inesperado al generar el contrato. Por favor, intenta nuevamente.`,
          'assistant'
        );
      }
    } finally {
      setIsGeneratingContract(false);
    }
  };

  // Helper para determinar el tipo de contrato correcto para los settings
  const determineContractType = (tipoContrato: string): string => {
    const tipo = tipoContrato.toLowerCase();

    // Mapeo de tipos detectados a settings disponibles
    if (tipo.includes('arras') && tipo.includes('penitencial')) {
      return 'arras-penitenciales';
    }
    if (tipo.includes('arrendamiento') && tipo.includes('vivienda')) {
      return 'arrendamiento-vivienda';
    }
    if (tipo.includes('psi') && tipo.includes('compra')) {
      return 'psi-compra';
    }
    // ... más tipos según se vayan creando settings

    // Por defecto, usar arras-penitenciales como ejemplo
    // TODO: Crear settings para todos los 30+ tipos
    return 'arras-penitenciales';
  };

  // NUEVO: Cerrar sidebar y cancelar modo contrato
  const handleCloseSidebar = () => {
    setContractMode(false);
    setContractData(null);
    setContractIntent(null);
    setContractAnalysis(null);
    setShowSuggestion(false);
    setIsConsultMode(false);
    console.log('[ChatInterface] Modo contrato cancelado por el usuario');
  };

  // Obtener conversación actual
  const conversacion = conversaciones.find((c) => c.id === conversacionActiva);

  // Handler para enviar mensaje
  const handleEnviar = async (contenido: string) => {
    if (!conversacionActiva) return;

    // MODO CONSULTA: Si está activado, enviar la pregunta a Lexy
    if (isConsultMode && contractData) {
      // Enviar mensaje del usuario
      await enviarMensaje(conversacionActiva, contenido, 'user');

      try {
        // Llamar a la API de consulta de Lexy
        const response = await fetch('/api/claude/consult', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: contenido,
            contractData,
            contractType: contractData.tipoContrato,
          }),
        });

        if (response.ok) {
          const { answer } = await response.json();

          // Enviar la respuesta de Lexy al chat
          await enviarMensaje(conversacionActiva, answer, 'assistant');
        } else {
          const error = await response.json();
          await enviarMensaje(
            conversacionActiva,
            `❌ Error al consultar: ${error.error || 'Error desconocido'}`,
            'assistant'
          );
        }
      } catch (error) {
        console.error('Error consulting Lexy:', error);
        await enviarMensaje(
          conversacionActiva,
          '❌ Error inesperado al consultar con Lexy.',
          'assistant'
        );
      }

      return; // No continuar con el flujo normal
    }

    // FLUJO NORMAL: Enviar mensaje a Lexy
    await enviarMensaje(conversacionActiva, contenido);

    // Si estamos en modo contrato, actualizar análisis después de cada respuesta del usuario
    if (contractMode) {
      // Esperar un poco para que el mensaje se procese
      setTimeout(async () => {
        const recentMessages = [...mensajes, { role: 'user', content: contenido }]
          .slice(-10)
          .map((m) => ({
            role: m.role,
            content: typeof m.content === 'string' ? m.content : '',
          }));

        try {
          const analysisResponse = await fetch('/api/contracts/analyze-conversation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversacionId: conversacionActiva,
              mensajes: recentMessages,
            }),
          });

          if (analysisResponse.ok) {
            const analysisData: ContractDeepAnalysis = await analysisResponse.json();
            setContractAnalysis(analysisData);
            updateContractDataFromAnalysis(analysisData);
          }
        } catch (error) {
          console.error('Error updating contract data:', error);
        }
      }, 1000);
    }
  };

  // Si no hay conversación activa
  if (!conversacionActiva) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md px-6">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Lexy - Tu Asistente Legal
          </h2>
          <p className="text-slate-600 mb-6">
            Experto en derecho inmobiliario español con más de 25 años de experiencia.
            Crea una nueva conversación para comenzar.
          </p>
          <div className="text-sm text-slate-500 space-y-2">
            <p className="font-medium">Puedo ayudarte con:</p>
            <ul className="text-left space-y-1">
              <li>• Consultas legales sobre contratos inmobiliarios</li>
              <li>• Análisis de cláusulas y documentación</li>
              <li>• Redacción de contratos profesionales</li>
              <li>• Asesoramiento basado en LAU, CC y jurisprudencia</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-white">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header de la conversación */}
        <div className="border-b px-6 py-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {conversacion?.titulo || 'Conversación'}
              </h2>
              {contractMode && contractData && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    Modo Contrato: {contractData.tipoContrato}
                  </div>
                  <span className="text-xs text-slate-500">
                    ({contractData.completitud}% completo)
                  </span>
                </div>
              )}
            </div>

            {/* Share Button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Compartir</span>
              {currentShares.length > 0 && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                  {currentShares.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Banner Crear Contrato (solo si NO está en modo contrato) */}
        {!contractMode && (
          <div className="bg-gradient-to-r from-primary-50 via-blue-50 to-primary-50 border-b border-primary-100 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start space-x-3 flex-1">
                <div className="mt-0.5">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-slate-900 mb-0.5">
                    Crear Contrato
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Lexy detectará el tipo de contrato y te guiará con preguntas personalizadas.
                  </p>
                </div>
              </div>
              <button
                onClick={handleCreateContractFromBanner}
                className="flex items-center space-x-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-all shadow-sm hover:shadow whitespace-nowrap"
              >
                <FileText className="w-4 h-4" />
                <span>Crear Contrato</span>
              </button>
            </div>
          </div>
        )}

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {mensajes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-slate-500">
                <p className="mb-2">👋 ¡Hola! Soy Lexy, tu asistente legal especializado.</p>
                <p className="text-sm">
                  Pregúntame cualquier duda legal o dime qué contrato necesitas crear.
                </p>
              </div>
            </div>
          ) : (
            <>
              {mensajes.map((mensaje) => (
                <MessageBubble
                  key={mensaje.id}
                  mensaje={mensaje}
                  isContractMode={contractMode}
                />
              ))}

              {/* Sugerencia de contrato automática (solo si NO está en modo contrato) */}
              {showSuggestion && contractIntent && !contractMode && (
                <ContractSuggestion
                  intent={contractIntent}
                  analysis={contractAnalysis}
                  onAccept={handleAcceptSuggestion}
                  onDismiss={handleDismissSuggestion}
                  isAnalyzing={isAnalyzing}
                />
              )}

              {/* Indicador de preparación de contrato */}
              {isAnalyzing && !contractMode && (
                <div className="my-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 text-sm mb-1">
                        🔄 Preparando modo contrato...
                      </h4>
                      <p className="text-xs text-blue-700">
                        Analizando la conversación y configurando el formulario. Puedes seguir escribiendo si lo necesitas.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Indicador de escritura */}
              {isTyping && (
                <div className="flex items-center space-x-2 text-slate-500">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                  <span className="text-sm">
                    {contractMode ? 'Analizando respuesta...' : 'Analizando consulta legal...'}
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input de chat */}
        <div className="border-t bg-white px-6 py-4">
          <ChatInput onSend={handleEnviar} disabled={isTyping} />
        </div>
      </div>

      {/* Sidebar de datos del contrato (modo contrato activo) */}
      {contractMode && contractData && (
        <ContractDataSidebar
          contractData={contractData}
          onUpdateField={handleUpdateField}
          onGenerateContract={handleGenerateContract}
          onClose={handleCloseSidebar}
          isGenerating={isGeneratingContract}
          onToggleConsultMode={setIsConsultMode}
          isConsultMode={isConsultMode}
        />
      )}

      {/* Sidebar de contratos de la conversación (cuando NO está en modo contrato) */}
      {!contractMode && (
        <ConversationContractsSidebar conversacionId={conversacionActiva} />
      )}

      {/* Share Chat Modal */}
      {showShareModal && conversacionActiva && conversacion && (
        <ShareChatModal
          conversacionId={conversacionActiva}
          conversacionTitle={conversacion.titulo}
          currentShares={currentShares}
          onClose={() => setShowShareModal(false)}
          onSuccess={() => {
            setShowShareModal(false);
            fetchParticipants();
          }}
        />
      )}
    </div>
  );
}
