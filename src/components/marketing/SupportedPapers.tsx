"use client";

import { useEffect, useRef, useState } from "react";

export default function SupportedPapers() {
  const papers = [
    { code: "BT", name: "Business & Technology" },
    { code: "MA", name: "Management Accounting" },
    { code: "FA", name: "Financial Accounting" },
    { code: "LW", name: "Corporate & Business Law" },
    { code: "PM", name: "Performance Management" },
    { code: "TX", name: "Taxation" },
    { code: "FR", name: "Financial Reporting" },
    { code: "AA", name: "Audit & Assurance" },
    { code: "FM", name: "Financial Management" },
    { code: "SBL", name: "Strategic Business Leader", soon: true },
    { code: "SBR", name: "Strategic Business Reporting", soon: true },
    { code: "AFM", name: "Advanced Financial Management", soon: true },
    { code: "APM", name: "Advanced Performance Management", soon: true },
    { code: "ATX", name: "Advanced Taxation", soon: true },
    { code: "AAA", name: "Advanced Audit & Assurance", soon: true },
  ];

  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative isolate mx-auto max-w-7xl px-6 sm:px-10 py-20 
                 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 
                 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Full ACCA Coverage
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          From Applied Knowledge to Strategic Professional — all ACCA papers are included.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {papers.map((p, i) => (
          <div
            key={p.code}
            className={`group relative overflow-hidden rounded-xl border 
                        border-gray-200 dark:border-white/10
                        bg-white dark:bg-zinc-900/60 p-5 text-center shadow-sm
                        transition-all duration-500 ease-out
                        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                        hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(16,185,129,0.25)]`}
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            {/* animated gradient border on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition duration-500 group-hover:opacity-100 group-hover:bg-gradient-to-r group-hover:from-emerald-400/30 group-hover:to-teal-400/30" />

            <div className="relative z-10">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {p.code}
              </div>
              <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                {p.name}
              </div>
            </div>

            {p.soon && (
              <span className="absolute top-2 right-2 rounded-full bg-amber-100/80 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-400/20 dark:text-amber-300 z-10">
                Coming soon
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}