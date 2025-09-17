"use client";

export default function InsightsCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/60 p-5 shadow-sm">
      <h3 className="text-lg font-semibold">Performance Insights</h3>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-amber-50 dark:bg-amber-900/10 p-3">
          <div className="text-xs text-zinc-500">Stakeholder Master</div>
          <div className="mt-1 font-semibold">7 day</div>
        </div>
        <div className="rounded-md bg-emerald-50 dark:bg-emerald-900/10 p-3">
          <div className="text-xs text-zinc-500">Z-day streak</div>
          <div className="mt-1 font-semibold">2,450</div>
        </div>
      </div>
    </div>
  );
}