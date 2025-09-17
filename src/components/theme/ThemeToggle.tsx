"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => mounted && setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="rounded-xl border px-3 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/5"
    >
      {!mounted ? "…" : isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}