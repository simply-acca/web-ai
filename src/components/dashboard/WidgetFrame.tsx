"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

type Size = "sm" | "md" | "lg";

/**
 * Reusable dashboard widget container with:
 * - Normal card style by default
 * - Expand-to-overlay (modal-like) with sticky header & scrollable body
 * - Persists expand state per widget id
 * - Optional toolbar/actions area
 */
export default function WidgetFrame({
  id: idProp,
  title,
  subtitle,
  size = "md",
  persist = true,
  defaultExpanded = false,
  actions,
  children,
  footer,
  className = "",
}: {
  id?: string;                // stable id for persistence
  title?: ReactNode;
  subtitle?: ReactNode;
  size?: Size;                // controls default height hints in expanded
  persist?: boolean;
  defaultExpanded?: boolean;
  actions?: ReactNode;        // right-side header actions (buttons, etc.)
  children: ReactNode;        // main content
  footer?: ReactNode;         // optional footer row (stays at bottom)
  className?: string;         // extra classes for the card (normal mode)
}) {
  const reactId = useId();
  const widgetId = useMemo(() => idProp ?? `widget-${reactId}`, [idProp, reactId]);

  // Expanded state (persisted)
  const [expanded, setExpanded] = useState<boolean>(() => {
    if (!persist) return !!defaultExpanded;
    try {
      const raw = localStorage.getItem(`wf:${widgetId}:expanded`);
      return raw == null ? !!defaultExpanded : raw === "1";
    } catch {
      return !!defaultExpanded;
    }
  });

  useEffect(() => {
    if (!persist) return;
    try {
      localStorage.setItem(`wf:${widgetId}:expanded`, expanded ? "1" : "0");
    } catch {}
  }, [expanded, persist, widgetId]);

  // Focus management for overlay
  const overlayRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!expanded) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    overlayRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prevFocus?.focus?.();
    };
  }, [expanded]);

  // Height hints for expanded mode
  const maxH =
    size === "sm" ? "max-h-[60vh]" :
    size === "lg" ? "max-h-[88vh]" :
    "max-h-[75vh]";

  const onToggle = useCallback(() => setExpanded((v) => !v), []);

  /* ---------- normal (in-grid) card ---------- */
  const CardShell = (
    <section
      className={[
        "rounded-2xl border border-zinc-200 bg-white shadow-sm",
        "dark:border-white/10 dark:bg-zinc-900/60",
        className,
      ].join(" ")}
      aria-label={typeof title === "string" ? title : undefined}
    >
      <div className="flex items-start justify-between gap-3 px-5 pt-4">
        <div className="min-w-0">
          {title && (
            <h3 className="truncate text-lg font-semibold">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {actions}
          <button
            onClick={onToggle}
            className="rounded-md border px-2 py-1 text-xs hover:border-emerald-400/40 dark:border-white/10"
            aria-expanded={expanded}
            aria-controls={`${widgetId}-overlay`}
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      <div className="px-5 pb-4 pt-3">{children}</div>

      {footer && (
        <div className="border-t border-zinc-200 px-5 py-3 text-sm dark:border-white/10">
          {footer}
        </div>
      )}
    </section>
  );

  /* ---------- overlay (expanded) ---------- */
  const Overlay = (
    <AnimatePresence>
      {expanded && (
        <motion.div
          key="wf-overlay"
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setExpanded(false)}
            aria-hidden
          />

          {/* dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${widgetId}-title`}
            id={`${widgetId}-overlay`}
            ref={overlayRef}
            tabIndex={-1}
            className="absolute inset-x-4 top-6 mx-auto w-auto max-w-6xl outline-none"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div
              className={[
                "overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl",
                "dark:border-white/10 dark:bg-zinc-900/70 backdrop-blur",
              ].join(" ")}
            >
              {/* sticky header */}
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-zinc-200 bg-white/80 px-5 py-3 backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
                <div className="min-w-0">
                  {title && (
                    <h2 id={`${widgetId}-title`} className="truncate text-base font-semibold">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {subtitle}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {actions}
                  <button
                    onClick={() => setExpanded(false)}
                    className="rounded-md border px-2 py-1 text-xs hover:border-emerald-400/40 dark:border-white/10"
                    title="Close"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* scrollable body */}
              <div className={`overflow-auto px-5 py-4 ${maxH}`}>
                {children}
              </div>

              {footer && (
                <div className="border-t border-zinc-200 bg-white/70 px-5 py-3 text-sm dark:border-white/10 dark:bg-zinc-900/60">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {CardShell}
      {Overlay}
    </>
  );
}