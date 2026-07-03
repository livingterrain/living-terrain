"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { FIELD_OBSERVATIONS } from "@/lib/terrain/pulse";
import { NAVIGATION } from "@/lib/atmosphere/tempo";
import { cn } from "@/lib/utils";

interface TerrainPulseProps {
  className?: string;
  variant?: "threshold" | "map";
  style?: React.CSSProperties;
}

export function TerrainPulse({
  className,
  variant = "threshold",
  style,
}: TerrainPulseProps) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const text = FIELD_OBSERVATIONS[index]!;

  useEffect(() => {
    if (reducedMotion) return;
    const interval = variant === "threshold" ? 22000 : 26000;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % FIELD_OBSERVATIONS.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [reducedMotion, variant]);

  return (
    <aside
      className={cn(
        "pointer-events-none select-none",
        variant === "threshold" ? "mt-14 text-center" : "text-left",
        className,
      )}
      style={style}
      aria-label="Field note"
    >
      <p
        className={cn(
          "type-chamber text-ivory/22",
          variant === "threshold" ? "text-[0.5625rem]" : "text-[0.5rem]",
        )}
      >
        Field note
      </p>
      <AnimatePresence mode="wait">
        <motion.p
          key={text}
          initial={
            reducedMotion || variant === "threshold" ? false : { opacity: 0, y: 3 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -2 }}
          transition={{
            duration: reducedMotion ? 0.01 : 2.2,
            ease: NAVIGATION.ease,
          }}
          className={cn(
            "mt-3 font-heading italic leading-relaxed text-ivory/32",
            variant === "threshold"
              ? "mx-auto max-w-xs text-[0.875rem] sm:max-w-sm sm:text-[0.9375rem]"
              : "max-w-[13rem] text-[0.75rem] sm:max-w-[14rem] sm:text-[0.8125rem]",
          )}
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </aside>
  );
}
