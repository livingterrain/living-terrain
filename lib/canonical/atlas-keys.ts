import type { AtlasV1ConceptId, AtlasV1QuestionId } from "@/lib/atlas-v1/content";

export function atlasBondKey(
  questionId: AtlasV1QuestionId,
  conceptId: AtlasV1ConceptId,
): string {
  return `${questionId}::${conceptId}`;
}
