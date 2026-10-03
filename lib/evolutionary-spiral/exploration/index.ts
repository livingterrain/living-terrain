import type {
  SpiralAcrossExploration,
  SpiralConcept,
  SpiralDomainId,
  SpiralExploreViewId,
  SpiralLensExploration,
  SpiralStageExploration,
  SpiralStageId,
} from "../types";
import { SPIRAL_LENS_ORDER } from "../types";
import { TRANSFORMATION_EXPLORATION } from "./transformation";

const BY_STAGE: Partial<Record<SpiralStageId, SpiralStageExploration>> = {
  transformation: TRANSFORMATION_EXPLORATION,
};

export function getStageExploration(
  stageId: SpiralStageId,
): SpiralStageExploration | undefined {
  return BY_STAGE[stageId];
}

export function stageHasDeepExploration(stageId: SpiralStageId): boolean {
  return Boolean(BY_STAGE[stageId]);
}

export function getLensExploration(
  stageId: SpiralStageId,
  lensId: SpiralDomainId,
): SpiralLensExploration | undefined {
  return getStageExploration(stageId)?.lenses.find((l) => l.lensId === lensId);
}

export function getConcept(
  stageId: SpiralStageId,
  lensId: SpiralDomainId,
  conceptId: string,
): SpiralConcept | undefined {
  return getLensExploration(stageId, lensId)?.concepts.find(
    (c) => c.id === conceptId,
  );
}

export function getAcrossExploration(
  stageId: SpiralStageId,
): SpiralAcrossExploration | undefined {
  return getStageExploration(stageId)?.across;
}

export function defaultExploreView(stageId: SpiralStageId): SpiralExploreViewId {
  const exploration = getStageExploration(stageId);
  if (!exploration) return SPIRAL_LENS_ORDER[0]!;
  const first = SPIRAL_LENS_ORDER.find((id) =>
    exploration.lenses.some((l) => l.lensId === id),
  );
  return first ?? "across";
}

export { TRANSFORMATION_EXPLORATION };
