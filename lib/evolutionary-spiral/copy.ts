import type { SpiralFrameworkCopy } from "./types";

/** Visitor-facing framing — grammar of operations + reference trajectory. */
export const SPIRAL_COPY: SpiralFrameworkCopy = {
  name: "The Evolutionary Spiral",
  shortName: "the Spiral",
  surfaceLine:
    "Things emerge, take form, differentiate, relate, organize, change—and sometimes begin again.",
  surfaceSupport:
    "The Spiral is a way of exploring recurring patterns of change across living systems, psychology, ecology, scripture, and symbolic traditions.",
  oneSentenceDefinition:
    "A Living Terrain grammar of recurrent operations through which organized systems may form, persist, meet changing conditions, reorganize, and sometimes generate new organization.",
  coreQuestion:
    "How does a living system remain itself while becoming something new?",
  visitorThesis: [
    "Life does not maintain itself by remaining unchanged.",
    "Living systems persist through continuous exchange, adaptation, repair, breakdown, and renewal. Stability, in living terms, is often the art of staying organized while changing.",
  ],
  shapeSentence:
    "A circle means return. The Spiral means recurrence with accumulated history.",
  ascentNote:
    "History accumulates upward. Ascent marks changed conditions, not guaranteed improvement, mystical higher attainment, or inevitable progress.",
  interactionTendency:
    "Without sufficient Transformation, Continuity can become rigidity. Without sufficient Continuity, Transformation can become dissolution. Living systems often endure in their interaction.",
  disclaimer:
    "The Evolutionary Spiral is a Living Terrain systems framework grounded in observations of living systems. It is not offered as a universal scientifically established developmental law. When historical or symbolic traditions appear beside it, they are comparative pattern-readings—not proof that one domain caused, predicted, or scientifically validates another. Structural resemblance is a reason to investigate—not evidence that the structures share a cause.",
  evolutionaryClarification:
    "Here, evolutionary means change unfolding through accumulated history—not a claim that this model is Darwinian evolutionary theory itself. The helix shows a reference trajectory through a grammar of operations, not a universal ladder every system must climb.",
  emergenceAgainCue:
    "A further Emergence from altered conditions—not a return to the first beginning.",
  howToRead: [
    "The stages are recurrent operations in a grammar—not mandatory rungs of progress.",
    "The helix shows one reference trajectory through that grammar, not a law that every system begins at Emergence, visits every operation once, or renews successfully.",
    "Continuity and Transformation ask, at every local state: what persists, and what changes?",
    "A lens compares trajectories in a domain with the grammar. An operation may appear more than once—or not at all. Mismatch is useful evidence.",
  ],
  referenceTrajectoryNote:
    "The helix shows a reference trajectory, not a guaranteed path. Real systems may repeat, overlap, skip, branch, stabilize differently, or fail to renew. Disruption need not lead to Transformation, and Transformation need not begin with Disruption. Neither leads necessarily to Integration or Renewal.",
  recurrenceNote:
    "Emergence again makes recurrence visible, but any operation may recur under changed conditions. A later Disruption is not the same state as an earlier one—history has already accumulated.",
  openQuestions: [
    "Is boundary formation an independent operation, or does it emerge from embodiment, differentiation, relationship, and organization?",
    "When the same operation appears at cell, organism, and collective scales, what travels across scales—and what does not?",
  ],
};

/**
 * One plain reading per trajectory, restating its authored comparison records.
 * Absent where nothing has been compared; never a new finding.
 */
export const TRAJECTORY_TAKEAWAYS: Readonly<Record<string, string>> = {
  "zodiac-cycle":
    "The researched resemblances cluster around Transformation, while the zodiac remains a cyclical symbolic sequence.",
  "jesus-narrative":
    "The researched comparison spans death through resurrection, while the narrative itself remains directional rather than cyclical.",
  metamorphosis:
    "The researched comparison is with Transformation: development continues through metamorphosis while the organization carrying it changes. At which scale remains open.",
  "lodgepole-fire-regeneration":
    "The strongest comparison is not fire itself, but what happens when another fire arrives before the stand has rebuilt its capacity to regenerate.",
};
