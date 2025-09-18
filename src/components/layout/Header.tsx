"use client";

import Link from "next/link";
import Navbar from "./Navbar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function Header() {
  return (
    <header
      className="
        sticky top-0 z-40
        border-b border-zinc-200/70 bg-white/80 backdrop-blur
        dark:border-white/10 dark:bg-zinc-900/70
      "
      role="banner"
    >
      <div
        className="
          mx-auto flex max-w-[1200px] items-center justify-between
          px-4 sm:px-6 lg:px-8 py-3 sm:py-4
        "
      >
        {/* Brand */}
        <Link
          href="/"
          className="
            inline-flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight
            text-zinc-900 dark:text-zinc-100
            focus:outline-none focus:ring-2 focus:ring-emerald-300/60 rounded-md px-1
          "
          aria-label="ACCA AI Home"
        >
          ACCA<span className="text-emerald-600 dark:text-emerald-400">AI</span>
        </Link>

        {/* Center nav (desktop) + mobile toggle inside Navbar */}
        <Navbar />

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <Link
            href="/sign-in"
            className="
              hidden sm:inline-flex items-center rounded-xl border px-3 py-1.5 text-sm
              border-zinc-200 text-zinc-700 hover:border-emerald-400/60 hover:text-zinc-900
              dark:border-white/10 dark:text-zinc-200 dark:hover:text-zinc-100
              focus:outline-none focus:ring-2 focus:ring-emerald-300/60
            "
          >
            Sign in
          </Link>

          <Link
            href="/sign-up"
            className="
              inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1.5 text-sm font-semibold
              text-gray-900 hover:bg-emerald-400
              dark:bg-emerald-500 dark:hover:bg-emerald-400
              focus:outline-none focus:ring-2 focus:ring-emerald-300/60
            "
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}