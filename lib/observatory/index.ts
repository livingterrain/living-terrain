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
