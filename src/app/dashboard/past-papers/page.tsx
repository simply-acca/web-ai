"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LoadingSkeleton, ErrorState } from "@/components/ui/Status";
import WidgetFrame from "@/components/dashboard/WidgetFrame";

type Paper = { id: string; code: string; title: string; durationMin: number; questions: number };

export default function PastPapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true); setErr(null);
    try {
      const r = await fetch("/api/papers", { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setPapers(j.papers ?? []);
    } catch (e) { console.error(e); setErr("network"); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <WidgetFrame
        title="Past Papers (CBE)"
        subtitle="Practice real exam style with timer & review"
        actions={!loading && (
          <button onClick={load} className="rounded-md border px-2 py-1 text-xs hover:border-emerald-400/40 dark:border-white/10">
            Refresh
          </button>
        )}
      >
        {loading ? (
          <div className="mt-2"><LoadingSkeleton rows={3} /></div>
        ) : err ? (
          <div className="mt-2"><ErrorState onRetry={load}>Couldn’t load papers.</ErrorState></div>
        ) : (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {papers.map(p => (
              <li key={p.id} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900/60">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{p.title}</div>
                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {p.code} • {p.questions} Qs • {p.durationMin} mins
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/past-papers/${p.id}`}
                    className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-emerald-400"
                  >
                    Start
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </WidgetFrame>
    </div>
  );
}