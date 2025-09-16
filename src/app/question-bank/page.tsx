export const metadata = { title: 'Question Bank' }

export default function Page() {
  const buckets = [
    { name: 'BT — Business and Technology', topics: ['A1: Types of business', 'A6: Social & Demographic', 'F1: Ethics & governance'] },
    { name: 'MA — Management Accounting', topics: ['B1: Cost classification', 'C1: Break‑even', 'D1: Budgeting'] },
    { name: 'FA — Financial Accounting', topics: ['A1: Double‑entry', 'C1: Trial balance', 'E1: Financial statements'] },
  ]

  return (
    <main>
      <h1 className="text-3xl font-bold">Question Bank</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">Exam‑style questions mapped to the official ACCA syllabus. Filter by paper, topic, and difficulty.</p>
      <div className="mt-8 space-y-6">
        {buckets.map((b) => (
          <div key={b.name} className="rounded-2xl border p-6 dark:border-gray-800">
            <div className="text-lg font-semibold">{b.name}</div>
            <ul className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {b.topics.map((t) => (
                <li key={t}>• {t}</li>
              ))}
            </ul>
            <a href="#" className="mt-4 inline-block rounded-xl border px-3 py-1.5 text-sm hover:border-brand-400">Browse</a>
          </div>
        ))}
      </div>
    </main>
  )
}