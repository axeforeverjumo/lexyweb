'use client';

import { useState } from 'react';
import { X, Check, Edit2, FileText, AlertCircle, Sparkles } from 'lucide-react';

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
  completitud: number; // 0-100
}

interface ContractDataSidebarProps {
  contractData: ContractData;
  onUpdateField: (section: string, field: string, value: string) => void;
  onGenerateContract: () => void;
  onClose: () => void;
  isGenerating?: boolean;
  onToggleConsultMode?: (enabled: boolean) => void;
  isConsultMode?: boolean;
}

export default function ContractDataSidebar({
  contractData,
  onUpdateField,
  onGenerateContract,
  onClose,
  isGenerating = false,
  onToggleConsultMode,
  isConsultMode = false,
}: ContractDataSidebarProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = (section: string, field: string, currentValue: string) => {
    setEditingField(`${section}.${field}`);
    setEditValue(currentValue);
  };

  const handleSaveEdit = (section: string, field: string) => {
    onUpdateField(section, field, editValue);
    setEditingField(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const renderField = (section: string, fieldName: string, fieldData: DatoCampo) => {
    const fieldKey = `${section}.${fieldName}`;
    const isEditing = editingField === fieldKey;

    return (
      <div key={fieldKey} className="mb-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <label className="text-xs font-medium text-slate-600 capitalize">
            {fieldName.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          {fieldData?.confianza !== undefined && fieldData.confianza < 0.7 && (
            <AlertCircle className="w-3 h-3 text-amber-500" />
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleSaveEdit(section, fieldName)}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
              >
                <Check className="w-3 h-3 inline mr-1" />
                Guardar
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                <X className="w-3 h-3 inline mr-1" />
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => handleStartEdit(section, fieldName, fieldData?.valor || '')}
            className="group flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <span className="text-sm text-slate-900 flex-1">
              {fieldData?.valor || <span className="text-slate-400 italic">No especificado</span>}
            </span>
            <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        {fieldData?.contexto && (
          <p className="text-xs text-slate-500 mt-1 italic">
            {fieldData.contexto}
          </p>
        )}
      </div>
    );
  };

  const renderSection = (sectionName: string, sectionData: Record<string, DatoCampo> | undefined, icon: React.ReactNode) => {
    if (!sectionData || Object.keys(sectionData).length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
          {icon}
          <h3 className="text-sm font-semibold text-slate-900 capitalize">
            {sectionName}
          </h3>
        </div>
        <div className="space-y-3">
          {Object.entries(sectionData).map(([fieldName, fieldData]) =>
            renderField(sectionName, fieldName, fieldData)
          )}
        </div>
      </div>
    );
  };

  const completitudColor =
    contractData.completitud >= 80
      ? 'bg-green-500'
      : contractData.completitud >= 50
      ? 'bg-amber-500'
      : 'bg-red-500';

  // Siempre se puede generar contrato, incluso con campos vacíos (usará placeholders)
  const canGenerate = true;

  return (
    <div className="w-96 h-full bg-white border-l border-slate-200 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-primary-50 to-blue-50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Datos del Contrato
            </h2>
            <p className="text-sm text-slate-600">
              {contractData.tipoContrato}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Completitud</span>
            <span className="font-bold text-slate-900">{contractData.completitud}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${completitudColor} transition-all duration-500`}
              style={{ width: `${contractData.completitud}%` }}
            />
          </div>
        </div>
      </div>

      {/* Data Sections */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {renderSection(
          'arrendador',
          contractData.datosBasicos.arrendador,
          <FileText className="w-4 h-4 text-primary-600" />
        )}
        {renderSection(
          'arrendatario',
          contractData.datosBasicos.arrendatario,
          <FileText className="w-4 h-4 text-blue-600" />
        )}
        {renderSection(
          'inmueble',
          contractData.datosBasicos.inmueble,
          <FileText className="w-4 h-4 text-green-600" />
        )}
        {renderSection(
          'economicos',
          contractData.datosBasicos.economicos,
          <FileText className="w-4 h-4 text-amber-600" />
        )}
        {renderSection(
          'temporales',
          contractData.datosBasicos.temporales,
          <FileText className="w-4 h-4 text-purple-600" />
        )}

        {/* Circunstancias Especiales */}
        {contractData.circunstanciasEspeciales && contractData.circunstanciasEspeciales.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-900">
                Circunstancias Especiales
              </h3>
            </div>
            <div className="space-y-2">
              {contractData.circunstanciasEspeciales.map((circ, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <p className="text-xs font-semibold text-amber-900 mb-1 capitalize">
                    {circ.tipo}
                  </p>
                  <p className="text-xs text-amber-700">{circ.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer - Consultation Mode Toggle */}
      <div className="px-6 py-3 border-t border-slate-200 bg-blue-50">
        <button
          onClick={() => onToggleConsultMode?.(!isConsultMode)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isConsultMode
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {isConsultMode ? '✓ Consultando con Lexy' : 'Consultar con Lexy'}
        </button>
        {isConsultMode && (
          <p className="text-xs text-blue-700 mt-2 text-center">
            Pregunta a Lexy sobre cualquier campo del contrato
          </p>
        )}
      </div>

      {/* Footer - Generate Button */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
        {isGenerating && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  ✨ Lexy está redactando tu contrato profesional
                </p>
                <p className="text-xs text-blue-700">
                  Esto puede tomar 30-60 segundos. Estamos generando un documento completo con cláusulas legales personalizadas, referencias al Código Civil y LAU.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onGenerateContract}
          disabled={!canGenerate || isGenerating}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
            canGenerate && !isGenerating
              ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:from-primary-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generar Contrato Personalizado
            </>
          )}
        </button>

        {!isGenerating && (
          <p className="text-xs text-slate-500 text-center mt-2">
            {contractData.completitud < 100
              ? 'Los campos vacíos se completarán con placeholders como [NOMBRE], [DNI], etc.'
              : 'Lexy personalizará el contrato con las circunstancias especiales detectadas'
            }
          </p>
        )}
      </div>
    </div>
  );
}
