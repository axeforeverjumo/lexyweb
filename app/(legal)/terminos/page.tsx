import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Lexy',
  description: 'Términos y condiciones de uso de la plataforma Lexy',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-8">Términos y Condiciones</h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Aceptación de los Términos</h2>
              <p className="text-gray-300 mb-4">
                Al acceder y utilizar Lexy, aceptas estar sujeto a estos términos y condiciones.
                Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Descripción del Servicio</h2>
              <p className="text-gray-300 mb-4">
                Lexy es una plataforma de generación de contratos legales mediante inteligencia artificial.
                El servicio proporciona:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Generación automatizada de documentos contractuales</li>
                <li>Plantillas de contratos personalizables</li>
                <li>Almacenamiento seguro de contratos</li>
                <li>Herramientas de gestión documental</li>
                <li>Asistencia mediante IA para redacción legal</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Responsabilidad Legal</h2>
              <p className="text-gray-300 mb-4">
                IMPORTANTE: Los contratos generados por Lexy son asistidos por IA y deben ser revisados
                por un profesional legal antes de su uso. Lexy proporciona herramientas de generación
                de documentos, pero no sustituye el asesoramiento legal profesional.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>No somos un despacho de abogados ni proporcionamos asesoría legal</li>
                <li>Los documentos generados son plantillas que deben ser revisadas</li>
                <li>El usuario es responsable de la validez legal de los contratos utilizados</li>
                <li>Recomendamos consultar con un abogado antes de firmar cualquier contrato</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Uso Aceptable</h2>
              <p className="text-gray-300 mb-4">
                Al utilizar Lexy, te comprometes a:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Proporcionar información veraz y actualizada</li>
                <li>No utilizar el servicio para fines ilegales o fraudulentos</li>
                <li>No intentar acceder a áreas restringidas del sistema</li>
                <li>No compartir tu cuenta con terceros</li>
                <li>Cumplir con todas las leyes aplicables</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Suscripciones y Pagos</h2>
              <p className="text-gray-300 mb-4">
                Ofrecemos diferentes planes de suscripción:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Periodo de prueba gratuito de 14 días (sin tarjeta de crédito)</li>
                <li>Suscripciones mensuales o anuales</li>
                <li>Pagos procesados de forma segura a través de Stripe</li>
                <li>Puedes cancelar tu suscripción en cualquier momento</li>
                <li>No hay reembolsos por periodos ya pagados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Propiedad Intelectual</h2>
              <p className="text-gray-300 mb-4">
                Los contratos que generes son de tu propiedad. Sin embargo:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Lexy mantiene los derechos sobre el software y las plantillas base</li>
                <li>Puedes usar, modificar y compartir los contratos que generes</li>
                <li>No puedes revender o redistribuir las plantillas de Lexy</li>
                <li>El contenido generado por IA puede no ser protegible por derechos de autor</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Limitación de Responsabilidad</h2>
              <p className="text-gray-300 mb-4">
                Lexy no será responsable de:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Daños derivados del uso o imposibilidad de uso del servicio</li>
                <li>Errores o imprecisiones en los documentos generados</li>
                <li>Problemas legales derivados del uso de contratos sin revisión profesional</li>
                <li>Pérdida de datos debido a problemas técnicos</li>
                <li>Interrupciones del servicio por mantenimiento o causas de fuerza mayor</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Disponibilidad del Servicio</h2>
              <p className="text-gray-300 mb-4">
                Nos esforzamos por mantener el servicio disponible 24/7, pero:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Puede haber interrupciones por mantenimiento programado</li>
                <li>No garantizamos disponibilidad ininterrumpida</li>
                <li>Podemos modificar o discontinuar funcionalidades con previo aviso</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">9. Terminación</h2>
              <p className="text-gray-300 mb-4">
                Nos reservamos el derecho de:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Suspender o terminar tu cuenta por violación de estos términos</li>
                <li>Modificar o discontinuar el servicio con previo aviso</li>
                <li>Eliminar contenido que viole nuestras políticas</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Puedes cancelar tu cuenta en cualquier momento desde el panel de configuración.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">10. Modificaciones</h2>
              <p className="text-gray-300 mb-4">
                Podemos actualizar estos términos ocasionalmente. Te notificaremos sobre cambios
                significativos por email o mediante un aviso en la plataforma. El uso continuado
                del servicio después de los cambios constituye tu aceptación de los nuevos términos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">11. Jurisdicción</h2>
              <p className="text-gray-300 mb-4">
                Estos términos se rigen por las leyes de España. Cualquier disputa será resuelta
                en los tribunales competentes de Barcelona, España.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">12. Contacto</h2>
              <p className="text-gray-300 mb-4">
                Si tienes preguntas sobre estos términos y condiciones, contáctanos en:
              </p>
              <p className="text-emerald-400">
                <a href="mailto:legal@lexy.plus" className="hover:text-emerald-300 transition-colors">
                  legal@lexy.plus
                </a>
              </p>
            </section>

            <div className="mt-12 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <p className="text-emerald-400 font-medium mb-2">
                Aviso Legal Importante
              </p>
              <p className="text-gray-300 text-sm">
                Lexy es una herramienta de asistencia para la generación de documentos legales, no un
                servicio de asesoramiento legal. Siempre recomendamos que consultes con un abogado
                calificado antes de utilizar cualquier documento legal en situaciones reales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
