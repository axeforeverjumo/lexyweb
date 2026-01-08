import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Column 1 - Logo + Tagline */}
          <div>
            <div className="text-2xl font-bold text-white mb-4">
              LEXY
            </div>
            <p className="text-sm mb-6 leading-relaxed">
              Tu asistente legal inmobiliario con IA verificada por abogados.
            </p>
            <p className="text-xs text-gray-500">
              © 2026 LEXY Plus
              <br />
              Todos los derechos reservados
            </p>
          </div>

          {/* Column 2 - Producto */}
          <div>
            <h3 className="text-white font-semibold mb-4">Producto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#como-funciona" className="hover:text-primary-400 transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="#precios" className="hover:text-primary-400 transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/plantillas" className="hover:text-primary-400 transition-colors">
                  Plantillas
                </Link>
              </li>
              <li>
                <Link href="/firmas" className="hover:text-primary-400 transition-colors">
                  Firmas digitales
                </Link>
              </li>
              <li>
                <Link href="/casos-uso" className="hover:text-primary-400 transition-colors">
                  Casos de uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Recursos */}
          <div>
            <h3 className="text-white font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/ayuda" className="hover:text-primary-400 transition-colors">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="hover:text-primary-400 transition-colors">
                  API Docs
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-primary-400 transition-colors">
                  Estado del servicio
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-primary-400 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terminos" className="hover:text-primary-400 transition-colors">
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-primary-400 transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-primary-400 transition-colors">
                  Política de cookies
                </Link>
              </li>
              <li>
                <Link href="/aviso-legal" className="hover:text-primary-400 transition-colors">
                  Aviso legal
                </Link>
              </li>
              <li>
                <Link href="/rgpd" className="hover:text-primary-400 transition-colors">
                  RGPD
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex space-x-6">
              <a href="https://linkedin.com" className="hover:text-primary-400 transition-colors" aria-label="LinkedIn">
                LinkedIn
              </a>
              <a href="https://twitter.com" className="hover:text-primary-400 transition-colors" aria-label="Twitter">
                Twitter
              </a>
              <a href="https://youtube.com" className="hover:text-primary-400 transition-colors" aria-label="YouTube">
                YouTube
              </a>
              <a href="mailto:hola@lexy.plus" className="hover:text-primary-400 transition-colors">
                Email
              </a>
            </div>

            {/* Credits */}
            <p className="text-xs text-gray-500">
              Hecho con ❤️ en Barcelona · Powered by Anthropic Claude & Google Gemini
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
