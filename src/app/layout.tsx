import '@/app/globals.css'
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#10b981' },
    { media: '(prefers-color-scheme: dark)', color: '#065f46' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.com'),
  title: { default: 'ACCA with AI — Faster, Smarter, Passed', template: '%s | ACCA with AI' },
  description: 'AI-powered study plans, adaptive notes, and exam-style practice for ACCA.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 antialiased">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between py-6">
            <a href="/" className="text-xl font-bold tracking-tight">ACCA<span className="text-brand-600">AI</span></a>
            <nav className="hidden gap-6 md:flex">
              <a href="/papers" className="hover:text-brand-600">Papers</a>
              <a href="/question-bank" className="hover:text-brand-600">Question Bank</a>
              <a href="/ai-tutor" className="hover:text-brand-600">AI Tutor</a>
              <a href="/pricing" className="hover:text-brand-600">Pricing</a>
            </nav>
            <div className="flex items-center gap-3">
              <a href="/sign-in" className="rounded-xl border px-3 py-1.5 text-sm hover:border-brand-400">Sign in</a>
              <a href="/sign-up" className="rounded-xl bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-500">Get Started</a>
            </div>
          </header>
          {children}
          <footer className="mt-20 border-t py-10 text-sm text-gray-600 dark:border-gray-800">
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <div className="text-lg font-semibold">ACCA<span className="text-brand-600">AI</span></div>
                <p className="mt-3 max-w-sm">Modern ACCA learning platform with AI-powered study plans, adaptive notes and mock exams.</p>
              </div>
              <div>
                <div className="font-semibold">Product</div>
                <ul className="mt-3 space-y-2">
                  <li><a href="/papers" className="hover:text-brand-600">Papers</a></li>
                  <li><a href="/question-bank" className="hover:text-brand-600">Question Bank</a></li>
                  <li><a href="/ai-tutor" className="hover:text-brand-600">AI Tutor</a></li>
                  <li><a href="/pricing" className="hover:text-brand-600">Pricing</a></li>
                </ul>
              </div>
              <div>
                <div className="font-semibold">Company</div>
                <ul className="mt-3 space-y-2">
                  <li><a href="/about" className="hover:text-brand-600">About</a></li>
                  <li><a href="/blog" className="hover:text-brand-600">Blog</a></li>
                  <li><a href="/contact" className="hover:text-brand-600">Contact</a></li>
                </ul>
              </div>
            </div>
            <p className="mt-8 text-xs">© {new Date().getFullYear()} ACCA AI. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
