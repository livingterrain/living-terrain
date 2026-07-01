"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { THRESHOLD_MOTION } from "@/lib/design-system/threshold";
import { cn } from "@/lib/utils";

interface ThresholdChamberProps {
  children: ReactNode;
  className?: string;
  /** Depth hint for subtle atmospheric shift within a page */
  depth?: "outer" | "inner" | "deep";
}

/**
 * A room within the observatory — content floats in silence, not on panels.
 */
export function ThresholdChamber({
  children,
  className,
  depth = "outer",
}: ThresholdChamberProps) {
  const reduced = useReducedMotion();
  const duration = reduced ? 0.01 : THRESHOLD_MOTION.chamberRevealMs / 1000;

  return (
    <motion.div
      className={cn(
        "threshold-chamber relative",
        depth === "inner" && "threshold-chamber--inner",
        depth === "deep" && "threshold-chamber--deep",
        className,
      )}
      initial={reduced ? false : { opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: THRESHOLD_MOTION.ease }}
    >
      {children}
    </motion.div>
  );
}
