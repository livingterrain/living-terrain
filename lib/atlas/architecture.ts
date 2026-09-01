/**
 * Living Terrain — Atlas information architecture (internal).
 *
 * Hierarchy:
 *   ROOT TERRITORIES → LIVING QUESTIONS → CONCEPTS → EVIDENCE → native works/rooms
 *
 * Working labels for this pass — not final public poetry.
 * Does not invent canonical relations. Does not rewrite journeys.
 */

import type { AtlasV1ConceptId, AtlasV1QuestionId } from "@/lib/atlas-v1/content";
import { VOID_QUESTIONS } from "@/lib/atlas-v1/questions";

export type RootTerritoryId =
  | "r1-living-systems"
  | "r2-reality-structure"
  | "r3-participation"
  | "r4-meaning-orientation"
  | "r5-time-emergence";

/**
 * How a living question sits under a root.
 * - primary: main active door into a deep territory
 * - active: journeyable living question
 * - forming: alive, may be thin
 * - forming-no-journey: catalogued under a root; must NOT open a duplicate trail
 */
export type QuestionDisposition =
  | "primary"
  | "active"
  | "forming"
  | "forming-no-journey";

export type TerritoryDepth = "deep" | "forming" | "thin";

export type RootTerritory = {
  id: RootTerritoryId;
  /** Working visitor-facing label */
  label: string;
  /** One quiet line — territory, not marketing */
  whisper: string;
  depth: TerritoryDepth;
  /** Existing Atlas concepts that naturally belong here (no new concepts) */
  conceptIds: readonly AtlasV1ConceptId[];
};

export type QuestionPlacement = {
  questionId: AtlasV1QuestionId;
  territoryId: RootTerritoryId;
  disposition: QuestionDisposition;
  /** When false, UI must not start the authored journey (duplicate-spine guard). */
  journeyOpen: boolean;
};

export const ROOT_TERRITORIES: readonly RootTerritory[] = [
  {
    id: "r1-living-systems",
    label: "Living systems",
    whisper: "Body, feedback, adaptation, becoming as organism.",
    depth: "deep",
    conceptIds: ["body", "feedback", "adaptation", "participation"],
  },
  {
    id: "r2-reality-structure",
    label: "Reality / structure",
    whisper: "What must already be in place for anything to appear as real.",
    depth: "deep",
    conceptIds: ["reality", "constraint"],
  },
  {
    id: "r3-participation",
    label: "Participation",
    whisper: "Relationship, agency, technology, culture — how we take part.",
    depth: "forming",
    conceptIds: ["relationship", "technology", "participation"],
  },
  {
    id: "r4-meaning-orientation",
    label: "Meaning / orientation",
    whisper: "Language, symbol, spirituality — still gathering as Atlas.",
    depth: "thin",
    conceptIds: ["meaning"],
  },
  {
    id: "r5-time-emergence",
    label: "Time / emergence",
    whisper: "Cycles, becoming over time, what forms before a phase turns.",
    depth: "forming",
    conceptIds: ["time", "adaptation"],
  },
] as const;

/**
 * Disposition of the six existing question IDs.
 * IDs and journeys preserved; before-collapse is not an independent journey door.
 */
export const QUESTION_PLACEMENTS: readonly QuestionPlacement[] = [
  {
    questionId: "body-react",
    territoryId: "r1-living-systems",
    disposition: "primary",
    journeyOpen: true,
  },
  {
    questionId: "beneath-perception",
    territoryId: "r2-reality-structure",
    disposition: "primary",
    journeyOpen: true,
  },
  {
    questionId: "technology-change",
    territoryId: "r3-participation",
    disposition: "active",
    journeyOpen: true,
  },
  {
    questionId: "relationships-difficult",
    territoryId: "r3-participation",
    disposition: "active",
    journeyOpen: true,
  },
  {
    questionId: "inhabit-time",
    territoryId: "r5-time-emergence",
    disposition: "forming",
    journeyOpen: true,
  },
  {
    questionId: "before-collapse",
    territoryId: "r5-time-emergence",
    disposition: "forming-no-journey",
    journeyOpen: false,
  },
] as const;

export function getRootTerritory(id: RootTerritoryId): RootTerritory {
  const t = ROOT_TERRITORIES.find((r) => r.id === id);
  if (!t) throw new Error(`Unknown root territory: ${id}`);
  return t;
}

export function getQuestionPlacement(
  questionId: AtlasV1QuestionId,
): QuestionPlacement {
  const p = QUESTION_PLACEMENTS.find((q) => q.questionId === questionId);
  if (!p) throw new Error(`Unknown question placement: ${questionId}`);
  return p;
}

export function isJourneyOpen(questionId: AtlasV1QuestionId): boolean {
  return getQuestionPlacement(questionId).journeyOpen;
}

export function placementsForTerritory(territoryId: RootTerritoryId) {
  return QUESTION_PLACEMENTS.filter((p) => p.territoryId === territoryId);
}

export function voidQuestionText(questionId: AtlasV1QuestionId): string {
  const q = VOID_QUESTIONS.find((v) => v.id === questionId);
  return q?.text ?? questionId;
}

/** Questions the Atlas entrance may start as journeys */
export function journeyableVoidQuestions() {
  return VOID_QUESTIONS.filter((q) => isJourneyOpen(q.id));
}
