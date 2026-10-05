export type {
  SpiralAcrossExploration,
  SpiralAcrossItem,
  SpiralAcrossSection,
  SpiralAcrossSectionKind,
  SpiralComparisonPair,
  SpiralConcept,
  SpiralConceptDiveSection,
  SpiralConceptDiveSectionKind,
  SpiralCurrent,
  SpiralCurrentId,
  SpiralCycleContextStop,
  SpiralCycleContextTransition,
  SpiralDomain,
  SpiralDomainId,
  SpiralEpistemicCategory,
  SpiralEpistemicKind,
  SpiralEssayRelation,
  SpiralExample,
  SpiralExploreViewId,
  SpiralFrameworkCopy,
  SpiralLensCycleContext,
  SpiralLensEntry,
  SpiralLens,
  SpiralLensExploration,
  SpiralLensId,
  SpiralLensSection,
  SpiralLensSectionKind,
  SpiralProvenanceKind,
  SpiralSequenceStop,
  SpiralSourceRef,
  SpiralStage,
  SpiralStageExploration,
  SpiralStageId,
  SpiralOperationRef,
  SpiralRelationshipStatus,
  SpiralTrajectory,
  SpiralTrajectoryAnchor,
  SpiralScaleId,
  SpiralScaleRef,
  SpiralTrajectoryEdge,
  SpiralTrajectoryOutcome,
  SpiralTrajectoryRelationship,
  SpiralTrajectoryResearchIssue,
  SpiralTrajectoryResonance,
  SpiralTrajectoryShape,
  SpiralTrajectoryStep,
} from "./types";

export {
  SPIRAL_CURRENT_IDS,
  SPIRAL_DOMAIN_IDS,
  SPIRAL_LENS_ORDER,
  SPIRAL_SCALE_IDS,
  SPIRAL_STAGE_IDS,
  SPIRAL_TRAJECTORY_OUTCOMES,
} from "./types";

export {
  EXPLICIT_TOPOLOGY_SHAPES,
  findEdge,
  incomingEdges,
  orderedEdges,
  outgoingEdges,
  resolveSpan,
  sinkStepIds,
  topologySource,
  trajectoryEdges,
} from "./topology";

export type { SpiralSpanResolution, SpiralTopologySource } from "./topology";

export {
  TRAJECTORY_TOPOLOGY,
  fitTopologyLayout,
  returningEdgeIds,
  topologyLayout,
  trajectoryFigureKind,
} from "./topology-layout";

export type {
  SpiralTrajectoryFigureKind,
  TopologyDensity,
  TopologyLayout,
  TopologyNode,
  TopologyRoute,
} from "./topology-layout";

export {
  SPIRAL_SEQUENCE,
  SPIRAL_STAGES,
  getSpiralStage,
  microcopyForStop,
} from "./stages";

export { SPIRAL_CURRENTS } from "./currents";

export { SPIRAL_DOMAINS, getSpiralDomain } from "./domains";

export {
  SPIRAL_EPISTEMIC_CATEGORIES,
  SPIRAL_EPISTEMIC_LEGEND,
  epistemicLabel,
} from "./epistemic";

export {
  SPIRAL_PROVENANCE_CATEGORIES,
  normalizeProvenance,
  provenanceLabel,
} from "./provenance";

export type { SpiralProvenanceCategory } from "./provenance";

export { SPIRAL_COPY, TRAJECTORY_TAKEAWAYS } from "./copy";

export { SPIRAL_EXAMPLES, examplesForStage } from "./examples";

export {
  defaultExploreView,
  getAcrossExploration,
  getConcept,
  getLensExploration,
  getStageExploration,
  stageHasDeepExploration,
  TRANSFORMATION_EXPLORATION,
} from "./exploration";

export {
  SPIRAL_LENSES,
  SPIRAL_LENS_IDS,
  authoredTrajectories,
  defaultTrajectoryId,
  getIntersection,
  getSpiralLens,
  getTrajectory,
  intersectionHasMaterial,
  researchedStopsForLens,
  resonancesForStop,
  transitionForResonance,
} from "./lenses";

export type { SpiralIntersection } from "./lenses";

export { ZODIAC_CYCLE_STEPS, ZODIAC_CYCLE_TRAJECTORY } from "./trajectories/zodiac";
export { JESUS_NARRATIVE_TRAJECTORY } from "./trajectories/jesus";
export { METAMORPHOSIS_TRAJECTORY } from "./trajectories/metamorphosis";
export { LODGEPOLE_FIRE_TRAJECTORY } from "./trajectories/lodgepole";

export {
  EMERGENCE_AGAIN_APPROVED_RELATIONSHIP_IDS,
  EMERGENCE_AGAIN_OCCURRENCE_ID,
  JESUS_RELATIONSHIPS,
  LODGEPOLE_RELATIONSHIPS,
  METAMORPHOSIS_RELATIONSHIPS,
  SPIRAL_NAME_COLLISION_ACKNOWLEDGEMENTS,
  SPIRAL_RELATIONSHIP_STATUS,
  SPIRAL_TRAJECTORY_RELATIONSHIPS,
  ZODIAC_RELATIONSHIPS,
  anchorLabel,
  anchorStepIds,
  conceptMatches,
  edgeAssertsEvidence,
  isCitableSource,
  COMPARISON_BREAK_STATUSES,
  DRAWABLE_RELATIONSHIP_STATUSES,
  comparisonFindingKind,
  isComparisonBreak,
  isComparisonFinding,
  isDrawableRelationship,
  multiOccurrenceStageIds,
  occurrencesForRelationship,
  relationshipStatusLabel,
  relationshipsForStep,
  relationshipsForStop,
  relationshipsForTrajectory,
  resolveRelationshipConcept,
  validateSpiralComparisons,
  validateTrajectorySources,
  validateTrajectoryTopology,
} from "./comparisons";

export type {
  SpiralComparisonFindingKind,
  SpiralComparisonIssue,
  SpiralComparisonIssueCode,
  SpiralComparisonValidationOptions,
  SpiralConceptMatch,
  SpiralNameCollisionAcknowledgement,
} from "./comparisons";

export {
  TRAJECTORY_WHEEL,
  wheelHitStyle,
  wheelNodes,
  wheelSegments,
} from "./trajectory-geometry";

export type { WheelNode, WheelSegment } from "./trajectory-geometry";

export { ZODIAC_LENS_RESEARCH } from "./research/zodiac";

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
  opacityForDepth,
  segmentCurrentByDepth,
  strokeWidthForDepth,
  tForIndex,
  transformationPoint,
} from "./geometry";

export type {
  SpiralDepthSegment,
  SpiralNodeGeometry,
  SpiralPoint,
} from "./geometry";

import { SPIRAL_COPY } from "./copy";
import { SPIRAL_CURRENTS } from "./currents";
import { SPIRAL_DOMAINS } from "./domains";
import { SPIRAL_EPISTEMIC_CATEGORIES } from "./epistemic";
import { SPIRAL_EXAMPLES } from "./examples";
import { SPIRAL_SEQUENCE, SPIRAL_STAGES } from "./stages";
import { getStageExploration } from "./exploration";
import { SPIRAL_LENSES } from "./lenses";

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
    lenses: SPIRAL_LENSES,
    explorations: {
      transformation: getStageExploration("transformation"),
    },
  };
}
