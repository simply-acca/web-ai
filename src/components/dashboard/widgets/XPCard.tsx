"use client";

export default function XPCard() {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/60 p-3 shadow-sm flex items-center justify-between">
      <div>
        <div className="text-xs text-zinc-500">XP</div>
        <div className="text-lg font-semibold">2,450</div>
      </div>
      <div className="text-sm text-emerald-600">+450 XP</div>
    </div>
  );
}