import Navbar from "./Navbar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function Header() {
  return (
    <header className="mx-auto flex max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8 py-6">
      <a href="/" className="text-xl font-bold tracking-tight">
        ACCA<span className="text-emerald-500 dark:text-emerald-400">AI</span>
      </a>

      <Navbar />

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <a
          href="/sign-in"
          className="rounded-xl border px-3 py-1.5 text-sm
                     border-gray-300 text-gray-700 hover:border-emerald-400 hover:text-gray-900
                     dark:border-white/10 dark:text-gray-200 dark:hover:border-emerald-500/40"
        >
          Sign in
        </a>
        <a
          href="/sign-up"
          className="rounded-xl bg-emerald-500 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-emerald-400
                     dark:bg-emerald-500 dark:text-gray-900 dark:hover:bg-emerald-400"
        >
          Get Started
        </a>
      </div>
    </header>
  );
}