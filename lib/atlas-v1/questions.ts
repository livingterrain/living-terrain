/**
 * Threshold-only question list — keep this module free of essays/relations
 * so The Void’s first paint does not wait on the journey corpus.
 */

import type { AtlasV1ConceptId, AtlasV1QuestionId } from "@/lib/atlas-v1/content";

export type VoidQuestion = {
  id: AtlasV1QuestionId;
  text: string;
  startConceptId: AtlasV1ConceptId;
};

export const VOID_QUESTIONS: VoidQuestion[] = [
  {
    id: "body-react",
    text: "Why does my body react this way?",
    startConceptId: "body",
  },
  {
    id: "technology-change",
    text: "Why does technology change us?",
    startConceptId: "technology",
  },
  {
    id: "relationships-difficult",
    text: "Why are relationships so difficult?",
    startConceptId: "relationship",
  },
  {
    id: "inhabit-time",
    text: "How do we inhabit time?",
    startConceptId: "time",
  },
  {
    id: "before-collapse",
    text: "What is forming before the collapse?",
    startConceptId: "relationship",
  },
  {
    id: "beneath-perception",
    text: "What lies beneath perception?",
    startConceptId: "reality",
  },
];
