// src/components/marketing/WhyChoose.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type Point = {
  title: string;
  traditional: string; // “Traditional providers …”
  us: string;          // “ACCA AI …”
};

const POINTS: Point[] = [
  {
    title: "Planner that fits YOU — not just the syllabus",
    traditional: "Traditional providers: fixed schedules you must bend around.",
    us: "ACCA AI: adaptive plan tuned to your lifestyle, deadlines, and pace.",
  },
  {
    title: "Personalised learning — not one-size-fits-all",
    traditional: "Traditional providers: same content for everyone.",
    us: "ACCA AI: path tailored by your progress and exam-style performance.",
  },
  {
    title: "Strengths & weaknesses — clear, visual insights",
    traditional: "Traditional providers: generic progress trackers (or none).",
    us: "ACCA AI: instant dashboards with next best actions that cut guesswork.",
  },
  {
    title: "24/7 smart help — not forum replies",
    traditional: "Traditional providers: slow tutor responses or scattered forums.",
    us: "ACCA AI: instant explanations and step-by-step guidance when you’re stuck.",
  },
  {
    title: "Learn smarter, remember more",
    traditional: "Traditional providers: long PDFs/lectures you forget next day.",
    us: "ACCA AI: AI-driven notes, flashcards & revision tuned to your memory style.",
  },
  {
    title: "Human factors = real results",
    traditional: "Traditional providers: focus on content delivery only.",
    us: "ACCA AI: mindset, motivation & confidence designed into every plan.",
  },
];

export default function WhyChoose() {
  return (
    <section
      aria-labelledby="why-choose"
      className="mx-auto mt-16 max-w-7xl px-6 sm:px-10"
    >
      <header className="mb-8">
        <h2
          id="why-choose"
          className="text-3xl font-semibold tracking-tight text-zinc-100/95 md:text-4xl"
        >
          Why choose ACCA AI?
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
          Built around clarity and momentum. Less second-guessing, more daily wins—so you
          walk into the exam confident.
        </p>
      </header>

      <div
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-5 shadow-[-8px_-8px_40px_rgba(16,185,129,0.06),8px_8px_40px_rgba(59,130,246,0.06)] sm:p-8"
      >
        {/* watermark / deco */}
        <svg
          aria-hidden
          className="pointer-events-none absolute -right-10 top-1/2 hidden h-72 -translate-y-1/2 opacity-[0.06] sm:block"
          viewBox="0 0 200 200"
        >
          <defs>
            <linearGradient id="wg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <path d="M20 150 L90 80 L180 170" stroke="url(#wg)" strokeWidth="18" strokeLinecap="round" fill="none" />
          <circle cx="60" cy="70" r="30" fill="url(#wg)" />
        </svg>

        {/* grid (two columns on lg, one on mobile) */}
        <ol className="grid gap-6 lg:grid-cols-2">
          {POINTS.map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.04 }}
              className="group rounded-2xl bg-zinc-900/40 p-5 ring-1 ring-white/8 transition hover:bg-zinc-900/55"
            >
              {/* number + title */}
              <div className="mb-2 flex items-start gap-3">
                <span className="select-none font-semibold tabular-nums text-zinc-500">
                  {String(i + 1).padStart(2, "0")}.
                </span>
                <h3 className="text-base font-semibold text-zinc-100">
                  {p.title}
                </h3>
              </div>

              {/* compare lines */}
              <div className="ml-8 space-y-1.5 text-sm">
                <p className="text-zinc-400">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-[11px] text-zinc-300 ring-1 ring-white/10">
                    🧱
                  </span>
                  {p.traditional}
                </p>
                <p className="text-emerald-300">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] text-emerald-300 ring-1 ring-emerald-500/30">
                    ⚡
                  </span>
                  {p.us}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* CTA stripe */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-zinc-900/50 p-4 ring-1 ring-white/8">
          <p className="text-sm text-zinc-300">
            Other platforms give you content.{" "}
            <span className="text-emerald-400">We give you results.</span> Start free and
            get a plan that fits you.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-emerald-400"
          >
            Create your plan
          </Link>
        </div>
      </div>
    </section>
  );
}