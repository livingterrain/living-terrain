"use client";

import dynamic from "next/dynamic";
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
import { ObservatoryWorkbench } from "./ObservatoryWorkbench";

const ObservatoryConstellationField = dynamic(
  () =>
    import("./ObservatoryConstellationField").then((m) => ({
      default: m.ObservatoryConstellationField,
    })),
  { loading: () => null },
);

const ObservatoryPathwayField = dynamic(
  () =>
    import("./ObservatoryPathwayField").then((m) => ({
      default: m.ObservatoryPathwayField,
    })),
  { loading: () => null },
);

const ObservatoryFieldMist = dynamic(
  () =>
    import("./ObservatoryFieldMist").then((m) => ({
      default: m.ObservatoryFieldMist,
    })),
  { loading: () => null },
);

const ObservatoryGrowingLights = dynamic(
  () =>
    import("./ObservatoryGrowingLights").then((m) => ({
      default: m.ObservatoryGrowingLights,
    })),
  { loading: () => null },
);

const ObservatoryWitness = dynamic(
  () =>
    import("./ObservatoryWitness").then((m) => ({
      default: m.ObservatoryWitness,
    })),
  { loading: () => null },
);

interface ObservatoryUniverseProps {
  clusters: EssayCluster[];
  fieldNotes: FieldNote[];
  threads: ObservatoryThread[];
  growingIdeas: GrowingIdea[];
  concepts: Theme[];
}

const ease = [0.42, 0.03, 0.38, 0.96] as const;

/**
 * The intellectual heart of Living Terrain — a warm observatory
 * where evidence accumulates, patterns emerge slowly, and nothing feels complete.
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
      <ObservatoryWorkbench />

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

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.8, delay: reduced ? 0 : 0.3, ease }}
            className="obs-universe-arrival__orient mt-8 max-w-sm font-heading text-[1.375rem] leading-[1.45] text-[var(--obs-ivory)]/92 sm:mt-10 sm:max-w-md sm:text-[1.625rem]"
          >
            Patterns emerge slowly.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.6, delay: reduced ? 0 : 0.65, ease }}
            className="obs-universe-whisper mx-auto mt-8 max-w-sm space-y-3 text-[0.9375rem] leading-[1.85] sm:mt-10 sm:max-w-md sm:text-base"
          >
            <p>The investigation continues.</p>
            <p>Observations accumulate. Nothing here is finished.</p>
            <p className="italic opacity-75">
              Begin where something catches your attention.
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
