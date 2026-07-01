import type { RoomKind } from "@/lib/rooms";

/** Physical locations within the Living Terrain observatory world */
export type WorldLocationId =
  | "threshold"
  | "terrain-map"
  | "guide-alcove"
  | "pathways"
  | "library"
  | "lantern-reading"
  | "archive"
  | "notebook"
  | "observatory"
  | "instrument-wing"
  | "chamber";

export interface WorldLocation {
  id: WorldLocationId;
  /** Human name — where you are in the world */
  place: string;
  whisper: string;
  /** 0 = outer threshold, 1 = innermost chamber */
  depth: number;
  roomKind: RoomKind | null;
}

export const WORLD_LOCATIONS: Record<WorldLocationId, WorldLocation> = {
  threshold: {
    id: "threshold",
    place: "The Threshold",
    whisper: "The air is still. Something vast waits beyond the ridge.",
    depth: 0,
    roomKind: null,
  },
  "terrain-map": {
    id: "terrain-map",
    place: "The Carved Map",
    whisper: "Ideas etched into stone — each line a path you have not walked.",
    depth: 0.08,
    roomKind: null,
  },
  "guide-alcove": {
    id: "guide-alcove",
    place: "The Guide's Alcove",
    whisper: "The one who built this place — not the subject of it.",
    depth: 0.1,
    roomKind: "guide",
  },
  pathways: {
    id: "pathways",
    place: "The Diverging Paths",
    whisper: "Questions branch ahead. Any direction is valid.",
    depth: 0.22,
    roomKind: "pathways",
  },
  library: {
    id: "library",
    place: "The Library",
    whisper: "Volumes rest in the quiet. Nothing is arranged by date.",
    depth: 0.32,
    roomKind: "library",
  },
  "lantern-reading": {
    id: "lantern-reading",
    place: "A Reading Room",
    whisper: "One lantern. One text. The world outside recedes.",
    depth: 0.44,
    roomKind: "library",
  },
  archive: {
    id: "archive",
    place: "The Archive",
    whisper: "Manuscripts sleep in the dim. Handle them slowly.",
    depth: 0.38,
    roomKind: "archive",
  },
  notebook: {
    id: "notebook",
    place: "The Field Desk",
    whisper: "Observations taken at the edge of understanding.",
    depth: 0.36,
    roomKind: "notebook",
  },
  observatory: {
    id: "observatory",
    place: "The Observatory",
    whisper: "Signals gather. Ideas mature in the amber dark.",
    depth: 0.62,
    roomKind: "observatory",
  },
  "instrument-wing": {
    id: "instrument-wing",
    place: "The Instrument Wing",
    whisper: "Prototypes and lenses — ways of seeing the same sky.",
    depth: 0.48,
    roomKind: "observatory",
  },
  chamber: {
    id: "chamber",
    place: "The Inner Chamber",
    whisper: "The deepest room. Structure beneath all structure.",
    depth: 0.88,
    roomKind: "chamber",
  },
};

export function worldLocation(id: WorldLocationId): WorldLocation {
  return WORLD_LOCATIONS[id];
}
