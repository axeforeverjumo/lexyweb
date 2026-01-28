'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Users,
  MessageSquare,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface ContractFormWizardProps {
  userId: string;
}

type WizardStep = 'type' | 'parties' | 'context' | 'generating';

interface ContractType {
  categoria: string;
  subcategoria: string;
  descripcion: string;
}

const CONTRACT_TYPES: ContractType[] = [
  // ENCARGOS Y GESTIÓN
  {
    categoria: 'Encargo',
    subcategoria: 'Venta sin exclusiva',
    descripcion: 'Mandato para vender inmueble sin exclusividad',
  },
  {
    categoria: 'Encargo',
    subcategoria: 'Venta con exclusiva',
    descripcion: 'Mandato exclusivo para vender inmueble',
  },
  {
    categoria: 'Encargo',
    subcategoria: 'Alquiler',
    descripcion: 'Mandato para gestionar alquiler de inmueble',
  },
  {
    categoria: 'Administración',
    subcategoria: 'Vertical',
    descripcion: 'Gestión integral de propiedades inmobiliarias',
  },

  // ARRENDAMIENTOS
  {
    categoria: 'Arrendamiento',
    subcategoria: 'Vivienda',
    descripcion: 'Alquiler de vivienda habitual (LAU)',
  },
  {
    categoria: 'Arrendamiento',
    subcategoria: 'Local Comercial',
    descripcion: 'Alquiler de local para actividad comercial',
  },
  {
    categoria: 'Arrendamiento',
    subcategoria: 'Temporada',
    descripcion: 'Alquiler de corta duración (estudiantes, temporeros)',
  },
  {
    categoria: 'Arrendamiento',
    subcategoria: 'Turístico',
    descripcion: 'Alquiler vacacional (LAU o Código Civil)',
  },
  {
    categoria: 'Arrendamiento',
    subcategoria: 'Finca Rústica',
    descripcion: 'Alquiler de terreno agrícola o finca rústica',
  },
  {
    categoria: 'Arrendamiento',
    subcategoria: 'Con Opción de Compra',
    descripcion: 'Alquiler con derecho preferente de compra',
  },
  {
    categoria: 'Cesión',
    subcategoria: 'Negocio',
    descripcion: 'Traspaso de local comercial con negocio activo',
  },
  {
    categoria: 'Renuncia',
    subcategoria: 'Arrendamiento',
    descripcion: 'Terminación anticipada de contrato de alquiler',
  },

  // COMPRAVENTA Y ARRAS
  {
    categoria: 'Arras',
    subcategoria: 'Penitenciales',
    descripcion: 'Señal con derecho a desistir',
  },
  {
    categoria: 'Arras',
    subcategoria: 'Confirmatorias',
    descripcion: 'Señal sin derecho a desistir',
  },
  {
    categoria: 'Arras',
    subcategoria: 'Penales',
    descripcion: 'Señal con penalización por incumplimiento',
  },
  {
    categoria: 'Oferta',
    subcategoria: 'Compra',
    descripcion: 'Propuesta formal de adquisición de inmueble',
  },

  // SERVICIOS INMOBILIARIOS
  {
    categoria: 'PSI',
    subcategoria: 'Compra',
    descripcion: 'Personal Shopper Inmobiliario para compra',
  },
  {
    categoria: 'PSI',
    subcategoria: 'Alquiler',
    descripcion: 'Personal Shopper Inmobiliario para alquiler',
  },
  {
    categoria: 'Hoja',
    subcategoria: 'Visita',
    descripcion: 'Registro de visita con/sin comisión comprador',
  },
  {
    categoria: 'Acuerdo',
    subcategoria: 'Colaboración Agencias',
    descripcion: 'Cooperación entre agencias inmobiliarias',
  },

  // DOCUMENTACIÓN LEGAL
  {
    categoria: 'LOI',
    subcategoria: 'Letter of Intent',
    descripcion: 'Carta de intenciones de compra',
  },
  {
    categoria: 'Confidencialidad',
    subcategoria: 'NDA',
    descripcion: 'Acuerdo de no divulgación de información',
  },
  {
    categoria: 'KYC',
    subcategoria: 'Blanqueo Capitales',
    descripcion: 'Identificación de cliente y origen de fondos',
  },
  {
    categoria: 'Información',
    subcategoria: 'Mínima',
    descripcion: 'Información obligatoria compra o alquiler',
  },

  // OTROS
  {
    categoria: 'Cesión',
    subcategoria: 'Derechos Imagen',
    descripcion: 'Autorización uso comercial de imágenes',
  },
  {
    categoria: 'Préstamo',
    subcategoria: 'Entre Particulares',
    descripcion: 'Contrato de mutuo dinerario entre personas',
  },
  {
    categoria: 'Autorización',
    subcategoria: 'Cambio Suministros',
    descripcion: 'Cambio de titular agua, luz, gas',
  },
  {
    categoria: 'Compraventa',
    subcategoria: 'Bienes Muebles',
    descripcion: 'Compra/venta de muebles (no inmuebles)',
  },
];

