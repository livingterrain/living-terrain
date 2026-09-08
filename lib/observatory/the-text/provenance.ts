import {
  categoryLabel,
  confidenceLabel,
  isPostEvidenceCategory,
  isScholarlyCategory,
  verificationLabel,
  type ClaimCategory,
  type EpistemicConfidence,
  type VerificationStatus,
} from "./epistemic";
import { getSourcesByIds, type TextSource } from "./sources";
import type { EvidenceClaim } from "./types";

export {
  categoryLabel,
  confidenceLabel,
  isPostEvidenceCategory,
  isScholarlyCategory,
  verificationLabel,
};

export function resolveClaimSources(claim: EvidenceClaim): TextSource[] {
  return getSourcesByIds(claim.sourceIds);
}

export function claimHasInspectableEvidence(claim: EvidenceClaim): boolean {
  if (isPostEvidenceCategory(claim.category)) return false;
  return claim.sourceIds.length > 0;
}

export function claimNeedsResearch(claim: EvidenceClaim): boolean {
  return claim.verificationStatus === "awaiting-research";
}

/** Visitor-facing status — category + confidence; verified when publishable. */
export function claimStatusLine(claim: EvidenceClaim): string {
  const parts = [
    categoryLabel(claim.category),
    confidenceLabel(claim.confidence),
  ];
  if (claim.verificationStatus === "verified") {
    parts.push(verificationLabel("verified"));
  } else if (claim.verificationStatus === "research-continues") {
    parts.push(verificationLabel("research-continues"));
  }
  return parts.join(" · ");
}

/** Authoring-state notes stay in data; do not present as reader scholarship. */
export function isAuthoringNote(text: string | undefined): boolean {
  if (!text) return false;
  const t = text.trim();
  return (
    /^FLAG:/i.test(t) ||
    /\bTBD\b/.test(t) ||
    /awaiting research/i.test(t) ||
    /research pass/i.test(t) ||
    /content packet/i.test(t) ||
    /PROVISIONAL/i.test(t) ||
    /not yet attached/i.test(t) ||
    /not yet documented/i.test(t)
  );
}

export function visitorFacingNote(claim: EvidenceClaim): string | undefined {
  if (claim.visitorNote) return claim.visitorNote;
  if (claim.note && !isAuthoringNote(claim.note)) return claim.note;
  return undefined;
}

export function makeClaim(input: {
  id: string;
  text: string;
  category: ClaimCategory;
  confidence: EpistemicConfidence;
  sourceIds?: string[];
  verificationStatus: VerificationStatus;
  note?: string;
  title?: string;
  visitorNote?: string;
}): EvidenceClaim {
  if (
    isPostEvidenceCategory(input.category) &&
    input.verificationStatus !== "exploratory"
  ) {
    throw new Error(
      `Claim ${input.id}: post-evidence category requires verificationStatus "exploratory".`,
    );
  }
  if (
    isScholarlyCategory(input.category) &&
    input.verificationStatus === "exploratory"
  ) {
    throw new Error(
      `Claim ${input.id}: scholarly category cannot be marked exploratory.`,
    );
  }
  return {
    id: input.id,
    text: input.text,
    category: input.category,
    confidence: input.confidence,
    sourceIds: input.sourceIds ?? [],
    verificationStatus: input.verificationStatus,
    note: input.note,
    title: input.title,
    visitorNote: input.visitorNote,
  };
}

export function makeLanguageNote(input: {
  id: string;
  text: string;
  category: Extract<
    ClaimCategory,
    "grammatical" | "literary-context" | "lexical" | "morphology"
  >;
  confidence: EpistemicConfidence;
  sourceIds?: string[];
  verificationStatus: VerificationStatus;
  note?: string;
  title?: string;
  visitorNote?: string;
}): import("./types").LanguageNote {
  return makeClaim(input) as import("./types").LanguageNote;
}
