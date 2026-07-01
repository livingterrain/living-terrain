import type { WorldLocationId } from "./locations";
import { locationForPath } from "./location-for-path";

export interface CuriosityContinuation {
  href: string;
  label: string;
  whisper: string;
}

/** One gentle pull forward — never a CTA, always a horizon line */
const CONTINUATIONS: Partial<Record<WorldLocationId, CuriosityContinuation>> = {
  threshold: {
    href: "/questions",
    label: "Where paths branch",
    whisper: "Something unresolved may lie that way.",
  },
  "guide-alcove": {
    href: "/",
    label: "The carved map",
    whisper: "The terrain itself is waiting to be walked.",
  },
  pathways: {
    href: "/inquiry",
    label: "The shelves",
    whisper: "Written discoveries rest in the next room.",
  },
  library: {
    href: "/questions",
    label: "Where paths branch",
    whisper: "Every essay here began as a question.",
  },
  "lantern-reading": {
    href: "/inquiry",
    label: "Back to the shelves",
    whisper: "One text opens into many.",
  },
  archive: {
    href: "/observatory",
    label: "Inward",
    whisper: "The archive ends where the observatory begins.",
  },
  notebook: {
    href: "/observatory",
    label: "The observatory",
    whisper: "Field notes often find their way there.",
  },
  "instrument-wing": {
    href: "/",
    label: "The threshold",
    whisper: "The live terrain is carved in stone at the edge.",
  },
  observatory: {
    href: "/structure-beneath-reality",
    label: "The inner chamber",
    whisper: "The deepest room is still ahead.",
  },
  chamber: {
    href: "/",
    label: "Outward",
    whisper: "Every chamber opens back onto the terrain.",
  },
};

export function continuationForPath(path: string): CuriosityContinuation | null {
  const id = locationForPath(path);
  return CONTINUATIONS[id] ?? null;
}
