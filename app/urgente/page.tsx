import Navigation from '@/components/Navigation';
import UrgentHero from '@/components/sections/urgent/UrgentHero';
import UrgentProblem from '@/components/sections/urgent/UrgentProblem';
import UrgentValueProp from '@/components/sections/urgent/UrgentValueProp';
import UrgentHowItWorks from '@/components/sections/urgent/UrgentHowItWorks';
import UrgentUseCases from '@/components/sections/urgent/UrgentUseCases';
import UrgentSocialProof from '@/components/sections/urgent/UrgentSocialProof';
import UrgentObjections from '@/components/sections/urgent/UrgentObjections';
import UrgentPricing from '@/components/sections/urgent/UrgentPricing';
import UrgentFinalCTA from '@/components/sections/urgent/UrgentFinalCTA';
import Footer from '@/components/sections/Footer';

export const metadata = {
  title: 'Generador Contratos Inmobiliarios | 30 Segundos | Lexy IA',
  description: '¿Necesitas un contrato YA? Genera contratos inmobiliarios legales en 30 segundos. IA validada por 250+ abogados. Firma digital integrada. Acceso inmediato.',
  keywords: 'generar contratos inmobiliarios rápido, crear contrato legal inmobiliario online, contratos automáticos inmobiliarios',
};

export default function UrgentePage() {
  return (
    <>
      <Navigation />
      <main className="bg-white">
        <UrgentHero />
        <UrgentProblem />
        <UrgentValueProp />
        <UrgentHowItWorks />
        <UrgentUseCases />
        <UrgentSocialProof />
        <UrgentObjections />
        <UrgentPricing />
        <UrgentFinalCTA />
      </main>
      <Footer />
    </>
  );
}
