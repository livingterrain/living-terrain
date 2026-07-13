"use client";

import { ObservatoryCinematicViewport } from "./ObservatoryCinematicViewport";

/** Full five-beat cinematic journey (Threshold → Arrival). */
export function ObservatoryCinematicExperience() {
  return (
    <div className="obs-cine-realm observatory-realm">
      <ObservatoryCinematicViewport />
    </div>
  );
}
