'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Milestone = {
  t: number;                 // position along the path (0..1)
  label: string;             // chip label
  href?: string;
  sub?: string;              // small tooltip line
};

const MS: Milestone[] = [
  { t: 0.05, label: 'Start',                 href: '#start',   sub: 'Create your plan' },
  { t: 0.30, label: 'Study Planner',         href: '#planner', sub: 'Daily, bite-size blocks' },
  { t: 0.55, label: 'Personalised Learning', href: '#learn',   sub: 'Weakness-first content' },
  { t: 0.78, label: 'Mock Exam',             href: '#mock',    sub: 'Real CBE timing/tools' },
  { t: 0.97, label: 'Exam Success',          href: '#pass',    sub: 'Confident & ready' },
];

/** Larger, higher-contrast curve for readability */
const VB_W = 1200;
const VB_H = 280;
const PATH_D =
  'M 60 200 C 280 120, 470 110, 690 185 S 1040 260, 1140 150';

const PATH_DURATION = 1.0;   // seconds
const LABEL_H = 48;
const ABOVE = 28;

export default function JourneyTrack({
  className = '',
  height = 320,
}: {
  className?: string;
  height?: number;
}) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const svgRef  = useRef<SVGSVGElement  | null>(null);
  const prefersReduce = useReducedMotion();

  const [pts, setPts] = useState<{ x: number; y: number }[] | null>(null);
  const [len, setLen] = useState<number>(0);

  useLayoutEffect(() => {
    const compute = () => {
      const p = pathRef.current;
      if (!p) return;
      const L = p.getTotalLength();
      setLen(L);
      setPts(MS.map(m => p.getPointAtLength(L * m.t)));
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (svgRef.current) ro.observe(svgRef.current);
    return () => ro.disconnect();
  }, []);


  const labelW = (text: string) =>
  Math.max(100, Math.min(300, Math.round(text.length * 11) + 24));

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
          {/* Thicker, brighter gradient for the main rail */}
          <linearGradient id="jt-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stopColor="#34d399" />
            <stop offset="55%"  stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>

          {/* soft outer glow */}
          <filter id="jt-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* chip shadow */}
          <filter id="chip" x="-20%" y="-40%" width="140%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* main curve */}
        <motion.path
          ref={pathRef}
          d={PATH_D}
          fill="none"
          stroke="url(#jt-grad)"
          strokeWidth={10}
          strokeLinecap="round"
          initial={{ pathLength: prefersReduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: PATH_DURATION, ease: 'easeInOut' }}
          style={{ filter: 'url(#jt-glow)' }}
        />

        {/* faint track edge for contrast on dark bg */}
        <motion.path
          d={PATH_D}
          fill="none"
          stroke="rgba(255,255,255,.30)"
          strokeWidth={2}
          strokeDasharray="10 16"
          strokeLinecap="round"
          initial={{ pathLength: prefersReduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: PATH_DURATION, ease: 'easeInOut', delay: 0.05 }}
        />

        {/* small “traveler” glider that slides along the path once */}
        {len > 0 && (
          <motion.circle
            r={6}
            fill="white"
            stroke="url(#jt-grad)"
            strokeWidth="3"
            filter="url(#jt-glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: PATH_DURATION + 0.3, ease: 'easeInOut', delay: 0.05 }}
          >
            {/* position the circle along the path using CSS motion path */}
            <animateMotion
              dur={`${PATH_DURATION + 0.3}s`}
              fill="freeze"
              path={PATH_D}
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
            />
          </motion.circle>
        )}

        {/* pins + labels */}
        {pts?.map((p, i) => {
          const m = MS[i];
          const w = labelW(m.label);
          const x = Math.min(VB_W - w - 8, Math.max(8, p.x - w / 2));
          const y = Math.max(10, p.y - ABOVE - LABEL_H);

          const pinDelay   = PATH_DURATION * (m.t * 0.95);
          const labelDelay = pinDelay + 0.06;

          return (
            <g key={i}>
              {/* pin (bigger, with halo) */}
              <g transform={`translate(${p.x}, ${p.y})`}>
                <motion.g
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: pinDelay, duration: 0.22, ease: 'easeOut' }}
                  style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
                >
                  <circle r={12} className="fill-white dark:fill-[#0b0f14]" />
                  <circle r={9}  fill="url(#jt-grad)" />
                  <circle r={14} className="fill-transparent" filter="url(#jt-glow)" />
                </motion.g>
              </g>

              {/* chip label – higher contrast, slight blur background */}
              <motion.foreignObject
                x={x}
                y={y}
                width={w}
                height={LABEL_H}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: labelDelay, duration: 0.22, ease: 'easeOut' }}
              >
                <a
                  href={m.href ?? '#'}
                  className="block h-full w-full focus:outline-none"
                  aria-label={m.label}
                  title={m.sub ?? m.label}
                >
                <div
                className="pointer-events-auto flex h-full items-center justify-center
                            rounded-2xl border border-zinc-200/90 bg-white/95
                            px-6 py-2 text-[20px] font-bold leading-none text-zinc-800
                            shadow-sm ring-1 ring-white/50 backdrop-blur
                            dark:border-white/10 dark:bg-black/45 dark:text-zinc-100 dark:ring-white/5"
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