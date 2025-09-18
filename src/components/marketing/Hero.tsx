// src/components/marketing/Hero.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import BackgroundGlow from '@/components/marketing/BackgroundGlow';
import JourneyTrack from '@/components/marketing/JourneyTrack';
import HeroPreview from './HeroPreview';

export default function Hero() {
  return (
    <section
      className="mt-5 relative isolate overflow-hidden rounded-3xl
                 border border-black/10 dark:border-white/10
                 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,250,252,0.92))]
                 dark:bg-[linear-gradient(180deg,rgba(17,22,28,0.92),rgba(9,12,17,0.92))]
                 mx-auto max-w-7xl px-6 sm:px-10 py-16 sm:py-20"
      aria-labelledby="hero-heading"
    >
      <BackgroundGlow />

    <div className="mx-auto max-w-5xl">
      {/* Top badge */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-800 shadow-sm
                   dark:border-emerald-900/40 dark:bg-emerald-900/15 dark:text-emerald-300"
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Learn ACCA with AI • 2025/26 syllabus aligned
      </motion.div>

      {/* Headline & copy */}
      <div className="mx-auto max-w-5xl">
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="text-4xl font-extrabold leading-tight text-zinc-900 md:text-6xl dark:text-white"
        >
          Your pace. Your plan.{' '}
          <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 bg-clip-text text-transparent">
            Your pass.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
          className="mt-4 max-w-2xl text-lg text-zinc-700 dark:text-zinc-300"
        >
          Pass ACCA faster with AI-powered study plans, adaptive notes, and exam-style practice.
          Join 10,000+ students compounding daily wins—without the burnout.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
          className="mt-6 flex flex-wrap gap-3"
        >
          <Link
            href="/pricing"
            className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-gray-900 shadow-[0_0_30px_rgba(16,185,129,.25)] hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            Start your plan
          </Link>
          <Link
            href="/features"
            className="rounded-xl border px-5 py-3 text-zinc-900 hover:border-emerald-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300
                       dark:border-white/15 dark:text-white"
          >
            See how it works
          </Link>
        </motion.div>

        {/* Social proof row */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.18 }}
          className="mt-5 flex flex-wrap items-center gap-4 text-sm"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white/70 px-3 py-1 text-xs text-zinc-700
                          dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-300">
            ⭐⭐⭐⭐⭐ <span className="ml-1">4.9/5 from 300+ reviews</span>
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            Trusted by students in 25+ countries
          </div>
        </motion.div>

        {/* Visual: product preview with floating widgets */}
        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] items-center">
        {/* Left: product preview */}
        <motion.div
            className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm
                    dark:border-white/10 dark:bg-zinc-900/60"
        >
            <HeroPreview />
        </motion.div>

        {/* Right: student illustration */}
        <div className="flex justify-center lg:justify-end">
            <Image
            src="/image.png"    // ✅ your PNG file in /public
            alt="Student studying illustration"
            width={320}                 // tweak size as needed
            height={320}
            priority
            className="max-h-80 w-auto drop-shadow-2xl lg:max-h-[22rem] animate-float"
            />
        </div>
        </div>

        {/* Footnote bullets */}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-600 dark:text-zinc-400">
          <span>BT, MA, FA, LW first • PM/TX/FR/AA/FM next</span>
          <span>AI tutor • Planner • Mocks • Analytics</span>
          <span>Cancel anytime</span>
        </div>
      </div>
      </div>
    </section>
  );
}

function FloatingChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full border border-zinc-200 bg-white/80 px-2.5 py-1 text-[11px] text-zinc-700 backdrop-blur
                 shadow-sm dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-300"
    >
      {children}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white/70 px-2 py-1.5 dark:border-white/10 dark:bg-zinc-900/60">
      <div className="text-sm font-semibold text-zinc-900 dark:text-white">{value}</div>
      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{label}</div>
    </div>
  );
}