import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "LEXY - Tu Asistente Legal Inmobiliario con IA",
  description: "De conversación a contrato firmado en 3 pasos. IA legal especializada para agentes inmobiliarios. Genera contratos profesionales en 30 segundos.",
  keywords: "contratos inmobiliarios, IA legal, asistente legal, agentes inmobiliarios, firmas digitales",
  authors: [{ name: "LEXY Plus" }],
  openGraph: {
    title: "LEXY - Tu Asistente Legal Inmobiliario con IA",
    description: "De conversación a contrato firmado en 3 pasos",
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
    <html lang="es" className={manrope.variable}>
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
