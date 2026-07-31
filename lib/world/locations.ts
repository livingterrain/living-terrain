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
  | "atlas"
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
    place: "Where Paths Branch",
    whisper: "Questions that stay alive longer than answers.",
    depth: 0.22,
    roomKind: "pathways",
  },
  library: {
    id: "library",
    place: "The Shelves",
    whisper: "Writing from the edges of the terrain.",
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
  atlas: {
    id: "atlas",
    place: "The Atlas",
    whisper: "Maps of completed investigations — cartography that endures after the survey.",
    depth: 0.42,
    roomKind: "atlas",
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
    whisper: "This is where questions begin.",
    depth: 0.62,
    roomKind: "observatory",
  },
  "instrument-wing": {
    id: "instrument-wing",
    place: "The Instrument Wing",
    whisper: "Room for ways of looking not yet built.",
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
