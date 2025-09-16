'use client'
import { motion } from 'framer-motion'

export type Milestone = { id: string; label: string; sub?: string }

export default function JourneyTrack({ className = '', milestones = DEFAULT_MILESTONES }: { className?: string; milestones?: Milestone[] }) {
  return (
    <div className={`relative w-full ${className}`}>
      <svg viewBox="0 0 1200 340" className="h-64 w-full">
        <defs>
          <linearGradient id="jt-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#22c1c3" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path d="M 40 290 C 260 260, 280 60, 520 90 S 900 250, 1160 60" fill="none" stroke="url(#jt-grad)" strokeWidth="10" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: 'easeInOut' }} style={{ filter: 'url(#softGlow)' }} />
        <motion.path d="M 40 290 C 260 260, 280 60, 520 90 S 900 250, 1160 60" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeDasharray="6 14" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.15 }} />
        {PIN_POINTS.map((p, i) => (
          <g key={i} transform={`translate(${p.x}, ${p.y})`}>
            <circle r="12" className="fill-white dark:fill-gray-900" />
            <circle r="8" fill="url(#jt-grad)" />
          </g>
        ))}
      </svg>
      <div className="mx-auto grid max-w-5xl grid-cols-5 gap-3 px-4 text-center text-xs sm:text-sm">
        {milestones.map((m) => (
          <div key={m.id} className="rounded-xl border px-2 py-2 dark:border-gray-800">
            <div className="font-medium">{m.label}</div>
            {m.sub && <div className="mt-0.5 opacity-70">{m.sub}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

const DEFAULT_MILESTONES: Milestone[] = [
  { id: 'start', label: 'Start' },
  { id: 'planner', label: 'Study Planner' },
  { id: 'learn', label: 'Personalised Learning' },
  { id: 'mock', label: 'Mock Exam' },
  { id: 'pass', label: 'Exam Success' },
]
const PIN_POINTS = [
  { x: 40, y: 290 },
  { x: 300, y: 230 },
  { x: 560, y: 110 },
  { x: 820, y: 210 },
  { x: 1160, y: 60 },
]