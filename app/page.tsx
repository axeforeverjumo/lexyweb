import Navigation from '@/components/Navigation';
import Hero from '@/components/sections/Hero';
import SocialProof from '@/components/sections/SocialProof';
import ValueProposition from '@/components/sections/ValueProposition';
import HowItWorks from '@/components/sections/HowItWorks';
import TrustBadges from '@/components/sections/TrustBadges';
import UrgentCTA from '@/components/sections/UrgentCTA';
import Pricing from '@/components/sections/Pricing';
import FAQ from '@/components/sections/FAQ';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <SocialProof />
        <ValueProposition />
        <HowItWorks />
        <TrustBadges />
        <UrgentCTA />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
