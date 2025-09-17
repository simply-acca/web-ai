"use client";

import { useEffect, useRef, useState } from "react";

export default function Calculator({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [expr, setExpr] = useState("");
  const [out, setOut] = useState<string>("");

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return;
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose]);

  function append(v: string) {
    setExpr((s) => (s + v).slice(0, 64));
  }
  function clear() {
    setExpr(""); setOut("");
  }
  function back() {
    setExpr((s) => s.slice(0, -1));
  }
  function evaluate() {
    try {
      // simple, limited evaluator: only digits and + - * / . ( )
      if (!/^[\d+\-*/().\s]+$/.test(expr)) throw new Error("Invalid");
      // eslint-disable-next-line no-new-func
      const val = Function(`"use strict";return (${expr})`)();
      setOut(String(val));
    } catch {
      setOut("Err");
    }
  }

  if (!open) return null;

  const keys = [
    ["7","8","9","/"],
    ["4","5","6","*"],
    ["1","2","3","-"],
    ["0",".","(",")"],
  ];

  return (
    <div className="fixed right-4 top-20 z-50">
      <div ref={ref} className="w-72 rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-zinc-900">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold">Calculator</div>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">✕</button>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-2 text-right font-mono text-sm dark:border-white/10 dark:bg-zinc-900/60">
          <div className="truncate text-zinc-500">{expr || "0"}</div>
          <div className="mt-1 text-lg font-semibold">{out || " "}</div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {keys.flat().map(k => (
            <button
              key={k}
              onClick={() => append(k)}
              className="rounded-md border border-zinc-200 bg-white py-2 text-sm hover:border-emerald-400/40 dark:border-white/10 dark:bg-zinc-900/60"
            >
              {k}
            </button>
          ))}
          <button onClick={back} className="col-span-1 rounded-md border border-zinc-200 bg-white py-2 text-sm hover:border-emerald-400/40 dark:border-white/10 dark:bg-zinc-900/60">⌫</button>
          <button onClick={clear} className="col-span-1 rounded-md border border-zinc-200 bg-white py-2 text-sm hover:border-emerald-400/40 dark:border-white/10 dark:bg-zinc-900/60">AC</button>
          <button onClick={evaluate} className="col-span-2 rounded-md bg-emerald-500 py-2 text-sm font-semibold text-gray-900 hover:bg-emerald-400">=</button>
        </div>
      </div>
    </div>
  );
}