import { getAtlas } from "@/lib/atlas";
import type { VisitorObservation } from "./types";

export function themeTitlesForObservation(observation: VisitorObservation): string[] {
  const atlas = getAtlas();
  return observation.themeIds
    .map((id) => atlas.getById(id)?.title)
    .filter((t): t is string => Boolean(t));
}

export function displayTitle(observation: VisitorObservation): string {
  if (observation.title) return observation.title;
  const excerpt = observation.body.trim();
  if (excerpt.length <= 72) return excerpt;
  return `${excerpt.slice(0, 71).trim()}…`;
}

export function contributorLabel(observation: VisitorObservation): string {
  if (observation.anonymous) return "Recorded anonymously";
  return observation.contributorName ?? "A fellow observer";
}

export function sortObservationsNewest(
  observations: VisitorObservation[],
): VisitorObservation[] {
  return [...observations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
