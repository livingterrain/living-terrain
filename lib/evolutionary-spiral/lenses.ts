import { examplesForStage } from "./examples";
import { getStageExploration } from "./exploration";
import { SPIRAL_SEQUENCE } from "./stages";
import { relationshipsForStop } from "./comparisons";
import { ZODIAC_LENS_RESEARCH } from "./research/zodiac";
import { JESUS_NARRATIVE_TRAJECTORY } from "./trajectories/jesus";
import { LODGEPOLE_FIRE_TRAJECTORY } from "./trajectories/lodgepole";
import { METAMORPHOSIS_TRAJECTORY } from "./trajectories/metamorphosis";
import { ZODIAC_CYCLE_TRAJECTORY } from "./trajectories/zodiac";
import type {
  SpiralCycleContextTransition,
  SpiralExample,
  SpiralLens,
  SpiralLensExploration,
  SpiralLensId,
  SpiralSequenceStop,
  SpiralTrajectory,
  SpiralTrajectoryRelationship,
} from "./types";

/**
 * Whole-helix lenses — the "View through" control.
 * A lens persists across operations; its trajectory is laid against the
 * whole Spiral. Forthcoming trajectories are names only, not mappings.
 */
export const SPIRAL_LENSES: readonly SpiralLens[] = [
  {
    id: "systems",
    label: "Systems",
    intro:
      "Systems thinking describes how organization holds, is disturbed, and reorganizes—at almost any scale.",
    evidence:
      "A structural lens: it frames questions about organization; it does not supply one shared mechanism.",
    inPhrase: "systems",
    trajectories: [],
    forthcoming: ["Regime shift / adaptive-cycle trajectories"],
    status: "available",
  },
  {
    id: "living-systems",
    label: "Biology",
    intro:
      "Living bodies are dismantled, repaired, and remade while remaining alive.",
    evidence:
      "Empirical research on living systems—the instrument’s primary anchor, and still specific to life.",
    inPhrase: "living systems",
    trajectories: [METAMORPHOSIS_TRAJECTORY],
    forthcoming: ["Wound healing", "Autophagy", "Development"],
    status: "available",
  },
  {
    id: "psychology",
    label: "Psychology",
    intro:
      "Minds carry history: memory, expectation, and identity are revised without being erased.",
    evidence:
      "Empirical and clinical research of varying strength—each concept is marked.",
    inPhrase: "psychological life",
    trajectories: [],
    forthcoming: ["Grief", "Memory updating", "Developmental transition"],
    status: "available",
  },
  {
    id: "ecology",
    label: "Ecology",
    intro:
      "Ecosystems are disturbed and reassemble from what survives—sometimes into something else.",
    evidence:
      "Empirical ecology: recovery is observed, never guaranteed.",
    inPhrase: "ecosystems",
    trajectories: [],
    heldTrajectories: [LODGEPOLE_FIRE_TRAJECTORY],
    forthcoming: ["Disturbance & succession", "Regime shift", "Recovery"],
    status: "available",
  },
  {
    id: "biblical-textual",
    label: "Jesus / Biblical",
    intro:
      "Biblical texts tell of rupture, exile, death, return, and new creation. This lens reads them beside the Spiral as narrative and theology.",
    evidence:
      "Textual, historical, and theological interpretation—not empirical mechanism.",
    inPhrase: "the biblical narrative",
    trajectories: [JESUS_NARRATIVE_TRAJECTORY],
    status: "available",
  },
  {
    id: "symbolic-zodiac",
    label: "Zodiac",
    intro:
      "The zodiac is one of the oldest ways humans have described a full cycle of change. Here the whole cycle is laid beside the Spiral.",
    evidence:
      "Historical and symbolic interpretation—not a causal or empirical claim.",
    inPhrase: "the zodiac",
    research: ZODIAC_LENS_RESEARCH,
    trajectories: [ZODIAC_CYCLE_TRAJECTORY],
    status: "available",
  },
  {
    id: "across",
    label: "Across",
    intro:
      "After each trajectory has been passed through the Spiral on its own terms, what actually recurs?",
    evidence:
      "Not yet written. Across waits until the separate lenses have been mapped—then it will compare recurring operations, transitions, constraints, scale, mismatches, failures, and strength of evidence.",
    inPhrase: "every lens",
    trajectories: [],
    status: "scaffold",
  },
];

