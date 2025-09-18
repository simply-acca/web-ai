// src/components/marketing/JourneyTrack.tsx
'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type Milestone = { t: number; label: string; href?: string };

const MS: Milestone[] = [
  { t: 0.05, label: 'Start', href: '#start' },
  { t: 0.30, label: 'Study Planner', href: '#planner' },
  { t: 0.55, label: 'Personalised Learning', href: '#learn' },
  { t: 0.78, label: 'Mock Exam', href: '#mock' },
  { t: 0.97, label: 'Exam Success', href: '#pass' },
];

const VB_W = 1200;
const VB_H = 220;
const PATH_D = 'M 60 150 C 260 60, 460 60, 660 140 S 1040 220, 1140 120';
const PATH_DURATION = 1.0;
const LABEL_HEIGHT = 22;
const ABOVE_OFFSET = 12;

export default function JourneyTrack({ className = '', height = 200 }: { className?: string; height?: number }) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [pts, setPts] = useState<{ x: number; y: number }[] | null>(null);

  useLayoutEffect(() => {
    const compute = () => {
      const p = pathRef.current;
      if (!p) return;
      const len = p.getTotalLength();
      setPts(MS.map((m) => p.getPointAtLength(len * m.t)));
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (svgRef.current) ro.observe(svgRef.current);
    return () => ro.disconnect();
  }, []);

  const labelWidth = (text: string) => Math.max(56, Math.min(200, Math.round(text.length * 6.8) + 16));

  return (
    <div className={`relative w-full ${className}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <linearGradient id="jt-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <filter id="jt-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* main curve */}
        <motion.path
          ref={pathRef}
          d={PATH_D}
          fill="none"
          stroke="url(#jt-grad)"
          strokeWidth={8}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: PATH_DURATION, ease: 'easeInOut' }}
          style={{ filter: 'url(#jt-soft)' }}
        />

        {/* subtle dashed overlay */}
        <motion.path
          d={PATH_D}
          fill="none"
          stroke="rgba(255,255,255,0.65)"
          strokeWidth={2}
          strokeDasharray="8 14"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: PATH_DURATION, ease: 'easeInOut', delay: 0.04 }}
        />

        {/* pins + labels */}
        {pts?.map((p, i) => {
          const m = MS[i];
          const w = labelWidth(m.label);
          const x = Math.min(VB_W - w - 8, Math.max(8, p.x - w / 2));
          const y = Math.max(8, p.y - ABOVE_OFFSET - LABEL_HEIGHT);

          const pinDelay = PATH_DURATION * (m.t * 0.95);
          const labelDelay = pinDelay + 0.05;

          return (
            <g key={i}>
              <g transform={`translate(${p.x}, ${p.y})`}>
                <motion.g
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: pinDelay, duration: 0.18, ease: 'easeOut' }}
                  style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
                >
                  <circle r={10} className="fill-white dark:fill-[#0b0f14]" />
                  <circle r={7.5} fill="url(#jt-grad)" />
                </motion.g>
              </g>

              <motion.foreignObject
                x={x}
                y={y}
                width={w}
                height={LABEL_HEIGHT}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: labelDelay, duration: 0.18, ease: 'easeOut' }}
              >
                <a href={m.href ?? '#'} style={{ display: 'block', width: '100%', height: '100%' }}>
                  <div
                    className="pointer-events-auto flex h-full items-center justify-center rounded-2xl border text-[11px] leading-none
                               border-black/10 bg-white/90 text-zinc-800 backdrop-blur
                               dark:border-white/10 dark:bg-black/35 dark:text-zinc-200"
                  >
                    {m.label}
                  </div>
                </a>
              </motion.foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}