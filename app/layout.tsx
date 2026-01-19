import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Generador Contratos Inmobiliarios | 30 Segundos | Lexy IA",
  description: "¿Necesitas un contrato YA? Genera contratos inmobiliarios legales en 30 segundos. IA validada por 250+ abogados. Firma digital integrada. Acceso inmediato.",
  keywords: "generar contratos inmobiliarios rápido, crear contrato legal inmobiliario online, contratos automáticos inmobiliarios, contratos inmobiliarios, IA legal, asistente legal, agentes inmobiliarios, firmas digitales",
  authors: [{ name: "LEXY Plus" }],
  openGraph: {
    title: "Generador Contratos Inmobiliarios | 30 Segundos | Lexy IA",
    description: "Genera contratos inmobiliarios legales en 30 segundos. De conversación a contrato firmado en 4 pasos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LEXY',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '65',
      priceCurrency: 'EUR',
    },
    description: 'IA legal especializada para agentes inmobiliarios',
  };

  return (
    <html lang="es" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
