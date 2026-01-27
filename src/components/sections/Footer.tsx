import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-12 px-6 relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Main Footer - Apple minimalist */}
        <div className="grid md:grid-cols-5 gap-8 mb-8">

          {/* Column 1 - Producto */}
          <div>
            <h3 className="text-white text-xs font-semibold mb-3">Producto</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#como-funciona" className="hover:text-white transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="#precios" className="hover:text-white transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - Recursos */}
          <div>
            <h3 className="text-white text-xs font-semibold mb-3">Recursos</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/ayuda" className="hover:text-white transition-colors">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Legal */}
          <div>
            <h3 className="text-white text-xs font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/terminos" className="hover:text-white transition-colors">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-white transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Social */}
          <div>
            <h3 className="text-white text-xs font-semibold mb-3">Síguenos</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://linkedin.com" className="hover:text-white transition-colors" aria-label="LinkedIn">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://twitter.com" className="hover:text-white transition-colors" aria-label="Twitter">
                  Twitter
                </a>
              </li>
              <li>
                <a href="mailto:hola@lexy.plus" className="hover:text-white transition-colors">
                  Email
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5 - Logo */}
          <div>
            <div className="text-xl font-bold text-white mb-2">
              LEXY
            </div>
            <p className="text-xs leading-relaxed">
              Asistente legal inmobiliario con IA
            </p>
          </div>

        </div>

        {/* Bottom Bar - Ultra minimalist */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 space-y-2 md:space-y-0">
            <p>© 2026 LEXY Plus. Todos los derechos reservados.</p>
            <p>Hecho en Barcelona</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
