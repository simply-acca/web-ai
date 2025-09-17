"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Avoid rendering incorrect icon before hydration
    return (
      <button
        aria-label="Toggle theme"
        className="rounded-xl border px-3 py-1 text-sm"
      >
        …
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="rounded-xl border px-3 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/5"
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}