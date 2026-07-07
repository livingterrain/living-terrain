import type { WorldLocationId } from "./locations";
import { WORLD_LOCATIONS } from "./locations";

export function locationForPath(path: string): WorldLocationId {
  if (path === "/" || path === "/welcome") return "threshold";

  if (path.startsWith("/about")) return "guide-alcove";

  if (path.startsWith("/concepts")) return "instrument-wing";

  if (path.startsWith("/questions")) {
    return path === "/questions" ? "pathways" : "pathways";
  }

  if (path.startsWith("/essays")) {
    return path === "/essays" ? "library" : "lantern-reading";
  }

  if (path.startsWith("/inquiry")) return "library";

  if (path.startsWith("/atlas")) return "atlas";

  if (path.startsWith("/library")) return "atlas";

  if (path.startsWith("/field-notes")) {
    return path === "/field-notes" ? "notebook" : "lantern-reading";
  }

  if (path.startsWith("/observatory")) return "observatory";

  if (path.startsWith("/chambers") || path.startsWith("/structure-beneath-reality")) {
    return "chamber";
  }

  if (path.startsWith("/themes/")) return "pathways";

  if (path.startsWith("/quotations/")) return "notebook";

  if (path.startsWith("/search")) return "guide-alcove";

  return "library";
}

export function depthForPath(path: string): number {
  return WORLD_LOCATIONS[locationForPath(path)].depth;
}

export function placeForPath(path: string): string {
  return WORLD_LOCATIONS[locationForPath(path)].place;
}

export function whisperForPath(path: string): string {
  return WORLD_LOCATIONS[locationForPath(path)].whisper;
}
