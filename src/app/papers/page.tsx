import Link from 'next/link'

const PAPERS = [
  { id: 'bt', name: 'BT — Business and Technology' },
  { id: 'ma', name: 'MA — Management Accounting' },
  { id: 'fa', name: 'FA — Financial Accounting' },
  { id: 'lw', name: 'LW — Corporate and Business Law' },
]

export default function Page() {
  return (
    <ul>
      {PAPERS.map((p) => (
        <li key={p.id}>
          <Link href={`/papers/${p.id}`}>{p.name}</Link>
        </li>
      ))}
    </ul>
  )
}