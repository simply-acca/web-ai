export default function CompetitorBar() {
  const items = [
    { name: 'ACCA Global', href: 'https://www.accaglobal.com/' },
    { name: 'Learnsignal', href: 'https://www.learnsignal.com/' },
    { name: 'aCOWtancy', href: 'https://www.acowtancy.com/' },
  ]
  return (
    <div className="rounded-2xl border p-4 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-300">
      <p>Inspired by the best, built different — AI‑first planning, adaptive content, and analytics you won’t find on traditional platforms.</p>
      <ul className="mt-2 flex flex-wrap gap-4">
        {items.map((i) => (
          <li key={i.name}>
            <a target="_blank" rel="noreferrer" className="underline decoration-dotted underline-offset-4 hover:text-brand-600" href={i.href}>
              {i.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}