import BackgroundGlow from '@/components/marketing/BackgroundGlow';
import JourneyTrack from '@/components/marketing/JourneyTrack';

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(20,24,31,0.9),rgba(11,15,20,0.9))] px-6 py-14 sm:px-10 sm:py-16">
      <BackgroundGlow />

      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-300/80">Learn ACCA with AI</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-white md:text-6xl">
          Your pace. Your plan. <span className="text-white">Your pass.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-300">
          Pass ACCA faster with AI-powered study plans, adaptive notes & exam-style practice. Trusted by 1,000+ students.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/pricing"
            className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-gray-900 shadow-[0_0_30px_rgba(16,185,129,.25)] hover:bg-emerald-300"
          >
            Start your plan
          </a>
          <a
            href="/papers"
            className="rounded-xl border border-white/15 px-5 py-3 text-white hover:border-emerald-400/40"
          >
            Explore papers
          </a>
        </div>

        <div className="mt-10 select-none">
          <JourneyTrack className="-mx-2" />
        </div>

        {/* tiny trust row */}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-400">
          <span>BT, MA, FA, LW</span>
          <span>Mocks • Analytics • AI Tutor</span>
          <span>2025/26 syllabus aligned</span>
        </div>
      </div>
    </div>
  );
}