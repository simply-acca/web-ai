"use client";

export default function RevisionQueueCard() {
  const items = [
    { label: "Strongest Area", value: "A1 Business organization (95%)" },
    { label: "Weakest Area", value: "A3c Data Protection (42%)" },
    { label: "Common error", value: "Mixing internal vs connected stakeholders" },
  ];

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/60 p-5 shadow-sm">
      <h3 className="text-lg font-semibold">Revision Queue</h3>
      <ul className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="rounded-full h-8 w-8 bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center text-emerald-600">{i + 1}</div>
            <div>
              <div className="font-medium">{it.label}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">{it.value}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}