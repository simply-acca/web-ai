"use client";

import { useEffect, useRef, useState } from "react";

export default function Scratchpad({
  paperId,
  open,
  onClose,
}: { paperId: string; open: boolean; onClose: () => void }) {
  const [val, setVal] = useState("");
  const key = `cbe-notes-${paperId}`;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const saved = localStorage.getItem(key);
    if (saved != null) setVal(saved);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    localStorage.setItem(key, val);
  }, [val, open, key]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return;
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed left-4 top-20 z-50">
      <div ref={ref} className="w-80 rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-zinc-900">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold">Scratchpad</div>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">✕</button>
        </div>
        <textarea
          className="h-56 w-full resize-y rounded-lg border border-zinc-200 bg-white p-2 text-sm dark:border-white/10 dark:bg-zinc-900/60"
          placeholder="Your workings / notes…"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <div className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">Auto-saved locally</div>
      </div>
    </div>
  );
}