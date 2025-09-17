import './globals.css';
import type { Metadata } from 'next';
import Providers from './provider';
import { Toaster } from "react-hot-toast";
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: { default: 'ACCA with AI — Faster, Smarter, Passed', template: '%s | ACCA with AI' },
  description: 'AI-powered study plans, adaptive notes, and exam-style practice for ACCA.',
};

const noFlash = `
(() => {
  try {
    const stored = localStorage.getItem('theme');           // "light" | "dark" 
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const t = stored ?? 'system';
    const dark = t === 'dark' || (t === 'system' && systemDark);
    document.documentElement.classList.toggle('dark', dark); // set before paint
  } catch(_) {}
})();
`;


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body className="antialiased min-h-screen bg-zinc-50 text-zinc-900 dark:bg-[#0b0f14] dark:text-zinc-100 transition-colors duration-700">
        <Toaster position="bottom-right" />
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}