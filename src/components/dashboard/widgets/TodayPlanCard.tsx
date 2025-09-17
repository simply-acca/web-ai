"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LoadingSkeleton, ErrorState } from "@/components/ui/Status";
import WidgetFrame from "@/components/dashboard/WidgetFrame";
import TaskDetailModal from "./TaskDetailModal";
import toast from "react-hot-toast";

type Task = {
  id: string;
  title: string;
  duration: number; // minutes
  tag?: "note" | "mcq" | "scenario" | "past" | string;
  detail?: string;
  completed?: boolean;
};

type ApiToday = {
  estimatedMinutes: number;
  tasks: Task[];
};

export default function TodayPlanCard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meta, setMeta] = useState<{ estimatedMinutes?: number } | null>(null);
  const [openTask, setOpenTask] = useState<Task | null>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Active session
  const [active, setActive] = useState<{
    task: Task;
    remainingSec: number;
    paused: boolean;
    startedAt: number;
  } | null>(null);
  const timerRef = useRef<number | null>(null);

  // ---- Fetch ---------------------------------------------------
  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/dashboard/mock", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const today: ApiToday = json.today ?? { estimatedMinutes: 0, tasks: [] };
      const withFlags = (today.tasks || []).map((t: Task) => ({ ...t, completed: !!t.completed }));
      setTasks(withFlags);
      setMeta({ estimatedMinutes: today.estimatedMinutes });
    } catch (e) {
      console.error(e);
      setErr("network");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  // ---- Add-to-Plan integration (listen for custom event) -------
  useEffect(() => {
    function handleAddTask(e: Event) {
      const { detail } = e as CustomEvent<Task>;
      if (!detail) return;

      // ensure unique id (avoid duplicates if same id is re-used)
      const id =
        !detail.id || tasks.some((t) => t.id === detail.id)
          ? `plan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
          : detail.id;

      const toAdd: Task = {
        ...detail,
        id,
        completed: false,
        duration: Math.max(1, Number(detail.duration) || 15),
      };

      setTasks((prev) => [toAdd, ...prev]);

      // bump remaining/estimated minutes
      setMeta((m) => ({
        estimatedMinutes: (m?.estimatedMinutes ?? 0) + (toAdd.duration || 0),
      }));

      toast?.success?.(`Added “${toAdd.title}” to today’s plan`);
    }

    window.addEventListener("acai:add-task", handleAddTask as EventListener);
    return () => window.removeEventListener("acai:add-task", handleAddTask as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  // ---- Timer ---------------------------------------------------
  useEffect(() => {
    if (!active || active.paused) return;
    timerRef.current = window.setInterval(() => {
      setActive((s) => {
        if (!s) return s;
        const next = s.remainingSec - 1;
        if (next <= 0) {
          window.clearInterval(timerRef.current!);
          timerRef.current = null;
          // mark as done
          setTasks((arr) => arr.map((t) => (t.id === s.task.id ? { ...t, completed: true } : t)));
          return null;
        }
        return { ...s, remainingSec: next };
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [active?.paused, active?.task?.id]);

  const startTask = (t: Task) => {
    if (t.completed) {
      setTasks((arr) => arr.map((x) => (x.id === t.id ? { ...x, completed: false } : x)));
    }
    setActive({
      task: t,
      remainingSec: t.duration * 60,
      paused: false,
      startedAt: Date.now(),
    });
  };
  const togglePause = () => setActive((s) => (s ? { ...s, paused: !s.paused } : s));
  const stopSession = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    setActive(null);
  };
  const formatted = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ---- Complete / reorder -------------------------------------
  const toggleComplete = (id: string) => {
    setTasks((arr) => arr.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    if (active?.task.id === id) stopSession();
  };

  // DnD (mouse)
  const dragIndex = useRef<number | null>(null);
  const onDragStart = (i: number) => (dragIndex.current = i);
  const onDragOver = (e: React.DragEvent<HTMLLIElement>) => e.preventDefault();
  const onDrop = (i: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from == null || from === i) return;
    setTasks((arr) => {
      const next = [...arr];
      const [moved] = next.splice(from, 1);
      next.splice(i, 0, moved);
      return next;
    });
  };

  // Keyboard reorder (accessible)
  const moveItem = (idx: number, dir: -1 | 1) => {
    setTasks((arr) => {
      const i2 = idx + dir;
      if (i2 < 0 || i2 >= arr.length) return arr;
      const next = [...arr];
      const [moved] = next.splice(idx, 1);
      next.splice(i2, 0, moved);
      return next;
    });
  };

  // ---- UI helpers ---------------------------------------------
  const iconFor = (tag?: Task["tag"]) => {
    switch (tag) {
      case "note":
        return "📝";
      case "mcq":
        return "❓";
      case "scenario":
        return "📄";
      case "past":
        return "🗂️";
      default:
        return "▣";
    }
  };
  const pillClassFor = (tag?: Task["tag"]) =>
    [
      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ring-1",
      tag === "note" &&
        "bg-amber-50 text-amber-700 ring-amber-200/60 dark:bg-amber-900/10 dark:text-amber-300 dark:ring-amber-800/30",
      tag === "mcq" &&
        "bg-blue-50 text-blue-700 ring-blue-200/60 dark:bg-blue-900/10 dark:text-blue-300 dark:ring-blue-800/30",
      tag === "scenario" &&
        "bg-purple-50 text-purple-700 ring-purple-200/60 dark:bg-purple-900/10 dark:text-purple-300 dark:ring-purple-800/30",
      tag === "past" &&
        "bg-emerald-50 text-emerald-700 ring-emerald-200/60 dark:bg-emerald-900/10 dark:text-emerald-300 dark:ring-emerald-800/30",
      !tag && "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-white/10",
    ]
      .filter(Boolean)
      .join(" ");

  // Remaining mins ignores completed
  const remainingMins = useMemo(
    () => tasks.reduce((a, t) => a + (t.completed ? 0 : t.duration || 0), 0),
    [tasks]
  );

  const progressPct = useMemo(() => {
    if (!active) return 0;
    const total = (active.task.duration || 0) * 60;
    if (!total) return 0;
    return Math.round(((total - active.remainingSec) / total) * 100);
  }, [active]);

  const subtitle = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <>
      <WidgetFrame
        title="Today’s Plan"
        subtitle={subtitle}
        status={
          <span
            title="Remaining time"
            className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
          >
            {remainingMins} mins
          </span>
        }
        actions={
          !loading && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTasks((arr) => [...arr].sort(() => Math.random() - 0.5))}
                className="rounded-md border px-2 py-1 text-xs hover:border-emerald-400/40 dark:border-white/10"
                aria-label="Shuffle today’s tasks"
                title="Shuffle"
              >
                Shuffle
              </button>
              <button
                onClick={load}
                className="rounded-md border px-2 py-1 text-xs hover:border-emerald-400/40 dark:border-white/10"
                title="Refresh"
              >
                Refresh
              </button>
            </div>
          )
        }
        isExpandable
      >
        {/* States */}
        {loading ? (
          <div className="mt-2">
            <LoadingSkeleton rows={4} />
          </div>
        ) : err ? (
          <div className="mt-2">
            <ErrorState onRetry={load} details="We couldn’t fetch your plan just now.">
              Failed to load Today’s Plan.
            </ErrorState>
          </div>
        ) : tasks.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">No tasks scheduled for today.</div>
            <button
              onClick={load}
              className="mt-3 rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-emerald-400"
            >
              Generate a plan
            </button>
          </div>
        ) : (
          <>
            {/* Tasks */}
            <ul className="mt-3 space-y-2">
              {tasks.map((t, idx) => (
                <li
                  key={t.id}
                  className={[
                    "group flex items-start gap-3 rounded-lg border p-2 pr-2.5 transition",
                    "border-zinc-200 hover:border-emerald-400/30 hover:bg-emerald-50/40",
                    "dark:border-white/10 dark:hover:bg-emerald-900/5",
                    t.completed ? "opacity-60" : "opacity-100",
                  ].join(" ")}
                  draggable
                  onDragStart={() => onDragStart(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(idx)}
                >
                  {/* Drag handle + keyboard move */}
                  <div className="flex flex-col items-center pt-1">
                    <button
                      className="h-5 w-5 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      aria-label="Move up"
                      onClick={() => moveItem(idx, -1)}
                    >
                      ▲
                    </button>
                    <button
                      className="h-5 w-5 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      aria-label="Move down"
                      onClick={() => moveItem(idx, 1)}
                    >
                      ▼
                    </button>
                  </div>

                  {/* Checkbox */}
                  <div className="pt-1">
                    <input
                      id={`chk-${t.id}`}
                      type="checkbox"
                      checked={!!t.completed}
                      onChange={() => toggleComplete(t.id)}
                      className="mt-1 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-400 dark:border-zinc-700"
                      aria-label={`Mark ${t.title} ${t.completed ? "not done" : "done"}`}
                    />
                  </div>

                  {/* Task icon */}
                  <button
                    onClick={() => setOpenTask(t)}
                    className="h-9 w-9 shrink-0 rounded-lg bg-white text-emerald-600 ring-1 ring-emerald-400/30
                               dark:bg-zinc-900/60 flex items-center justify-center transition
                               group-hover:-translate-y-0.5"
                    aria-label={`Open task ${t.title}`}
                    title="View details"
                  >
                    {iconFor(t.tag)}
                  </button>

                  {/* Title + meta */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <label
                        htmlFor={`chk-${t.id}`}
                        className={[
                          "min-w-0 truncate text-sm font-medium",
                          t.completed ? "line-through text-zinc-400 dark:text-zinc-500" : "text-zinc-900 dark:text-zinc-100",
                        ].join(" ")}
                        title={t.title}
                      >
                        {t.title}
                      </label>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={pillClassFor(t.tag)}>{t.tag ?? "study"}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{t.duration}m</span>
                      </div>
                    </div>
                    {t.detail && !t.completed && (
                      <p className="mt-1 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">{t.detail}</p>
                    )}
                  </div>

                  {/* Start / Resume */}
                  <div className="flex items-center gap-2">
                    {!t.completed && (
                      <button
                        onClick={() => startTask(t)}
                        className="rounded-md bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-gray-900 hover:bg-emerald-400"
                      >
                        Start
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Active session dock */}
            {active && (
              <div className="mt-5 rounded-xl border border-emerald-200/40 bg-emerald-50/40 p-3 dark:border-emerald-900/30 dark:bg-emerald-900/10">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                      Active: {active.task.title}
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-emerald-200/60 dark:bg-emerald-900/40">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-[width] duration-700"
                        style={{ width: `${progressPct}%` }}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progressPct}
                        role="progressbar"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-sm tabular-nums text-emerald-800 dark:text-emerald-300">
                      {formatted(active.remainingSec)}
                    </span>
                    <button
                      onClick={togglePause}
                      className="rounded-md border px-2.5 py-1 text-xs hover:border-emerald-400/40 dark:border-white/10"
                    >
                      {active.paused ? "Resume" : "Pause"}
                    </button>
                    <button
                      onClick={stopSession}
                      className="rounded-md bg-white px-2.5 py-1 text-xs hover:bg-zinc-50 dark:bg-zinc-800/70"
                    >
                      Stop
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </WidgetFrame>

      {/* Task modal */}
      <TaskDetailModal task={openTask} onClose={() => setOpenTask(null)} />
    </>
  );
}