export default function PapersLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="prose dark:prose-invert">
      <h1>ACCA Papers</h1>
      {children}
    </main>
  )
}