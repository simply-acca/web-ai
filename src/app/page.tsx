import Hero from '@/components/marketing/Hero'
import FeatureTiles from '@/components/marketing/FeatureTiles'
import CompetitorBar from '@/components/marketing/CompetitorBar'
import CTA from '@/components/marketing/CTA'
import SupportedPapers from '@/components/marketing/SupportedPapers';
import WhyUs from '@/components/marketing/WhyUs';

export default function Page() {
  return (
    <main className="space-y-24">
      <Hero />                 {/* renders with its own background */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <WhyUs />
        <CTA />
      </section>
      <FeatureTiles />         {/* renders with its own background */}
      <SupportedPapers />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CompetitorBar />
      </section>
      
    </main>
  );
}