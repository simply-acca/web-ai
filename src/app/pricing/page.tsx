export const metadata = { title: 'Pricing' }

const tiers = [
  { name: 'Free', price: '€0', tagline: 'Start now', features: ['Basic study planner', 'Limited question bank', 'AI Tutor (5 Q/day)'] },
  { name: '3‑Month', price: '€39', tagline: 'Most Popular', features: ['Full planner', 'All questions & mocks', 'AI Tutor (unlimited)'] },
  { name: '1‑Year', price: '€99', tagline: 'Best Value', features: ['All features', 'Priority support', 'Progress analytics'] },
]

export default function Page() {
  return (
    <main>
      <h1 className="text-3xl font-bold">Pricing</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">Simple, transparent plans designed for exam cycles.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div key={t.name} className="rounded-2xl border p-6 shadow-sm dark:border-gray-800">
            <div className="flex items-baseline justify-between">
              <div className="text-lg font-semibold">{t.name}</div>
              <div className="text-xs text-brand-600">{t.tagline}</div>
            </div>
            <div className="mt-2 text-3xl font-bold">{t.price}</div>
            <ul className="mt-4 space-y-2 text-sm">
              {t.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <a href="/sign-up" className="mt-6 block rounded-xl bg-brand-600 px-4 py-2 text-center font-medium text-white hover:bg-brand-500">Choose {t.name}</a>
          </div>
        ))}
      </div>
    </main>
  )
}