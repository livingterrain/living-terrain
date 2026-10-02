/**
 * The Evolutionary Spiral — typed content model (Phase 1).
 * Canon: docs/evolutionary-spiral-phase-0.md
 *
 * Presentation must not invent Atlas relationships from these types.
 */

/** Stable stage identifiers — nine stage-kinds. */
export const SPIRAL_STAGE_IDS = [
  "emergence",
  "embodiment",
  "differentiation",
  "relationship",
  "organization",
  "disruption",
  "transformation",
  "integration",
  "renewal",
] as const;

export type SpiralStageId = (typeof SPIRAL_STAGE_IDS)[number];

/** The two interacting currents (not Strand / Thread / Trail / Pathway). */
export const SPIRAL_CURRENT_IDS = ["continuity", "transformation"] as const;

export type SpiralCurrentId = (typeof SPIRAL_CURRENT_IDS)[number];

/**
 * Epistemic status of a comparative example — per example, not per domain.
 * Categories do not have equivalent evidentiary status.
 */
export type SpiralEpistemicKind =
  | "empirical"
  | "historical-textual"
  | "symbolic-comparative";

/** Comparative lenses planned for the first public version. */
export const SPIRAL_DOMAIN_IDS = [
  "living-systems",
  "ecology",
  "psychology",
  "biblical-textual",
  "symbolic-zodiac",
] as const;

export type SpiralDomainId = (typeof SPIRAL_DOMAIN_IDS)[number];

/**
 * One stop in the visitor-facing developmental sequence.
 * Emergence may appear at cycleIndex 0 (Emergence¹) and again at later turns
 * (Emergence²…) — same stageId, different cycleIndex.
 */
export type SpiralSequenceStop = {
  /** Unique key for this occurrence in the sequence (e.g. emergence@0). */
  occurrenceId: string;
  stageId: SpiralStageId;
  /**
   * 0 = first turn of the helix for this stage-kind in the primary sequence.
   * Higher values = subsequent turns (Emergence again = emergence @ 1).
   */
  cycleIndex: number;
  /** 1-based display order along the sequence including Emergence again. */
  order: number;
  /**
   * Optional display label override (e.g. "Emergence again").
   * When omitted, use the stage's canonical name.
   */
  labelOverride?: string;
};

export type SpiralStage = {
  id: SpiralStageId;
  name: string;
  /** Canonical definition — Phase 0 §8. */
  definition: string;
  /** Visitor-facing whisper (~12–20 words) — Phase 0 §8A. */
  whisper: string;
  /** 1-based order of first occurrence in the primary nine-stage sequence. */
  order: number;
};

export type SpiralCurrent = {
  id: SpiralCurrentId;
  name: string;
  definition: string;
  qualities: readonly string[];
};

export type SpiralDomain = {
  id: SpiralDomainId;
  label: string;
  /** Role of this lens in the framework. */
  role: string;
};

export type SpiralComparisonPair = {
  left: string;
  right: string;
};

/**
 * Comparative example — stored as data, not hard-coded in presentation.
 * Sparse seeding is intentional; missing stages/domains are valid.
 */
export type SpiralExample = {
  id: string;
  stageId: SpiralStageId;
  domainId: SpiralDomainId;
  epistemicKind: SpiralEpistemicKind;
  title: string;
  body: string;
  /** Optional Continuity ↔ Transformation style pairing. */
  comparisonPair?: SpiralComparisonPair;
  /** Optional authored essay links — never inferred. */
  relatedEssaySlugs?: readonly string[];
  /** Optional authored Atlas stop ids — never inferred. */
  relatedAtlasStops?: readonly string[];
  /** Optional current emphasis when authored. */
  current?: SpiralCurrentId;
};

/**
 * Future essay → Spiral circulation (Phase 4+).
 * Only stageId is required when a relation is authored.
 */
export type SpiralEssayRelation = {
  stageId: SpiralStageId;
  current?: SpiralCurrentId;
  epistemicKind?: SpiralEpistemicKind;
};

export type SpiralEpistemicCategory = {
  id: SpiralEpistemicKind;
  label: string;
  definition: string;
};

export type SpiralFrameworkCopy = {
  name: string;
  shortName: string;
  oneSentenceDefinition: string;
  coreQuestion: string;
  visitorThesis: readonly string[];
  shapeSentence: string;
  ascentNote: string;
  interactionTendency: string;
  disclaimer: string;
  evolutionaryClarification: string;
  emergenceAgainCue: string;
};
