"use client";

import React from "react";

export default function Topbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  return (
    <header className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          aria-label="Open menu"
          className="md:hidden rounded-md p-2 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10"
        >
          ☰
        </button>

        <div className="block md:hidden">
          <h1 className="text-lg font-semibold">Hi Alex</h1>
        </div>

        <div className="hidden md:block">
          <h1 className="text-2xl font-semibold">Hi Alex 👋</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">42 days until your BT exam</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block">
          <input
            type="search"
            placeholder="Search notes, questions..."
            className="rounded-md border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>

        <button className="rounded-full bg-white dark:bg-zinc-900/60 p-2 border border-zinc-200 dark:border-white/10">
          <span className="sr-only">Open notifications</span> 🔔
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-sm text-zinc-600 dark:text-zinc-400">ALEX</div>
          <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </header>
  );
}