import type { Theme } from "../content/types";
import { getAtlas, toTheme } from "../atlas";

/**
 * Level-2 major concepts — the architecture of the constellation.
 * Sourced from the Living Terrain Atlas (lazy — avoids circular import races).
 */
export function getMajorConceptThemes(): Theme[] {
  return getAtlas()
    .getMajorConcepts()
    .map(toTheme);
}

/** @deprecated Prefer getMajorConceptThemes() */
export function getMajorConcepts(): Theme[] {
  return getMajorConceptThemes();
}

/** Map granular theme ids to a major concept on the ring */
export function getThemeToMajorMap(): Record<string, string> {
  const atlas = getAtlas();
  const map: Record<string, string> = {};

  for (const concept of atlas.getMajorConcepts()) {
    map[concept.id] = concept.id;
  }
  for (const sub of atlas.getPublished("concept")) {
    if ("parentConceptId" in sub.meta) {
      map[sub.id] = (sub.meta as { parentConceptId: string }).parentConceptId;
    }
  }
  return map;
}

/** Topic strings from essays → major concept */
export const TOPIC_TO_MAJOR: Record<string, string> = {
  Consciousness: "th-consciousness",
  Philosophy: "th-reality",
  Structure: "th-reality",
  Embodiment: "th-embodiment",
  Meaning: "th-meaning",
  Psychology: "th-identity",
  Existence: "th-reality",
  Relationship: "th-relationship",
  Language: "th-language",
  Time: "th-time",
  Freedom: "th-freedom",
  Identity: "th-identity",
  Information: "th-information",
};

export function resolveMajorConcept(
  themeIds: string[] | undefined,
  topics: string[] | undefined,
): string {
  const themeToMajor = getThemeToMajorMap();
  for (const id of themeIds ?? []) {
    const mapped = themeToMajor[id];
    if (mapped) return mapped;
  }
  for (const topic of topics ?? []) {
    const mapped = TOPIC_TO_MAJOR[topic];
    if (mapped) return mapped;
  }
  return getAtlas().getMajorConcepts()[0]?.id ?? "th-reality";
}

export function isMajorConcept(id: string): boolean {
  return getAtlas().getMajorConcepts().some((c) => c.id === id);
}
