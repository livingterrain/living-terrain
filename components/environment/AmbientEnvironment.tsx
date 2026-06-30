"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { RefObject } from "react";
import {
  ContourDepth,
  DustMotes,
  InterferencePattern,
  MycelialField,
  PaperDepth,
} from "./atmosphere";

interface AmbientEnvironmentProps {
  scrollRef: RefObject<HTMLElement | null>;
}

/**
 * Homepage atmosphere — light, shadow, depth, silence.
 * Moves extremely slowly. Rewards lingering. Never competes with reading.
 */
export function AmbientEnvironment({ scrollRef }: AmbientEnvironmentProps) {
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  /* Parallax — three depths, glacial pace */
  const farY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const nearY = useTransform(scrollYProgress, [0, 1], [0, -280]);

  /* Contours emerge as you descend */
  const contourOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.35, 0.7],
    [0.15, 0.5, 0.85, 1],
  );

  /* Interference — visible deeper in */
  const interferenceOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.6],
    [0, 0.4, 0.7],
  );

  /* Light shifts with scroll — entering the building */
  const thresholdLight = useTransform(
    scrollYProgress,
    [0, 0.15, 0.4, 0.75],
    [0.7, 0.55, 0.45, 0.35],
  );
  const deepLight = useTransform(
    scrollYProgress,
    [0, 0.25, 0.6, 1],
    [0, 0.25, 0.5, 0.65],
  );
  const warmShift = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.15, 0.35, 0.5],
  );

  /* Vignette deepens — forest library shadows */
  const voidDepth = useTransform(
    scrollYProgress,
    [0, 0.3, 0.8],
    [0.06, 0.1, 0.16],
  );

  const vignetteShadow = useTransform(
    voidDepth,
    (v) =>
      `inset 0 0 140px 50px color-mix(in srgb, var(--color-void) ${v * 100}%, transparent)`,
  );

  /* Dust brightens in the light cone, fades deeper in */
  const dustOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 1],
    [0.35, 0.25, 0.15, 0.1],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Paper & grain — the material world */}
      <PaperDepth />

      {/* Far plane — interference geometry */}
      <InterferencePattern y={farY} opacity={interferenceOpacity} />

      {/* Mid-far — topographic contours */}
      <ContourDepth opacity={contourOpacity} y={midY} />

      {/* Mycelial network — cursor-attuned */}
      <MycelialField />

      {/* Mid — original contour drift + botanical marks */}
      <motion.div style={{ y: midY }} className="absolute inset-0 animate-drift-ultra">
        <svg
          className="absolute inset-0 h-full w-full text-charcoal"
          viewBox="0 0 1440 3200"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <g stroke="currentColor" strokeWidth="0.4" opacity="0.045">
            <path d="M-40 400 C300 360, 500 440, 720 380 S1160 340, 1480 400" />
            <path d="M-40 800 C260 760, 460 840, 680 780 S1120 740, 1480 800" />
            <path d="M-40 1400 C280 1360, 480 1440, 700 1380 S1140 1340, 1480 1400" />
            <path d="M-40 2000 C300 1960, 500 2040, 720 1980 S1160 1940, 1480 2000" />
          </g>
        </svg>
      </motion.div>

      {/* Near — botanical specimen marks */}
      <motion.div style={{ y: nearY }} className="absolute inset-0 animate-drift-slow">
        <svg
          className="absolute right-[5%] top-[10%] h-56 w-56 text-forest sm:top-[14%] sm:h-72 sm:w-72"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.35" opacity="0.045" />
          <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="0.35" opacity="0.035" />
        </svg>
        <svg
          className="absolute bottom-[28%] left-0 h-72 w-72 text-charcoal"
          viewBox="0 0 300 300"
          fill="none"
        >
          <g stroke="currentColor" strokeWidth="0.35" opacity="0.04">
            <path d="M150 280 V60 M150 60 C120 40, 100 20, 80 0" />
            <path d="M150 100 C110 90, 70 85, 40 80" />
            <path d="M150 100 C190 90, 230 85, 260 80" />
            <path d="M150 150 C105 145, 70 140, 35 138" />
          </g>
        </svg>
      </motion.div>

      {/* Light — threshold sun (high window) */}
      <motion.div
        style={{ opacity: thresholdLight }}
        className="absolute left-[38%] top-[8%] h-[32rem] w-[min(85vw,40rem)] -translate-x-1/2 atmosphere-light-threshold rounded-full"
      />

      {/* Light — warm pool that grows as you wander deeper */}
      <motion.div
        style={{ opacity: deepLight }}
        className="absolute left-1/2 top-[45%] h-[36rem] w-[min(90vw,44rem)] -translate-x-1/2 atmosphere-light-deep rounded-full"
      />

      {/* Light — observatory glint at the bottom */}
      <motion.div
        style={{ opacity: warmShift }}
        className="absolute bottom-[8%] right-[10%] h-56 w-56 atmosphere-light-warm rounded-full"
      />

      {/* Dust in the light cone */}
      <motion.div style={{ opacity: dustOpacity }} className="absolute inset-0">
        <DustMotes />
      </motion.div>

      {/* Edge void — deepens with descent */}
      <motion.div style={{ boxShadow: vignetteShadow }} className="absolute inset-0" />

      {/* Ceiling shadow — library roof */}
      <div className="atmosphere-ceiling-shadow absolute inset-x-0 top-0 h-48" />
    </div>
  );
}
