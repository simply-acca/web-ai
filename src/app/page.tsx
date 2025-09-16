import Hero from '@/components/marketing/Hero'
import FeatureTiles from '@/components/marketing/FeatureTiles'
import CompetitorBar from '@/components/marketing/CompetitorBar'
import CTA from '@/components/marketing/CTA'

export default function Page() {
  return (
    <main className="space-y-24">
      <Hero />
      <FeatureTiles />
      <CompetitorBar />
      <CTA />
    </main>
  )
}