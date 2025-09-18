// src/components/marketing/HeroJourneySection.tsx
"use client";

import { motion } from "framer-motion";
import JourneyTrack from "@/components/marketing/JourneyTrack";

type Stat = { label: string; value: string; sub?: string };

const STATS: Stat[] = [
  { value: "+18%", label: "Avg. pass boost", sub: "vs. baseline" },
  { value: "10k+", label: "Daily streaks", sub: "logged by students" },
  { value: "3k+", label: "Mock questions", sub: "ACCA-style items" },
];

export default function HeroJourneySection() {
  return (
    <section
      id="journey"
      className="relative mx-auto mt-16 w-full max-w-7xl px-6 sm:px-10"
      aria-labelledby="journey-heading"
    >
      {/* subtle background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-3xl"
        style={{
          background:
            "radial-gradient(40% 35% at 80% 20%, rgba(59,130,246,0.12), transparent 70%), radial-gradient(35% 35% at 25% 75%, rgba(16,185,129,0.10), transparent 70%)",
        }}
      />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: big curve + captions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur
                     dark:border-white/10 dark:bg-zinc-900/70"
        >
          <header className="mb-4">
            <h2
              id="journey-heading"
              className="text-xl font-semibold text-zinc-900 dark:text-zinc-100"
            >
              Your journey with ACCA&nbsp;AI
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              From plan to pass—see how the platform guides your next best step.
            </p>
          </header>

          {/* Taller curve for readability */}
          <JourneyTrack height={300} />

          {/* Milestone chips (optional quick anchors) */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {["Study Planner", "Adaptive Notes", "Mock Exam", "Progress"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1
                           dark:border-white/10 dark:bg-zinc-900/50"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right: proof points / stats / CTA */}
        <motion.aside
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex flex-col gap-4"
        >
          <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm
                          dark:border-white/10 dark:bg-zinc-900/70">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Why students stick with it
            </h3>
            <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {STATS.map((s) => (
                <li
                  key={s.label}
                  className="rounded-lg border border-zinc-200 bg-white/70 p-3 text-center
                             dark:border-white/10 dark:bg-zinc-900/50"
                >
                  <div className="text-2xl font-bold text-emerald-500">{s.value}</div>
                  <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{s.label}</div>
                  {s.sub && (
                    <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">{s.sub}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white/90 p-5 shadow-sm
                          dark:border-white/10 dark:bg-zinc-900/70">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              What this means for you
            </h4>
            <ul className="mt-2 list-inside list-disc text-sm text-zinc-700 dark:text-zinc-300">
              <li>Clear next step every session—no second-guessing.</li>
              <li>Mocks that mirror ACCA CBE tools and timing.</li>
              <li>Feedback you can act on, not generic tips.</li>
            </ul>

            <div className="mt-4 flex gap-2">
              <a
                href="/pricing"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-emerald-400"
              >
                Start your plan
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm
                           hover:border-emerald-400/40 dark:border-white/10"
              >
                See how it works
              </a>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}