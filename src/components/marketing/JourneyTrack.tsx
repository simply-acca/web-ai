'use client';
import { motion } from 'framer-motion';

export default function JourneyTrack({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full ${className}`}>
      <svg viewBox="0 0 1200 260" className="h-56 w-full">
        <defs>
          <linearGradient id="jt-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="55%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <filter id="jt-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* main curve */}
        <motion.path
          d="M 60 180 C 220 140, 360 80, 520 120 S 900 200, 1140 120"
          fill="none"
          stroke="url(#jt-grad)"
          strokeWidth="10"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          style={{ filter: 'url(#jt-glow)' }}
        />

        {/* light dashed overlay */}
        <motion.path
          d="M 60 180 C 220 140, 360 80, 520 120 S 900 200, 1140 120"
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2"
          strokeDasharray="8 14"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.1 }}
        />

        {/* pins */}
        {[
          { x: 60, y: 180, label: 'Start' },
          { x: 320, y: 110, label: 'Study Planner' },
          { x: 600, y: 95, label: 'Personalised Learning' },
          { x: 880, y: 190, label: 'Mock Exam' },
          { x: 1140, y: 120, label: 'Exam Success' },
        ].map((p, i) => (
          <g key={i} transform={`translate(${p.x}, ${p.y})`}>
            <circle r="11" className="fill-[#0b0f14]" />
            <circle r="8" fill="url(#jt-grad)" />
          </g>
        ))}
      </svg>

      {/* labels */}
      <div className="mx-auto grid max-w-5xl grid-cols-5 gap-3 px-2 text-center text-[11px] text-gray-300 sm:text-xs">
        {['Start', 'Study Planner', 'Personalised Learning', 'Mock Exam', 'Exam Success'].map((t) => (
          <div key={t} className="rounded-xl border border-white/10 px-2 py-1.5">{t}</div>
        ))}
      </div>
    </div>
  );
}