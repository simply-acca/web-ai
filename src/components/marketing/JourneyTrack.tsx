'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type Milestone = { t: number; label: string; href?: string };

// positions along the path (0..1)
const MS: Milestone[] = [
  { t: 0.02, label: 'Start',                 href: '#start' },
  { t: 0.27, label: 'Study Planner',         href: '#planner' },
  { t: 0.50, label: 'Personalised Learning', href: '#learn' },
  { t: 0.74, label: 'Mock Exam',             href: '#mock' },
  { t: 0.98, label: 'Exam Success',          href: '#pass' },
];

// Stable viewBox (keeps geometry consistent while we scale responsively)
const VB_W = 1200;
const VB_H = 260;
const PATH_D = 'M 60 180 C 220 140, 360 80, 520 120 S 900 200, 1140 120';

// Animation timing
const PATH_DURATION = 1.1;     // seconds for the curve draw
const PIN_DELAY     = 0.00;    // extra delay on pins
const LABEL_DELAY   = 0.06;    // extra delay on labels after pin

// Label geometry
const LABEL_HEIGHT  = 24;      // px inside SVG space
const ABOVE_OFFSET  = 14;      // px above the pin center (tighten/loosen here)

export default function JourneyTrack({
  className = '',
  height = 224, // rendered height in px; width is 100%
}: { className?: string; height?: number }) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const svgRef  = useRef<SVGSVGElement  | null>(null);
  const [pts, setPts] = useState<{ x: number; y: number }[] | null>(null);

  useLayoutEffect(() => {
    const compute = () => {
      const p = pathRef.current;
      if (!p) return;
      const len = p.getTotalLength();
      const next = MS.map(m => p.getPointAtLength(len * m.t));
      setPts(next);
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (svgRef.current) ro.observe(svgRef.current);
    return () => ro.disconnect();
  }, []);

  // helper: estimate label width from characters (simple & good-enough)
  const labelWidth = (text: string) => Math.max(60, Math.min(220, Math.round(text.length * 7.2) + 16));

  return (
    <div className={`relative w-full ${className}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="jt-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#34d399" />
            <stop offset="55%"  stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <filter id="jt-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* curve */}
        <motion.path
          ref={pathRef}
          d={PATH_D}
          fill="none"
          stroke="url(#jt-grad)"
          strokeWidth={10}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: PATH_DURATION, ease: 'easeInOut' }}
          style={{ filter: 'url(#jt-glow)' }}
        />

        {/* dashed overlay */}
        <motion.path
          d={PATH_D}
          fill="none"
          stroke="rgba(255,255,255,0.65)"
          strokeWidth={2}
          strokeDasharray="8 14"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: PATH_DURATION, ease: 'easeInOut', delay: 0.05 }}
        />

        {/* pins + labels (SVG-native; no HTML overlay) */}
        {pts?.map((p, i) => {
  const m = MS[i];
  const pinDelay   = PATH_DURATION * m.t + PIN_DELAY;
  const labelDelay = PATH_DURATION * m.t + LABEL_DELAY;

  // label box anchored ABOVE the pin (your same math)
  const w = labelWidth(m.label);
  const x = Math.min(VB_W - w - 8, Math.max(8, p.x - w / 2));
  const y = Math.max(8, p.y - ABOVE_OFFSET - LABEL_HEIGHT);

  return (
    <g key={i}>
      {/* ✅ PIN: outer <g> positions via SVG translate; inner <motion.g> only animates scale/opacity */}
      <g transform={`translate(${p.x}, ${p.y})`}>
        <motion.g
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: pinDelay, duration: 0.18, ease: 'easeOut' }}
          // helps Safari/Chrome handle transform origin correctly
          style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
        >
          <circle r={11} className="fill-white dark:fill-[#0b0f14]" />
          <circle r={8}  fill="url(#jt-grad)" />
        </motion.g>
      </g>

      {/* little connector dot (unchanged) */}
      <motion.circle
        cx={p.x}
        cy={p.y - Math.max(6, ABOVE_OFFSET - 6)}
        r={1.3}
        className="fill-white/70 dark:fill-white/35"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: labelDelay - 0.04, duration: 0.12, ease: 'easeOut' }}
      />

      {/* label pill (unchanged) */}
      <motion.foreignObject
        x={x}
        y={y}
        width={w}
        height={LABEL_HEIGHT}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: labelDelay, duration: 0.2, ease: 'easeOut' }}
      >
        <a href={m.href ?? undefined} style={{ display: 'block', width: '100%', height: '100%' }}>
          <div
            className="pointer-events-auto flex h-full items-center justify-center rounded-2xl border text-[11px] leading-none sm:text-xs
                       border-black/10 bg-white/85 text-gray-800 backdrop-blur
                       shadow-[0_0_0_1px_rgba(255,255,255,0.02)]
                       dark:border-white/10 dark:bg-black/35 dark:text-gray-200"
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