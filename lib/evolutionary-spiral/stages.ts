import type { SpiralSequenceStop, SpiralStage } from "./types";

/** Canonical nine stages — definitions and whispers from Phase 0. */
export const SPIRAL_STAGES: readonly SpiralStage[] = [
  {
    id: "emergence",
    name: "Emergence",
    order: 1,
    definition:
      "A new pattern of organization becomes discernible as a system—something begins to hold as an identifiable process or form where it was not previously available as such.",
    whisper:
      "Something begins to hold as a pattern—a form not available in the same way before.",
  },
  {
    id: "embodiment",
    name: "Embodiment",
    order: 2,
    definition:
      "The emerging pattern takes substrate: it occupies body, medium, or material conditions through which it can persist, sense, and act.",
    whisper:
      "The pattern takes body or medium—conditions through which it can persist and act.",
  },
  {
    id: "differentiation",
    name: "Differentiation",
    order: 3,
    definition:
      "Distinctions appear within the system—parts, roles, boundaries, or specialized functions—so that the whole is no longer an undifferentiated unity.",
    whisper:
      "Distinctions appear: parts, roles, and boundaries form within what had been more whole.",
  },
  {
    id: "relationship",
    name: "Relationship",
    order: 4,
    definition:
      "Differentiated elements enter into mutual influence. What each is becomes inseparable from what it contacts; relation becomes constitutive, not optional.",
    whisper:
      "What is differentiated begins to matter through contact; relation itself becomes constitutive.",
  },
  {
    id: "organization",
    name: "Organization",
    order: 5,
    definition:
      "Relations stabilize into structure that can regulate itself across time—coordinated interdependence that holds form under ordinary variation.",
    whisper:
      "Relations settle into structure that can regulate itself and hold under ordinary change.",
  },
  {
    id: "disruption",
    name: "Disruption",
    order: 6,
    definition:
      "Stress, novelty, failure, or intrusion challenges the existing organization. Continuity is forced into contact with what it cannot assimilate unchanged.",
    whisper:
      "Pressure arrives that the existing organization cannot take in or absorb unchanged.",
  },
  {
    id: "transformation",
    name: "Transformation",
    order: 7,
    definition:
      "The system reorganizes under pressure. Variation, learning, breakdown, or structural change alters the means by which the system maintains itself.",
    whisper:
      "Under pressure, the means by which the system stays organized themselves begin to change.",
  },
  {
    id: "integration",
    name: "Integration",
    order: 8,
    definition:
      "Reorganized elements have become coherent enough to function together again—not as a temporary patch, but as a re-coherence that can operate as one system.",
    whisper:
      "What was reorganized becomes coherent enough to function again as one system.",
  },
  {
    id: "renewal",
    name: "Renewal",
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
  },
] as const;

export function getSpiralStage(id: string): SpiralStage | undefined {
  return SPIRAL_STAGES.find((s) => s.id === id);
}