/**
 * Wizard de formulario guiado para crear contratos paso a paso
 */
export default function ContractFormWizard({ userId }: ContractFormWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>('type');

  // Step 1: Contract Type
  const [selectedType, setSelectedType] = useState<ContractType | null>(null);

  // Step 2: Parties
  const [numParties, setNumParties] = useState<number>(2);
  const [partyNames, setPartyNames] = useState<string[]>(['', '']);

  // Step 3: Context
  const [context, setContext] = useState<string>('');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContractId, setGeneratedContractId] = useState<string | null>(null);

  const handleTypeSelect = (type: ContractType) => {
    setSelectedType(type);
  };

  const handlePartiesChange = (num: number) => {
    setNumParties(num);
    const newPartyNames = Array(num).fill('');
    // Keep existing names
    for (let i = 0; i < Math.min(num, partyNames.length); i++) {
      newPartyNames[i] = partyNames[i];
    }
    setPartyNames(newPartyNames);
  };

  const handlePartyNameChange = (index: number, name: string) => {
    const newNames = [...partyNames];
    newNames[index] = name;
    setPartyNames(newNames);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCurrentStep('generating');

    try {
      // Build the query for finding template
      const query = `${selectedType?.categoria} ${selectedType?.subcategoria}`;

      // Find template
      const templateResponse = await fetch('/api/contracts/find-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!templateResponse.ok) {
        throw new Error('Error finding template');
      }

      const { template } = await templateResponse.json();

      if (!template) {
        throw new Error('No template found for this contract type');
      }

      // Build context from form data
      const fullContext = `
Tipo de contrato: ${selectedType?.categoria} - ${selectedType?.subcategoria}

Partes involucradas:
${partyNames.map((name, i) => `${i + 1}. ${name || `Parte ${i + 1}`}`).join('\n')}

Contexto adicional:
${context || 'No se proporcionó contexto adicional.'}
      `.trim();

      // Generate contract
      const generateResponse = await fetch('/api/contracts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          userInput: fullContext,
          language: 'es',
        }),
      });

      if (!generateResponse.ok) {
        throw new Error('Error generating contract');
      }

      const { contract } = await generateResponse.json();

      setGeneratedContractId(contract.id);

      // Redirect to contract detail after a short delay
      setTimeout(() => {
        router.push(`/contratos/${contract.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error generating contract:', error);
      alert('Error al generar el contrato. Por favor, inténtalo de nuevo.');
      setCurrentStep('context');
      setIsGenerating(false);
    }
  };

  const canContinueFromType = selectedType !== null;
  const canContinueFromParties = partyNames.every((name) => name.trim() !== '');
  const canContinueFromContext = context.trim().length >= 20;

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-2 ${
              currentStep === 'type' ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'type'
                  ? 'bg-blue-600 text-white'
                  : currentStep === 'parties' || currentStep === 'context' || currentStep === 'generating'
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {currentStep !== 'type' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <span className="font-semibold">1</span>
              )}
            </div>
            <span className="font-medium text-sm">Tipo</span>
          </div>

          <div className="flex-1 h-0.5 bg-slate-200 mx-2"></div>

          <div
            className={`flex items-center gap-2 ${
              currentStep === 'parties' ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'parties'
                  ? 'bg-blue-600 text-white'
                  : currentStep === 'context' || currentStep === 'generating'
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {currentStep === 'context' || currentStep === 'generating' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <span className="font-semibold">2</span>
              )}
            </div>
            <span className="font-medium text-sm">Firmantes</span>
          </div>

          <div className="flex-1 h-0.5 bg-slate-200 mx-2"></div>

          <div
            className={`flex items-center gap-2 ${
              currentStep === 'context' ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'context'
                  ? 'bg-blue-600 text-white'
                  : currentStep === 'generating'
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {currentStep === 'generating' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <span className="font-semibold">3</span>
              )}
            </div>
            <span className="font-medium text-sm">Contexto</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm min-h-[400px]">
        {/* STEP 1: Contract Type */}
        {currentStep === 'type' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Tipo de Contrato
              </h2>
              <p className="text-slate-600">
                Selecciona el tipo de contrato que necesitas crear
              </p>
            </div>

            {/* Organized by categories */}
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              {/* Group by category */}
              {Object.entries(
                CONTRACT_TYPES.reduce((acc, type) => {
                  const key = type.categoria;
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(type);
                  return acc;
                }, {} as Record<string, ContractType[]>)
              ).map(([categoria, types]) => (
                <div key={categoria}>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 px-1">
                    {categoria}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {types.map((type, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTypeSelect(type)}
                        className={`text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                          selectedType?.categoria === type.categoria &&
                          selectedType?.subcategoria === type.subcategoria
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <h4 className="font-semibold text-slate-900 text-sm mb-1">
                          {type.subcategoria}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {type.descripcion}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Parties */}
        {currentStep === 'parties' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Partes Firmantes
              </h2>
              <p className="text-slate-600">
                Indica cuántas personas firmarán el contrato y sus nombres
              </p>
            </div>

            {/* Number of parties */}
            <div className="max-w-md mx-auto mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ¿Cuántas partes firmarán?
              </label>
              <select
                value={numParties}
                onChange={(e) => handlePartiesChange(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={2}>2 partes</option>
                <option value={3}>3 partes</option>
                <option value={4}>4 partes</option>
                <option value={5}>5 partes</option>
              </select>
            </div>

            {/* Party names */}
            <div className="space-y-4 max-w-2xl mx-auto">
              {partyNames.map((name, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre completo - Parte {idx + 1}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handlePartyNameChange(idx, e.target.value)}
                    placeholder={`Ej: Juan Pérez García`}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Context */}
        {currentStep === 'context' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Contexto del Contrato
              </h2>
              <p className="text-slate-600">
                Proporciona información adicional sobre el contrato
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Describe la situación (mínimo 20 caracteres)
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={12}
                placeholder="Ejemplo:&#10;&#10;El inmueble está ubicado en Calle Mayor 123, Madrid, 28013.&#10;La renta mensual acordada es de 1.200€.&#10;La duración del contrato será de 12 meses.&#10;Se entregará una fianza de 1 mes.&#10;El inquilino tiene una mascota (perro pequeño).&#10;&#10;Incluye todos los detalles relevantes: dirección, importes, plazos, circunstancias especiales, etc."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <p className="mt-2 text-sm text-slate-500">
                Caracteres: {context.length} / 20 mínimo
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: Generating */}
        {currentStep === 'generating' && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Generando tu contrato...
            </h2>
            <p className="text-slate-600 text-center max-w-md">
              Estamos analizando la información y creando un contrato personalizado
              según tus necesidades.
            </p>
            {generatedContractId && (
              <p className="mt-4 text-sm text-green-600">
                ✓ Contrato generado exitosamente. Redirigiendo...
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {currentStep !== 'generating' && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (currentStep === 'parties') setCurrentStep('type');
              else if (currentStep === 'context') setCurrentStep('parties');
              else router.back();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Atrás</span>
          </button>

          <button
            onClick={() => {
              if (currentStep === 'type' && canContinueFromType) setCurrentStep('parties');
              else if (currentStep === 'parties' && canContinueFromParties)
                setCurrentStep('context');
              else if (currentStep === 'context' && canContinueFromContext)
                handleGenerate();
            }}
            disabled={
              (currentStep === 'type' && !canContinueFromType) ||
              (currentStep === 'parties' && !canContinueFromParties) ||
              (currentStep === 'context' && !canContinueFromContext)
            }
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            <span>{currentStep === 'context' ? 'Generar Contrato' : 'Continuar'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
