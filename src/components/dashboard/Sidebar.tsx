"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useUser } from "@/components/user/UserContext";

/* ---------- Inline icons (kept minimal, tuned strokes) ---------- */
const Icon = {
  plan: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
      <path d="M7 3.5v3M17 3.5v3M3.5 9.5h17" />
      <path d="M7 15l3-2 2 1.5 4-3" />
    </svg>
  ),
  revision: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h12l4 4v8a2 2 0 0 1-2 2H4z" />
      <path d="M16 6v4h4" />
      <path d="M7 15h10M7 11h6" />
    </svg>
  ),
  papers: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3.5h7l5 5v12a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5z" />
      <path d="M14 3.5V9h5.5" />
    </svg>
  ),
  bank: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10l9-6 9 6" />
      <path d="M5 10v8M12 10v8M19 10v8" />
      <path d="M3 18h18" />
    </svg>
  ),
  insights: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 20V10M12 20V6M19 20V14" />
      <path d="M4 20h16" />
    </svg>
  ),
  tutor: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 8.5h8.5c4.2 0 6.5 2.7 6.5 5.3S17.2 19 13 19H9.5L6 21v-2H6c-4 0-6.5-2.6-6.5-5.2S2.4 8.5 6.5 8.5Z" />
      <circle cx="11.5" cy="13" r="0.9" />
      <circle cx="15" cy="13" r="0.9" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c0-3.3 3.1-6 7-6s7 2.7 7 6" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3.5" />
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1A2 2 0 1 1 7.6 4.8l.1.1a1 1 0 0 0 1.1.2h.1c.4-.2.6-.5.6-.9V4a2 2 0 1 1 4 0v.1c0 .4.2.7.6.9h.1a1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1" />
    </svg>
  ),
};

/* ---------- Nav structure ---------- */
type Item = { href: string; label: string; icon: JSX.Element; note?: string; badge?: string };
const NAV: { title: string; items: Item[] }[] = [
  {
    title: "Study",
    items: [
      { href: "/dashboard", label: "Study Plan", icon: Icon.plan, note: "Your daily flow" },
      { href: "/dashboard/revision", label: "Revision", icon: Icon.revision, note: "Spaced review" },
      { href: "/dashboard/ai-tutor", label: "AI Tutor", icon: Icon.tutor, badge: "New", note: "Ask & practice" },
    ],
  },
  {
    title: "Practice",
    items: [
      { href: "/dashboard/question-bank", label: "Question Bank", icon: Icon.bank, note: "MCQ, OT, MTQ" },
      { href: "/dashboard/past-papers", label: "Past Papers", icon: Icon.papers, note: "CBE-style" },
    ],
  },
  {
    title: "Insights",
    items: [
      { href: "/dashboard/insights", label: "Progress", icon: Icon.insights, note: "Mastery & trends" },
      { href: "/dashboard/profile", label: "Profile", icon: Icon.profile },
      { href: "/dashboard/settings", label: "Settings", icon: Icon.settings },
    ],
  },
];

export default function Sidebar({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const { user, loading } = useUser();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const exam = useMemo(() => user?.nextExam ?? { code: "BT", days: 42 }, [user?.nextExam]);
  const initials =
    (user?.name || "A U")
      .split(" ")
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "AU";

  return (
    <nav aria-label="Dashboard navigation" className="space-y-6">
      {/* Header card */}
      <div
        className="
          relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/70 p-4
          shadow-sm backdrop-blur-sm
          dark:border-white/10 dark:bg-zinc-900/60
        "
      >
        {/* subtle background accents */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-sky-400/10 blur-2xl"
        />

        <div className="flex items-center gap-3">
          {/* Avatar (initials fallback) */}
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-zinc-200 dark:ring-white/10">
            {loading ? (
              <span className="block h-full w-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            ) : user?.photo ? (
              <img src={user.photo} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-200">
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">
              {loading ? "…" : user?.name ?? "Student"}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              @{loading ? "…" : user?.handle ?? "user"}
            </div>
          </div>

          {/* Exam chip */}
          <div className="ml-auto inline-flex items-center gap-2 rounded-lg border border-emerald-300/40 bg-emerald-50/60 px-2 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-300">
            <span title="Next exam">{exam.code}</span>
            <span aria-hidden>•</span>
            <span title="Days left">{exam.days}d</span>
          </div>
        </div>

        {/* Quick action */}
        <Link
          href="/dashboard/session/start"
          onClick={() => onItemClick?.()}
          className="
            mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl
            bg-emerald-500 px-3 py-2 text-sm font-semibold text-gray-900
            shadow-[0_8px_30px_rgba(16,185,129,0.25)] hover:bg-emerald-400 transition
          "
        >
          ▶ Continue study
        </Link>
      </div>

      {/* Navigation rail */}
      <div className="rounded-2xl border border-zinc-200 bg-white/70 p-3 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/60">
        {NAV.map((group) => (
          <div key={group.title} className="mb-3 last:mb-0">
            <div className="px-2 pb-1 text-[11px] uppercase tracking-[0.14em] text-zinc-500/80 dark:text-zinc-400/80">
              {group.title}
            </div>
            <ul className="space-y-1">
              {group.items.map((it) => {
                const active = isActive(it.href);
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      onClick={() => onItemClick?.()}
                      className={[
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2 transition",
                        active
                          ? "bg-emerald-50/80 text-emerald-800 ring-1 ring-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300"
                          : "text-zinc-700 hover:bg-zinc-100/70 dark:text-zinc-200 dark:hover:bg-zinc-800/70",
                      ].join(" ")}
                    >
                      {/* Active accent bar */}
                      <span
                        aria-hidden
                        className={[
                          "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full",
                          active ? "bg-emerald-500" : "bg-transparent",
                        ].join(" ")}
                      />
                      {/* Icon */}
                      <span
                        className={[
                          "shrink-0 rounded-md p-1.5 ring-1 transition",
                          active
                            ? "text-emerald-600 ring-emerald-400/30 bg-white dark:bg-zinc-900/80"
                            : "text-zinc-500 ring-zinc-200 bg-white/80 dark:ring-white/10 dark:bg-zinc-900/40 group-hover:text-emerald-500",
                        ].join(" ")}
                        aria-hidden
                      >
                        {it.icon}
                      </span>

                      {/* Labels */}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{it.label}</span>
                        {it.note && (
                          <span className="block truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                            {it.note}
                          </span>
                        )}
                      </span>

                      {/* Badge (optional) */}
                      {it.badge && (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                          {it.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Help card */}
      <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4 text-sm shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/60">
        <div className="font-medium">Need help?</div>
        <div className="mt-1 text-zinc-600 dark:text-zinc-400">
          Chat with support or see study tips.
        </div>
        <div className="mt-3 flex gap-2">
          <Link
            href="/support"
            onClick={() => onItemClick?.()}
            className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-[12px] hover:border-emerald-400/40 dark:border-white/10 dark:bg-zinc-900/60"
          >
            Support
          </Link>
          <Link
            href="/tips"
            onClick={() => onItemClick?.()}
            className="rounded-md bg-emerald-500/90 px-2.5 py-1 text-[12px] font-semibold text-gray-900 hover:bg-emerald-400"
          >
            Study tips
          </Link>
        </div>
      </div>
    </nav>
  );
}