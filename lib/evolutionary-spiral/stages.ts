import type { SpiralSequenceStop, SpiralStage } from "./types";

/** Canonical nine stages — definitions and whispers from Phase 0. */
export const SPIRAL_STAGES: readonly SpiralStage[] = [
  {
    id: "emergence",
    name: "Emergence",
    microcopy: "Something new becomes possible.",
    order: 1,
    definition:
      "Relations among a system's components begin to sustain a capacity the system did not have at that scale—new against what the system, and any lineage or program that reliably reproduces it, already makes possible—and that capacity holds rather than flickers.",
    whisper:
      "Relations among parts begin to hold a capacity not already available in the system's repertoire.",
  },
  {
    id: "embodiment",
    name: "Embodiment",
    microcopy: "It takes form.",
    order: 2,
    definition:
      "The emerging pattern takes substrate: it occupies body, medium, or material conditions through which it can persist, sense, and act.",
    whisper:
      "The pattern takes body or medium—conditions through which it can persist and act.",
  },
  {
    id: "differentiation",
    name: "Differentiation",
    microcopy: "Differences appear.",
    order: 3,
    definition:
      "Distinctions appear within the system—parts, roles, boundaries, or specialized functions—so that the whole is no longer an undifferentiated unity.",
    whisper:
      "Distinctions appear: parts, roles, and boundaries form within what had been more whole.",
  },
  {
    id: "relationship",
    name: "Relationship",
    microcopy: "The parts begin to affect one another.",
    order: 4,
    definition:
      "Differentiated elements enter into mutual influence. What each is becomes inseparable from what it contacts; relation becomes constitutive, not optional.",
    whisper:
      "What is differentiated begins to matter through contact; relation itself becomes constitutive.",
  },
  {
    id: "organization",
    name: "Organization",
    microcopy: "A pattern holds.",
    order: 5,
    definition:
      "Relations stabilize into structure that can regulate itself across time—coordinated interdependence that holds form under ordinary variation.",
    whisper:
      "Relations settle into structure that can regulate itself and hold under ordinary change.",
  },
  {
    id: "disruption",
    name: "Disruption",
    microcopy: "The existing pattern is disturbed.",
    order: 6,
    definition:
      "Stress, novelty, failure, or intrusion challenges the existing organization. Continuity is forced into contact with what it cannot assimilate unchanged.",
    whisper:
      "Pressure arrives that the existing organization cannot take in or absorb unchanged.",
  },
  {
    id: "transformation",
    name: "Transformation",
    microcopy: "The ways it stays organized change.",
    order: 7,
    definition:
      "The processes by which a system generates or maintains its organization are themselves altered—not only their products, rate, setting, or appearance, and not merely their ordinary operation. It may follow Disruption or arise without it, through variation, learning, breakdown, development, or structural change.",
    whisper:
      "More than its form changes: the very ways the system keeps itself organized are altered.",
  },
  {
    id: "integration",
    name: "Integration",
    microcopy: "Change is incorporated.",
    order: 8,
    definition:
      "Reorganized elements have become coherent enough to function together again—not as a temporary patch, but as a re-coherence that can operate as one system.",
    whisper:
      "What was reorganized becomes coherent enough to function again as one system.",
  },
  {
    id: "renewal",
    name: "Renewal",
    microcopy: "A viable pattern stabilizes—when it can.",
    order: 9,
    definition:
      "The reorganized system has stabilized sufficiently to continue forward with altered capacity, carrying history forward and preparing conditions under which a further Emergence may become discernible.",
    whisper:
      "The reorganized system stabilizes enough to continue forward now with altered capacity.",
  },
] as const;

/**
 * Full visitor sequence including Emergence again (cycleIndex 1).
 * Spatial ascent later = accumulated history, not guaranteed progress.
 */
export const SPIRAL_SEQUENCE: readonly SpiralSequenceStop[] = [
  {
    occurrenceId: "emergence@0",
    stageId: "emergence",
    cycleIndex: 0,
    order: 1,
  },
  {
    occurrenceId: "embodiment@0",
    stageId: "embodiment",
    cycleIndex: 0,
    order: 2,
  },
  {
    occurrenceId: "differentiation@0",
    stageId: "differentiation",
    cycleIndex: 0,
    order: 3,
  },
  {
    occurrenceId: "relationship@0",
    stageId: "relationship",
    cycleIndex: 0,
    order: 4,
  },
  {
    occurrenceId: "organization@0",
    stageId: "organization",
    cycleIndex: 0,
    order: 5,
  },
  {
    occurrenceId: "disruption@0",
    stageId: "disruption",
    cycleIndex: 0,
    order: 6,
  },
  {
    occurrenceId: "transformation@0",
    stageId: "transformation",
    cycleIndex: 0,
    order: 7,
  },
  {
    occurrenceId: "integration@0",
    stageId: "integration",
    cycleIndex: 0,
    order: 8,
  },
  {
    occurrenceId: "renewal@0",
    stageId: "renewal",
    cycleIndex: 0,
    order: 9,
  },
  {
    occurrenceId: "emergence@1",
    stageId: "emergence",
    cycleIndex: 1,
    order: 10,
    labelOverride: "Emergence again",
    microcopyOverride: "Something becomes possible under changed conditions.",
  },
] as const;

export function getSpiralStage(id: string): SpiralStage | undefined {
  return SPIRAL_STAGES.find((s) => s.id === id);
}

/** Plain-language line for an occurrence (Emergence again keeps its own). */
export function microcopyForStop(stop: SpiralSequenceStop): string {
  return stop.microcopyOverride ?? getSpiralStage(stop.stageId)?.microcopy ?? "";
}
