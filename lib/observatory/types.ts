/** What the visitor actually touched — never who they are */
export type JourneyKind =
  | "map"
  | "observatory"
  | "realm"
  | "concept"
  | "essay"
  | "question"
  | "field-note"
  | "book"
  | "quotation"
  | "chamber"
  | "thread";

export interface JourneyEvent {
  at: number;
  kind: JourneyKind;
  id: string;
  title: string;
  path: string;
  /** Major concept titles encountered along this stop */
  themes: string[];
}

export interface VisitJourney {
  startedAt: number;
  events: JourneyEvent[];
  /** Reflection ids already surfaced this visit */
  reflectionsShown: string[];
  lastReflectionAt: number | null;
}

export interface ObservatoryReflection {
  id: string;
  observation: string;
  invitation: {
    text: string;
    href: string;
  };
}

export interface VisitorObservation {
  id: string;
  slug: string;
  title: string | null;
  body: string;
  themeIds: string[];
  terrainLocation: string | null;
  createdAt: string;
  anonymous: boolean;
  contributorName: string | null;
}

export interface UnexpectedConnection {
  id: string;
  observationA: VisitorObservation;
  observationB: VisitorObservation;
  sharedConcept: string;
  phrase: string;
}

export interface QuietDiscovery {
  id: string;
  observation: VisitorObservation;
  connectedTitle: string;
  connectedHref: string;
  phrase: string;
}

export interface SubmitObservationInput {
  title?: string | null;
  body: string;
  themeIds: string[];
  terrainLocation?: string | null;
  anonymous?: boolean;
  contributorName?: string | null;
}

export interface SubmitObservationResult {
  success: boolean;
  message: string;
  observation?: VisitorObservation;
}

export interface ObservationStore {
  version: number;
  observations: VisitorObservation[];
}
