"use client";

import { TerrainLink } from "@/components/navigation";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.45, 0.05, 0.55, 0.95] as const;

interface ThresholdChoicesProps {
  onExplore: () => void;
  exploring: boolean;
}

export function ThresholdChoices({ onExplore, exploring }: ThresholdChoicesProps) {
  const reducedMotion = useReducedMotion();
  const motionDuration = reducedMotion ? 0.01 : 1.1;

  return (
    <div className="mt-8 grid gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-5">
      <motion.button
        type="button"
        onClick={onExplore}
        disabled={exploring}
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: exploring ? 0.5 : 1, y: 0 }}
        transition={{ duration: motionDuration, delay: reducedMotion ? 0 : 0.55, ease }}
        className="group min-h-[5.75rem] touch-manipulation rounded-sm border border-forest-light/25 bg-[#0a0c10]/45 px-5 py-6 text-left transition-[border-color,background-color,transform] duration-500 active:scale-[0.995] active:border-forest-light/40 active:bg-[#0c1018]/60 disabled:pointer-events-none sm:min-h-0 sm:px-8 sm:py-10"
      >
        <p className="font-heading text-[1.125rem] leading-snug text-ivory/92 sm:text-xl">
          Explore the Living Terrain
        </p>
        <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ivory/50 sm:mt-3 sm:text-sm sm:text-ivory/42">
          An interactive constellation of ideas — discover connections visually,
          follow threads, and wander.
        </p>
        <p className="mt-5 text-[0.75rem] tracking-[0.1em] text-forest-light/65 transition-colors duration-500 group-active:text-forest-light/90 sm:mt-6 sm:text-[0.6875rem] sm:group-hover:text-forest-light/85">
          Enter the map →
        </p>
      </motion.button>

      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionDuration, delay: reducedMotion ? 0 : 0.7, ease }}
      >
        <TerrainLink
          href="/inquiry"
          className="group flex min-h-[5.75rem] touch-manipulation flex-col rounded-sm border border-ivory/16 bg-[#0a0c10]/45 px-5 py-6 text-left transition-[border-color,background-color,transform] duration-500 active:scale-[0.995] active:border-ivory/26 active:bg-[#0c1018]/60 sm:min-h-0 sm:px-8 sm:py-10 sm:hover:border-ivory/22 sm:hover:bg-[#0c1018]/55"
        >
          <p className="font-heading text-[1.125rem] leading-snug text-ivory/92 sm:text-xl">
            Read the Inquiry
          </p>
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ivory/50 sm:mt-3 sm:text-sm sm:text-ivory/42">
            Essays, volumes, and field notes — a quiet reading room for those
            who prefer the page.
          </p>
          <p className="mt-auto pt-5 text-[0.75rem] tracking-[0.1em] text-ivory/42 transition-colors duration-500 group-active:text-ivory/65 sm:pt-6 sm:text-[0.6875rem] sm:group-hover:text-ivory/62">
            Open the library →
          </p>
        </TerrainLink>
      </motion.div>
    </div>
  );
}
