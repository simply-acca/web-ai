"use client";

import { motion } from "framer-motion";

export default function WhyUs() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const titleAnim = {
    hidden: { opacity: 0, scale: 0.97, y: 18 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  };

  const subtitleAnim = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.18, ease: "easeOut" },
    },
  };

  // underline animation (scaleX)
  const underlineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 0.65, delay: 0.12, ease: "easeOut" },
    },
  };

  const cards = [
    {
      title: "Traditional Study",
      points: [
        "Generic study paths",
        "Heavy reliance on lectures & notes",
        "Little focus on exam-day confidence",
      ],
      type: "negative",
    },
    {
      title: "ACCA AI",
      points: [
        "Personalized study plan tuned to your exam date & pace",
        "Adaptive notes, flashcards & CBE-style mocks",
        "AI tutor support for weak spots & confidence building",
        "Designed around human factors: energy, pacing, motivation",
      ],
      type: "positive",
    },
    {
      title: "Old Exam Prep",
      points: [
        "Practice-heavy but unstructured",
        "No adaptive planning",
        "Overlooks energy & motivation",
      ],
      type: "negative",
    },
  ];

  return (
    <section className="relative isolate mx-auto max-w-7xl px-6 sm:px-10 py-20">
      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 shadow-md backdrop-blur-sm p-10">
        {/* Title */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white inline-block"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={titleAnim}
          >
            Why choose{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-emerald-600 to-sky-500 bg-clip-text text-transparent">
                ACCA AI
              </span>
              {/* animated underline (positioned under the inline-block text) */}
              <motion.span
                aria-hidden="true"
                className="absolute left-0 right-0 -bottom-2 h-1 rounded-full"
                style={{ transformOrigin: "left center" }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={underlineVariants}
              >
                {/* gradient + subtle glow */}
                <span className="block h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 opacity-90" />
                {/* soft blurred glow layer */}
                <span className="pointer-events-none absolute inset-0 rounded-full blur-2xl opacity-30 bg-gradient-to-r from-emerald-400 to-teal-300" />
              </motion.span>
            </span>
            ?
          </motion.h2>

          <motion.p
            className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={subtitleAnim}
          >
            We don’t just provide materials. We build{" "}
            <span className="font-medium">a complete learning journey</span> that
            adapts to your pace, supports your mindset, and helps you pass in the
            best possible condition.
          </motion.p>
        </div>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              className={`group rounded-2xl p-6 shadow-sm transition transform hover:-translate-y-1 ${
                card.type === "positive"
                  ? "border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 hover:shadow-emerald-500/20 hover:border-emerald-600"
                  : "border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900/60 hover:shadow-lg"
              }`}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  card.type === "positive"
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {card.title}
              </h3>
              <ul className="space-y-3 text-sm">
                {card.points.map((point, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span
                      className={`mt-0.5 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5 ${
                        card.type === "positive"
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      {card.type === "positive" ? "✔" : "✖"}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}