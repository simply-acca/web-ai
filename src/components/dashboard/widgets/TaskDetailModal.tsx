"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSkeleton, ErrorState } from "@/components/ui/Status";

type Task = {
  id: string;
  title: string;
  duration: number;
  tag?: "note" | "mcq" | "scenario" | "past" | string;
  detail?: string;
};

type PreviewPayload =
  | { kind: "note"; bullets: string[] }
  | { kind: "mcq"; stem: string; options: string[]; answerIndex: number; rationale?: string }
  | { kind: "scenario"; blurb: string; skills: string[] }
  | { kind: "past"; set: string; timing: string; coverage: string };

export default function TaskDetailModal({ task, onClose }: { task: Task | null; onClose: () => void }) {
  const open = !!task;
  const primaryRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => primaryRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  if (!open || !task) return null;

  const iconFor = (tag?: Task["tag"]) =>
    tag === "note" ? "📝" : tag === "mcq" ? "❓" : tag === "scenario" ? "📄" : tag === "past" ? "🗂️" : "▣";

  const chipClasses = (tag?: Task["tag"]) =>
    [
      "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] ring-1",
      tag === "note" && "bg-amber-50 text-amber-700 ring-amber-200/60 dark:bg-amber-900/10 dark:text-amber-300 dark:ring-amber-800/30",
      tag === "mcq" && "bg-blue-50 text-blue-700 ring-blue-200/60 dark:bg-blue-900/10 dark:text-blue-300 dark:ring-blue-800/30",
      tag === "scenario" && "bg-purple-50 text-purple-700 ring-purple-200/60 dark:bg-purple-900/10 dark:text-purple-300 dark:ring-purple-800/30",
      tag === "past" && "bg-emerald-50 text-emerald-700 ring-emerald-200/60 dark:bg-emerald-900/10 dark:text-emerald-300 dark:ring-emerald-800/30",
      !tag && "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-white/10",
    ].filter(Boolean).join(" ");

  const addToPlan = () => {
    const evt = new CustomEvent("acai:add-task", {
      detail: {
        id: task.id,
        title: task.title,
        duration: task.duration,
        tag: task.tag,
        detail: task.detail ?? "Added from task details",
      },
    });
    window.dispatchEvent(evt);
  };

  return (
    <AnimatePresence>
      <div role="dialog" aria-modal="true" aria-label="Task details" className="fixed inset-0 z-50 flex items-end justify-center p-4 md:items-center">
        {/* Backdrop */}
        <motion.button
          aria-label="Close"
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Card */}
        <motion.div
          role="document"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="relative z-10 w-full max-w-xl rounded-2xl border border-zinc-200 bg-white/95 p-6 shadow-xl dark:border-white/10 dark:bg-zinc-900/80"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white ring-1 ring-emerald-300/40 dark:bg-zinc-900/60" aria-hidden>
                  {iconFor(task.tag)}
                </span>
                <span className={chipClasses(task.tag)}>{task.tag ?? "study"}</span>
              </div>
              <h3 className="mt-2 truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">{task.title}</h3>
              <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {task.duration} mins • {task.tag || "study"}
              </div>
            </div>

            <button onClick={onClose} aria-label="Close" className="rounded-md px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="mt-4 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            {task.detail ?? "No further detail for this task."}
          </div>

          {/* Hydrated preview */}
          <HydratedPreview id={task.id} tag={task.tag} />

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              ref={primaryRef}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-gray-900 shadow hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
            >
              Start now
            </button>
            <button onClick={addToPlan} className="rounded-xl border px-4 py-2 text-sm hover:border-emerald-400/40 dark:border-white/10">
              Add to plan
            </button>
            <button onClick={onClose} className="ml-auto rounded-xl border px-4 py-2 text-sm hover:border-emerald-400/40 dark:border-white/10">
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ---------------- Hydrated preview ---------------- */

function HydratedPreview({ id, tag }: { id: string; tag?: Task["tag"] }) {
  const [data, setData] = useState<PreviewPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch(`/api/dashboard/tasks/${id}?slow=500`, { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setData(j);
    } catch (e) {
      setErr("network");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="mt-5 rounded-xl border border-zinc-200 bg-white/70 p-4 text-sm leading-6 dark:border-white/10 dark:bg-zinc-900/50">
      {loading ? (
        <LoadingSkeleton message="Loading a quick preview…" rows={3} />
      ) : err ? (
        <ErrorState onRetry={load}>We couldn’t load a preview for this task.</ErrorState>
      ) : !data ? null : data.kind === "note" ? (
        <>
          <div className="mb-2 font-medium text-zinc-900 dark:text-zinc-100">What’s inside</div>
          <ul className="list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-300">
            {data.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </>
      ) : data.kind === "mcq" ? (
        <McqPreview stem={data.stem} options={data.options} answerIndex={data.answerIndex} rationale={data.rationale} />
      ) : data.kind === "scenario" ? (
        <>
          <div className="mb-2 font-medium text-zinc-900 dark:text-zinc-100">Case snapshot</div>
          <p className="text-zinc-700 dark:text-zinc-300">{data.blurb}</p>
          <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">You’ll practice: {data.skills.join(", ")}</div>
        </>
      ) : (
        <>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <div className="font-medium text-zinc-900 dark:text-zinc-100">Set details</div>
              <div className="text-zinc-700 dark:text-zinc-300">{data.set}</div>
            </div>
            <div>
              <div className="font-medium text-zinc-900 dark:text-zinc-100">Assessment</div>
              <div className="text-zinc-700 dark:text-zinc-300">{data.timing} • {data.coverage}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function McqPreview({ stem, options, answerIndex, rationale }:{
  stem: string; options: string[]; answerIndex: number; rationale?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="mb-2 font-medium text-zinc-900 dark:text-zinc-100">Sample question</div>
      <div className="rounded-lg border border-zinc-200 p-3 dark:border-white/10">
        <div className="text-zinc-800 dark:text-zinc-200">{stem}</div>
        <ul className="mt-2 space-y-1 text-zinc-700 dark:text-zinc-300">
          {options.map((opt, i) => (
            <li key={i}>
              {String.fromCharCode(65 + i)}. {opt}
            </li>
          ))}
        </ul>
        <button onClick={() => setShow((s) => !s)} className="mt-3 rounded-md border px-2 py-1 text-xs hover:border-emerald-400/40 dark:border-white/10">
          {show ? "Hide answer" : "Reveal answer"}
        </button>
        {show && (
          <div className="mt-2 text-emerald-700 dark:text-emerald-300">
            Correct: <strong>{String.fromCharCode(65 + answerIndex)}</strong>
            {rationale ? ` — ${rationale}` : ""}
          </div>
        )}
      </div>
    </div>
  );
}