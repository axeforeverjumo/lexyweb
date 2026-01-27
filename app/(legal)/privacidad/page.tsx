import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Lexy',
  description: 'Política de privacidad y protección de datos de Lexy',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-8">Política de Privacidad</h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Información que Recopilamos</h2>
              <p className="text-gray-300 mb-4">
                En Lexy, recopilamos la siguiente información:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Nombre completo y dirección de email (para crear tu cuenta)</li>
                <li>Datos de los contratos que generas (para proporcionar el servicio)</li>
                <li>Información de uso y análisis (para mejorar la plataforma)</li>
                <li>Datos de facturación (cuando realizas una suscripción)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Cómo Usamos tu Información</h2>
              <p className="text-gray-300 mb-4">
                Utilizamos tu información para:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Proporcionar y mantener nuestro servicio</li>
                <li>Procesar tus solicitudes de generación de contratos</li>
                <li>Mejorar y personalizar tu experiencia</li>
                <li>Comunicarnos contigo sobre actualizaciones y cambios</li>
                <li>Procesar pagos y suscripciones</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Protección de Datos</h2>
              <p className="text-gray-300 mb-4">
                Implementamos medidas de seguridad para proteger tu información:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Encriptación de datos en tránsito y en reposo</li>
                <li>Acceso restringido a información personal</li>
                <li>Auditorías de seguridad periódicas</li>
                <li>Cumplimiento con RGPD y otras regulaciones de privacidad</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Compartir Información</h2>
              <p className="text-gray-300 mb-4">
                No vendemos ni alquilamos tu información personal. Solo compartimos datos con:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Proveedores de servicios necesarios para operar la plataforma</li>
                <li>Procesadores de pagos (Stripe) para gestionar suscripciones</li>
                <li>Autoridades legales cuando sea requerido por ley</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Tus Derechos</h2>
              <p className="text-gray-300 mb-4">
                Tienes derecho a:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Acceder a tu información personal</li>
                <li>Corregir datos inexactos</li>
                <li>Solicitar la eliminación de tu cuenta y datos</li>
                <li>Exportar tus datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies y Tecnologías de Seguimiento</h2>
              <p className="text-gray-300 mb-4">
                Utilizamos cookies esenciales para el funcionamiento de la plataforma y cookies de análisis
                para mejorar nuestro servicio. Puedes gestionar tus preferencias de cookies en tu navegador.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Retención de Datos</h2>
              <p className="text-gray-300 mb-4">
                Conservamos tu información mientras tu cuenta esté activa o según sea necesario para
                proporcionar el servicio. Puedes solicitar la eliminación de tu cuenta en cualquier momento.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Cambios a esta Política</h2>
              <p className="text-gray-300 mb-4">
                Nos reservamos el derecho de actualizar esta política de privacidad. Te notificaremos
                sobre cambios significativos por email o mediante un aviso en la plataforma.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">9. Contacto</h2>
              <p className="text-gray-300 mb-4">
                Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tu información,
                contáctanos en:
              </p>
              <p className="text-emerald-400">
                <a href="mailto:privacy@lexy.plus" className="hover:text-emerald-300 transition-colors">
                  privacy@lexy.plus
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
