"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type StationAnchor =
  | "desk"
  | "nave-left"
  | "nave-right"
  | "crossing"
  | "window";

interface ObservatoryStationProps {
  children: ReactNode;
  /** Where in the painted room this content lives */
  anchor?: StationAnchor;
  /** How long the visitor dwells at this station while scrolling */
  dwell?: string;
  className?: string;
}

const ease = [0.42, 0.03, 0.38, 0.96] as const;

/**
 * A physical station along the nave — content anchored to a place in the room,
 * not a full-screen webpage section.
 */
export function ObservatoryStation({
  children,
  anchor = "desk",
  dwell = "min-h-[92dvh] sm:min-h-[100dvh]",
  className,
}: ObservatoryStationProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px -30% 0px" });
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      ref={ref}
      className={cn(
        "obs-desk-station",
        `obs-desk-station--${anchor}`,
        dwell,
        className,
      )}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 18 }}
        animate={
          reduced || inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }
        }
        transition={{ duration: reduced ? 0.01 : 2.2, ease }}
        className="obs-desk-station__content"
      >
        {children}
      </motion.div>
    </section>
  );
}
