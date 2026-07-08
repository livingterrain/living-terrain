"use client";

import dynamic from "next/dynamic";
import type { EssayCluster } from "@/lib/content/terrain";
import type { GrowingIdea } from "@/lib/observatory/growing-ideas-data";
import type { ObservatoryThread } from "@/lib/observatory/threads-data";
import {
  layoutConstellations,
  layoutGrowingLights,
} from "@/lib/observatory/universe-layout";
import type { Theme } from "@/lib/content/types";
import { ObservatoryConservatory } from "./ObservatoryConservatory";
import { ObservatoryTable, type TableLatestEntry } from "./ObservatoryTable";
import {
  ObservatoryRecentObservations,
  type ObservationSlip,
} from "./ObservatoryRecentObservations";

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
  slips: ObservationSlip[];
  latest?: TableLatestEntry;
  threads: ObservatoryThread[];
  growingIdeas: GrowingIdea[];
  concepts: Theme[];
}

/**
 * The intellectual heart of Living Terrain — a warm observatory arranged as
 * four zones: the observation table, recent observations, emerging patterns,
 * and long investigations maturing toward maps in The Atlas.
 */
export function ObservatoryUniverse({
  clusters,
  slips,
  latest,
  threads,
  growingIdeas,
  concepts,
}: ObservatoryUniverseProps) {
  const constellations = layoutConstellations(clusters);
  const lights = layoutGrowingLights(growingIdeas);

  return (
    <div className="obs-universe relative">
      <ObservatoryConservatory />

      <div className="relative z-10">
        {/* Zone 1 — The observation table (also the moment of arrival) */}
        <ObservatoryTable latest={latest} />

        {/* Zone 2 — Recent observations */}
        <ObservatoryRecentObservations slips={slips} />

        {/* Zone 3 — Emerging patterns */}
        <ObservatoryConstellationField constellations={constellations} />

        {/* Zone 4 — Long investigations, maturing toward The Atlas */}
        <ObservatoryPathwayField threads={threads} />
        <ObservatoryGrowingLights lights={lights} />

        <ObservatoryWitness concepts={concepts} />
      </div>
    </div>
  );
}
