import type { RealmSlug } from "./types";

export type RealmMetaphor =
  | "flow"
  | "weave"
  | "illuminate"
  | "crystallize"
  | "grow"
  | "stabilize"
  | "support"
  | "expand"
  | "branch"
  | "ripple";

export interface RealmMetaphorConfig {
  verb: string;
  metaphor: RealmMetaphor;
  /** Short phenomenological line — the realm speaks through motion */
  line: string;
}

export const REALM_METAPHOR: Record<RealmSlug, RealmMetaphorConfig> = {
  time: {
    verb: "flow",
    metaphor: "flow",
    line: "Downward — memory branching from the spine of now.",
  },
  relationship: {
    verb: "weave",
    metaphor: "weave",
    line: "Every thread tugs every other.",
  },
  meaning: {
    verb: "illuminate",
    metaphor: "illuminate",
    line: "Light gathers where attention rests.",
  },
  identity: {
    verb: "crystallize",
    metaphor: "crystallize",
    line: "Layers settling into form around a stable center.",
  },
  embodiment: {
    verb: "grow",
    metaphor: "grow",
    line: "Upward from root — tissue remembering how to live.",
  },
  reality: {
    verb: "stabilize",
    metaphor: "stabilize",
    line: "What holds while everything changes.",
  },
  freedom: {
    verb: "expand",
    metaphor: "expand",
    line: "Structure supports; space opens.",
  },
  language: {
    verb: "branch",
    metaphor: "branch",
    line: "One stream dividing into many tongues.",
  },
  consciousness: {
    verb: "ripple",
    metaphor: "ripple",
    line: "Influence spreading through a field.",
  },
};

export function getRealmMetaphor(slug: RealmSlug): RealmMetaphorConfig {
  return REALM_METAPHOR[slug];
}
