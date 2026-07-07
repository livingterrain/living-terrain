import { isImmersiveRealm } from "@/lib/realms/config";
import { NAVIGATION } from "./tempo";

export type TerrainTransitionIntent =
  | "map-to-reading"
  | "reading-to-map"
  | "to-theme"
  | "theme-to-map"
  | "theme-to-reading"
  | "theme-to-theme"
  | "to-thread"
  | "soft";

export interface TerrainNavSession {
  intent: TerrainTransitionIntent;
  to: string;
  from: string;
  /** Realm palette for theme crossings */
  atmosphere?: string;
}

const STORAGE_KEY = "living-terrain-nav";

const READING_PREFIX =
  /^\/(essays|questions|field-notes|atlas|library|inquiry|quotations|chambers|structure-beneath-reality)/;

export function isMapPath(path: string): boolean {
  return path === "/" || path === "";
}

export function isThemePath(path: string): boolean {
  const match = path.match(/^\/themes\/([^/]+)$/);
  if (!match) return false;
  return isImmersiveRealm(match[1]);
}

export function isReadingPath(path: string): boolean {
  return READING_PREFIX.test(path);
}

export function classifyTransition(
  from: string,
  to: string,
): TerrainTransitionIntent {
  if (isMapPath(from) && isReadingPath(to)) return "map-to-reading";
  if (isReadingPath(from) && isMapPath(to)) return "reading-to-map";
  if ((isMapPath(from) || isReadingPath(from)) && isThemePath(to)) {
    return "to-theme";
  }
  if (isThemePath(from) && isMapPath(to)) return "theme-to-map";
  if (isThemePath(from) && isReadingPath(to)) return "theme-to-reading";
  if (isThemePath(from) && isThemePath(to)) return "theme-to-theme";
  return "soft";
}

export function durationForIntent(
  intent: TerrainTransitionIntent,
  phase: "exit" | "enter",
): number {
  const table = {
    "map-to-reading": NAVIGATION.mapToReading,
    "reading-to-map": NAVIGATION.readingToMap,
    "to-theme": NAVIGATION.toTheme,
    "theme-to-map": NAVIGATION.themeToMap,
    "theme-to-reading": NAVIGATION.themeToReading,
    "theme-to-theme": NAVIGATION.themeToTheme,
    "to-thread": NAVIGATION.toThread,
    soft: NAVIGATION.soft,
  } as const;
  return table[intent][phase];
}

export function stashTerrainNav(session: TerrainNavSession): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

export function clearTerrainNav(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function consumeTerrainNav(): TerrainNavSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(STORAGE_KEY);
    return JSON.parse(raw) as TerrainNavSession;
  } catch {
    return null;
  }
}

export function peekTerrainNav(): TerrainNavSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TerrainNavSession;
  } catch {
    return null;
  }
}
