"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#071014] text-zinc-900 dark:text-zinc-100 transition-colors duration-500">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <aside className="hidden md:block md:w-72">
            <div className="sticky top-6">
              <Sidebar />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <Topbar onMenuToggle={() => setOpen((v) => !v)} />

            {/* Mobile drawer */}
            <div className={`fixed inset-0 z-50 md:hidden ${open ? "" : "pointer-events-none"}`}>
              <div
                className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
                aria-hidden
                onClick={() => setOpen(false)}
              />
              <div className={`absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-zinc-900 shadow-lg p-4 transition-transform ${open ? "translate-x-0" : "-translate-x-72"}`}>
                <Sidebar onItemClick={() => setOpen(false)} />
              </div>
            </div>

            <main className="mt-6">
              <div className="space-y-8">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}