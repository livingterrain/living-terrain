/**
 * Epistemic vocabulary for Instrument 01: The Text.
 * Categories are structural — not mere visual labels.
 */

/** What kind of statement a claim is making. */
export type ClaimCategory =
  | "primary-text"
  | "morphology"
  | "lexical"
  | "grammatical"
  | "translation"
  | "literary-context"
  | "historical-context"
  | "interpretive-tradition"
  | "scholarly-interpretation"
  | "living-terrain-exploration"
  | "open-question";

/**
 * Passage strata — ordered hierarchy.
 * Terrain and open questions are structurally post-evidence.
 */
export type PassageStratum =
  | "text"
  | "language"
  | "translation"
  | "context"
  | "interpretation"
  | "terrain"
  | "open";

export const PASSAGE_STRATUM_ORDER: readonly PassageStratum[] = [
  "text",
  "language",
  "translation",
  "context",
  "interpretation",
  "terrain",
  "open",
] as const;

export const EVIDENCE_STRATA: readonly PassageStratum[] = [
  "text",
  "language",
  "translation",
  "context",
  "interpretation",
] as const;

/** Categories allowed before the terrain boundary. */
export const SCHOLARLY_CATEGORIES: readonly ClaimCategory[] = [
  "primary-text",
  "morphology",
  "lexical",
  "grammatical",
  "translation",
  "literary-context",
  "historical-context",
  "interpretive-tradition",
  "scholarly-interpretation",
] as const;

/** Categories that must never present as linguistic conclusions. */
export const POST_EVIDENCE_CATEGORIES: readonly ClaimCategory[] = [
  "living-terrain-exploration",
  "open-question",
] as const;

/**
 * Confidence — reusable, deliberately coarse.
 * Do not use “widely agreed” for entire interpretive traditions.
 */
export type EpistemicConfidence =
  | "widely-attested"
  | "reasonable-reading"
  | "disputed"
  | "directly-attested"
  | "tradition-noted"
  | "exploratory";

/**
 * Internal / editorial verification gate.
 * verified = publishable core claim
 * research-continues = core may stand while deeper lexicon work remains
 */
export type VerificationStatus =
  | "verified"
  | "research-continues"
  | "provisionally-sourced"
  | "awaiting-research"
  | "exploratory";

/** Passage-level scholarship banner (not a CMS status). */
export type ScholarshipStatus = "verified-core" | "research-continues" | "prototype";

export type SourceType =
  | "primary-text-edition"
  | "lexicon"
  | "grammar"
  | "translation"
  | "commentary"
  | "academic-book"
  | "academic-article"
  | "jewish-interpretive"
  | "christian-interpretive"
  | "other-scholarly";

export function confidenceLabel(c: EpistemicConfidence): string {
  switch (c) {
    case "widely-attested":
      return "Widely attested";
    case "reasonable-reading":
      return "Reasonable reading";
    case "disputed":
      return "Disputed";
    case "directly-attested":
      return "Directly attested";
    case "tradition-noted":
      return "Tradition noted";
    case "exploratory":
      return "Exploratory";
  }
}

export function verificationLabel(v: VerificationStatus): string {
  switch (v) {
    case "verified":
      return "Verified";
    case "research-continues":
      return "Research continues";
    case "provisionally-sourced":
      return "Provisionally sourced";
    case "awaiting-research":
      return "Awaiting research";
    case "exploratory":
      return "Exploratory";
  }
}

export function scholarshipStatusLabel(s: ScholarshipStatus): string {
  switch (s) {
    case "verified-core":
      return "Verified core";
    case "research-continues":
      return "Research continues";
    case "prototype":
      return "Prototype";
  }
}

export function categoryLabel(c: ClaimCategory): string {
  switch (c) {
    case "primary-text":
      return "Primary text";
    case "morphology":
      return "Morphology";
    case "lexical":
      return "Lexical";
    case "grammatical":
      return "Grammatical";
    case "translation":
      return "Translation";
    case "literary-context":
      return "Literary context";
    case "historical-context":
      return "Historical context";
    case "interpretive-tradition":
      return "Interpretive tradition";
    case "scholarly-interpretation":
      return "Scholarly interpretation";
    case "living-terrain-exploration":
      return "Living Terrain exploration";
    case "open-question":
      return "Open question";
  }
}

export function isPostEvidenceCategory(c: ClaimCategory): boolean {
  return (POST_EVIDENCE_CATEGORIES as readonly string[]).includes(c);
}

export function isScholarlyCategory(c: ClaimCategory): boolean {
  return (SCHOLARLY_CATEGORIES as readonly string[]).includes(c);
}
