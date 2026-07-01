"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { EssayCluster } from "@/lib/content/terrain";
import type { FieldNote } from "@/lib/content/types";
import type { GrowingIdea } from "@/lib/observatory/growing-ideas-data";
import type { ObservatoryThread } from "@/lib/observatory/threads-data";
import {
  layoutConstellations,
  layoutFieldSparks,
  layoutGrowingLights,
} from "@/lib/observatory/universe-layout";
import type { Theme } from "@/lib/content/types";
import { ObservatoryDepthField } from "./ObservatoryDepthField";
import { ObservatoryConstellationField } from "./ObservatoryConstellationField";
import { ObservatoryPathwayField } from "./ObservatoryPathwayField";
import { ObservatoryFieldMist } from "./ObservatoryFieldMist";
import { ObservatoryGrowingLights } from "./ObservatoryGrowingLights";
import { ObservatoryWitness } from "./ObservatoryWitness";

interface ObservatoryUniverseProps {
  clusters: EssayCluster[];
  fieldNotes: FieldNote[];
  threads: ObservatoryThread[];
  growingIdeas: GrowingIdea[];
  concepts: Theme[];
}

const ease = [0.42, 0.03, 0.38, 0.96] as const;

/**
 * The intellectual heart of Living Terrain — an impossibly vast interior
 * where ideas exist as light, pathways, and drifting observation.
 */
export function ObservatoryUniverse({
  clusters,
  fieldNotes,
  threads,
  growingIdeas,
  concepts,
}: ObservatoryUniverseProps) {
  const reduced = useReducedMotion() ?? false;
  const constellations = layoutConstellations(clusters);
  const sparks = layoutFieldSparks(fieldNotes);
  const lights = layoutGrowingLights(growingIdeas);

  return (
    <div className="obs-universe relative">
      <ObservatoryDepthField />

      <div className="relative z-10">
        {/* Arrival — not a header, a moment of standing still */}
        <section className="obs-universe-arrival flex min-h-[100dvh] flex-col items-center justify-center pb-20 pt-28 text-center sm:pb-24 sm:pt-32"
          style={{
            paddingLeft: "max(1.25rem, env(safe-area-inset-left, 0px))",
            paddingRight: "max(1.25rem, env(safe-area-inset-right, 0px))",
          }}
        >
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.8, ease }}
            className="obs-universe-chamber"
          >
            The Observatory
          </motion.p>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 3.2, delay: reduced ? 0 : 0.35, ease }}
            className="obs-universe-arrival__title mt-6 max-w-md font-heading text-[1.625rem] leading-[1.22] text-[var(--obs-ivory)] sm:mt-8 sm:max-w-2xl sm:text-4xl md:text-[2.75rem]"
          >
            More here than one life could chart.
          </motion.h1>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.6, delay: reduced ? 0 : 0.75, ease }}
            className="obs-universe-whisper mx-auto mt-10 max-w-md space-y-4 text-[0.9375rem] leading-[1.9] sm:text-base"
          >
            <p>Every point of light connects to another.</p>
            <p className="italic opacity-80">
              Walk until something pulls you. There is no correct path.
            </p>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.4, delay: reduced ? 0 : 1.6, ease }}
            className="obs-universe-arrival__scroll mt-20"
            aria-hidden
          >
            <span className="obs-universe-arrival__scroll-line" />
          </motion.div>
        </section>

        <ObservatoryConstellationField constellations={constellations} />
        <ObservatoryPathwayField threads={threads} />
        <ObservatoryFieldMist sparks={sparks} />
        <ObservatoryGrowingLights lights={lights} />
        <ObservatoryWitness concepts={concepts} />
      </div>
    </div>
  );
}
