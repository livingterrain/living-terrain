/**
 * THE TEXT — Instrument 01 data model.
 * Scholarly content lives here; presentation stays in components.
 *
 * Structural rule: Living Terrain exploration and open questions are
 * post-evidence strata. They must not carry scholarly citation styling
 * that could be mistaken for linguistic conclusions.
 *
 * Primary-text observations (e.g. cross-references) are not the same
 * evidence kind as attributed interpretation. Keep them separate:
 * - occurrenceNotes / primary-text claims → textual evidence
 * - NamedInterpretation → attributed reading of what that evidence means
 */

import type {
  ClaimCategory,
  EpistemicConfidence,
  PassageStratum,
  ScholarshipStatus,
  SourceType,
  VerificationStatus,
} from "./epistemic";

export type TextLanguage = "hebrew" | "greek";

export type PassageStatus = "ready" | "forming" | "prototype";

export type InterpretiveTradition =
  | "jewish"
  | "christian"
  | "academic"
  | "shared";

export type TerrainLinkKind =
  | "scripture"
  | "concept"
  | "essay"
  | "question"
  | "atlas"
  | "note";

/** @deprecated Prefer EpistemicConfidence — kept for migration clarity. */
export type ClaimConfidence = EpistemicConfidence;

/** @deprecated Prefer VerificationStatus. */
export type ContentVerification = VerificationStatus;

/**
 * A discrete claim with provenance.
 * Sparse accurate data > generated filler.
 *
 * Sources attach at CLAIM level — do not imply a section bibliography
 * endorses every sentence in that section.
 */
export interface EvidenceClaim {
  id: string;
  text: string;
  category: ClaimCategory;
  confidence: EpistemicConfidence;
  sourceIds: string[];
  /** Optional primary source-type hint for the claim. */
  sourceType?: SourceType;
  verificationStatus: VerificationStatus;
  /**
   * Internal authoring note (FLAG / research queue).
   * Not final visitor copy — EvidenceInspect must not surface this as scholarship.
   */
  note?: string;
  title?: string;
  /** Optional visitor-safe clarification (rare). */
  visitorNote?: string;
}

export interface SemanticSense {
  gloss: string;
  confidence: EpistemicConfidence;
  note?: string;
  sourceIds?: string[];
  verificationStatus?: VerificationStatus;
}

export interface SemanticRange {
  caution: string;
  senses: SemanticSense[];
}

/**
 * Exploratory only — TypeScript locks category + verification.
 * Cannot be mistaken for a lexical EvidenceClaim in the type system.
 */
export interface TerrainExploration {
  label: string;
  kind: TerrainLinkKind;
  note?: string;
  href?: string;
  readonly category: "living-terrain-exploration";
  readonly confidence: "exploratory";
  readonly verificationStatus: "exploratory";
  /** Must remain empty — exploratory nodes do not cite as scholarly proof. */
  readonly sourceIds: readonly [];
}

export interface PassageWord {
  id: string;
  surface: string;
  lemma?: string;
  strongs?: string;
  transliteration: string;
  /** Morphology / grammatical form. */
  form: string;
  formClaim?: EvidenceClaim;
  gloss?: string;
  semanticRange: SemanticRange;
  translatedHere: string;
  translationNote?: string;
  translationClaim?: EvidenceClaim;
  /**
   * Occurrence / cross-reference notes as claims.
   * Prefer category "primary-text" when stating that a phrase appears elsewhere.
   * Do not place commentator explanations here — those belong in NamedInterpretation.
   */
  occurrenceNotes?: EvidenceClaim[];
  /** Post-evidence relational notes (not lexical proof). */
  followThisWord?: TerrainExploration[];
  sourceIds?: string[];
  verificationStatus: VerificationStatus;
}

export type OriginalToken =
  | { type: "word"; wordId: string }
  | { type: "text"; value: string };

/** Metadata separable from translation text. */
export interface TranslationMeta {
  id: string;
  label: string;
  shortName: string;
  attribution: string;
  year?: number | string;
  publicDomain: boolean;
  licenseNote?: string;
  sourceId: string;
  /** When false, kept in data but hidden from the compare UI. */
  visibleInCompare?: boolean;
}

export interface TranslationVariant extends TranslationMeta {
  text: string;
  differenceNotes?: {
    phrase: string;
    note: string;
    claim?: EvidenceClaim;
  }[];
}

/**
 * One named reading within a tradition.
 * Prefer: "Rashi — …", "Ramban — …", "Westermann — …"
 * Never collapse to "Judaism says…" / "Christianity says…".
 */
