"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LoadingSkeleton, ErrorState } from "@/components/ui/Status";

type Q = {
  id: string;
  type: "mcq" | "multi" | "scenario";
  stem: string;
  options?: { id: string; text: string }[];
  correct?: string[];
  marks?: number;
  explanation?: string;
};
type Paper = { id: string; title: string; code: string; durationMin: number; questions: Q[] };

export default function CBESummary({ params }: { params: { id: string } }) {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; max: number; answered: number; total: number } | null>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  async function load() {
    setLoading(true); setErr(null);
    try {
      const r = await fetch(`/api/papers/${params.id}`, { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j: Paper = await r.json();
      setPaper(j);
      const resRaw = sessionStorage.getItem(`cbe-result-${j.id}`);
      if (resRaw) setResult(JSON.parse(resRaw));
      const ansRaw = localStorage.getItem(`cbe-${j.id}`); // if still around; otherwise from res? (optional)
      if (ansRaw) setAnswers(JSON.parse(ansRaw)?.answers ?? {});
    } catch (e) { console.error(e); setErr("network"); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const pct = useMemo(() => result ? Math.round((result.score / Math.max(1, result.max)) * 100) : 0, [result]);

  if (loading) {
    return <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900/60"><LoadingSkeleton rows={6} /></div>;
  }
  if (err || !paper) {
    return <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900/60"><ErrorState onRetry={load}>Couldn’t load summary.</ErrorState></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">{paper.title}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">{paper.code} • {paper.durationMin} mins • {paper.questions.length} Qs</div>
          </div>
          <Link href="/dashboard/past-papers" className="rounded-md border px-3 py-1.5 text-sm hover:border-emerald-400/40 dark:border-white/10">Back to list</Link>
        </div>

        {result && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-white/10 dark:bg-zinc-900/60">
              <div className="text-xs text-zinc-500">Score</div>
              <div className="text-xl font-semibold">{result.score}/{result.max} ({pct}%)</div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-white/10 dark:bg-zinc-900/60">
              <div className="text-xs text-zinc-500">Answered</div>
              <div className="text-xl font-semibold">{result.answered}/{result.total}</div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-white/10 dark:bg-zinc-900/60">
              <div className="text-xs text-zinc-500">Recommendation</div>
              <div className="text-sm mt-1">Focus on topics you missed; reattempt flagged questions.</div>
            </div>
          </div>
        )}
      </div>

      {/* Review list */}
      <div className="rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900/60">
        <div className="border-b border-zinc-200 p-3 text-sm font-semibold dark:border-white/10">Review</div>
        <ul className="divide-y divide-zinc-200 dark:divide-white/10">
          {paper.questions.map((q, i) => {
            const yours = answers[q.id] ?? [];
            const correct = q.correct ?? [];
            let state: "correct" | "wrong" | "open" = "open";
            if (q.type !== "scenario") {
              const ok = yours.length === correct.length && yours.every(id => correct.includes(id));
              state = yours.length ? (ok ? "correct" : "wrong") : "open";
            }
            return (
              <li key={q.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-semibold">Q{i+1} <span className="text-xs font-normal text-zinc-500">({q.marks ?? 1} mark{(q.marks ?? 1) > 1 ? "s" : ""})</span></div>
                  <div className={[
                    "rounded-full px-2 py-0.5 text-[11px] ring-1",
                    state === "correct" && "bg-emerald-50 text-emerald-700 ring-emerald-200/60 dark:bg-emerald-900/10 dark:text-emerald-300",
                    state === "wrong" && "bg-red-50 text-red-700 ring-red-200/60 dark:bg-red-900/10 dark:text-red-300",
                    state === "open" && "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-200"
                  ].filter(Boolean).join(" ")}>{state}</div>
                </div>

                <div className="prose prose-sm mt-2 dark:prose-invert max-w-none">
                  <p dangerouslySetInnerHTML={{ __html: q.stem }} />
                </div>

                {q.type !== "scenario" && (
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border border-zinc-200 bg-white p-2 text-sm dark:border-white/10 dark:bg-zinc-900/60">
                      <div className="text-xs text-zinc-500">Your answer</div>
                      <div className="mt-1">
                        {yours.length ? renderOpts(q, yours) : <span className="text-zinc-500">—</span>}
                      </div>
                    </div>
                    <div className="rounded-lg border border-zinc-200 bg-white p-2 text-sm dark:border-white/10 dark:bg-zinc-900/60">
                      <div className="text-xs text-zinc-500">Correct</div>
                      <div className="mt-1">{renderOpts(q, correct)}</div>
                    </div>
                  </div>
                )}

                {q.explanation && (
                  <div className="mt-2 rounded-lg border border-emerald-200/50 bg-emerald-50 p-2 text-sm dark:border-emerald-900/30 dark:bg-emerald-900/10">
                    <div className="text-xs text-emerald-700 dark:text-emerald-300">Explanation</div>
                    <div className="mt-1 text-emerald-900 dark:text-emerald-200">{q.explanation}</div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function renderOpts(q: Q, ids: string[]) {
  if (!q.options?.length) return ids.join(", ");
  const map = new Map(q.options.map(o => [o.id, o.text]));
  return (
    <ul className="list-disc pl-5">
      {ids.map(id => <li key={id}>{map.get(id) ?? id}</li>)}
    </ul>
  );
}