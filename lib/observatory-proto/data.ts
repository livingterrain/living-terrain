/**
 * Observatory — Recognition Scenes
 *
 * Canonical data. Pattern · Body · Scene.
 * Theory frozen. Only composition from here.
 */

// ─── Types ───

export type PatternId = "return";

export type BodyId =
  | "itch"
  | "thread"
  | "sell"
  | "feed"
  | "chest"
  | "clock";

export type SceneId = "s1";

export type StageLayout = "diptych" | "margin" | "void";

export type Pattern = {
  id: PatternId;
  name: string;
  stabilizer: string;
};

export type Body = {
  id: BodyId;
  text: string;
  patterns: PatternId[];
};

export type Scene = {
  id: SceneId;
  patternId: PatternId;
  bodyIds: BodyId[];
};

// ─── Data ───

export const PATTERNS: Record<PatternId, Pattern> = {
  return: {
    id: "return",
    name: "Feedback",
    stabilizer:
      "A response that intensifies what it answered. Action returns as its own cause.",
  },
};

export const BODIES: Record<BodyId, Body> = {
  itch: {
    id: "itch",
    patterns: ["return"],
    text: `Left forearm.

A small itch.

Fingernail.

Quiet.

Fingernail again.`,
  },
  thread: {
    id: "thread",
    patterns: ["return"],
    text: `9:41
you good?

9:44
yeah

9:51
sure?

9:58
what's wrong`,
  },
  sell: {
    id: "sell",
    patterns: ["return"],
    text: `4,412
4,408
4,401
4,389
4,362`,
  },
  feed: {
    id: "feed",
    patterns: ["return"],
    text: `Thumb stops.

Three seconds.

Scroll.

Five seconds.

Scroll.

Seven.`,
  },
  chest: {
    id: "chest",
    patterns: ["return"],
    text: `Aisle six.
Chest tightens.

You notice.

Tighter.`,
  },
  clock: {
    id: "clock",
    patterns: ["return"],
    text: `12:10
Eyes closed.

12:14
Still closed.

12:21
Clock.`,
  },
};

/**
 * Scene 1 — investigation, not literature
 * Evidence: scratched forearm × message thread (photographed)
 * Ordinary observations. Almost no narration until Naming.
 */
export const SCENES: Record<SceneId, Scene> = {
  s1: {
    id: "s1",
    patternId: "return",
    bodyIds: ["itch", "thread"],
  },
};

export const SCENE_ORDER: SceneId[] = ["s1"];

// ─── Constants ───

/** Time Encounter sits alone before the cut is available */
export const ENCOUNTER_DWELL_MS = 4000;

/** Silence after co-presence before Naming may appear */
export const HOLD_BEFORE_NAMING_MS = 9000;

// ─── Queries ───

export function getPattern(id: PatternId): Pattern {
  return PATTERNS[id];
}

export function getBody(id: BodyId): Body {
  return BODIES[id];
}

export function getScene(id: SceneId): Scene {
  return SCENES[id];
}

export function bodiesForPattern(
  patternId: PatternId,
  exclude: BodyId[] = [],
): Body[] {
  const excluded = new Set(exclude);
  return Object.values(BODIES).filter(
    (b) => b.patterns.includes(patternId) && !excluded.has(b.id),
  );
}

export function nextSceneId(current: SceneId): SceneId | null {
  const i = SCENE_ORDER.indexOf(current);
  if (i < 0 || i >= SCENE_ORDER.length - 1) return null;
  return SCENE_ORDER[i + 1] ?? null;
}
