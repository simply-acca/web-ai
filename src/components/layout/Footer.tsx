export default function Footer() {
  return (
    <footer className="mt-20 border-t py-10 text-sm text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10">
      <div className="mx-auto max-w-[1200px] grid gap-8 px-4 sm:px-6 lg:px-8 sm:grid-cols-3">
        <div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            ACCA<span className="text-emerald-600 dark:text-emerald-400">AI</span>
          </div>
          <p className="mt-3 max-w-sm">
            Modern ACCA learning platform with AI-powered study plans, adaptive notes and mock exams.
          </p>
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">Product</div>
          <ul className="mt-3 space-y-2">
            <li><a href="/papers" className="hover:text-emerald-600 dark:hover:text-emerald-400">Papers</a></li>
            <li><a href="/question-bank" className="hover:text-emerald-600 dark:hover:text-emerald-400">Question Bank</a></li>
            <li><a href="/ai-tutor" className="hover:text-emerald-600 dark:hover:text-emerald-400">AI Tutor</a></li>
            <li><a href="/pricing" className="hover:text-emerald-600 dark:hover:text-emerald-400">Pricing</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">Company</div>
          <ul className="mt-3 space-y-2">
            <li><a href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400">About</a></li>
            <li><a href="/blog" className="hover:text-emerald-600 dark:hover:text-emerald-400">Blog</a></li>
            <li><a href="/contact" className="hover:text-emerald-600 dark:hover:text-emerald-400">Contact</a></li>
          </ul>
        </div>
      </div>
      <p className="mt-8 text-xs text-gray-400 dark:text-gray-500 text-center">
        © {new Date().getFullYear()} ACCA AI. All rights reserved.
      </p>
    </footer>
  );
}