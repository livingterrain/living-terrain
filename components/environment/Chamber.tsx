"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChamberProps {
  children: ReactNode;
  className?: string;
  /** Exhibition room identifier */
  name?: string;
  tone?: "threshold" | "warm" | "dim" | "deep";
  id?: string;
}

const tones = {
  threshold: "bg-ivory-shadow/25",
  warm: "bg-ivory-deep/40",
  dim: "bg-ivory-shadow/35",
  deep: "bg-ivory-shadow/50",
};

export function Chamber({
  children,
  className,
  name,
  tone,
  id,
}: ChamberProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        "threshold-chamber relative",
        tone && tones[tone],
        className,
      )}
    >
      {name && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 2.4, ease: [0.45, 0.05, 0.55, 0.95] }}
          className="type-chamber absolute left-6 top-8 z-10 sm:left-10"
        >
          {name}
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 2.8, ease: [0.45, 0.05, 0.55, 0.95] }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </section>
  );
}
