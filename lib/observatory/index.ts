export type {
  Observation,
  ObservationStatus,
  ObservationVisibility,
  ObservationProvenance,
} from "./observations";

export {
  OBSERVATIONS,
  getObservations,
  getPublicObservations,
  getBenchObservations,
  getObservationById,
  getObservationsByIds,
  observationCue,
  observationWhen,
} from "./observations";

export type {
  ObservatoryInvestigation,
  InvestigationStatus,
  DownstreamEcho,
} from "./investigations";

export {
  getInvestigations,
  getInvestigationBySlug,
  getInvestigationById,
  getRelatedInvestigations,
  getInvestigationObservations,
  statusLabel,
  echoKindLabel,
  evidenceKindLabel,
  INVESTIGATIONS,
  DISSOLVED_INVESTIGATIONS,
} from "./investigations";

/** Private researcher vocabulary — not a public glossary surface */
export type {
  FrameworkTerm,
  FrameworkTermStatus,
} from "./framework-terms";

export {
  FRAMEWORK_TERMS,
  getFrameworkTerms,
  getFrameworkTermById,
  getTermsForInvestigation,
  termLabel,
  termLabels,
} from "./framework-terms";

export type {
  JourneyKind,
  JourneyEvent,
  VisitJourney,
  ObservatoryReflection,
  VisitorObservation,
  UnexpectedConnection,
  QuietDiscovery,
  SubmitObservationInput,
  SubmitObservationResult,
} from "./types";

export {
  loadJourney,
  saveJourney,
  subscribeJourney,
  recordJourneyEvent,
  recordPathVisit,
  markReflectionShown,
  hasSeenReflection,
} from "./journey";

export { journeyEventFromPath } from "./path";
export { composeReflection } from "./compose";

export {
  displayTitle,
  contributorLabel,
  themeTitlesForObservation,
} from "./display";

export { observationNodeRef, resolveVisitorObservationNode } from "./atlas-bridge";

import { recordJourneyEvent } from "./journey";

export function recordThreadTraced(
  originTitle: string,
  themes: string[],
  path: string,
): void {
  recordJourneyEvent({
    at: Date.now(),
    kind: "thread",
    id: `thread:${path}`,
    title: originTitle,
    path,
    themes,
  });
}
