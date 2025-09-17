"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSkeleton, ErrorState } from "@/components/ui/Status";

type MockUser = { xp?: number; xpHistory?: number[] };
type MockResp = { user?: MockUser };

export default function XPCard() {
  const [xp, setXp] = useState<number | null>(null);
  const [prevXp, setPrevXp] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const delta = useMemo(() => {
    if (xp == null || prevXp == null) return 0;
    return Math.max(0, xp - prevXp);
  }, [xp, prevXp]);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/dashboard/mock", { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j: MockResp = await r.json();

      const newXp = j.user?.xp ?? 0;
      setPrevXp((old) => (old == null ? newXp : old)); // first load: no delta flash
      setXp(newXp);

      const hist = normalizeHistory(j.user?.xpHistory, newXp);
      setHistory(hist);
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

  // Level math (1k XP per level)
  const level = useMemo(() => (xp == null ? 1 : Math.floor(xp / 1000) + 1), [xp]);
  const intoLevel = useMemo(() => (xp == null ? 0 : xp % 1000), [xp]);
  const pct = useMemo(() => Math.min(100, Math.round((intoLevel / 1000) * 100)), [intoLevel]);

  // Gauge geometry
  const size = 64;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <section
      className="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm
                 dark:border-white/10 dark:bg-zinc-900/60"
      aria-labelledby="xp-heading"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Gauge + totals */}
        <div className="flex items-center gap-3">
          <div className="relative h-16 w-16">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" strokeWidth={stroke} fill="none" />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke="url(#xpGrad)"
                strokeWidth={stroke}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${c - dash}`}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                initial={{ strokeDasharray: `0 ${c}` }}
                animate={{ strokeDasharray: `${dash} ${c - dash}` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </svg>

            {/* Level chip */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span
                title="Level"
                className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-800 ring-1 ring-zinc-200
                           dark:bg-zinc-800 dark:text-zinc-100 dark:ring-white/10"
              >
                L{level}
              </span>
            </div>

            {/* hover glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-md transition group-hover:opacity-100"
              style={{ background: "radial-gradient(30% 30% at 50% 50%, rgba(16,185,129,0.15), transparent 70%)" }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 id="xp-heading" className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Total XP
              </h3>
              <Tooltip label="How XP works">
                <div className="cursor-help text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200" aria-hidden>
                  ⓘ
                </div>
                <div className="max-w-xs text-xs leading-5 text-zinc-700 dark:text-zinc-300">
                  You gain XP for focused study time and completed tasks (notes, MCQs, scenarios, past questions). Every
                  1000 XP is +1 level. Small daily streaks beat cramming.
                </div>
              </Tooltip>
            </div>

            {loading ? (
              <div className="mt-1 w-24">
                <LoadingSkeleton rows={1} />
              </div>
            ) : err ? (
              <div className="mt-1">
                <ErrorState onRetry={load}>Failed to load XP.</ErrorState>
              </div>
            ) : (
              <>
                <motion.div
                  key={xp ?? 0}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-0.5 text-lg font-semibold text-zinc-900 dark:text-zinc-100"
                >
                  {(xp ?? 0).toLocaleString()}
                </motion.div>
                <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                  {intoLevel}/1000 to L{level + 1}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Sparkline + delta + refresh */}
        <div className="flex flex-col items-end gap-2">
          {/* Sparkline */}
          <div className="rounded-md border border-zinc-200 bg-white/70 p-2 dark:border-white/10 dark:bg-zinc-900/40">
            {loading ? (
              <div className="h-[36px] w-[120px] rounded bg-zinc-200/70 dark:bg-zinc-800 animate-pulse" />
            ) : err ? (
              <div className="h-[36px] w-[120px] text-[10px] flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                — 
              </div>
            ) : (
              <Sparkline values={history} width={120} height={36} />
            )}
          </div>

          <div className="flex items-center gap-2">
            <AnimatePresence>
              {!loading && !err && delta > 0 && (
                <motion.span
                  key={`delta-${xp}`}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200/60
                             dark:bg-emerald-900/15 dark:text-emerald-300 dark:ring-emerald-800/30"
                >
                  +{delta} XP
                </motion.span>
              )}
            </AnimatePresence>

            {!loading && (
              <button
                onClick={() => {
                  setPrevXp(xp);
                  load();
                }}
                className="rounded-md border px-2 py-1 text-xs hover:border-emerald-400/40 dark:border-white/10"
                title="Refresh XP"
              >
                Refresh
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- small helpers ---------- */

// If mock provides no xpHistory, create a gentle synthetic last-14-days curve ending at current XP
function normalizeHistory(apiHistory: number[] | undefined, currentXp: number) {
  if (apiHistory && apiHistory.length >= 2) {
    // Keep last 14 points max
    return apiHistory.slice(-14);
  }
  // synthesize: monotonic with tiny daily gains (looks stable, not noisy)
  const days = 14;
  const base = Math.max(0, currentXp - 14 * 120); // assume ~120 xp/day recent
  const arr = Array.from({ length: days }, (_, i) => {
    const step = i + 1;
    return Math.round(base + step * (80 + (i % 3) * 15)); // small variance
  });
  // Ensure last matches current
  arr[arr.length - 1] = currentXp;
  return arr;
}

/* Narrow, neutral sparkline (no seaborn, just vanilla SVG) */
function Sparkline({ values, width = 120, height = 36 }: { values: number[]; width?: number; height?: number }) {
  if (!values?.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const step = width / Math.max(1, values.length - 1);

  const pts = values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <defs>
        <linearGradient id="xpLine" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="xpFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polyline
        points={`0,${height} ${pts.join(" ")} ${width},${height}`}
        fill="url(#xpFill)"
        stroke="none"
      />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="url(#xpLine)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Minimal tooltip (no lib): pass two children—trigger then content */
function Tooltip({ label, children }: { label: string; children: [React.ReactNode, React.ReactNode] }) {
  const [trigger, content] = children;
  return (
    <span className="relative inline-flex items-center">
      <span className="peer inline-flex items-center" aria-label={label}>
        {trigger}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-[120%] z-10 w-max -translate-x-1/2 rounded-md border border-zinc-200 bg-white px-3 py-2 shadow-sm
                   opacity-0 transition-opacity duration-150 dark:border-white/10 dark:bg-zinc-900/90
                   peer-hover:opacity-100"
      >
        {content}
      </span>
    </span>
  );
}