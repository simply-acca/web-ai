"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LoadingSkeleton, ErrorState } from "@/components/ui/Status";

type InsightResp = {
  insights?: { streak?: number; zday?: number };      // we won't show zday here anymore
  user?: { daysUntil?: number };                       // optional (if you later want a countdown tile)
  modules?: { pct: number }[];                         // for avg mastery
};

export default function InsightsCard() {
  const [data, setData] = useState<InsightResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/dashboard/mock", { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j: InsightResp = await r.json();
      setData(j);
    } catch (e) {
      console.error(e);
      setErr("network");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const streak = data?.insights?.streak ?? 0;

  // Compute average mastery across modules (0–100)
  const avgPct = useMemo(() => {
    const arr = data?.modules ?? [];
    if (!arr.length) return 0;
    const sum = arr.reduce((a, m) => a + (m.pct || 0), 0);
    return Math.round(sum / arr.length);
  }, [data?.modules]);

  return (
    <section
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm
                 dark:border-white/10 dark:bg-zinc-900/60"
      aria-labelledby="insights-heading"
    >
      <div className="flex items-center justify-between">
        <h3 id="insights-heading" className="text-lg font-semibold">
          Performance Insights
        </h3>
        {!loading && (
          <button
            onClick={load}
            className="rounded-md border px-2 py-1 text-xs hover:border-emerald-400/40 dark:border-white/10"
          >
            Refresh
          </button>
        )}
      </div>

      {loading ? (
        <div className="mt-4">
          <LoadingSkeleton rows={2} />
        </div>
      ) : err ? (
        <div className="mt-4">
          <ErrorState onRetry={load}>
            Failed to load performance insights.
          </ErrorState>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="group rounded-xl border border-amber-200/60 bg-amber-50 p-3
                       hover:shadow-sm dark:border-amber-900/30 dark:bg-amber-900/10"
            title="Days in a row you studied—keep the chain going."
          >
            <div className="flex items-center justify-between">
              <div className="text-xs text-amber-800/80 dark:text-amber-300/80">
                Streak
              </div>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/70 text-amber-600 ring-1 ring-amber-300/60 dark:bg-transparent">
                🔥
              </span>
            </div>
            <div className="mt-1 text-xl font-semibold text-amber-900 dark:text-amber-200">
              {streak} day{streak === 1 ? "" : "s"}
            </div>
            <div className="mt-0.5 text-[11px] text-amber-900/70 dark:text-amber-300/70">
              Aim for 10+ for compounding gains
            </div>
          </motion.div>

          {/* Readiness (Avg Mastery) */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="group rounded-xl border border-emerald-200/60 bg-emerald-50 p-3
                       hover:shadow-sm dark:border-emerald-900/30 dark:bg-emerald-900/10"
            title="Average mastery across your modules (higher = more exam-ready)."
          >
            <div className="flex items-center justify-between">
              <div className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
                Readiness (Avg mastery)
              </div>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/70 text-emerald-700 ring-1 ring-emerald-300/60 dark:bg-transparent">
                ✅
              </span>
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              <div className="text-xl font-semibold text-emerald-900 dark:text-emerald-200">
                {avgPct}%
              </div>
              <span className="text-[11px] text-emerald-900/70 dark:text-emerald-300/70">
                70% = exam-ready
              </span>
            </div>

            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-emerald-200/40 dark:bg-emerald-900/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-[width] duration-700"
                style={{ width: `${avgPct}%` }}
                role="progressbar"
                aria-valuenow={avgPct}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}