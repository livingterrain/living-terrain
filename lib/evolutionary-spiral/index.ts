export type {
  SpiralComparisonPair,
  SpiralCurrent,
  SpiralCurrentId,
  SpiralDomain,
  SpiralDomainId,
  SpiralEpistemicCategory,
  SpiralEpistemicKind,
  SpiralEssayRelation,
  SpiralExample,
  SpiralFrameworkCopy,
  SpiralSequenceStop,
  SpiralStage,
  SpiralStageId,
} from "./types";

export {
  SPIRAL_CURRENT_IDS,
  SPIRAL_DOMAIN_IDS,
  SPIRAL_STAGE_IDS,
} from "./types";

export {
  SPIRAL_SEQUENCE,
  SPIRAL_STAGES,
  getSpiralStage,
} from "./stages";

export { SPIRAL_CURRENTS } from "./currents";

export { SPIRAL_DOMAINS, getSpiralDomain } from "./domains";

export {
  SPIRAL_EPISTEMIC_CATEGORIES,
  epistemicLabel,
} from "./epistemic";

export { SPIRAL_COPY } from "./copy";

export { SPIRAL_EXAMPLES, examplesForStage } from "./examples";

export {
  SPIRAL_ASCENT_CAPTION,
  SPIRAL_DEFAULT_OCCURRENCE_ID,
  SPIRAL_GEOM,
  SPIRAL_VIEWBOX,
  arcWindowForIndex,
  axisPoint,
  buildSpiralNodes,
  continuityPoint,
  currentPaths,
  displayNameForStop,
  localArcPath,
  localAxisPath,
  nodeHitStyle,
  tForIndex,
  transformationPoint,
} from "./geometry";

export type { SpiralNodeGeometry, SpiralPoint } from "./geometry";

import { SPIRAL_COPY } from "./copy";
import { SPIRAL_CURRENTS } from "./currents";
import { SPIRAL_DOMAINS } from "./domains";
import { SPIRAL_EPISTEMIC_CATEGORIES } from "./epistemic";
import { SPIRAL_EXAMPLES } from "./examples";
import { SPIRAL_SEQUENCE, SPIRAL_STAGES } from "./stages";

/** Aggregated read model for the Spiral page. */
export function getEvolutionarySpiral() {
  return {
    copy: SPIRAL_COPY,
    stages: SPIRAL_STAGES,
    sequence: SPIRAL_SEQUENCE,
    currents: SPIRAL_CURRENTS,
    domains: SPIRAL_DOMAINS,
    epistemicCategories: SPIRAL_EPISTEMIC_CATEGORIES,
    examples: SPIRAL_EXAMPLES,
  };
}
