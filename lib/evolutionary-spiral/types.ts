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
  | "conceptual-framework"
  | "systems-principle"
  | "historical-observation"
  | "historical-textual"
  | "textual-observation"
  | "textual-interpretation"
  | "theological-interpretation"
  | "symbolic-comparative"
  | "symbolic-analogy"
  | "hypothesis"
  | "contested-interpretation"
  /** Output of a formal or computational model — never an observation. */
  | "model-projection";

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

/** Visitor lens order for the whole-instrument "View through" control (Across follows). */
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
 * One stop in the visitor-facing reference trajectory.
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
  /** Optional plain-language microcopy override for this occurrence. */
  microcopyOverride?: string;
};

export type SpiralStage = {
  id: SpiralStageId;
  name: string;
  /** Canonical definition — Phase 0 §8. */
  definition: string;
  /** Visitor-facing whisper (~12–20 words) — Phase 0 §8A. */
  whisper: string;
  /** Plain-language surface line (a few words) — the instrument's first teaching layer. */
  microcopy: string;
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
  /** First-screen human sentence — no model vocabulary required. */
  surfaceLine: string;
  /** Short supporting sentence beneath the surface line. */
  surfaceSupport: string;
  oneSentenceDefinition: string;
  coreQuestion: string;
  visitorThesis: readonly string[];
  shapeSentence: string;
  ascentNote: string;
  interactionTendency: string;
  disclaimer: string;
  evolutionaryClarification: string;
  emergenceAgainCue: string;
  /**
   * Compact “how to read” lines for the instrument — grammar framing,
   * not a second essay.
   */
  howToRead: readonly string[];
  /** Explicit non-guarantee / alternate-outcome note near the helix. */
  referenceTrajectoryNote: string;
  /** Recurrence beyond Emergence again. */
  recurrenceNote: string;
  /** Living research questions the instrument should surface. */
  openQuestions: readonly string[];
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

/**
 * Authored citation slot — never invent DOIs or claims.
 * `title` is the publication title when known. Omit it when the dossier
 * does not record a true article title; do not substitute a citation line.
 */
export type SpiralSourceRef = {
  id: string;
  /** True publication title when known. Omit rather than invent. */
  title?: string;
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
  /**
   * Optional multiple epistemic marks when a concept genuinely spans kinds
   * (e.g. observation + mechanism). When set, takes precedence for display.
   */
  epistemicKinds?: readonly SpiralEpistemicKind[];
  /** Quiet emphasis line in a deep dive — not a second summary. */
  whisper?: string;
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

/**
 * One stop in an optional compact symbolic-cycle context (e.g. Zodiac).
 * Not a Spiral stage, not a canonical object, not a deep dive.
 */
export type SpiralCycleContextStop = {
  id: string;
  label: string;
  /**
   * Short comparative gloss. May mix historical/developmental reading with
   * Living Terrain synthesis — lens-level provenanceNote must say so.
   */
  gloss?: string;
  /**
   * Visual emphasis within a compact cycle.
   * `resonance` = comparative interest without one-to-one mapping.
   * `focus` remains available but should not imply a singular domain “match.”
   */
  emphasis?: "default" | "focus" | "neighbor" | "resonance";
  /** Recurrence marker (e.g. Aries again) — not a claim of traditional doctrine. */
  recurrence?: boolean;
};

export type SpiralCycleContextTransition = {
  id: string;
  label: string;
  /** Optional step ids this transition spans (lets a trajectory mark the passage, not a sign). */
  from?: string;
  to?: string;
  body: string;
  /**
   * Quiet role for the transition — e.g. “Candidate resonance” —
   * not a badge that a sign equals a Spiral stage.
   */
  role?: string;
  provenance?: SpiralProvenanceKind | readonly SpiralProvenanceKind[];
};

/**
 * Lightweight symbolic-cycle context inside a lens landing.
 * Used for Zodiac full-sequence orientation — not global navigation.
 */
export type SpiralLensCycleContext = {
  title?: string;
  /** Required honesty line: glosses are not ancient doctrine. */
  provenanceNote: string;
  /** Optional structural reading (e.g. Ptolemy turn/solid/bicorporeal). */
  structureNote?: {
    title: string;
    body: string;
    provenance: SpiralProvenanceKind;
  };
  /** Optional — a stage-local context may carry only its transitions. */
  stops?: readonly SpiralCycleContextStop[];
  /**
   * @deprecated Prefer transition annotations for comparison.
   * Per-stop emphasis must not imply sign = stage.
   */
  focusId?: string;
  /** Intro above transition annotations — regions/transitions as comparison unit. */
  transitionsNote?: string;
  transitions?: readonly SpiralCycleContextTransition[];
  /** Circle vs spiral comparison — our systems reading. */
  circleAndSpiral?: {
    title: string;
    body: string;
    provenance: SpiralProvenanceKind;
  };
};

/** Deep exploration packet for one lens at one stage. */
export type SpiralLensExploration = {
  lensId: SpiralDomainId;
  /** Optional lens landing title (may differ from domain short label). */
  title?: string;
  /**
   * Lens landing body. May contain paragraphs separated by blank lines;
   * presentation splits on `\n\n`.
   */
  framing?: string;
  /**
   * Optional concise Explore-depth lede. When omitted, the first framing
   * paragraph is used; the full framing remains in Investigate.
   */
  lede?: string;
  /**
   * Optional compact symbolic-cycle context (Zodiac lens).
   * Not twelve Spiral stages and not twelve MODEL objects.
   */
  cycleContext?: SpiralLensCycleContext;
  /**
   * Quiet cue above the concept index — e.g. that concepts are supporting
   * research beneath a trajectory comparison.
   */
  conceptsCue?: string;
  /** Concept index — primary hierarchy under the lens. */
  concepts: readonly SpiralConcept[];
  /** Optional lens-level break (concepts may also carry their own). */
  comparisonBreaks?: {
    title?: string;
    body: string;
    placeholder?: boolean;
  };
  /** Lens-level open questions (not conclusions). */
  openQuestions?: readonly string[];
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

/* ── Whole-helix lenses and trajectories ──
 *
 * SPIRAL → LENS → TRAJECTORY → STEP / TRANSITION / SPAN ↔ OPERATIONS
 *
 * A lens is a way of observing. A trajectory is an actual sequence, process,
 * or narrative inside that lens, laid against the whole Spiral.
 *
 * Trajectory steps are not Spiral stages and not canonical objects.
 * Relationships are authored separately from trajectory data, never inferred
 * from position or array index. Zero relationships is valid; mismatch is data.
 */

export type SpiralLensId = SpiralExploreViewId;

export type SpiralTrajectoryStep = SpiralCycleContextStop;

/** How a trajectory moves. Not every trajectory terminates or returns. */
export type SpiralTrajectoryShape =
  | "cyclical"
  | "directional"
  | "branching"
  | "recurrent"
  | "process";

/**
 * What happens across an edge, in the trajectory's own domain terms.
 * Never a Spiral operation: `recovery` is not Renewal, `reorganization` is not
 * Organization, `collapse` is not Disruption, and `failure` is not a
 * comparison break. A return to an earlier step is expressed by the edge
 * itself, not by an outcome. Absent = not stated.
 */
export const SPIRAL_TRAJECTORY_OUTCOMES = [
  /** The process proceeds without a change of regime. */
  "continues",
  /** Returns toward a prior configuration. */
  "recovery",
  /** Persists through a substantially changed configuration. */
  "reorganization",
  /** Crosses into a different, self-maintaining configuration. */
  "regime-shift",
  /** Loses its organization. */
  "collapse",
  /** Arrested; does not proceed. */
  "stall",
  /** Breaks into separate parts that continue apart. */
  "fragmentation",
  /** Does not complete what the process undertakes. */
  "failure",
] as const;

export type SpiralTrajectoryOutcome = (typeof SPIRAL_TRAJECTORY_OUTCOMES)[number];

/**
 * Edge between two steps — domain topology only. An edge never implies a
 * Spiral operation; comparisons are authored separately as relationships.
 */
export type SpiralTrajectoryEdge = {
  /** Stable, unique within the trajectory. */
  id: string;
  from: string;
  to: string;
  label?: string;
  outcome?: SpiralTrajectoryOutcome;
  /** Conditions under which this edge is taken, in domain terms. */
  conditions?: string;
  epistemicKinds?: readonly SpiralEpistemicKind[];
  /**
   * Sources for this edge's own claim — the transition, its outcome, and its
   * conditions. Authored only; never inherited from the trajectory or inferred.
   */
  sources?: readonly SpiralSourceRef[];
};

/** An authored open research issue surfaced beside the trajectory. */
export type SpiralTrajectoryResearchIssue = {
  id: string;
  question: string;
  body?: string;
  items?: readonly string[];
};

export type SpiralTrajectory = {
  id: string;
  lensId: SpiralDomainId;
  title: string;
  shortTitle?: string;
  /** Phrase used in "Where does X appear within …?" */
  inPhrase: string;
  /** One concise orientation line for the whole trajectory. */
  description: string;
  shape: SpiralTrajectoryShape;
  /**
   * Opt-in evidentiary standard. `empirical`: every explicit transition that
   * asserts something (an outcome, conditions, or an empirical or
   * model-projection epistemic kind) must cite at least one citable source.
   * Absent = no edge-sourcing requirement (textual, symbolic trajectories).
   */
  evidenceStandard?: "empirical";
  steps: readonly SpiralTrajectoryStep[];
  /**
   * Authoritative topology when present: no edge exists that is not listed.
   * When omitted, consecutive steps are read in order (no closing edge).
   * Required for `branching` and `recurrent` shapes.
   */
  transitions?: readonly SpiralTrajectoryEdge[];
  /**
   * Research owned by this trajectory, referenced by relationship `conceptId`.
   * An id must not also exist in the stage-local research a relationship
   * could resolve against.
   */
  concepts?: readonly SpiralConcept[];
  /** Epistemic framing — what kind of object this trajectory is. */
  framing?: string;
  provenanceNote?: string;
  researchIssues?: readonly SpiralTrajectoryResearchIssue[];
  openQuestions?: readonly string[];
  comparisonBreaks?: {
    title?: string;
    body: string;
  };
  sources?: readonly SpiralSourceRef[];
};

/** Where on a trajectory a relationship is anchored. */
export type SpiralTrajectoryAnchor =
  | { kind: "step"; stepId: string }
  /** The passage along one existing edge. */
  | { kind: "transition"; from: string; to: string }
  /**
   * An authored path, inclusive: from → …via → to, each hop an existing edge.
   * `via` may be omitted only when the path is unambiguous by construction —
   * in-order steps of an ordered trajectory, or a single explicit edge.
   */
  | { kind: "span"; from: string; to: string; via?: readonly string[] };

/**
 * Observational scale of a claim. A flat vocabulary — not ordered, and no
 * scale is "higher" or "lower" than another across domains.
 */
export const SPIRAL_SCALE_IDS = [
  /** Processes within or of single cells (e.g. autophagy). */
  "cell",
  /** Tissues and organs (e.g. remodeling, wound repair). */
  "tissue",
  /** The whole living body (e.g. metamorphosis, development). */
  "organism",
  /** One person's experience, memory, identity. */
  "person",
  /** Dyads, families, small groups. */
  "group",
  /** Organizations, institutions, societies. */
  "institution",
  /** One species' population. */
  "population",
  /** An ecological community of species, e.g. a forest stand. */
  "ecological-community",
  /** Community together with its abiotic processes (nutrients, water, fire). */
  "ecosystem",
  /** A mosaic of ecosystems and the regimes shaping it. */
  "landscape",
  /** A text and its tradition of reading. */
  "text-tradition",
  /** A symbolic system read as a whole (e.g. the zodiac). */
  "symbolic-system",
] as const;

export type SpiralScaleId = (typeof SPIRAL_SCALE_IDS)[number];

export type SpiralScaleRef = {
  id: SpiralScaleId;
  /** Domain-specific qualification of the scale. */
  note?: string;
};

/**
 * Status of a comparison — how much weight the relationship can bear.
 * Statuses are not equivalent; presentation must name them in text.
 * Whether a status draws is decided only in `comparisons/findings.ts`; a new
 * status draws nothing until it is listed there. `ambiguous` is an authored,
 * drawing relationship whose reading is kept open — not an unresolved inquiry.
 */
export type SpiralRelationshipStatus =
  | "strong-empirical"
  | "candidate"
  | "structural"
  | "symbolic-analogy"
  | "textual-theological"
  | "context"
  | "ambiguous"
  | "comparison-break";

/** A Spiral operation; `occurrenceId` narrows to one occurrence (e.g. Emergence again). */
export type SpiralOperationRef = {
  stageId: SpiralStageId;
  occurrenceId?: string;
};

/**
 * Authored relationship between part of a trajectory and one or more Spiral
 * operations. Not a match, not a mapping, not evidence.
 */
export type SpiralTrajectoryRelationship = {
  id: string;
  trajectoryId: string;
  anchor: SpiralTrajectoryAnchor;
  operations: readonly SpiralOperationRef[];
  status: SpiralRelationshipStatus;
  /** Uses the existing epistemic categories. */
  epistemicKinds?: readonly SpiralEpistemicKind[];
  /** Observational scale at which the relationship is claimed, when authored. */
  scale?: SpiralScaleRef;
  /**
   * Stage-local transition annotation holding the full research text
   * (looked up in the stage exploration's lens cycleContext).
   */
  transitionId?: string;
  /**
   * Concept carrying the research behind this relationship. Resolves against
   * the trajectory's own concepts or the stage-local research of its
   * operations for the trajectory's lens — exactly one match, never a guess.
   */
  conceptId?: string;
  /** Authored line; when absent, the transition body's first paragraph is used. */
  note?: string;
};

/** @deprecated Prefer SpiralTrajectoryRelationship. */
export type SpiralTrajectoryResonance = SpiralTrajectoryRelationship;

export type SpiralLens = {
  id: SpiralLensId;
  label: string;
  /** One human sentence — what this way of seeing brings to the whole Spiral. */
  intro: string;
  /** Concise evidentiary line shown at Explore depth. */
  evidence: string;
  /** Phrase used in "Where does X appear in …?" when no trajectory is active. */
  inPhrase: string;
  /**
   * Lens-level research — scholarship about the lens as a whole, not owned by
   * any operation. Same shape as stage-local research.
   */
  research?: SpiralLensExploration;
  /** Authored whole-helix trajectories. Empty is valid. */
  trajectories: readonly SpiralTrajectory[];
  /**
   * Trajectories under consideration but not yet mapped. Names only —
   * presentation must say they are not yet mapped.
   */
  forthcoming?: readonly string[];
  /** `scaffold` = surface exists, content intentionally unwritten (Across). */
  status: "available" | "scaffold";
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
