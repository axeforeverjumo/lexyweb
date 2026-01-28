'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, FileText, ChevronRight, Sparkles } from 'lucide-react';
import type { ContractDeepAnalysis } from '@/lib/gemini/prompts/contract-deep-analyzer';

type Step = 'initial' | 'searching' | 'found' | 'filling' | 'generating' | 'done' | 'intelligent-review';

interface CampoRequerido {
  nombre: string;
  label: string;
  tipo: 'text' | 'number' | 'date' | 'textarea';
  descripcion?: string;
  requerido: boolean;
}

interface TemplateMatch {
  templateId: string;
  templateCodigo: string;
  templateNombre: string;
  categoria: string;
  subcategoria: string;
  camposRequeridos: CampoRequerido[];
  similarity: number;
}

interface ContractCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Props for intelligent flow (from chat detection)
  initialAnalysis?: ContractDeepAnalysis | null;
  suggestedTemplate?: any;
}

export default function ContractCreationModal({
  isOpen,
  onClose,
  initialAnalysis,
  suggestedTemplate,
}: ContractCreationModalProps) {
  const [step, setStep] = useState<Step>('initial');
  const [region, setRegion] = useState<string>('España');
  const [idioma, setIdioma] = useState<string>('es');
  const [descripcion, setDescripcion] = useState<string>('');
  const [templateMatch, setTemplateMatch] = useState<TemplateMatch | null>(null);
  const [datosFormulario, setDatosFormulario] = useState<Record<string, any>>({});
  const [contratoGenerado, setContratoGenerado] = useState<{
    id: string;
    contenidoMarkdown: string;
    contenidoHtml: string;
  } | null>(null);

  // Estado para flujo inteligente
  const [useIntelligentFlow, setUseIntelligentFlow] = useState(false);
  const [analysis, setAnalysis] = useState<ContractDeepAnalysis | null>(null);

  // Detectar si debemos usar el flujo inteligente
  useEffect(() => {
    if (isOpen && initialAnalysis && suggestedTemplate) {
      setUseIntelligentFlow(true);
      setAnalysis(initialAnalysis);
      setTemplateMatch({
        templateId: suggestedTemplate.id,
        templateCodigo: suggestedTemplate.codigo,
        templateNombre: suggestedTemplate.titulo,
        categoria: suggestedTemplate.categoria,
        subcategoria: suggestedTemplate.subcategoria,
        camposRequeridos: [],
        similarity: 0.95,
      });
      setStep('intelligent-review');
    }
  }, [isOpen, initialAnalysis, suggestedTemplate]);

  const resetModal = () => {
    setStep('initial');
    setRegion('España');
    setIdioma('es');
    setDescripcion('');
    setTemplateMatch(null);
    setDatosFormulario({});
    setContratoGenerado(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const buscarPlantilla = async () => {
    if (!descripcion.trim()) return;

    setStep('searching');

    try {
      const response = await fetch('/api/contracts/find-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userDescription: descripcion,
          idioma,
          region,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al buscar plantilla');
      }

      const data = await response.json();

      if (!data.template) {
        alert('No se encontró una plantilla apropiada para tu solicitud');
        setStep('initial');
        return;
      }

      setTemplateMatch(data.template);
      setStep('found');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al buscar plantilla');
      setStep('initial');
    }
  };

  const generarContrato = async () => {
    if (!templateMatch) return;

    // Si NO es flujo inteligente, validar campos requeridos
    if (!useIntelligentFlow) {
      const camposVacios = templateMatch.camposRequeridos
        .filter((campo) => campo.requerido && !datosFormulario[campo.nombre])
        .map((campo) => campo.label);

      if (camposVacios.length > 0) {
        alert(`Por favor completa los siguientes campos: ${camposVacios.join(', ')}`);
        return;
      }
    }

    setStep('generating');

    try {
      // Usar API inteligente si hay análisis disponible
      if (useIntelligentFlow && analysis) {
        const response = await fetch('/api/contracts/generate-intelligent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateId: templateMatch.templateId,
            deepAnalysis: analysis,
            language: idioma,
          }),
        });

        if (!response.ok) {
          throw new Error('Error al generar contrato inteligente');
        }

        const data = await response.json();
        setContratoGenerado({
          id: data.contract.id,
          contenidoMarkdown: data.contract.contenido,
          contenidoHtml: '',
        });
        setStep('done');
      } else {
        // Flujo básico original
        const response = await fetch('/api/contracts/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateId: templateMatch.templateId,
            datosCompletados: datosFormulario,
            idioma,
            titulo: `${templateMatch.templateNombre} - ${new Date().toLocaleDateString()}`,
          }),
        });

        if (!response.ok) {
          throw new Error('Error al generar contrato');
        }

        const data = await response.json();
        setContratoGenerado(data);
        setStep('done');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar contrato');
      setStep(useIntelligentFlow ? 'intelligent-review' : 'filling');
    }
  };

  const handleCampoChange = (nombreCampo: string, valor: any) => {
    setDatosFormulario((prev) => ({
      ...prev,
      [nombreCampo]: valor,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {step === 'initial' && 'Crear Nuevo Contrato'}
            {step === 'searching' && 'Buscando Plantilla...'}
            {step === 'found' && 'Plantilla Encontrada'}
            {step === 'filling' && 'Completar Datos'}
            {step === 'generating' && 'Generando Contrato...'}
            {step === 'done' && '¡Contrato Generado!'}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* STEP 1: Initial */}
          {step === 'initial' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Región
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="España">España</option>
                  <option value="Cataluña">Cataluña</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Idioma
                </label>
                <select
                  value={idioma}
                  onChange={(e) => setIdioma(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="es">Español</option>
                  <option value="ca">Catalán</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Describe el contrato que necesitas
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Ej: Necesito un contrato de alquiler de vivienda para una persona física"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px]"
                />
              </div>

              <button
                onClick={buscarPlantilla}
                disabled={!descripcion.trim()}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                Buscar Contrato Apropiado
              </button>
            </div>
          )}

          {/* STEP 2: Searching */}
          {step === 'searching' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-slate-600">
                Buscando la plantilla más apropiada...
              </p>
            </div>
          )}

          {/* STEP 3: Found */}
          {step === 'found' && templateMatch && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FileText className="w-6 h-6 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900 mb-1">
                      {templateMatch.templateNombre}
                    </h3>
                    <p className="text-sm text-green-700 mb-2">
                      {templateMatch.categoria} • {templateMatch.subcategoria}
                    </p>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-600">
                        Similitud: {(templateMatch.similarity * 100).toFixed(1)}%
                      </span>
                      <span className="text-green-600">•</span>
                      <span className="text-green-600">
                        {templateMatch.camposRequeridos.length} campos a completar
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3">
                  Campos que deberás completar:
                </h4>
                <ul className="space-y-2">
                  {templateMatch.camposRequeridos.slice(0, 5).map((campo, i) => (
                    <li
                      key={i}
                      className="flex items-center text-sm text-slate-600"
                    >
                      <ChevronRight className="w-4 h-4 text-primary mr-2" />
                      {campo.label}
                      {campo.requerido && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </li>
                  ))}
                  {templateMatch.camposRequeridos.length > 5 && (
                    <li className="text-sm text-slate-500 italic">
                      ... y {templateMatch.camposRequeridos.length - 5} campos más
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep('initial')}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 px-4 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  Buscar Otro
                </button>
                <button
                  onClick={() => setStep('filling')}
                  className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Continuar con los Datos
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Filling */}
          {step === 'filling' && templateMatch && (
            <div className="space-y-6">
              <p className="text-sm text-slate-600">
                Completa los siguientes campos para generar tu contrato personalizado.
                Los campos marcados con <span className="text-red-500">*</span> son
                obligatorios.
              </p>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {templateMatch.camposRequeridos.map((campo) => (
                  <div key={campo.nombre}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {campo.label}
                      {campo.requerido && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {campo.descripcion && (
                      <p className="text-xs text-slate-500 mb-2">
                        {campo.descripcion}
                      </p>
                    )}
                    {campo.tipo === 'textarea' ? (
                      <textarea
                        value={datosFormulario[campo.nombre] || ''}
                        onChange={(e) =>
                          handleCampoChange(campo.nombre, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        rows={3}
                      />
                    ) : (
                      <input
                        type={campo.tipo}
                        value={datosFormulario[campo.nombre] || ''}
                        onChange={(e) =>
                          handleCampoChange(
                            campo.nombre,
                            campo.tipo === 'number'
                              ? parseFloat(e.target.value)
                              : e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                <button
                  onClick={() => setStep('found')}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 px-4 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={generarContrato}
                  className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Generar Contrato
                </button>
              </div>
            </div>
          )}

          {/* STEP: Intelligent Review (from chat) */}
          {step === 'intelligent-review' && analysis && templateMatch && (
            <div className="space-y-6">
              {/* Header with sparkles */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">
                      Generación Inteligente Activada
                    </h3>
                    <p className="text-sm text-blue-700">
                      He analizado tu conversación y voy a personalizar el contrato con cláusulas
                      específicas para tu situación.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contract Type */}
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Tipo de contrato:</h4>
                <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <p className="font-semibold text-slate-900">{templateMatch.templateNombre}</p>
                  <p className="text-sm text-slate-600">
                    {templateMatch.categoria} • {templateMatch.subcategoria}
                  </p>
                </div>
              </div>

              {/* Extracted Data Summary */}
              {Object.keys(analysis.datosBasicos).length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Datos detectados:</h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                    {Object.entries(analysis.datosBasicos).map(([categoria, campos]) => {
                      if (!campos || Object.keys(campos).length === 0) return null;
                      return (
                        <div key={categoria}>
                          <p className="text-xs font-semibold text-green-900 uppercase tracking-wide mb-1">
                            {categoria}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(campos).slice(0, 5).map(([campo, dato]: [string, any]) => (
                              <span
                                key={campo}
                                className="text-xs bg-white text-green-700 px-2 py-1 rounded border border-green-300"
                              >
                                {campo}: {typeof dato === 'object' && 'valor' in dato ? dato.valor : String(dato)}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Circumstances */}
              {analysis.circunstanciasEspeciales.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">
                    Circunstancias especiales detectadas:
                  </h4>
                  <div className="space-y-2">
                    {analysis.circunstanciasEspeciales.map((circ, idx) => (
                      <div
                        key={idx}
                        className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2"
                      >
                        <span className="text-xl">{circ.tipo === 'mascotas' ? '🐕' : '📝'}</span>
                        <div>
                          <p className="text-sm font-medium text-amber-900 capitalize">
                            {circ.tipo.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-amber-700">{circ.descripcion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Clauses Preview */}
              {analysis.clausulasAdicionales.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">
                    Cláusulas adicionales que se incluirán:
                  </h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {analysis.clausulasAdicionales.map((clausula, idx) => (
                      <div
                        key={idx}
                        className="bg-indigo-50 border border-indigo-200 rounded-lg p-3"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-indigo-900">
                            {clausula.nombre}
                          </p>
                          {clausula.importancia === 'alta' && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                              Alta prioridad
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-indigo-700">{clausula.razon}</p>
                        {clausula.impactoEconomico && (
                          <p className="text-xs text-indigo-600 mt-1 font-medium">
                            {clausula.impactoEconomico}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analysis Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Datos completos</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {analysis.resumenAnalisis.datosCompletos}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Complejidad</p>
                    <p className="text-lg font-semibold text-slate-900 capitalize">
                      {analysis.resumenAnalisis.complejidad}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Cláusulas extra</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {analysis.clausulasAdicionales.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={handleClose}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 px-4 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={generarContrato}
                  className="flex-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generar Contrato Personalizado</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Generating */}
          {step === 'generating' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-slate-600 mb-2">Generando tu contrato...</p>
              <p className="text-sm text-slate-500">
                Esto puede tardar unos segundos
              </p>
            </div>
          )}

          {/* STEP 6: Done */}
          {step === 'done' && contratoGenerado && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">
                      ¡Contrato generado exitosamente!
                    </h3>
                    <p className="text-sm text-green-700">
                      Tu contrato ha sido creado y guardado en la base de datos.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-2">
                  Preview del contrato:
                </h4>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
                    {contratoGenerado.contenidoMarkdown.substring(0, 1000)}
                    {contratoGenerado.contenidoMarkdown.length > 1000 && '\n\n...'}
                  </pre>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {contratoGenerado.contenidoMarkdown.length} caracteres generados
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 px-4 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    // TODO: Implementar descarga PDF
                    alert('Funcionalidad de descarga en desarrollo');
                  }}
                  className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Descargar PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
