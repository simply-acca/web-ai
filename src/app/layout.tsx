import ThemeToggle from '@/components/theme/ThemeToggle';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'ACCA with AI — Faster, Smarter, Passed', template: '%s | ACCA with AI' },
  description: 'AI-powered study plans, adaptive notes, and exam-style practice for ACCA.',
};

const noFlash = `
(() => {
  try {
    const stored = localStorage.getItem('theme');
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const systemDark = mql.matches;
    const root = document.documentElement;
    const t = stored ?? 'system';
    const dark = t === 'dark' || (t === 'system' && systemDark);
    root.classList.toggle('dark', dark);
  } catch(_) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 antialiased">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between py-6">
            <a href="/" className="text-xl font-bold tracking-tight">ACCA<span className="text-emerald-400">AI</span></a>
            <nav className="hidden gap-6 md:flex text-sm text-gray-300">
              <a href="/papers" className="hover:text-emerald-400">Papers</a>
              <a href="/question-bank" className="hover:text-emerald-400">Question Bank</a>
              <a href="/ai-tutor" className="hover:text-emerald-400">AI Tutor</a>
              <a href="/pricing" className="hover:text-emerald-400">Pricing</a>
            </nav>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <a href="/sign-in" className="rounded-xl border border-white/10 px-3 py-1.5 text-sm text-gray-200 hover:border-emerald-500/40">Sign in</a>
              <a href="/sign-up" className="rounded-xl bg-emerald-500 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-emerald-400">Get Started</a>
            </div>
          </header>
          {children}
          <footer className="mt-20 border-t border-white/10 py-10 text-sm text-gray-400">
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <div className="text-lg font-semibold text-white">ACCA<span className="text-emerald-400">AI</span></div>
                <p className="mt-3 max-w-sm">Modern ACCA learning platform with AI-powered study plans, adaptive notes and mock exams.</p>
              </div>
              <div>
                <div className="font-semibold text-white">Product</div>
                <ul className="mt-3 space-y-2">
                  <li><a href="/papers" className="hover:text-emerald-400">Papers</a></li>
                  <li><a href="/question-bank" className="hover:text-emerald-400">Question Bank</a></li>
                  <li><a href="/ai-tutor" className="hover:text-emerald-400">AI Tutor</a></li>
                  <li><a href="/pricing" className="hover:text-emerald-400">Pricing</a></li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-white">Company</div>
                <ul className="mt-3 space-y-2">
                  <li><a href="/about" className="hover:text-emerald-400">About</a></li>
                  <li><a href="/blog" className="hover:text-emerald-400">Blog</a></li>
                  <li><a href="/contact" className="hover:text-emerald-400">Contact</a></li>
                </ul>
              </div>
            </div>
            <p className="mt-8 text-xs text-gray-500">© {new Date().getFullYear()} ACCA AI. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}