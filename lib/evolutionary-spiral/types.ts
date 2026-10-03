/**
 * The Evolutionary Spiral — typed content model.
 * Canon: docs/evolutionary-spiral-phase-0.md
 *
 * Presentation must not invent Atlas relationships from these types.
 * selection identity = occurrenceId · content identity = stageId
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
 * Epistemic status — per entry/example, not per lens.
 * Categories do not have equivalent evidentiary status.
 *
 * Legacy Phase 1 kinds (`empirical`, `historical-textual`, `symbolic-comparative`)
 * remain valid for seeded examples.
 */
export type SpiralEpistemicKind =
  | "empirical"
  | "empirical-mechanism"
  | "empirical-observation"
  | "historical-observation"
  | "historical-textual"
  | "textual-observation"
  | "textual-interpretation"
  | "theological-interpretation"
  | "symbolic-comparative"
  | "symbolic-analogy"
  | "hypothesis";

/**
 * Comparative lenses.
 * `systems` = structural / process lens (not a scientific domain claim).
 * `living-systems` = Biology lens in visitor UI.
 */
export const SPIRAL_DOMAIN_IDS = [
  "systems",
  "living-systems",
  "ecology",
  "psychology",
  "biblical-textual",
  "symbolic-zodiac",
] as const;

export type SpiralDomainId = (typeof SPIRAL_DOMAIN_IDS)[number];

/** Visitor lens order for deep exploration (prototype). */
export const SPIRAL_LENS_ORDER: readonly SpiralDomainId[] = [
  "systems",
  "living-systems",
  "psychology",
  "ecology",
  "biblical-textual",
  "symbolic-zodiac",
] as const;

/** Explore view: a lens, or the Across synthesis surface. */
export type SpiralExploreViewId = SpiralDomainId | "across";

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
  /** Short visitor label for lens rail (may differ from full label). */
  shortLabel: string;
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

/**
 * Historical / interpretive provenance — especially for Zodiac material.
 * Distinct from epistemic kind: provenance answers “from which era/tradition?”
 */
export type SpiralProvenanceKind =
  | "ancient-hellenistic"
  | "later-traditional"
  | "modern-pluto-era"
  | "modern-psychological"
  | "our-systems-reading";

/** Deep-dive section kinds under a concept. */
export type SpiralConceptDiveSectionKind =
  | "summary"
  | "mechanism"
  | "pattern"
  | "what-persists"
  | "what-changes"
  | "examples"
  | "epistemic-status"
  | "sources"
  | "analogy-holds"
  | "comparison-breaks"
  | "open-questions"
  | "related"
  | "general";

/** Authored citation slot — never invent DOIs or claims. */
export type SpiralSourceRef = {
  id: string;
  title: string;
  authors?: string;
  year?: string | number;
  publication?: string;
  url?: string;
  doi?: string;
  /** What claim this source supports — only when authored. */
  supports?: string;
  placeholder?: boolean;
};

export type SpiralConceptDiveSection = {
  id: string;
  kind: SpiralConceptDiveSectionKind;
  title: string;
  body?: string;
  items?: readonly string[];
  placeholder?: boolean;
};

/**
 * One concept under a lens — internal MODEL content, not a canonical object.
 * IDs should be stable and domain-scoped (e.g. `bio-metamorphosis`).
 */
export type SpiralConcept = {
  id: string;
  title: string;
  /** Short index whisper — not the full deep dive. */
  summary: string;
  epistemicKind?: SpiralEpistemicKind;
  /** One or more provenance labels when historically relevant. */
  provenance?: SpiralProvenanceKind | readonly SpiralProvenanceKind[];
  placeholder?: boolean;
  sections?: readonly SpiralConceptDiveSection[];
  sources?: readonly SpiralSourceRef[];
  comparisonBreaks?: {
    title?: string;
    body: string;
    placeholder?: boolean;
  };
  openQuestions?: readonly string[];
  relatedEssaySlugs?: readonly string[];
  relatedAtlasStops?: readonly string[];
};

/** Deep exploration packet for one lens at one stage. */
export type SpiralLensExploration = {
  lensId: SpiralDomainId;
  framing?: string;
  /** Concept index — primary hierarchy under the lens. */
  concepts: readonly SpiralConcept[];
  /** Optional lens-level break (concepts may also carry their own). */
  comparisonBreaks?: {
    title?: string;
    body: string;
    placeholder?: boolean;
  };
};

/** Structured Across synthesis — not a single paragraph. */
export type SpiralAcrossSectionKind =
  | "recurring-structures"
  | "resemblances"
  | "where-they-break"
  | "counterarguments"
  | "open-questions"
  | "synthesis";

export type SpiralAcrossItem = {
  id: string;
  title: string;
  body?: string;
  placeholder?: boolean;
};

export type SpiralAcrossSection = {
  id: string;
  kind: SpiralAcrossSectionKind;
  title: string;
  body?: string;
  items?: readonly SpiralAcrossItem[];
  placeholder?: boolean;
  /**
   * Visual emphasis — `counter` elevates disagreement / anti-correspondence
   * as first-class exploration, not a footnote.
   */
  emphasis?: "default" | "counter";
};

export type SpiralAcrossExploration = {
  title?: string;
  framing?: string;
  sections: readonly SpiralAcrossSection[];
  placeholder?: boolean;
};

/** Stage-level deep exploration — only authored for prototype stages. */
export type SpiralStageExploration = {
  stageId: SpiralStageId;
  lenses: readonly SpiralLensExploration[];
  across?: SpiralAcrossExploration;
};

/* ── Legacy M1B section shapes (kept for type compatibility; unused in M1C) ── */

/** @deprecated Prefer SpiralConcept hierarchy (M1C). */
export type SpiralLensSectionKind =
  | "what-is-happening"
  | "pattern"
  | "mechanism"
  | "examples"
  | "continuity-transformation"
  | "where-this-appears"
  | "general";

/** @deprecated Prefer SpiralConcept. */
export type SpiralLensEntry = {
  id: string;
  title: string;
  body: string;
  epistemicKind: SpiralEpistemicKind;
  current?: SpiralCurrentId;
  placeholder?: boolean;
  relatedEssaySlugs?: readonly string[];
  relatedAtlasStops?: readonly string[];
};

/** @deprecated Prefer SpiralConcept. */
export type SpiralLensSection = {
  id: string;
  kind: SpiralLensSectionKind;
  title: string;
  body?: string;
  entries?: readonly SpiralLensEntry[];
  placeholder?: boolean;
};
