import type { WorldLocationId } from "./locations";
import { locationForPath } from "./location-for-path";

export interface CuriosityContinuation {
  href: string;
  label: string;
  whisper: string;
}

/** One gentle pull forward — never a CTA, always a horizon line */
const CONTINUATIONS: Partial<Record<WorldLocationId, CuriosityContinuation>> = {
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
  "lantern-reading": {
    href: "/inquiry",
    label: "Back to the shelves",
    whisper: "One text opens into many.",
  },
  archive: {
    href: "/observatory",
    label: "The Observatory",
    whisper: "The archive ends where the observatory begins.",
  },
  notebook: {
    href: "/observatory",
    label: "The Observatory",
    whisper: "Field notes often find their way there.",
  },
  "instrument-wing": {
    href: "/",
    label: "The threshold",
    whisper: "The live terrain is carved in stone at the edge.",
  },
  chamber: {
    href: "/",
    label: "Outward",
    whisper: "Every chamber opens back onto the terrain.",
  },
};

export function continuationForPath(path: string): CuriosityContinuation | null {
  // The Shelves foyer and Books shelf are not essay-only rooms.
  if (path === "/inquiry" || path.startsWith("/inquiry/")) return null;
  if (path === "/books" || path.startsWith("/books/")) return null;
  // Visual Maps are nested under The Shelves but are not essays —
  // do not inherit the library essay continuation.
  if (path.startsWith("/visual-maps")) return null;
  if (path === "/essays") return null;
  if (path.startsWith("/essays/")) {
    return {
      href: "/essays",
      label: "Essays",
      whisper: "One text opens into many.",
    };
  }
  const id = locationForPath(path);
  return CONTINUATIONS[id] ?? null;
}
