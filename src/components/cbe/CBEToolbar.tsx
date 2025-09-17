"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function CBEToolbar({
  title,
  code,
  deadlineTs,            // shared deadline (epoch ms)
  index,
  total,
  answered,
  onPrev,
  onNext,
  onSubmit,
  onToggleCalc,
  onToggleNotes,
}: {
  title: string;
  code: string;
  deadlineTs: number;
  index: number;
  total: number;
  answered: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onToggleCalc: () => void;
  onToggleNotes: () => void;
}) {
  const [now, setNow] = useState(Date.now());
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => setNow(Date.now()), 1000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, []);

  // listen to cross-tab deadline changes (just in case)
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key?.startsWith("cbe-deadline-")) setNow(Date.now());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const remaining = useMemo(() => Math.max(0, Math.floor((deadlineTs - now) / 1000)), [deadlineTs, now]);
  useEffect(() => { if (remaining === 0) onSubmit(); /* eslint-disable-next-line */ }, [remaining]);

  const mm = Math.floor(remaining / 60).toString().padStart(2, "0");
  const ss = (remaining % 60).toString().padStart(2, "0");

  const progressPct = useMemo(() => {
    const totalSec = deadlineTs - (deadlineTs - remaining * 1000);
    const startedAt = deadlineTs - totalSec;
    const elapsed = Math.max(0, now - startedAt);
    const dur = Math.max(1, deadlineTs - startedAt);
    return Math.min(100, Math.round((elapsed / dur) * 100));
  }, [deadlineTs, now, remaining]);

  return (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-white/70 p-3 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/60">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{title}</div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">{code} • Q{index}/{total}</div>
      </div>

      <div className="hidden md:block w-64">
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-[width] duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">{answered} answered</div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onToggleCalc} className="rounded-md border px-2 py-1 text-sm hover:border-emerald-400/40 dark:border-white/10">Calc</button>
        <button onClick={onToggleNotes} className="rounded-md border px-2 py-1 text-sm hover:border-emerald-400/40 dark:border-white/10">Notes</button>

        <span className="rounded-md bg-zinc-100 px-2 py-1 text-sm font-mono dark:bg-zinc-800" title="Shared across tabs">
          {mm}:{ss}
        </span>
        <button onClick={onPrev} className="rounded-md border px-2 py-1 text-sm hover:border-emerald-400/40 dark:border-white/10">Prev</button>
        <button onClick={onNext} className="rounded-md border px-2 py-1 text-sm hover:border-emerald-400/40 dark:border-white/10">Next</button>
        <button onClick={onSubmit} className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-emerald-400">
          Submit
        </button>
      </div>
    </div>
  );
}