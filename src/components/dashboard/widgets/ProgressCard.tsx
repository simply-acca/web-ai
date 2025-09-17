"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ModuleDrilldownModal from "./ModuleDrilldownModal";
import { LoadingSkeleton, ErrorState } from "@/components/ui/Status";

/* ---------- tooltips for filters ---------- */
const FILTER_INFO: Record<"All" | "Core" | "Applied", string> = {
  All: "Show progress across every ACCA paper you’ve added.",
  Core:
    "Foundation-level ACCA modules: Business & Technology, Management Accounting, Financial Accounting.",
  Applied:
    "Applied Skills papers such as Corporate & Business Law, Financial Reporting, etc.",
};

/* ---------- narrow sparkline ---------- */
function Sparkline({ values = [] as number[] }) {
  if (!values.length) return null;
  const w = 70, h = 28;
  const max = Math.max(...values), min = Math.min(...values), range = Math.max(1, max - min);
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <line x1="0" x2={w} y1={h} y2={h} stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeWidth="0.5" />
      <polyline fill="none" stroke="url(#g)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      {values.map((v, i) => {
        const x = i * step;
        const y = h - ((v - min) / range) * h;
        return <circle key={i} cx={x} cy={y} r="1.6" className="fill-emerald-400" />;
      })}
    </svg>
  );
}

function Trend({ values = [] as number[] }) {
  if (values.length < 2) return null;
  const diff = values.at(-1)! - values.at(-2)!;
  const sign = diff > 0 ? "+" : diff < 0 ? "–" : "±";
  const color = diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-500" : "text-zinc-500";
  return <span className={`text-xs font-medium ${color}`}>{sign}{Math.abs(diff)}%</span>;
}

function Milestones() {
  return (
    <div className="relative mt-1 h-3">
      {[50, 70, 85].map((t) => (
        <span key={t} className="absolute -translate-x-1/2" style={{ left: `${t}%` }}>
          <span className="block h-3 w-[1px] bg-zinc-300 dark:bg-zinc-700" />
        </span>
      ))}
    </div>
  );
}

/* ---------- main ---------- */
type Row = { id: string; title: string; pct: number; band: "Core" | "Applied"; history: number[] };

export default function ProgressCard() {
  const [modules, setModules] = useState<Row[]>([]);
  const [filter, setFilter] = useState<"All" | "Core" | "Applied">("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/dashboard/mock", { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setModules(j.modules);
    } catch (e: any) {
      console.error(e);
      setError("network");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => (filter === "All" ? modules : modules.filter((m) => m.band === filter)),
    [modules, filter]
  );
  const avg = filtered.length ? Math.round(filtered.reduce((a, b) => a + b.pct, 0) / filtered.length) : 0;

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/60"
        aria-labelledby="progress-heading"
      >
        {/* header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 id="progress-heading" className="text-lg font-semibold">Mastery Progress</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Last 30 days • Avg: <span className="font-semibold">{loading ? "—" : `${avg}%`}</span>
            </p>
          </div>

          {/* filter chips with tooltips */}
          <div className="flex items-center gap-1 text-xs">
            {(["All", "Core", "Applied"] as const).map((f) => (
              <span key={f} className="relative group">
                <button
                  onClick={() => setFilter(f)}
                  disabled={loading}
                  className={[
                    "rounded-full px-3 py-1 transition focus:outline-none focus:ring-2 focus:ring-emerald-300/60 disabled:opacity-60",
                    filter === f
                      ? "bg-emerald-500 text-gray-900 font-semibold"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700",
                  ].join(" ")}
                  aria-pressed={filter === f}
                >
                  {f}
                </button>
                {/* tooltip */}
                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-1/2 top-full z-20 mt-1 w-56 -translate-x-1/2
                             rounded-md bg-zinc-900 px-2 py-1 text-center text-[11px] text-white opacity-0 shadow
                             transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100
                             dark:bg-zinc-800"
                >
                  {FILTER_INFO[f]}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* body */}
        {loading ? (
          <div className="mt-4">
            <LoadingSkeleton rows={4} />
          </div>
        ) : error ? (
          <div className="mt-4">
            <ErrorState onRetry={load} details="Check your connection and try again.">
              We couldn’t load progress right now.
            </ErrorState>
          </div>
        ) : (
          <>
            <ul className="mt-4 space-y-4">
              {filtered.map((m, i) => (
                <motion.li
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
                  className="flex items-center justify-between gap-4"
                >
                  <button
                    onClick={() => setOpenId(m.id)}
                    className="group flex-1 text-left"
                    aria-label={`Open details for ${m.title}`}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="truncate font-medium">
                        {m.id} <span className="text-zinc-500 text-xs">{m.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trend values={m.history} />
                        <span className="text-sm font-semibold">{m.pct}%</span>
                      </div>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-[width] duration-700 group-hover:from-emerald-300 group-hover:to-emerald-500"
                        style={{ width: `${m.pct}%` }}
                        role="progressbar"
                        aria-valuenow={m.pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                    <Milestones />
                  </button>

                  <div className="ml-2 shrink-0">
                    <Sparkline values={m.history} />
                  </div>
                </motion.li>
              ))}
            </ul>

            {/* footer hint */}
            <div className="mt-5 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <div>Milestones: 50% (foundation), 70% (exam-ready), 85% (confident pass)</div>
              <a
                href="/dashboard/insights"
                className="rounded-md border px-2 py-1 text-[11px] border-zinc-200 hover:border-emerald-400/40 dark:border-white/10"
              >
                See full analytics →
              </a>
            </div>
          </>
        )}
      </motion.section>

      {/* Drilldown modal */}
      <ModuleDrilldownModal moduleId={openId} onClose={() => setOpenId(null)} />
    </>
  );
}