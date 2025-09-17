"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

/* ---------- tiny inline icons (no deps) ---------- */
const Icon = {
  plan: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
      <path d="M7 3.5v3M17 3.5v3M3.5 9.5h17" />
      <path d="M7 15l3-2 2 1.5 4-3" />
    </svg>
  ),
  revision: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h12l4 4v8a2 2 0 0 1-2 2H4z" />
      <path d="M16 6v4h4" />
      <path d="M7 15h10M7 11h6" />
    </svg>
  ),
  papers: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 3.5h7l5 5v12a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5z" />
      <path d="M14 3.5V9h5.5" />
    </svg>
  ),
  bank: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10l9-6 9 6" />
      <path d="M5 10v8M12 10v8M19 10v8" />
      <path d="M3 18h18" />
    </svg>
  ),
  insights: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 20V10M12 20V6M19 20V14" />
      <path d="M4 20h16" />
    </svg>
  ),
  tutor: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4.5 8.5h8.5c4.2 0 6.5 2.7 6.5 5.3S17.2 19 13 19H9.5L6 21v-2H6c-4 0-6.5-2.6-6.5-5.2S2.4 8.5 6.5 8.5Z" />
      <circle cx="11.5" cy="13" r="0.9" />
      <circle cx="15" cy="13" r="0.9" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c0-3.3 3.1-6 7-6s7 2.7 7 6" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1A2 2 0 1 1 7.6 4.8l.1.1a1 1 0 0 0 1.1.2h.1c.4-.2.6-.5.6-.9V4a2 2 0 1 1 4 0v.1c0 .4.2.7.6.9h.1a1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.1c.2.4.5.6.9.6H20a2 2 0 1 1 0 4h-.1a1 1 0 0 0-.9.6z" />
    </svg>
  ),
};

/* ---------- progress ring (mini) ---------- */
function ProgressRing({ size = 36, stroke = 4, value = 62, track = "#e5e7eb", color = "#10b981" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={`${dash} ${c - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

/* ---------- nav config ---------- */
type Item = { href: string; label: string; icon: JSX.Element; badge?: string; soon?: boolean };

const groups: { title: string; items: Item[] }[] = [
  {
    title: "Study",
    items: [
      { href: "/dashboard", label: "Study Plan", icon: Icon.plan },
      { href: "/dashboard/revision", label: "Revision", icon: Icon.revision },
      { href: "/dashboard/ai-tutor", label: "AI Tutor", icon: Icon.tutor, badge: "New" },
    ],
  },
  {
    title: "Practice",
    items: [
      { href: "/dashboard/question-bank", label: "Question Bank", icon: Icon.bank },
      { href: "/dashboard/past-papers", label: "Past Papers", icon: Icon.papers },
    ],
  },
  {
    title: "Insights",
    items: [
      { href: "/dashboard/insights", label: "Progress", icon: Icon.insights },
      { href: "/dashboard/profile", label: "Profile", icon: Icon.profile },
      { href: "/dashboard/settings", label: "Settings", icon: Icon.settings },
    ],
  },
];

export default function Sidebar({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const exam = useMemo(() => ({ code: "BT", days: 42, mastered: 62 }), []);

  return (
    <nav aria-label="Dashboard navigation" className="space-y-5">
      {/* Brand / profile card */}
      <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm
                       dark:border-white/10 dark:bg-zinc-900/60">
        <div className="flex items-center gap-3">
          <div className="shrink-0 rounded-xl bg-emerald-500/10 p-2 ring-1 ring-emerald-400/30 text-emerald-500">
            {/* tiny logo letters */}
            <span className="text-xs font-bold tracking-wider">AI</span>
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">Alex</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Hi there 👋</div>
          </div>
          <div className="ml-auto">
            <ProgressRing value={exam.mastered} />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-zinc-200/70 px-3 py-2
                        text-xs bg-white/60 dark:bg-zinc-900/50 dark:border-white/10">
          <div className="font-medium">
            Next: <span className="text-emerald-600 dark:text-emerald-400">{exam.code}</span>
          </div>
          <div className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-600 dark:text-emerald-400">
            {exam.days} days
          </div>
        </div>

        <Link
          href="/dashboard/session/start"
          onClick={() => onItemClick?.()}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl
                     bg-emerald-500 px-3 py-2 text-sm font-semibold text-gray-900
                     shadow-[0_8px_30px_rgba(16,185,129,0.25)]
                     hover:bg-emerald-400 transition"
        >
          ▶ Start study session
        </Link>
      </div>

      {/* Groups */}
      {groups.map((g) => (
        <div key={g.title} className="space-y-2">
          <div className="px-2 text-[11px] uppercase tracking-[0.12em] text-zinc-500/80 dark:text-zinc-400/80">
            {g.title}
          </div>

          <ul className="space-y-1">
            {g.items.map((it) => {
              const active = isActive(it.href);
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={() => onItemClick?.()}
                    className={[
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                      "focus:outline-none focus:ring-2 focus:ring-emerald-300/60",
                      active
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300"
                        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "shrink-0 rounded-md p-1.5 ring-1 transition",
                        active
                          ? "text-emerald-600 ring-emerald-400/30 bg-white dark:bg-zinc-900/80"
                          : "text-zinc-500 ring-zinc-200 dark:ring-white/10 bg-white/70 dark:bg-zinc-900/40 group-hover:text-emerald-500",
                      ].join(" ")}
                      aria-hidden
                    >
                      {it.icon}
                    </span>

                    <span className="flex-1">{it.label}</span>

                    {it.badge && (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
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

      {/* Help / footer */}
      <div className="rounded-xl border border-zinc-200 bg-white/70 p-3 text-xs shadow-sm
                      dark:border-white/10 dark:bg-zinc-900/50">
        <div className="font-medium">Need help?</div>
        <div className="mt-1 text-zinc-600 dark:text-zinc-400">Chat with support or see study tips.</div>
        <div className="mt-2 flex gap-2">
          <Link
            href="/support"
            onClick={() => onItemClick?.()}
            className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 hover:border-emerald-400/40 text-zinc-700 text-[12px]
                       dark:bg-zinc-900/60 dark:border-white/10"
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