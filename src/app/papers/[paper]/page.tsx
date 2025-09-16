import { notFound } from 'next/navigation'
import { syllabus, type PaperId } from '@/lib/papers'

export function generateStaticParams() {
  return Object.keys(syllabus).map((id) => ({ paper: id }))
}

export function generateMetadata({ params }: { params: { paper: PaperId } }) {
  const data = syllabus[params.paper]
  return { title: `${data?.title ?? 'Paper'}` }
}

export default function Page({ params }: { params: { paper: PaperId } }) {
  const data = syllabus[params.paper]
  if (!data) return notFound()
  return (
    <article>
      <h2 className="!mt-0">{data.title}</h2>
      <p className="text-sm opacity-80">Mapped to the 2025/26 syllabus.</p>
      <ul>
        {data.areas.map((a) => (
          <li key={a.code}>
            <strong>{a.code}.</strong> {a.title}
          </li>
        ))}
      </ul>
      <a className="inline-block rounded-xl border px-3 py-1.5 text-sm hover:border-brand-400" href="/question-bank">Practice questions</a>
    </article>
  )
}