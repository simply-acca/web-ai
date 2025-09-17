export default function CTA() {
  return (
    <section
      className="relative isolate mx-auto max-w-7xl px-6 sm:px-10 py-24
                 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700
                 text-white shadow-2xl overflow-hidden"
    >
      {/* Glow accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Headline */}
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Study smarter, pass with confidence.
        </h2>

        {/* Supporting text */}
        <p className="mt-4 text-lg text-emerald-50/90 leading-relaxed">
          ACCA AI isn’t another library of notes or endless lectures.  
          We combine <span className="font-semibold">personalized study plans</span> with 
          <span className="font-semibold"> human-aware support</span> — 
          pacing, motivation, and exam confidence — so you prepare in the best possible conditions.  
          This is why students choose us over ACCA Global, LearnSignal, or Acowtancy.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-5">
          <a
            href="/pricing"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 shadow-lg
                       transition-all duration-300 hover:bg-gray-100 hover:shadow-[0_12px_40px_rgba(255,255,255,0.4)]"
          >
            Start your personalized plan
          </a>
          <a
            href="#why-us"
            className="rounded-xl border border-white/30 px-6 py-3 font-medium text-white/90
                       backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-white"
          >
            Why choose ACCA AI?
          </a>
        </div>

        {/* Testimonial strip */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl bg-white/10 p-5 text-left shadow-sm">
            <p className="text-sm text-emerald-50/90 italic">
              “I felt supported, not overwhelmed. The plan adapted to my weak areas and gave me confidence before exam day.”
            </p>
            <p className="mt-3 text-xs font-medium text-emerald-100">— Aisha, BT Student</p>
          </div>
          <div className="rounded-xl bg-white/10 p-5 text-left shadow-sm">
            <p className="text-sm text-emerald-50/90 italic">
              “It was the first time I saw a study platform care about my pacing and motivation. It’s not just questions — it’s guidance.”
            </p>
            <p className="mt-3 text-xs font-medium text-emerald-100">— Daniel, MA Student</p>
          </div>
        </div>
      </div>
    </section>
  );
}