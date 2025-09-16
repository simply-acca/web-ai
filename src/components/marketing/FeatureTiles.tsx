const FEATURES = [
  { title: 'Study Planner', desc: 'Generates a plan by exam date, hours/week, and confidence per topic.', icon: '🎯' },
  { title: 'Adaptive Notes', desc: 'Concise notes, flashcards, and micro‑notes aligned to syllabus areas.', icon: '🧠' },
  { title: 'Smart Question Bank', desc: 'MCQ, OTQ, MTQ, and case questions with detailed solutions.', icon: '🧩' },
  { title: 'CBE‑style Mocks', desc: 'Timed mocks in an interface similar to ACCA’s CBE platform.', icon: '🖥️' },
  { title: 'AI Tutor', desc: 'Ask follow‑up questions, get hints, and fix weak spots fast.', icon: '🤖' },
  { title: 'Progress Analytics', desc: 'Track mastery, streaks, and topic coverage vs the exam blueprint.', icon: '📈' },
]

export default function FeatureTiles() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((f) => (
        <div key={f.title} className="rounded-2xl border p-6 shadow-sm hover:shadow-md dark:border-gray-800">
          <div className="text-2xl">{f.icon}</div>
          <div className="mt-2 text-lg font-semibold">{f.title}</div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{f.desc}</p>
        </div>
      ))}
    </div>
  )
}