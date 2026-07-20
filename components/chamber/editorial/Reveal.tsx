"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds */
  delay?: number;
}

/**
 * Near-invisible entrance — a slow settle, like ink drying.
 * The only motion primitive the editorial chamber uses.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 4 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1.8, delay, ease: [0.45, 0.05, 0.55, 0.95] }}
    >
      {children}
    </motion.div>
  );
}
