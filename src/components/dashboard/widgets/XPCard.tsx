// components/dashboard/widgets/XPCard.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSkeleton, ErrorState } from "@/components/ui/Status";
import WidgetFrame from "@/components/dashboard/WidgetFrame";

type MockUser = { xp?: number; xpHistory?: number[] };
type MockResp = { user?: MockUser };

export default function XPCard() {
  const [xp, setXp] = useState<number | null>(null);
  const [prevXp, setPrevXp] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const delta = useMemo(() => (xp == null || prevXp == null ? 0 : Math.max(0, xp - prevXp)), [xp, prevXp]);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/dashboard/mock", { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j: MockResp = await r.json();
      const newXp = j.user?.xp ?? 0;
      setPrevXp((old) => (old == null ? newXp : old));
      setXp(newXp);
      setHistory(normalizeHistory(j.user?.xpHistory, newXp));
    } catch (e) {
      console.error(e);
      setErr("network");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const level = useMemo(() => (xp == null ? 1 : Math.floor(xp / 1000) + 1), [xp]);
  const intoLevel = useMemo(() => (xp == null ? 0 : xp % 1000), [xp]);
  const pct = useMemo(() => Math.min(100, Math.round((intoLevel / 1000) * 100)), [intoLevel]);

  const size = 64, stroke = 6, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <WidgetFrame
      id="xp"
      title="XP"
      subtitle="Your momentum across tasks and focus time"
      size="sm"
      actions={
        !loading && (
          <button
            onClick={() => { setPrevXp(xp); load(); }}
            className="rounded-md border px-2 py-1 text-xs hover:border-emerald-400/40 dark:border-white/10"
          >
            Refresh
          </button>
        )
      }
    >
      <div className="flex items-start justify-between gap-4">
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
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-800 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-white/10">
                L{level}
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total XP</div>
            {loading ? (
              <div className="mt-1 w-24"><LoadingSkeleton rows={1} /></div>
            ) : err ? (
              <div className="mt-1"><ErrorState onRetry={load}>Failed to load XP.</ErrorState></div>
            ) : (
              <>
                <motion.div
                  key={xp ?? 0}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-0.5 text-lg font-semibold"
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

        <div className="flex flex-col items-end gap-2">
          <div className="rounded-md border border-zinc-200 bg-white/70 p-2 overflow-hidden dark:border-white/10 dark:bg-zinc-900/40">
            {loading ? (
              <div className="h-[36px] w-[120px] rounded bg-zinc-200/70 dark:bg-zinc-800 animate-pulse" />
            ) : err ? (
              <div className="h-[36px] w-[120px] text-[10px] flex items-center justify-center text-zinc-500 dark:text-zinc-400">—</div>
            ) : (
              <Sparkline values={history} width={120} height={36} />
            )}
          </div>

          <div className="flex items-center gap-2">
            <AnimatePresence>
              {!loading && !err && (xp ?? 0) - (prevXp ?? 0) > 0 && (
                <motion.span
                  key={`delta-${xp}`}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200/60 dark:bg-emerald-900/15 dark:text-emerald-300 dark:ring-emerald-800/30"
                >
                  +{(xp ?? 0) - (prevXp ?? 0)} XP
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}

/* helpers */
function normalizeHistory(apiHistory: number[] | undefined, currentXp: number) {
  if (apiHistory && apiHistory.length >= 2) return apiHistory.slice(-14);
  const days = 14;
  const base = Math.max(0, currentXp - 14 * 120);
  const arr = Array.from({ length: days }, (_, i) => Math.round(base + (i + 1) * (80 + (i % 3) * 15)));
  arr[arr.length - 1] = currentXp;
  return arr;
}

function Sparkline({ values, width = 120, height = 36 }: { values: number[]; width?: number; height?: number }) {
  if (!values?.length) return null;
  const PAD = 1, W = width - 2 * PAD, H = height - 2 * PAD;
  const min = Math.min(...values), max = Math.max(...values), range = Math.max(1, max - min);
  const step = W / Math.max(1, values.length - 1);
  const pts = values.map((v, i) => `${PAD + i * step},${PAD + (H - ((v - min) / range) * H)}`);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="block w-[120px] h-[36px]" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="xpLine" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="xpFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
        </linearGradient>
        <clipPath id="xpClip"><rect x="0" y="0" width={width} height={height} rx="4" ry="4" /></clipPath>
      </defs>
      <g clipPath="url(#xpClip)">
        <polyline points={`${PAD},${height - PAD} ${pts.join(" ")} ${width - PAD},${height - PAD}`} fill="url(#xpFill)" stroke="none" />
        <polyline points={pts.join(" ")} fill="none" stroke="url(#xpLine)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}