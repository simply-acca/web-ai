"use client";

import React from "react";
import { useUser } from "@/components/user/UserContext";

export default function Topbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { user, loading, error, refresh } = useUser();

  return (
    <header
      className="
        sticky top-0 z-30 -mx-2 mb-2 rounded-xl border border-zinc-200/80
        bg-white/80 px-2 py-2 backdrop-blur
        dark:border-white/10 dark:bg-zinc-900/70
      "
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: menu + greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            aria-label="Open menu"
            className="md:hidden rounded-lg p-2 border border-zinc-200 bg-white text-zinc-700
                       hover:bg-zinc-50 active:scale-[0.98]
                       dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200"
          >
            ☰
          </button>

          <div className="hidden md:block">
            {loading ? (
              <>
                <div className="h-5 w-40 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="mt-1 h-4 w-48 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              </>
            ) : error ? (
              <button
                onClick={refresh}
                className="rounded-md border px-2 py-1 text-xs hover:border-emerald-400/40 dark:border-white/10"
              >
                Retry user
              </button>
            ) : (
              <>
                <h1 className="text-2xl font-semibold">
                  Hi {user?.name?.split(" ")[0]} 👋
                </h1>
                {!!user?.nextExam && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {user.nextExam.days} days until your {user.nextExam.code} exam
                  </p>
                )}
              </>
            )}
          </div>

          <div className="md:hidden">
            <h1 className="text-lg font-semibold">
              {loading ? "…" : `Hi ${user?.name?.split(" ")[0] ?? ""}`}
            </h1>
          </div>
        </div>

        {/* Right: compact search + rounded bell + avatar (no menu) */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block relative">
            <input
              type="search"
              placeholder="Search notes, questions…"
              className="
                w-64 rounded-lg border border-zinc-200 bg-white pl-9 pr-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-emerald-300
                dark:border-white/10 dark:bg-zinc-900/40
              "
            />
            <span
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              aria-hidden
            >
              ⌘K
            </span>
          </div>

          {/* Rounded bell */}
          <button
            className="
              relative inline-flex h-9 w-9 items-center justify-center rounded-full
              border border-zinc-200 bg-white text-[15px]
              hover:bg-zinc-50 active:scale-[0.98]
              dark:border-white/10 dark:bg-zinc-900/60
            "
            title="Notifications"
            aria-label="Open notifications"
          >
            🔔
            {/* optional count badge if provided */}
            {!!user?.notifications && (
              <span
                className="
                  absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center
                  rounded-full bg-emerald-500 px-1 text-[11px] font-semibold text-gray-900
                "
                aria-label={`${user.notifications} notifications`}
              >
                {user.notifications}
              </span>
            )}
          </button>

          {/* Avatar only (no dropdown; link to profile if you want) */}
          <a
            href="/dashboard/profile"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-zinc-200 dark:ring-white/10 overflow-hidden"
            aria-label="Open profile"
            title="Profile"
          >
            {loading ? (
              <span className="h-full w-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            ) : (
              <img
                src={user?.photo || "/avatars/default.png"}
                alt={user?.name || "User"}
                className="h-9 w-9 object-cover"
              />
            )}
          </a>
        </div>
      </div>
    </header>
  );
}