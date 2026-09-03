/**
 * Atlas Branch — explicitly authored lateral openings.
 *
 * Branch-native data only. Does not read PATH RELATES_TO, SOURCED_FROM,
 * EVIDENCE_FOR, or inferred graph edges.
 *
 * PATH      = progression within the current living question
 * SOURCE    = evidence / public work beneath a concept
 * BRANCH    = authored lateral opening defined here
 * THREAD    = visitor session route (Living Thread)
 */

import {
  getQuestion,
  type AtlasV1ConceptId,
  type AtlasV1QuestionId,
} from "@/lib/atlas-v1/content";
import { isJourneyOpen } from "@/lib/atlas/architecture";

export type AtlasAuthoredBranch = {
  id: string;
  /** Living question where the branch is offered */
  offeredQuestionId: AtlasV1QuestionId;
  /** Concept stop where the branch appears */
  offeredConceptId: AtlasV1ConceptId;
  /** Destination concept the visitor enters */
  toConceptId: AtlasV1ConceptId;
  /** Living question that hosts the destination on its authored PATH */
  entryQuestionId: AtlasV1QuestionId;
  /** Visitor-facing branch copy — not borrowed from PATH bonds */
  copy: string;
};

export type AtlasBranchOffer = AtlasAuthoredBranch & {
  trail: readonly AtlasV1ConceptId[];
};

/** First five authored branches — curated by Chelsea */
export const ATLAS_AUTHORED_BRANCHES: readonly AtlasAuthoredBranch[] = [
  {
    id: "branch-tech-relationship-constraint",
    offeredQuestionId: "technology-change",
    offeredConceptId: "relationship",
    toConceptId: "constraint",
    entryQuestionId: "relationships-difficult",
    copy:
      "Every relationship eventually reveals its limits: what can bend, what must hold, and what happens when neither is clear.",
  },
  {
    id: "branch-tech-time-meaning",
    offeredQuestionId: "technology-change",
    offeredConceptId: "time",
    toConceptId: "meaning",
    entryQuestionId: "inhabit-time",
    copy:
      "What something means often changes with when we encounter it, how long it lasts, and what remains after it passes.",
  },
  {
    id: "branch-rel-relationship-time",
    offeredQuestionId: "relationships-difficult",
    offeredConceptId: "relationship",
    toConceptId: "time",
    entryQuestionId: "inhabit-time",
    copy:
      "Relationships are not only made of people. They are made of accumulated moments, memory, repetition, and change.",
  },
  {
    id: "branch-rel-constraint-meaning",
    offeredQuestionId: "relationships-difficult",
    offeredConceptId: "constraint",
    toConceptId: "meaning",
    entryQuestionId: "beneath-perception",
    copy:
      "Meaning appears partly because not everything can be held at once. To notice one thing is already to leave something else outside the frame.",
  },
  {
    id: "branch-perception-meaning-participation",
    offeredQuestionId: "beneath-perception",
    offeredConceptId: "meaning",
    toConceptId: "participation",
    entryQuestionId: "inhabit-time",
    copy:
      "Meaning does not remain abstract for long. What we believe something means changes how we enter it, respond to it, and live with it.",
  },
] as const;

/** Authored PATH prefix from a question's start through `conceptId`. */
export function authoredTrailToConcept(
  questionId: AtlasV1QuestionId,
  conceptId: AtlasV1ConceptId,
): AtlasV1ConceptId[] | null {
  const question = getQuestion(questionId);
  const trail: AtlasV1ConceptId[] = [];
  let current: AtlasV1ConceptId | null = question.startConceptId;
  const seen = new Set<AtlasV1ConceptId>();

  while (current && !seen.has(current)) {
    trail.push(current);
    if (current === conceptId) return trail;
    seen.add(current);
    current = question.relations[current]?.[0]?.to ?? null;
  }

  return null;
}

function resolveOffer(branch: AtlasAuthoredBranch): AtlasBranchOffer | null {
  if (!isJourneyOpen(branch.entryQuestionId)) return null;
  const trail = authoredTrailToConcept(branch.entryQuestionId, branch.toConceptId);
  if (!trail) return null;
  return { ...branch, trail };
}

/** Branch offered at this question/concept stop, if explicitly authored. */
export function resolveAuthoredBranch(
  questionId: AtlasV1QuestionId,
  conceptId: AtlasV1ConceptId,
): AtlasBranchOffer | null {
  const branch = ATLAS_AUTHORED_BRANCHES.find(
    (candidate) =>
      candidate.offeredQuestionId === questionId &&
      candidate.offeredConceptId === conceptId,
  );
  if (!branch) return null;
  return resolveOffer(branch);
}

export function listAuthoredBranches(): readonly AtlasBranchOffer[] {
  return ATLAS_AUTHORED_BRANCHES.map(resolveOffer).filter(
    (offer): offer is AtlasBranchOffer => offer !== null,
  );
}
