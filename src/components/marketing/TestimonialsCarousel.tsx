// components/marketing/TestimonialsCarousel.tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Testimonial = {
  name: string;
  paper: string;
  quote: string;
  img: string; // /public path
};

const ITEMS: Testimonial[] = [
  {
    name: "Aisha",
    paper: "BT Student",
    quote:
      "I felt supported, not overwhelmed. The plan adapted to my weak areas and gave me confidence before exam day.",
    img: "/images/testimonials/indian-woman.jpg",
  },
  {
    name: "Thandi",
    paper: "MA Student",
    quote:
      "First time I saw a platform care about my pacing and motivation. It’s not just questions — it’s guidance.",
    img: "/images/testimonials/african-woman.jpg",
  },
  // Add more if you like:
  // {
  //   name: "Omar",
  //   paper: "FR Student",
  //   quote: "Mock interface felt like the real CBE. Clear analytics, faster feedback.",
  //   img: "/images/testimonials/middle-eastern-man.jpg",
  // },
];

export default function TestimonialsCarousel({
  intervalMs = 5000,
}: {
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const next = () => setIndex((i) => (i + 1) % ITEMS.length);
  const prev = () => setIndex((i) => (i - 1 + ITEMS.length) % ITEMS.length);
  const goTo = (i: number) => setIndex(i);

  useEffect(() => {
    if (paused || ITEMS.length <= 1) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(next, intervalMs);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, paused, intervalMs]);

  return (
    <div
      className="relative mx-auto mt-10 w-full max-w-3xl select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Slides */}
      <div className="relative overflow-hidden rounded-xl">
        {ITEMS.map((t, i) => (
          <article
            key={t.name + i}
            className={`absolute inset-0 grid grid-cols-[auto,1fr] items-start gap-4 rounded-xl bg-white/10 p-5 text-left shadow-sm transition-opacity duration-500 ease-out
            ${i === index ? "opacity-100" : "opacity-0"} `}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${ITEMS.length}`}
          >
            <Image
              src={t.img}
              alt={`${t.name}, ${t.paper}`}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-white/30"
              priority={i === index}
            />
            <div>
              <p className="text-sm text-emerald-50/90 italic">“{t.quote}”</p>
              <p className="mt-2 text-xs font-medium text-emerald-100">
                — {t.name}, {t.paper}
              </p>
            </div>
          </article>
        ))}
        {/* Set height with an invisible placeholder to prevent layout shift */}
        <div className="invisible grid grid-cols-[auto,1fr] items-start gap-4 rounded-xl p-5">
          <div className="h-14 w-14 rounded-full" />
          <div>
            <p className="text-sm">.</p>
            <p className="mt-2 text-xs">.</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={prev}
          className="rounded-full border border-white/30 px-3 py-1 text-sm text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Previous testimonial"
        >
          ‹
        </button>
        <div className="flex items-center gap-2">
          {ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition
                ${i === index ? "bg-white" : "bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="rounded-full border border-white/30 px-3 py-1 text-sm text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Next testimonial"
        >
          ›
        </button>
      </div>
    </div>
  );
}