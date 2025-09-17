import './globals.css';
import type { Metadata } from 'next';
import Providers from './provider';
import { Toaster } from "react-hot-toast";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: { default: 'ACCA with AI — Faster, Smarter, Passed', template: '%s | ACCA with AI' },
  description: 'AI-powered study plans, adaptive notes, and exam-style practice for ACCA.',
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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