export interface NamedInterpretation {
  id: string;
  /**
   * Named interpreter / work voice.
   * Omit while provisional; content packet should supply names.
   */
  interpreter?: string;
  /** Optional work title or locus (e.g. "Commentary on Genesis"). */
  work?: string;
  body: string;
  confidence: EpistemicConfidence;
  verificationStatus: VerificationStatus;
  /** Claim-level sources for THIS reading only. */
  sourceIds: string[];
  /** Optional finer-grained claims inside this reading. */
  claims?: EvidenceClaim[];
  /** Internal authoring flag — not visitor copy. */
  researchFlag?: string;
}

/**
 * Tradition group containing one or more named readings.
 * Supports interpretive plurality inside Jewish / Christian / academic streams.
 */
export interface InterpretationTraditionGroup {
  tradition: InterpretiveTradition;
  /** Group heading only — e.g. "Jewish readings" — not a consensus claim. */
  label: string;
  readings: NamedInterpretation[];
  /** Internal authoring flag for the group — not visitor copy. */
  researchFlag?: string;
}

/**
 * @deprecated Use InterpretationTraditionGroup + NamedInterpretation.
 * Kept as an alias for tooling during the content-packet handoff.
 */
export type AttributedReading = InterpretationTraditionGroup;

export interface ContextBlock {
  title: string;
  body: string;
  category: Extract<
    ClaimCategory,
    "literary-context" | "historical-context" | "primary-text" | "grammatical"
  >;
  verificationStatus: VerificationStatus;
  sourceIds: string[];
  confidence: EpistemicConfidence;
  /** Internal authoring flag — not visitor copy. */
  researchFlag?: string;
}

export interface OpenQuestion {
  question: string;
  whyOpen: string;
  readonly category: "open-question";
  readonly confidence: "exploratory";
  readonly verificationStatus: "exploratory";
}

export interface LanguageNote extends EvidenceClaim {
  category: Extract<
    ClaimCategory,
    "grammatical" | "literary-context" | "lexical" | "morphology"
  >;
}

export interface PassageSections {
  languageNotes: LanguageNote[];
  context: ContextBlock[];
  interpretation: InterpretationTraditionGroup[];
  terrain: TerrainExploration[];
  remainsOpen: OpenQuestion[];
}

export interface PassageSummary {
  id: string;
  slug: string;
  reference: string;
  language: TextLanguage;
  themes: string[];
  status: PassageStatus;
  whisper: string;
}

export interface PassageOriginal {
  scriptLabel: string;
  dir: "rtl" | "ltr";
  lang: string;
  source: string;
  sourceId: string;
  tokens: OriginalToken[];
}

export interface Passage extends PassageSummary {
  englishPrimary: {
    label: string;
    attribution: string;
    text: string;
    sourceId: string;
  };
  /** Publishable-core honesty banner. */
  scholarshipStatus?: ScholarshipStatus;
  semanticRangeNote: string;
  /** Passage-specific framing above the translation compare. */
  translationFraming?: string;
  /** Optional restrained aside below compare (e.g. copyrighted phrase evidence). */
  translationAside?: string;
  /**
   * Inactive / future passage relations — do not render as live links
   * until the target passage is ready.
   */
  futureRelations?: {
    targetSlug: string;
    reason: string;
  }[];
  original: PassageOriginal;
  words: PassageWord[];
  translations: TranslationVariant[];
  sections: PassageSections;
  /** Optional ordered claim index for tooling / audits. */
  claimIndex?: EvidenceClaim[];
}

export type {
  ClaimCategory,
  EpistemicConfidence,
  PassageStratum,
  ScholarshipStatus,
  SourceType,
  VerificationStatus,
};

/** Factory helpers that enforce epistemic locks. */
export function terrainNode(
  partial: Omit<
    TerrainExploration,
    "category" | "confidence" | "verificationStatus" | "sourceIds"
  >,
): TerrainExploration {
  return {
    ...partial,
    category: "living-terrain-exploration",
    confidence: "exploratory",
    verificationStatus: "exploratory",
    sourceIds: [],
  };
}

export function openQuestion(
  partial: Omit<
    OpenQuestion,
    "category" | "confidence" | "verificationStatus"
  >,
): OpenQuestion {
  return {
    ...partial,
    category: "open-question",
    confidence: "exploratory",
    verificationStatus: "exploratory",
  };
}

export function namedInterpretation(
  partial: NamedInterpretation,
): NamedInterpretation {
  return partial;
}

export function interpretationGroup(
  partial: InterpretationTraditionGroup,
): InterpretationTraditionGroup {
  if (partial.readings.length === 0) {
    throw new Error(
      `Interpretation group "${partial.label}" must contain at least one named reading.`,
    );
  }
  return partial;
}
