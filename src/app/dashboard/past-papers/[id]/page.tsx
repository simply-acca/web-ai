"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSkeleton, ErrorState } from "@/components/ui/Status";
import CBEToolbar from "@/components/cbe/CBEToolbar";
import CBEQuestion from "@/components/cbe/CBEQuestion";
import Calculator from "@/components/cbe/Calculator";
import Scratchpad from "@/components/cbe/Scratchpad";

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

type AnswerState = Record<string, string[] | undefined>;
type FlagState = Record<string, boolean>;

type Action =
  | { type: "SET_ANS"; qid: string; sel: string[] }
  | { type: "TOGGLE_FLAG"; qid: string }
  | { type: "LOAD"; answers: AnswerState; flags: FlagState };

function reducer(state: { answers: AnswerState; flags: FlagState }, action: Action) {
  switch (action.type) {
    case "SET_ANS": return { ...state, answers: { ...state.answers, [action.qid]: action.sel } };
    case "TOGGLE_FLAG": return { ...state, flags: { ...state.flags, [action.qid]: !state.flags[action.qid] } };
    case "LOAD": return { answers: action.answers, flags: action.flags };
    default: return state;
  }
}

function kSession(paperId: string) { return `cbe-${paperId}`; }
function kDeadline(paperId: string) { return `cbe-deadline-${paperId}`; }

export default function CBERunner({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);

  const [calcOpen, setCalcOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  const [deadline, setDeadline] = useState<number>(0);

  const [state, dispatch] = useReducer(reducer, { answers: {}, flags: {} });
  const q = paper?.questions?.[idx];

  // load paper + session + deadline
  async function load() {
    setLoading(true); setErr(null);
    try {
      const r = await fetch(`/api/papers/${params.id}`, { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j: Paper = await r.json();
      setPaper(j);

      // restore answers/flags/idx
      const raw = localStorage.getItem(kSession(j.id));
      if (raw) {
        const saved = JSON.parse(raw);
        dispatch({ type: "LOAD", answers: saved.answers ?? {}, flags: saved.flags ?? {} });
        setIdx(Math.min(saved.idx ?? 0, (j.questions?.length ?? 1) - 1));
      } else {
        dispatch({ type: "LOAD", answers: {}, flags: {} });
        setIdx(0);
      }

      // shared deadline (multi-tab)
      const existing = localStorage.getItem(kDeadline(j.id));
      if (existing) {
        setDeadline(Number(existing));
      } else {
        const dl = Date.now() + j.durationMin * 60_000;
        localStorage.setItem(kDeadline(j.id), String(dl));
        setDeadline(dl);
      }
    } catch (e) { console.error(e); setErr("network"); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  // persist session across changes
  useEffect(() => {
    if (!paper) return;
    localStorage.setItem(kSession(paper.id), JSON.stringify({ answers: state.answers, flags: state.flags, idx }));
  }, [state.answers, state.flags, idx, paper]);

  // cross-tab sync for answers/deadline
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (!paper) return;
      if (e.key === kSession(paper.id) && e.newValue) {
        const saved = JSON.parse(e.newValue);
        dispatch({ type: "LOAD", answers: saved.answers ?? {}, flags: saved.flags ?? {} });
        if (typeof saved.idx === "number") setIdx(saved.idx);
      }
      if (e.key === kDeadline(paper.id) && e.newValue) setDeadline(Number(e.newValue));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [paper]);

  const total = paper?.questions?.length ?? 0;
  const answeredCount = useMemo(
    () => Object.values(state.answers).filter(v => v && v.length > 0).length,
    [state.answers]
  );

  const submit = useCallback(() => {
    if (!paper) return;
    let score = 0, max = 0;
    paper.questions.forEach(qq => {
      const correct = qq.correct ?? [];
      const marks = qq.marks ?? 1;
      max += marks;
      const got = state.answers[qq.id] ?? [];
      if (qq.type === "mcq") {
        if (got.length === 1 && correct.length === 1 && got[0] === correct[0]) score += marks;
      } else if (qq.type === "multi") {
        const ok = got.length === correct.length && got.every(id => correct.includes(id));
        if (ok) score += marks;
      }
    });
    sessionStorage.setItem(`cbe-result-${paper.id}`, JSON.stringify({ score, max, answered: answeredCount, total }));
    localStorage.removeItem(kDeadline(paper.id));
    router.push(`/dashboard/past-papers/${paper.id}/summary`);
  }, [paper, answeredCount, state.answers, router]);

  // keyboard shortcuts: ←/→ nav, f flag, s submit
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setIdx(i => Math.min(total - 1, i + 1));
      if (e.key === "ArrowLeft") setIdx(i => Math.max(0, i - 1));
      if (e.key.toLowerCase() === "f" && q) dispatch({ type: "TOGGLE_FLAG", qid: q.id });
      if (e.key.toLowerCase() === "s") submit();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, total, submit]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900/60">
        <LoadingSkeleton rows={6} />
      </div>
    );
  }
  if (err || !paper) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900/60">
        <ErrorState onRetry={load}>Couldn’t load paper.</ErrorState>
      </div>
    );
  }

  return (
    <>
      {/* floating tools */}
      <Calculator open={calcOpen} onClose={() => setCalcOpen(false)} />
      <Scratchpad paperId={paper.id} open={notesOpen} onClose={() => setNotesOpen(false)} />

      <div className="rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900/60">
        <CBEToolbar
          title={paper.title}
          code={paper.code}
          deadlineTs={deadline}
          index={idx + 1}
          total={total}
          answered={answeredCount}
          onPrev={() => setIdx(i => Math.max(0, i - 1))}
          onNext={() => setIdx(i => Math.min(total - 1, i + 1))}
          onSubmit={submit}
          onToggleCalc={() => setCalcOpen(v => !v)}
          onToggleNotes={() => setNotesOpen(v => !v)}
        />

        <div className="grid gap-0 md:grid-cols-[1fr_260px]">
          {/* Question */}
          <div className="p-5">
            <CBEQuestion
              q={q!}
              selected={state.answers[q!.id] ?? []}
              flagged={!!state.flags[q!.id]}
              onChange={(sel) => dispatch({ type: "SET_ANS", qid: q!.id, sel })}
              onToggleFlag={() => dispatch({ type: "TOGGLE_FLAG", qid: q!.id })}
            />
          </div>

          {/* Navigator */}
          <aside className="border-t md:border-l md:border-t-0 border-zinc-200 p-4 dark:border-white/10">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Question Navigator</div>
            <ul className="mt-3 grid grid-cols-8 gap-2 sm:grid-cols-10 md:grid-cols-4">
              {paper.questions.map((qq, i) => {
                const selected = (state.answers[qq.id] ?? []).length > 0;
                const flagged = !!state.flags[qq.id];
                const active = i === idx;
                return (
                  <li key={qq.id}>
                    <button
                      onClick={() => setIdx(i)}
                      className={[
                        "h-9 w-9 rounded-md ring-1 text-sm font-medium",
                        active
                          ? "bg-emerald-500 text-gray-900 ring-emerald-400/40"
                          : selected
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200/60 dark:bg-emerald-900/10 dark:text-emerald-300"
                          : "bg-white text-zinc-700 ring-zinc-200 dark:bg-zinc-900/50 dark:text-zinc-200 dark:ring-white/10",
                      ].join(" ")}
                      title={flagged ? "Flagged" : ""}
                    >
                      {i + 1}{flagged ? "•" : ""}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 text-[11px] text-zinc-500 dark:text-zinc-400">
              Shortcuts: ←/→ nav • 1–9 select • F flag • S submit
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}