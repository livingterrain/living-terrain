import type { JourneyEvent, VisitJourney } from "./types";

const STORAGE_KEY = "living-terrain-observatory-journey";
const MAX_EVENTS = 48;
const SAME_PATH_COOLDOWN_MS = 45_000;

type JourneyListener = (journey: VisitJourney) => void;

const listeners = new Set<JourneyListener>();

let lastRecordedPath = "";
let lastRecordedAt = 0;

function emptyJourney(): VisitJourney {
  return {
    startedAt: Date.now(),
    events: [],
    reflectionsShown: [],
    lastReflectionAt: null,
  };
}

export function loadJourney(): VisitJourney {
  if (typeof window === "undefined") return emptyJourney();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyJourney();
    const data = JSON.parse(raw) as VisitJourney;
    if (!Array.isArray(data.events)) return emptyJourney();
    return {
      startedAt: data.startedAt ?? Date.now(),
      events: data.events,
      reflectionsShown: data.reflectionsShown ?? [],
      lastReflectionAt: data.lastReflectionAt ?? null,
    };
  } catch {
    return emptyJourney();
  }
}

export function saveJourney(journey: VisitJourney): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(journey));
  } catch {
    /* storage unavailable */
  }
  for (const listener of listeners) listener(journey);
}

export function subscribeJourney(listener: JourneyListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function recordJourneyEvent(event: JourneyEvent): VisitJourney {
  const journey = loadJourney();
  const tail = journey.events[journey.events.length - 1];

  if (
    tail &&
    tail.path === event.path &&
    tail.kind === event.kind &&
    Date.now() - tail.at < SAME_PATH_COOLDOWN_MS
  ) {
    return journey;
  }

  journey.events.push({ ...event, at: Date.now() });
  if (journey.events.length > MAX_EVENTS) {
    journey.events = journey.events.slice(-MAX_EVENTS);
  }

  lastRecordedPath = event.path;
  lastRecordedAt = Date.now();
  saveJourney(journey);
  return journey;
}

export function recordPathVisit(pathname: string, event: JourneyEvent | null): VisitJourney | null {
  if (!event) return null;
  if (
    event.path === lastRecordedPath &&
    Date.now() - lastRecordedAt < SAME_PATH_COOLDOWN_MS
  ) {
    return loadJourney();
  }
  return recordJourneyEvent(event);
}

export function markReflectionShown(reflectionId: string): VisitJourney {
  const journey = loadJourney();
  if (!journey.reflectionsShown.includes(reflectionId)) {
    journey.reflectionsShown.push(reflectionId);
  }
  journey.lastReflectionAt = Date.now();
  saveJourney(journey);
  return journey;
}

export function hasSeenReflection(reflectionId: string): boolean {
  return loadJourney().reflectionsShown.includes(reflectionId);
}
