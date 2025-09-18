'use client';

import { motion } from 'framer-motion';

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={[
        'rounded-xl border border-zinc-200 bg-white/85 shadow-sm backdrop-blur',
        'dark:border-white/10 dark:bg-zinc-900/70',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

export default function HeroPreview() {
  return (
    <div className="relative grid h-full w-full gap-4 p-4 sm:p-5 lg:grid-cols-2">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
        className="col-span-2 flex items-center justify-between rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-xs
                   dark:border-white/10 dark:bg-zinc-900/60"
      >
        <span className="font-medium text-zinc-700 dark:text-zinc-200">Today • Thu 18</span>
        <span className="text-zinc-500 dark:text-zinc-400">ACCA BT • adaptive plan</span>
      </motion.div>

      {/* Left: plan list */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="col-span-1"
      >
        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Study plan</div>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
              65 mins
            </span>
          </div>

          <ul className="space-y-2">
            {[
              { t: 'Read micro-notes: A3c', m: 12, tag: '📝' },
              { t: '10 MCQs: data protection', m: 20, tag: '❓' },
              { t: 'Scenario drill', m: 18, tag: '📄' },
              { t: 'Past Q: A3c+ A2', m: 15, tag: '🗂️' },
            ].map((x, i) => (
              <li
                key={i}
                className="group flex items-center justify-between rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm
                           hover:border-emerald-400/40 dark:border-white/10 dark:bg-zinc-900/60"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-md ring-1 ring-emerald-400/30 bg-white dark:bg-zinc-900">
                    {x.tag}
                  </span>
                  <span className="truncate">{x.t}</span>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{x.m}m</span>
              </li>
            ))}
          </ul>

          {/* shimmering footer */}
          <div className="mt-3 h-6 w-full animate-pulse rounded-md bg-zinc-200/60 dark:bg-zinc-800/70" />
        </Card>
      </motion.div>

      {/* Right: progress + tiny chart */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="col-span-1"
      >
        <div className="grid gap-4">
          {/* mastery gauge */}
          <Card className="flex items-center gap-3 p-4">
            <div className="relative h-16 w-16">
              <svg viewBox="0 0 64 64" width="64" height="64" className="block">
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <circle cx="32" cy="32" r="26" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" strokeWidth="6" fill="none" />
                <motion.circle
                  cx="32" cy="32" r="26" stroke="url(#g1)" strokeWidth="6" fill="none" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 0.62 }} transition={{ duration: 0.8 }}
                  transform="rotate(-90 32 32)"
                />
              </svg>
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-800 ring-1 ring-zinc-200
                                  dark:bg-zinc-800 dark:text-zinc-100 dark:ring-white/10">
                  62%
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Readiness</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Avg mastery • BT</div>
            </div>
          </Card>

          {/* tiny sparkline card */}
          <Card className="p-4">
            <div className="mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">Momentum</div>
            <svg viewBox="0 0 220 60" className="block w-full">
              <defs>
                <linearGradient id="l" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <linearGradient id="f" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              {/* fill */}
              <motion.polyline
                points="0,60 20,48 40,44 70,30 100,26 130,38 160,42 190,28 220,24 220,60"
                fill="url(#f)" stroke="none"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              />
              {/* line */}
              <motion.polyline
                points="0,60 20,48 40,44 70,30 100,26 130,38 160,42 190,28 220,24"
                fill="none" stroke="url(#l)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            </svg>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px] text-zinc-600 dark:text-zinc-400">
              <span>+18% pass boost</span>
              <span>7-day streak</span>
              <span>2,450 XP</span>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* soft glow edge */}
      <div className="pointer-events-none absolute -left-20 bottom-6 h-32 w-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.20),transparent_65%)] blur-2xl" />
    </div>
  );
}