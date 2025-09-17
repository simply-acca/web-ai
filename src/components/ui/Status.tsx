"use client";

import { ReactNode, useState } from "react";

type LoadingProps = {
  message?: string;
  rows?: number;              // number of skeleton rows
  variant?: "inline" | "card";
  showIcon?: boolean;
};

export function LoadingSkeleton({
  message = "Loading…",
  rows = 3,
  variant = "inline",
  showIcon = false,
}: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={variant === "card"
        ? "rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/60"
        : ""
      }
    >
      <div className="mb-2 flex items-center gap-2">
        {showIcon && (
          <span
            className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent dark:border-zinc-600"
            aria-hidden
          />
        )}
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
      </div>

      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="relative h-4 w-full overflow-hidden rounded bg-zinc-200/70 dark:bg-zinc-800"
          >
            <span className="absolute inset-0 -translate-x-full ai-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

type ErrorProps = {
  children?: ReactNode;
  onRetry?: () => Promise<any> | void;
  retryLabel?: string;
  details?: string;
  compact?: boolean;
};

export function ErrorState({
  children = "Something went wrong.",
  onRetry,
  retryLabel = "Retry",
  details,
  compact = false,
}: ErrorProps) {
  const [busy, setBusy] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    try {
      setBusy(true);
      await onRetry();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      role="alert"
      className={[
        "rounded-lg border text-sm",
        "border-red-200 bg-red-50 text-red-700",
        "dark:border-red-800/40 dark:bg-red-950/20 dark:text-red-300",
        compact ? "p-2" : "p-3",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="font-medium">{children}</div>
          {details && (
            <div className="mt-1 text-xs opacity-90">{details}</div>
          )}
        </div>

        {onRetry && (
          <button
            onClick={handleRetry}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md border border-red-300 bg-white/70 px-2 py-1 text-xs
                       hover:bg-white disabled:opacity-60 dark:border-red-800/60 dark:bg-transparent"
          >
            {busy && (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
            )}
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
}