import React from "react";
import FeatureSectionHeading from "./FeatureSectionHeading";

/* --------- ICON BASE (gradient strokes) --------- */
const GradientIcon = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="h-5 w-5"
  >
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
    <g stroke={`url(#${id})`}>{children}</g>
  </svg>
);

const IconBadge = ({ children }: { children: React.ReactNode }) => (
  <span
    className="
      group relative inline-flex h-10 w-10 items-center justify-center rounded-lg
      bg-blue-500/10 ring-1 ring-blue-400/20 text-blue-500
      dark:bg-emerald-400/10 dark:ring-emerald-400/20 dark:text-emerald-400
      transition duration-500
    "
  >
    {/* hover glow */}
    <span
      className="
        pointer-events-none absolute inset-0 rounded-lg blur-md opacity-0 transition duration-500
        group-hover:opacity-100
        bg-blue-400/20 dark:bg-emerald-400/20
      "
    />
    {/* icon pulses when parent card is hovered */}
    <span className="relative transition-transform duration-500 will-change-transform group-hover:animate-iconPulse">
      {children}
    </span>
  </span>
);

/* --------- ICONS --------- */
const IconStudyPlanner = () => (
  <GradientIcon id="grad-study">
    <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
    <path d="M7 3.5v3M17 3.5v3M3.5 9.5h17" />
    <path d="M6 15.5l4.2-3.2 2.9 2 4.9-4" />
    <circle cx="18" cy="10.3" r="0.9" fill="url(#grad-study)" />
  </GradientIcon>
);

const IconAdaptiveNotes = () => (
  <GradientIcon id="grad-notes">
    <rect x="5" y="6" width="12.5" height="14" rx="2.5" />
    <path d="M17.5 11V7.8c0-.3-.1-.6-.3-.8l-2.5-2.5c-.2-.2-.5-.3-.8-.3H9" />
    <path d="M8.5 11h7M8.5 14h5.5M8.5 17h4" />
    <path d="M14.7 4.2V7h2.8" />
  </GradientIcon>
);

const IconQuestionBank = () => (
  <GradientIcon id="grad-bank">
    <path d="M3.5 8.5c3-1.2 6-1.2 9 0v9c-3-1.2-6-1.2-9 0v-9Z" />
    <path d="M20.5 8.5c-3-1.2-6-1.2-9 0v9c3-1.2 6-1.2 9 0v-9Z" />
    <circle cx="18.2" cy="6.2" r="2.2" />
    <path d="M18.2 5.2c0-.9 1.6-.9 1.6 0 0 .7-.7.8-.7 1.4" strokeWidth="1.5" />
    <circle cx="18.2" cy="7.9" r="0.5" fill="url(#grad-bank)" />
  </GradientIcon>
);

const IconMocks = () => (
  <GradientIcon id="grad-mocks">
    <rect x="3.75" y="5.5" width="16.5" height="11" rx="2.5" />
    <path d="M9 19h6M8 16h8" />
    <circle cx="18.3" cy="7.7" r="2.4" />
    <path d="M18.3 6.4v1.7l1.3.8" />
    <path d="M18.3 4.8v.9" />
  </GradientIcon>
);

const IconAITutor = () => (
  <GradientIcon id="grad-ai">
    <path d="M4.5 8.5h8.5c4.2 0 6.5 2.7 6.5 5.3s-2.3 5.2-6.5 5.2h-3.5l-3 2.5v-2.5H6.5c-4 0-6.5-2.6-6.5-5.2S2.4 8.5 6.5 8.5Z" />
    <circle cx="11.2" cy="13.2" r="0.9" fill="url(#grad-ai)" />
    <circle cx="14.8" cy="13.2" r="0.9" fill="url(#grad-ai)" />
    <path d="M9.2 11.2c1.8-1.1 8.8-1.1 10.2 0" opacity="0.75" />
  </GradientIcon>
);

const IconAnalytics = () => (
  <GradientIcon id="grad-analytics">
    <path d="M5.5 18.5v-4.5M10 18.5v-7M14.5 18.5v-9.5M19 18.5v-6" />
    <path d="M5.5 14l4.5-2.5L14.5 9l4.5-2.2" />
    <circle cx="19" cy="6.8" r="0.9" fill="url(#grad-analytics)" />
  </GradientIcon>
);

/* --------- MAIN COMPONENT --------- */
export default function FeatureTiles() {
  const features = [
    { title: "Study Planner", desc: "Plan by exam date, hours/week & confidence per topic.", icon: <IconBadge><IconStudyPlanner /></IconBadge> },
    { title: "Adaptive Notes", desc: "Concise notes, flashcards & micro-notes by syllabus area.", icon: <IconBadge><IconAdaptiveNotes /></IconBadge> },
    { title: "Smart Question Bank", desc: "MCQ, OTQ, MTQ + detailed solutions and tips.", icon: <IconBadge><IconQuestionBank /></IconBadge> },
    { title: "CBE-style Mocks", desc: "Timed mocks in an ACCA-like interface.", icon: <IconBadge><IconMocks /></IconBadge> },
    { title: "AI Tutor", desc: "Ask questions, get hints and fix weak spots fast.", icon: <IconBadge><IconAITutor /></IconBadge> },
    { title: "Progress Analytics", desc: "Mastery, streaks & topic coverage vs blueprint.", icon: <IconBadge><IconAnalytics /></IconBadge> },
  ];

  return (
    <section className="relative isolate overflow-hidden rounded-3xl
                 bg-gradient-to-br from-teal-50 via-white to-sky-50
                 dark:from-indigo-900 dark:via-teal-900 dark:to-emerald-950
                 mx-auto max-w-7xl px-6 sm:px-10 py-20">
  {/* LIGHT: teal→sky duotone (clean SaaS) */}
  <div className="absolute inset-0 dark:opacity-0 transition-opacity duration-700">
    <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-sky-50" />
    {/* ultra-soft vignette so edges don’t feel empty */}
    <div className="absolute inset-0 [mask-image:radial-gradient(75%_75%_at_50%_40%,black,transparent)] bg-zinc-900/5" />
  </div>

  {/* DARK: indigo→teal duotone + subtle radial glow */}
  <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-700">
  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-teal-900 to-emerald-950" />
  {/* soft radial emerald glow in center */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.12)_0%,transparent_70%)]" />
</div>

  {/* CONTENT */}
  <div className="relative z-10 px-4 sm:px-6 lg:px-8">
    <FeatureSectionHeading />

    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((f) => (
        <div
          key={f.title}
          className="group relative transform rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-700 hover:-translate-y-1 hover:shadow-lg
                     dark:scale-[0.97] dark:border-white/5 dark:bg-zinc-900/60 dark:backdrop-blur-sm
                     dark:hover:scale-100 dark:hover:border-emerald-400/30 dark:hover:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.25)]"
        >
          <div className="mb-4">{f.icon}</div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 transition-colors duration-700">
            {f.title}
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 transition-colors duration-700">
            {f.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
  );
}

