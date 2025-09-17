"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react"; // icons from lucide-react

const links = [
  { href: "/papers", label: "Papers" },
  { href: "/question-bank", label: "Question Bank" },
  { href: "/ai-tutor", label: "AI Tutor" },
  { href: "/pricing", label: "Pricing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex gap-6 text-sm text-gray-600 dark:text-gray-300">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="ml-auto h-full w-64 bg-white dark:bg-zinc-900 p-6 shadow-xl transition-transform">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Menu
              </span>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col space-y-4 text-gray-700 dark:text-gray-300">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}