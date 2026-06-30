"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getCatalogQuotations } from "@/lib/relationships/catalog";
import { cn } from "@/lib/utils";

type LingerVariant = "threshold" | "room";

interface LingerWhisperProps {
  /** Milliseconds of stillness before a whisper appears */
  delay?: number;
  variant?: LingerVariant;
  /** Pause whispers while something else holds focus */
  paused?: boolean;
  className?: string;
}

/**
 * Hidden quotations — appear only after lingering.
 * Rewards patience, never interrupts reading.
 */
export function LingerWhisper({
  delay = 15000,
  variant = "room",
  paused = false,
  className,
}: LingerWhisperProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<number | null>(null);
  const quoteIndexRef = useRef(0);

  const published = useMemo(
    () => getCatalogQuotations().filter((q) => q.status === "published"),
    [],
  );

  const quote = published[quoteIndexRef.current % Math.max(published.length, 1)];

  const resetTimer = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setVisible(false);

    if (paused || dismissed || published.length === 0) return;

    timerRef.current = window.setTimeout(() => {
      setVisible(true);
    }, delay);
  }, [delay, dismissed, paused, published.length]);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || published.length === 0) return;

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"] as const;

    for (const event of events) {
      window.addEventListener(event, resetTimer, { passive: true });
    }

    resetTimer();

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      for (const event of events) {
        window.removeEventListener(event, resetTimer);
      }
    };
  }, [resetTimer, published.length]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    quoteIndexRef.current += 1;
  };

  if (published.length === 0) return null;

  return (
    <AnimatePresence>
      {visible && quote && (
        <motion.aside
          key={quote.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 2.4, ease: [0.45, 0.05, 0.55, 0.95] }}
          className={cn(
            "pointer-events-auto fixed bottom-8 left-1/2 z-[30] max-w-md -translate-x-1/2 px-6 text-center sm:bottom-10",
            className,
          )}
          aria-live="polite"
        >
          <blockquote
            className={cn(
              "text-sm leading-relaxed italic sm:text-[0.9375rem]",
              variant === "threshold" ? "text-ivory/40" : "text-charcoal-faint",
            )}
          >
            &ldquo;{quote.text}&rdquo;
          </blockquote>
          {quote.attribution && (
            <p
              className={cn(
                "mt-3 text-[0.625rem] uppercase tracking-[0.16em]",
                variant === "threshold" ? "text-ivory/20" : "text-forest-faint",
              )}
            >
              {quote.attribution}
            </p>
          )}
          <div className="mt-4 flex items-center justify-center gap-5">
            <Link
              href={`/quotations/${quote.slug}`}
              className={cn(
                "text-[0.625rem] tracking-[0.06em] transition-colors duration-700",
                variant === "threshold"
                  ? "text-forest-light/50 hover:text-forest-light/80"
                  : "text-forest/60 hover:text-forest",
              )}
            >
              Follow this voice
            </Link>
            <button
              type="button"
              onClick={handleDismiss}
              className={cn(
                "text-[0.625rem] tracking-[0.06em] transition-colors duration-700",
                variant === "threshold"
                  ? "text-ivory/20 hover:text-ivory/40"
                  : "text-charcoal-faint hover:text-charcoal-muted",
              )}
            >
              Let it fade
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
