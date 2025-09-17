// src/components/marketing/Hero.tsx
import BackgroundGlow from '@/components/marketing/BackgroundGlow';
import JourneyTrack from '@/components/marketing/JourneyTrack';

export default function Hero() {
  return (
    <div
      className="relative isolate overflow-hidden rounded-3xl
                 border border-black/10 dark:border-white/10
                 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,250,252,0.9))]
                 dark:bg-[linear-gradient(180deg,rgba(20,24,31,0.9),rgba(11,15,20,0.9))]
                 mx-auto max-w-7xl px-6 sm:px-10 py-14 sm:py-16"
    >
      <BackgroundGlow />

      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300/80">
          Learn ACCA with AI
        </p>

        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-gray-900 dark:text-white md:text-6xl">
          Your pace. Your plan. <span>Your pass.</span>
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-gray-700 dark:text-gray-300">
          Pass ACCA faster with AI-powered study plans, adaptive notes & exam-style practice. Trusted by 1,000+ students.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/pricing"
            className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-gray-900 shadow-[0_0_30px_rgba(16,185,129,.25)] hover:bg-emerald-400"
          >
            Start your plan
          </a>
          <a
            href="/papers"
            className="rounded-xl border px-5 py-3 text-gray-900 hover:border-emerald-400/40 dark:border-white/15 dark:text-white"
          >
            Explore papers
          </a>
        </div>

        <div className="mt-10 select-none">
          <JourneyTrack className="-mx-2" />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600 dark:text-gray-400">
          <span>BT, MA, FA, LW</span>
          <span>Mocks • Analytics • AI Tutor</span>
          <span>2025/26 syllabus aligned</span>
        </div>
      </div>
    </div>
  );
}