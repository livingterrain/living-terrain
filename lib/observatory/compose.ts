import { INITIAL_REALM_SLUGS } from "@/lib/realms/config";
import { REFLECTION } from "@/lib/atmosphere/tempo";
import type { JourneyEvent, ObservatoryReflection, VisitJourney } from "./types";

const CONTENT_KINDS = new Set([
  "essay",
  "question",
  "field-note",
  "book",
  "quotation",
]);

function countThemes(events: JourneyEvent[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const event of events) {
    for (const theme of event.themes) {
      counts.set(theme, (counts.get(theme) ?? 0) + 1);
    }
  }
  return counts;
}

function dominantTheme(counts: Map<string, number>): [string, number] | null {
  let best: [string, number] | null = null;
  for (const [theme, count] of counts) {
    if (!best || count > best[1]) best = [theme, count];
  }
  return best;
}

function realmTitles(events: JourneyEvent[]): string[] {
  const seen = new Set<string>();
  const titles: string[] = [];
  for (const event of events) {
    if (event.kind !== "realm" || seen.has(event.title)) continue;
    seen.add(event.title);
    titles.push(event.title);
  }
  return titles;
}

function contentKindsVisited(events: JourneyEvent[]): Set<string> {
  const kinds = new Set<string>();
  for (const event of events) {
    if (CONTENT_KINDS.has(event.kind)) kinds.add(event.kind);
  }
  return kinds;
}

function sharedThemeAcrossKinds(events: JourneyEvent[]): string | null {
  const byTheme = new Map<string, Set<string>>();
  for (const event of events) {
    if (!CONTENT_KINDS.has(event.kind)) continue;
    for (const theme of event.themes) {
      if (!byTheme.has(theme)) byTheme.set(theme, new Set());
      byTheme.get(theme)!.add(event.kind);
    }
  }
  for (const [theme, kinds] of byTheme) {
    if (kinds.size >= 2) return theme;
  }
  return null;
}

function unvisitedRealmSlug(events: JourneyEvent[]): string | null {
  const visited = new Set(
    events
      .filter((e) => e.kind === "realm")
      .map((e) => e.path.replace(/^\/themes\//, "")),
  );
  for (const slug of INITIAL_REALM_SLUGS) {
    if (!visited.has(slug)) return slug;
  }
  return null;
}

function pickInvitation(
  journey: VisitJourney,
  currentPath: string,
): ObservatoryReflection["invitation"] {
  const path = currentPath.split("?")[0] || "/";
  const tracedThread = journey.events.some((e) => e.kind === "thread");
  const depth = journey.events.filter((e) => e.kind !== "map").length;
  const nextRealm = unvisitedRealmSlug(journey.events);

  if (path === "/observatory") {
    return { text: "Return to the constellation.", href: "/" };
  }

  if (tracedThread && path !== "/") {
    return { text: "Trace another thread.", href: path };
  }

  if (path === "/" && nextRealm) {
    return { text: "Continue deeper.", href: `/themes/${nextRealm}` };
  }

  if (depth >= REFLECTION.restAfterStops) {
    return { text: "Rest here.", href: "/observatory" };
  }

  if (path !== "/") {
    return { text: "Return to the constellation.", href: "/" };
  }

  return { text: "Continue deeper.", href: nextRealm ? `/themes/${nextRealm}` : "/inquiry" };
}

function meaningfulExploration(events: JourneyEvent[]): boolean {
  const stops = events.filter((e) => e.kind !== "map").length;
  if (stops < REFLECTION.minStops) return false;

  const kinds = new Set(events.map((e) => e.kind));
  if (kinds.size >= REFLECTION.minDistinctKinds) return true;

  return events.filter((e) => e.kind === "thread").length > 0;
}

/**
 * Compose an observational reflection from what actually happened this visit.
 * Returns null when the terrain has nothing honest to say yet.
 */
export function composeReflection(
  journey: VisitJourney,
  currentPath: string,
): ObservatoryReflection | null {
  const events = journey.events;
  if (!meaningfulExploration(events)) return null;

  if (
    journey.lastReflectionAt &&
    Date.now() - journey.lastReflectionAt < REFLECTION.cooldownMs
  ) {
    return null;
  }

  const realms = realmTitles(events);
  const themeCounts = countThemes(events);
  const dominant = dominantTheme(themeCounts);
  const kinds = contentKindsVisited(events);
  const threadCount = events.filter((e) => e.kind === "thread").length;
  const sharedTheme = sharedThemeAcrossKinds(events);

  let observation: string | null = null;
  let id: string | null = null;

  if (threadCount > 0 && kinds.size >= 2) {
    observation = "You've followed one question through multiple forms.";
    id = "thread-through-forms";
  } else if (realms.length >= 2) {
    observation = `You've spent time where ${realms[0]} meets ${realms[1]}.`;
    id = `realms-${realms[0]}-${realms[1]}`.toLowerCase().replace(/\s+/g, "-");
  } else if (sharedTheme && kinds.size >= 2) {
    observation = `You explored several paths connected to ${sharedTheme}.`;
    id = `paths-${sharedTheme}`.toLowerCase().replace(/\s+/g, "-");
  } else if (dominant && dominant[1] >= 2) {
    observation = `Your journey today kept returning to ${dominant[0]}.`;
    id = `returning-${dominant[0]}`.toLowerCase().replace(/\s+/g, "-");
  } else if (threadCount > 0) {
    const lastThread = [...events].reverse().find((e) => e.kind === "thread");
    if (lastThread?.themes[0]) {
      observation = `You traced a thread through ${lastThread.themes[0]}.`;
      id = `traced-${lastThread.themes[0]}`.toLowerCase().replace(/\s+/g, "-");
    } else {
      observation = "You traced a thread across the terrain.";
      id = "traced-thread";
    }
  } else if (realms.length === 1 && stopsAtRealms(events) >= 2) {
    observation = `You kept returning to ${realms[0]}.`;
    id = `realm-return-${realms[0]}`.toLowerCase().replace(/\s+/g, "-");
  }

  if (!observation || !id) return null;
  if (journey.reflectionsShown.includes(id)) return null;

  return {
    id,
    observation,
    invitation: pickInvitation(journey, currentPath),
  };
}

function stopsAtRealms(events: JourneyEvent[]): number {
  return events.filter((e) => e.kind === "realm").length;
}
