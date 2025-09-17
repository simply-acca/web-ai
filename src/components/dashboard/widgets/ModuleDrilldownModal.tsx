"use client";

import { useEffect, useMemo, useState } from "react";
import { LoadingSkeleton, ErrorState } from "@/components/ui/Status";

type Detail = {
  id: string;
  title: string;
  pct: number;
  history: number[];
  weaknesses: string[];
  nextTasks: { id: string; title: string; type: "note" | "mcq" | "scenario" | "past"; estMin: number }[];
};

export default function ModuleDrilldownModal({
  moduleId,
  onClose,
}: {
  moduleId: string | null;
  onClose: () => void;
}) {
  const [data, setData] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<null | string>(null);
  const open = !!moduleId;

  async function load() {
    if (!moduleId) return;
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch(`/api/dashboard/module/${moduleId}`, { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setData(j);
    } catch (e: any) {
      console.error(e);
      setErr("network");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  const areaPath = useMemo(() => {
    if (!data?.history?.length) return null;
    const values = data.history;
    const w = 320, h = 120;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = Math.max(1, max - min);
    const step = w / (values.length - 1);
    const pts = values.map((v, i) => [i * step, h - ((v - min) / range) * h]);
    const line = pts.map(([x, y], i) => (i === 0 ? `M ${x},${y}` : `L ${x},${y}`)).join(" ");
    const area = `${line} L ${w},${h} L 0,${h} Z`;
    return { w, h, line, area, pts };
  }, [data]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white dark:bg-zinc-900/80 backdrop-blur-sm p-6 border border-zinc-200 dark:border-white/10 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">
              {loading ? "Loading…" : data?.title ?? "—"}
            </h3>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Estimated readiness: <span className="font-semibold">{loading ? "—" : `${data?.pct ?? "—"}%`}</span>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-md px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">✕</button>
        </div>

        {/* Error state */}
        {err && (
        <div className="mt-4">
            <ErrorState onRetry={load} details="Please check your connection and try again.">
            We couldn’t load module details.
            </ErrorState>
        </div>
        )}

        {/* Area chart */}
        <div className="mt-5 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 p-4">
          {loading ? (
        <LoadingSkeleton message="Fetching progress trend…" rows={1} variant="card" />
        ) : areaPath ? ( 
            <svg width={areaPath.w} height={areaPath.h} viewBox={`0 0 ${areaPath.w} ${areaPath.h}`} className="mx-auto block">
              <defs>
                <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <line x1="0" x2={areaPath.w} y1={areaPath.h} y2={areaPath.h} stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeWidth="0.5" />
              <path d={areaPath.area} fill="url(#areaFill)" />
              <path d={areaPath.line} fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" />
              {areaPath.pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" className="fill-emerald-400" />)}
            </svg>
          ) : (
            <div className="h-24" />
          )}
          <div className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">Last 60–90 days trend</div>
        </div>

        {/* Weakness chips */}
        <div className="mt-5">
          <div className="text-sm font-medium">Focus areas</div>
          {loading ? <LoadingSkeleton rows={2} /> : (
            <div className="mt-2 flex flex-wrap gap-2">
              {data?.weaknesses?.map((w) => (
                <span key={w} className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200">
                  {w}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Next best tasks */}
        <div className="mt-6">
          <div className="text-sm font-medium">Next best tasks</div>
          {loading ? (
            <div className="mt-3">
                <LoadingSkeleton rows={3} />
            </div>
            ) : (
            <ul className="mt-3 space-y-3">
            {data?.nextTasks?.map((t) => (
                <li
                key={t.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm
                            dark:border-white/10 dark:bg-zinc-900/60"
                >
                {/* LEFT: icon + titles */}
                <div className="flex min-w-0 items-center gap-3">
                    <span
                    className={[
                        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md ring-1",
                        t.type === "note" &&
                        "bg-amber-50 text-amber-600 ring-amber-200/60 dark:bg-amber-900/10 dark:ring-amber-800/30",
                        t.type === "mcq" &&
                        "bg-blue-50 text-blue-600 ring-blue-200/60 dark:bg-blue-900/10 dark:ring-blue-800/30",
                        t.type === "scenario" &&
                        "bg-purple-50 text-purple-600 ring-purple-200/60 dark:bg-purple-900/10 dark:ring-purple-800/30",
                        t.type === "past" &&
                        "bg-emerald-50 text-emerald-600 ring-emerald-200/60 dark:bg-emerald-900/10 dark:ring-emerald-800/30",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    aria-hidden
                    >
                    {t.type === "note" ? "📝" : t.type === "mcq" ? "❓" : t.type === "scenario" ? "📄" : "🗂️"}
                    </span>

                    <div className="min-w-0">
                    <div className="truncate font-medium text-zinc-900 dark:text-zinc-100">{t.title}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {t.estMin} mins • {t.type}
                    </div>
                    </div>
                </div>

                {/* RIGHT: actions */}
                <div className="flex items-center gap-2">
                    <button
                    onClick={() => {
                        const addEvt = new CustomEvent("acai:add-task", {
                        detail: {
                            id: t.id,
                            title: t.title,
                            duration: t.estMin,
                            tag: t.type,
                            detail: `From ${data?.title ?? "module"}`,
                        },
                        });
                        window.dispatchEvent(addEvt);
                    }}
                    className="rounded-md border px-2.5 py-1 text-xs hover:border-emerald-400/40 dark:border-white/10"
                    >
                    Add to plan
                    </button>

                    <button className="rounded-md bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-gray-900 hover:bg-emerald-400">
                    Start
                    </button>
                </div>
                </li>
            ))}
            </ul>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-3 py-1.5 text-sm hover:border-emerald-400/40 dark:border-white/10">Close</button>
        </div>
      </div>
    </div>
  );
}