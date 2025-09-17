"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSkeleton, ErrorState } from "@/components/ui/Status";

type Item = { label: string; value: string };

export default function RevisionQueueCard() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/dashboard/mock", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setItems(json.revision ?? []);
    } catch (e) {
      console.error(e);
      setErr("network");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm
                 dark:border-white/10 dark:bg-zinc-900/60"
      aria-labelledby="revision-heading"
    >
      <div className="flex items-center justify-between">
        <h3 id="revision-heading" className="text-lg font-semibold">
          Revision Queue
        </h3>
        {!loading && (
          <button
            onClick={load}
            className="rounded-md border px-2 py-1 text-xs hover:border-emerald-400/40
                       dark:border-white/10"
          >
            Refresh
          </button>
        )}
      </div>

      {loading ? (
        <div className="mt-4">
          <LoadingSkeleton rows={3} />
        </div>
      ) : err ? (
        <div className="mt-4">
          <ErrorState onRetry={load}>
            Failed to load revision queue.
          </ErrorState>
        </div>
      ) : (
        <ul className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
          <AnimatePresence>
            {items.map((it, i) => (
              <motion.li
                key={it.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-lg p-1.5 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10"
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                             bg-gradient-to-br from-emerald-400 to-emerald-500 text-white text-sm font-semibold
                             shadow-sm ring-1 ring-emerald-500/40 dark:from-emerald-500 dark:to-emerald-400"
                >
                  {i + 1}
                </div>
                <div>
                  <div className="font-medium">{it.label}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {it.value}
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}