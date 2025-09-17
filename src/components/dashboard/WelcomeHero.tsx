"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/components/user/UserContext";

/**
 * A subtle, animated welcome band meant to sit at the top of the dashboard.
 * - Soft glass background with animated gradient edge
 * - Time-of-day greeting using user's first name
 * - Two small stat chips (days to exam, today's minutes)
 * - Gentle floating accents (no heavy particles)
 */
export default function WelcomeHero({
  todayMinutes,
}: {
  /** Optional override; if not provided we’ll show “—” */
  todayMinutes?: number;
}) {
  const { user, loading } = useUser();

  const first = useMemo(
    () => (user?.name ? user.name.split(" ")[0] : "there"),
    [user?.name]
  );

  const tod = useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return "Good night";
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const days = user?.nextExam?.days ?? null;
  const code = user?.nextExam?.code ?? "";

  return (
    <section
      className="
        relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70
        px-5 py-6 shadow-sm backdrop-blur
        dark:border-white/10 dark:bg-zinc-900/60
      "
      aria-label="Welcome"
    >
      {/* animated gradient edge (subtle) */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          background:
            "linear-gradient(90deg, rgba(16,185,129,0) 0%, rgba(16,185,129,.35) 50%, rgba(16,185,129,0) 100%)",
        }}
      />

      {/* floating accents */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-emerald-400/10 blur-2xl"
        initial={{ y: -8, opacity: 0.6 }}
        animate={{ y: 8, opacity: 0.9 }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-10 -bottom-12 h-40 w-40 rounded-full bg-sky-400/10 blur-2xl"
        initial={{ y: 6, opacity: 0.6 }}
        animate={{ y: -6, opacity: 0.9 }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: 7, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Greeting + subline */}
        <div>
          <motion.h1
            className="text-2xl font-semibold tracking-tight"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {loading ? "…" : `${tod}, ${first} 👋`}
          </motion.h1>

          <motion.p
            className="mt-1 text-sm text-zinc-600 dark:text-zinc-400"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
          >
            {days != null && code ? (
              <>
                {days} days to <span className="font-medium text-zinc-800 dark:text-zinc-200">{code}</span>. 
                Let’s make today count.
              </>
            ) : (
              <>Your plan is ready. Let’s make today count.</>
            )}
          </motion.p>
        </div>

        {/* Chips + action */}
        <div className="flex flex-wrap items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.08 }}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-300/40 bg-emerald-50/70 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-300"
            title="Target focus time for today"
          >
            ⏱ Today’s plan • {todayMinutes != null ? `${todayMinutes} mins` : "—"}
          </motion.div>

          {days != null && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.11 }}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white/70 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-200"
            >
              📆 Countdown • {days}d
            </motion.div>
          )}

          <motion.a
            href="#today" // anchor to TodayPlanCard section if you give it id="today"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.14 }}
            className="ml-1 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-[0_8px_30px_rgba(16,185,129,0.25)] hover:bg-emerald-400"
          >
            Start today’s first task
          </motion.a>
        </div>
      </div>
    </section>
  );
}