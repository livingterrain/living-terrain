"use client";

import { TerrainLink } from "@/components/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { NAVIGATION } from "@/lib/atmosphere/tempo";
import { TerrainPulse } from "./TerrainPulse";

const ease = NAVIGATION.ease;

interface ThresholdChoicesProps {
  onExplore: () => void;
  exploring: boolean;
}

export function ThresholdChoices({ onExplore, exploring }: ThresholdChoicesProps) {
  const reducedMotion = useReducedMotion();
  const duration = reducedMotion ? 0.01 : 1.85;

  return (
    <>
      <div className="mt-12 grid gap-10 sm:mt-14 sm:grid-cols-2 sm:gap-x-16 sm:gap-y-0">
        <motion.button
          type="button"
          onClick={onExplore}
          disabled={exploring}
          initial={false}
          animate={{ opacity: exploring ? 0.45 : 1, y: 0 }}
          transition={{ duration, ease }}
          className="group touch-manipulation border-t border-ivory/[0.07] py-7 text-left transition-[border-color] duration-[900ms] disabled:pointer-events-none sm:hover:border-forest-light/22"
        >
          <p className="threshold-hero-choice font-heading text-[1.0625rem] tracking-[0.012em] sm:text-lg">
            Step onto the terrain
          </p>
          <p className="threshold-hero-choice__hint mt-2.5 font-heading text-[0.8125rem] italic leading-relaxed">
            The map is carved in stone beyond this ridge.
          </p>
        </motion.button>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, ease }}
        >
          <TerrainLink
            href="/observatory"
            className="group block touch-manipulation border-t border-ivory/[0.07] py-7 text-left transition-[border-color] duration-[900ms] sm:hover:border-ivory/18"
          >
            <p className="threshold-hero-choice font-heading text-[1.0625rem] tracking-[0.012em] sm:text-lg">
              Follow the amber light
            </p>
            <p className="threshold-hero-choice__hint mt-2.5 font-heading text-[0.8125rem] italic leading-relaxed">
              Something is still forming in the dark.
            </p>
          </TerrainLink>
        </motion.div>
      </div>

      <div className="mx-auto mt-14 max-w-xs border-t border-ivory/[0.04] sm:max-w-sm">
        <TerrainPulse variant="threshold" className="!mt-8" />
      </div>
    </>
  );
}
