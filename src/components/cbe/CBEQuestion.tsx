"use client";

import { useEffect } from "react";

export default function CBEQuestion({
  q,
  selected,
  flagged,
  onChange,
  onToggleFlag,
}: {
  q: {
    id: string;
    type: "mcq" | "multi" | "scenario";
    stem: string;
    options?: { id: string; text: string }[];
    marks?: number;
  };
  selected: string[];
  flagged: boolean;
  onChange: (sel: string[]) => void;
  onToggleFlag: () => void;
}) {
  // number keys to select options (1..9)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!q.options?.length) return;
      const idx = Number(e.key) - 1;
      if (idx >= 0 && idx < q.options.length) {
        const id = q.options[idx].id;
        if (q.type === "mcq") onChange([id]);
        else {
          const has = selected.includes(id);
          onChange(has ? selected.filter(x => x !== id) : [...selected, id]);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, selected, onChange]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Question</div>
          <h2 className="text-lg font-semibold">Q: <span className="font-normal">{q.marks ?? 1} mark{(q.marks ?? 1) > 1 ? "s" : ""}</span></h2>
        </div>
        <button
          onClick={onToggleFlag}
          className={[
            "rounded-md border px-2 py-1 text-xs",
            flagged
              ? "border-amber-400/40 bg-amber-50 text-amber-700 dark:bg-amber-900/20"
              : "hover:border-emerald-400/40 dark:border-white/10",
          ].join(" ")}
          title="Flag for review (F)"
        >
          {flagged ? "Flagged" : "Flag"}
        </button>
      </div>

      <article className="prose prose-sm mt-3 dark:prose-invert max-w-none">
        <p dangerouslySetInnerHTML={{ __html: q.stem }} />
      </article>

      {q.type !== "scenario" && (
        <ul className="mt-4 space-y-2">
          {q.options?.map((opt, i) => {
            const checked = selected.includes(opt.id);
            return (
              <li key={opt.id}>
                <label className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3 hover:border-emerald-400/40 dark:border-white/10 dark:bg-zinc-900/60">
                  {q.type === "mcq" ? (
                    <input type="radio" name={`q-${q.id}`} className="mt-0.5" checked={checked} onChange={() => onChange([opt.id])} />
                  ) : (
                    <input type="checkbox" className="mt-0.5" checked={checked} onChange={(e) => {
                      const next = e.target.checked ? [...selected, opt.id] : selected.filter(id => id !== opt.id);
                      onChange(next);
                    }} />
                  )}
                  <span className="text-sm">
                    <span className="mr-2 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] dark:bg-zinc-800">{i+1}</span>
                    {opt.text}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {q.type === "scenario" && (
        <div className="mt-4">
          <textarea
            className="h-40 w-full resize-y rounded-lg border border-zinc-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-zinc-900/60"
            placeholder="Write your response…"
            value={selected[0] ?? ""}
            onChange={(e) => onChange([e.target.value])}
          />
          <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Free response (not auto-marked in this mock).
          </div>
        </div>
      )}
    </div>
  );
}