export const SPIRAL_LENS_IDS: readonly SpiralLensId[] = SPIRAL_LENSES.map(
  (l) => l.id,
);

export function getSpiralLens(id: SpiralLensId): SpiralLens | undefined {
  return SPIRAL_LENSES.find((l) => l.id === id);
}

/** Default trajectory when a lens is chosen — first authored, if any. */
export function defaultTrajectoryId(lensId: SpiralLensId): string | null {
  return getSpiralLens(lensId)?.trajectories[0]?.id ?? null;
}

export function getTrajectory(
  lensId: SpiralLensId,
  trajectoryId: string | null,
): SpiralTrajectory | undefined {
  if (!trajectoryId) return undefined;
  return getSpiralLens(lensId)?.trajectories.find((t) => t.id === trajectoryId);
}

/** Every authored trajectory, in lens order. */
export function authoredTrajectories(): SpiralTrajectory[] {
  return SPIRAL_LENSES.flatMap((l) => l.trajectories);
}

/** Trajectories held back until the figure can draw their topology. */
export function heldTrajectories(): SpiralTrajectory[] {
  return SPIRAL_LENSES.flatMap((l) => l.heldTrajectories ?? []);
}

/** @deprecated Prefer relationshipsForStop. */
export function resonancesForStop(
  trajectory: SpiralTrajectory | undefined,
  stop: SpiralSequenceStop,
): SpiralTrajectoryRelationship[] {
  return relationshipsForStop(trajectory?.id, stop);
}

/** Full transition annotation behind a relationship, when it exists. */
export function transitionForResonance(
  relationship: SpiralTrajectoryRelationship,
  lensId: SpiralLensId,
): SpiralCycleContextTransition | undefined {
  if (!relationship.transitionId || lensId === "across") return undefined;
  for (const ref of relationship.operations) {
    const found = getStageExploration(ref.stageId)
      ?.lenses.find((l) => l.lensId === lensId)
      ?.cycleContext?.transitions?.find(
        (t) => t.id === relationship.transitionId,
      );
    if (found) return found;
  }
  return undefined;
}

export type SpiralIntersection = {
  /** Stage-local research for this lens (deep). */
  exploration?: SpiralLensExploration;
  /** Seeded Phase 1 examples for this lens × stage. */
  examples: SpiralExample[];
  /** Authored relationships between the active trajectory and this operation. */
  resonances: SpiralTrajectoryRelationship[];
  /** Across scaffold for this stage, when Across is active. */
  hasAcross: boolean;
};

/** Read the local intersection: active lens × selected operation. */
export function getIntersection(
  lensId: SpiralLensId,
  stop: SpiralSequenceStop,
  trajectory: SpiralTrajectory | undefined,
): SpiralIntersection {
  const stageExploration = getStageExploration(stop.stageId);
  if (lensId === "across") {
    return {
      examples: [],
      resonances: [],
      hasAcross: Boolean(stageExploration?.across),
    };
  }
  return {
    exploration: stageExploration?.lenses.find((l) => l.lensId === lensId),
    examples: examplesForStage(stop.stageId).filter(
      (e) => e.domainId === lensId,
    ),
    resonances: relationshipsForStop(trajectory?.id, stop),
    hasAcross: false,
  };
}

export function intersectionHasMaterial(i: SpiralIntersection): boolean {
  return (
    Boolean(i.exploration) ||
    i.examples.length > 0 ||
    i.resonances.length > 0 ||
    i.hasAcross
  );
}

/** Occurrences where this lens has stage-local deep research. */
export function researchedStopsForLens(
  lensId: SpiralLensId,
): SpiralSequenceStop[] {
  return SPIRAL_SEQUENCE.filter((stop) => {
    const ex = getStageExploration(stop.stageId);
    if (!ex) return false;
    return lensId === "across"
      ? Boolean(ex.across)
      : ex.lenses.some((l) => l.lensId === lensId);
  });
}
