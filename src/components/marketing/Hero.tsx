import JourneyTrack from '@/components/marketing/JourneyTrack'

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 to-white p-8 dark:from-emerald-950/20 dark:to-gray-950">
      <div className="mx-auto max-w-5xl py-16">
        <p className="text-sm uppercase tracking-wider text-brand-600">Learn ACCA with AI</p>
        <h1 className="mt-2 text-4xl font-black leading-tight md:text-6xl">Your pace. Your plan. Your pass.</h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">Pass ACCA faster with AI‑powered study plans, adaptive notes & exam‑style practice. Trusted by 1,000+ students.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/pricing" className="rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-500">Start your plan</a>
          <a href="/papers" className="rounded-xl border px-5 py-3 hover:border-brand-400">Explore papers</a>
        </div>
        <div className="pointer-events-none mt-10 select-none">
          <JourneyTrack className="-mx-4" />
        </div>
      </div>
    </div>
  )
}