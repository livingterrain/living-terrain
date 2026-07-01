"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useBreakpoint } from "@/lib/atmosphere/use-breakpoint";
import { cn } from "@/lib/utils";

interface ObservatoryEmergenceProps {
  children: ReactNode;
  className?: string;
  /** How long the section breathes before content appears */
  delay?: number;
  /** Minimum viewport presence */
  minHeight?: string;
}

const ease = [0.42, 0.03, 0.38, 0.96] as const;

/**
 * Content that emerges from darkness as the observer moves through space.
 */
export function ObservatoryEmergence({
  children,
  className,
  delay = 0,
  minHeight = "min-h-[72vh] sm:min-h-[85vh]",
}: ObservatoryEmergenceProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });
  const reduced = useReducedMotion() ?? false;
  const { isMobile } = useBreakpoint();

  return (
    <section
      ref={ref}
      className={cn(
        "obs-universe-emergence relative flex flex-col items-center justify-center px-5 py-24 sm:px-10 sm:py-32 md:py-40",
        minHeight,
        className,
      )}
    >
      <motion.div
        initial={
          reduced
            ? false
            : { opacity: 0, y: isMobile ? 16 : 28, filter: "blur(6px)" }
        }
        animate={
          reduced || inView
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : {
                opacity: 0,
                y: isMobile ? 16 : 28,
                filter: isMobile ? "blur(0px)" : "blur(6px)",
              }
        }
        transition={{
          duration: reduced ? 0.01 : 2.4,
          delay: reduced ? 0 : delay,
          ease,
        }}
        className="relative z-10 w-full max-w-3xl"
      >
        {children}
      </motion.div>
    </section>
  );
}
