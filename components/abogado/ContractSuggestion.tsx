'use client';

import { useState } from 'react';
import { Sparkles, FileText, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { ContractDeepAnalysis } from '@/lib/gemini/prompts/contract-deep-analyzer';
import type { ContractIntentDetection } from '@/lib/gemini/prompts/contract-intent-detector';

interface ContractSuggestionProps {
  intent: ContractIntentDetection;
  analysis?: ContractDeepAnalysis | null;
  onAccept: (analysis: ContractDeepAnalysis | null) => void;
  onDismiss: () => void;
  isAnalyzing?: boolean;
}

/**
 * Componente que muestra una sugerencia inteligente para crear un contrato
 * cuando se detecta la necesidad durante una conversación.
 */
export default function ContractSuggestion({
  intent,
  analysis,
  onAccept,
  onDismiss,
  isAnalyzing = false,
}: ContractSuggestionProps) {
  const [showDetails, setShowDetails] = useState(false);

  const confidencePercentage = Math.round(intent.confidence * 100);

  // Color basado en confianza
  const getConfidenceColor = () => {
    if (intent.confidence >= 0.85) return 'text-green-600';
    if (intent.confidence >= 0.7) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="my-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-blue-900 text-base">
                💡 Detecté que necesitas un contrato
              </h4>
              <button
                onClick={onDismiss}
                className="flex-shrink-0 text-blue-400 hover:text-blue-600 transition-colors"
                aria-label="Cerrar sugerencia"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contract Type and Confidence */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-blue-200">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {intent.contractType || 'Contrato legal'}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-blue-200">
                <span className="text-xs text-slate-600">Confianza:</span>
                <span className={`text-sm font-semibold ${getConfidenceColor()}`}>
                  {confidencePercentage}%
                </span>
              </div>

              {intent.userExplicitRequest && (
                <div className="inline-flex items-center gap-1.5 bg-green-100 px-3 py-1 rounded-full border border-green-300">
                  <span className="text-xs font-medium text-green-700">
                    Solicitud directa
                  </span>
                </div>
              )}
            </div>

            {/* Reasoning */}
            {intent.reasoning && (
              <p className="mt-2 text-sm text-blue-700">
                {intent.reasoning}
              </p>
            )}

            {/* Template Selected */}
            {analysis?.suggestedTemplate && !isAnalyzing && (
              <div className="mt-3 p-2.5 bg-white rounded-lg border border-green-200">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <FileText className="w-3 h-3 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-green-800">
                      ✓ Template seleccionado:
                    </p>
                    <p className="text-xs text-green-700 font-medium mt-0.5">
                      {analysis.suggestedTemplate.nombre}
                    </p>
                    {analysis.suggestedTemplate.final_score && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-green-600">
                          Coincidencia: {Math.round(analysis.suggestedTemplate.final_score * 100)}%
                        </span>
                        <span className="text-xs text-slate-500">
                          • {analysis.suggestedTemplate.categoria}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Preview */}
            {analysis && !isAnalyzing && (
              <div className="mt-3">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {showDetails ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      <span>Ocultar datos detectados</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      <span>
                        Ver datos detectados ({analysis.resumenAnalisis.datosCompletos}% completo)
                      </span>
                    </>
                  )}
                </button>

                {/* Details Panel */}
                {showDetails && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200 space-y-2">
                    {/* Extracted Data Summary */}
                    {Object.keys(analysis.datosBasicos).length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-1">
                          Datos extraídos:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(analysis.datosBasicos).map(([categoria, datos]) => {
                            const numCampos = Object.keys(datos || {}).length;
                            if (numCampos === 0) return null;
                            return (
                              <span
                                key={categoria}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                              >
                                {categoria}: {numCampos} campos
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Special Circumstances */}
                    {analysis.circunstanciasEspeciales.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-1">
                          Circunstancias especiales:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.circunstanciasEspeciales.map((circ, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded"
                            >
                              {circ.tipo}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Clauses */}
                    {analysis.clausulasAdicionales.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-1">
                          Cláusulas adicionales sugeridas:
                        </p>
                        <ul className="text-xs text-slate-600 space-y-0.5 pl-3">
                          {analysis.clausulasAdicionales.slice(0, 3).map((clausula, idx) => (
                            <li key={idx} className="list-disc">
                              {clausula.nombre}
                              {clausula.prioridad === 'alta' && (
                                <span className="ml-1 text-red-600 font-semibold">
                                  (alta prioridad)
                                </span>
                              )}
                            </li>
                          ))}
                          {analysis.clausulasAdicionales.length > 3 && (
                            <li className="list-none text-blue-600">
                              +{analysis.clausulasAdicionales.length - 3} más...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Missing Data */}
                    {analysis.resumenAnalisis.datosFaltantes.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-700 mb-1">
                          Datos que necesitaremos:
                        </p>
                        <p className="text-xs text-slate-600">
                          {analysis.resumenAnalisis.datosFaltantes.slice(0, 5).join(', ')}
                          {analysis.resumenAnalisis.datosFaltantes.length > 5 &&
                            ` +${analysis.resumenAnalisis.datosFaltantes.length - 5} más`}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Loading State */}
            {isAnalyzing && (
              <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Analizando conversación en detalle...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex flex-wrap gap-2">
        <button
          onClick={() => onAccept(analysis || null)}
          disabled={isAnalyzing}
          className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
        >
          <FileText className="w-4 h-4" />
          <span>Sí, crear contrato</span>
        </button>

        <button
          onClick={onDismiss}
          disabled={isAnalyzing}
          className="flex-1 min-w-[100px] inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 disabled:bg-slate-100 text-slate-700 font-medium px-4 py-2.5 rounded-lg border-2 border-slate-200 hover:border-slate-300 transition-all duration-200 disabled:cursor-not-allowed"
        >
          <span>No, gracias</span>
        </button>
      </div>
    </div>
  );
}
