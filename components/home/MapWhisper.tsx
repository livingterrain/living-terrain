"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { pickMapWhisper } from "@/lib/constellation/map-whispers";

interface MapWhisperProps {
  active: boolean;
  paused?: boolean;
}

/**
 * A sentence appears somewhere on the map for two seconds — then vanishes.
 * Discovered, never announced.
 */
export function MapWhisper({ active, paused = false }: MapWhisperProps) {
  const [whisper, setWhisper] = useState<{
    text: string;
    left: number;
    top: number;
  } | null>(null);
  const indexRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || paused) {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      setWhisper(null);
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const schedule = () => {
      timerRef.current = window.setTimeout(
        () => {
          const left = 12 + Math.random() * 76;
          const top = 18 + Math.random() * 58;
          setWhisper({
            text: pickMapWhisper(indexRef.current++),
            left,
            top,
          });
          window.setTimeout(() => setWhisper(null), 2600);
          schedule();
        },
        72000 + Math.random() * 56000,
      );
    };

    const first = window.setTimeout(
      () => schedule(),
      42000 + Math.random() * 28000,
    );

    return () => {
      window.clearTimeout(first);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [active, paused]);

  return (
    <AnimatePresence>
      {whisper && (
        <motion.p
          key={`${whisper.text}-${whisper.left}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.22 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 2.2,
            ease: [0.45, 0.05, 0.55, 0.95],
          }}
          className="pointer-events-none absolute z-[18] max-w-[11rem] font-heading text-[0.8125rem] italic leading-snug text-ivory/50 sm:max-w-xs sm:text-sm"
          style={{ left: `${whisper.left}%`, top: `${whisper.top}%` }}
          aria-live="polite"
        >
          {whisper.text}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
