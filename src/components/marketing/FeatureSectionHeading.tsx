// app/components/FeatureSectionHeading.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function FeatureSectionHeading() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect(); // reveal once
        }
      },
      { root: null, threshold: 0.35 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative mb-16 text-center">
      {/* emerald halo */}
      <div
        className={[
          "pointer-events-none absolute inset-0 flex items-center justify-center transition duration-700",
          show ? "opacity-100 scale-100" : "opacity-0 scale-95",
        ].join(" ")}
        aria-hidden="true"
      >
        <div className="h-28 w-80 rounded-full bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-emerald-500/20 blur-3xl" />
      </div>

      {/* headline */}
      <h2 className="relative text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
  Our focus,{" "}
  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
    your success
  </span>
</h2>

      {/* subline */}
      <p
        className={[
          "mt-3 text-base text-zinc-600 dark:text-zinc-400 transition-all duration-700 delay-100",
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")}
      >
        Learn faster with AI-powered study tools built for ACCA
      </p>
    </div>
  );
}