const FEATURES = [
  { title: 'Study Planner', desc: 'Plan by exam date, hours/week & confidence per topic.', icon: '🎯' },
  { title: 'Adaptive Notes', desc: 'Concise notes, flashcards & micro-notes by syllabus area.', icon: '🧠' },
  { title: 'Smart Question Bank', desc: 'MCQ, OTQ, MTQ + detailed solutions and tips.', icon: '🧩' },
  { title: 'CBE-style Mocks', desc: 'Timed mocks in an ACCA-like interface.', icon: '🖥️' },
  { title: 'AI Tutor', desc: 'Ask questions, get hints and fix weak spots fast.', icon: '🤖' },
  { title: 'Progress Analytics', desc: 'Mastery, streaks & topic coverage vs blueprint.', icon: '📈' },
];

export default function FeatureTiles() {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-semibold text-white/90">Our focus, your success</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm transition hover:border-emerald-400/40"
          >
            <div className="text-2xl">{f.icon}</div>
            <div className="mt-2 text-base font-semibold text-white">{f.title}</div>
            <p className="mt-1 text-sm text-gray-300">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}