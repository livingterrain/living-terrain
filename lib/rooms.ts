import { locationForPath } from "@/lib/world/location-for-path";
import { WORLD_LOCATIONS } from "@/lib/world/locations";

export type RoomKind =
  | "pathways"
  | "reading"
  | "library"
  | "guide"
  | "notebook"
  | "archive"
  | "atlas"
  | "observatory"
  | "chamber";

export interface RoomProfile {
  kind: RoomKind;
  whisper: string;
  surface: string;
  vignette: string;
}

export const rooms: Record<RoomKind, RoomProfile> = {
  pathways: {
    kind: "pathways",
    whisper: "Questions branch ahead. Any direction is valid.",
    surface: "threshold-room threshold-room--pathways",
    vignette: "room-vignette-pathways",
  },
  reading: {
    kind: "reading",
    whisper: "One lantern. One text. The world outside recedes.",
    surface: "threshold-room threshold-room--reading",
    vignette: "room-vignette-reading",
  },
  library: {
    kind: "library",
    whisper: "Writing from the edges of the terrain.",
    surface: "threshold-room threshold-room--library",
    vignette: "room-vignette-library",
  },
  guide: {
    kind: "guide",
    whisper: "The one who built this place — not the subject of it.",
    surface: "threshold-room threshold-room--guide",
    vignette: "room-vignette-guide",
  },
  notebook: {
    kind: "notebook",
    whisper: "Observations taken at the edge of understanding.",
    surface: "threshold-room threshold-room--notebook",
    vignette: "room-vignette-notebook",
  },
  archive: {
    kind: "archive",
    whisper: "Manuscripts sleep in the dim. Handle them slowly.",
    surface: "threshold-room threshold-room--archive",
    vignette: "room-vignette-archive",
  },
  atlas: {
    kind: "atlas",
    whisper: "Maps of completed investigations — cartography that endures after the survey.",
    surface: "threshold-room threshold-room--atlas",
    vignette: "room-vignette-archive",
  },
  observatory: {
    kind: "observatory",
    whisper: "Signals gather. Ideas mature in the amber dark.",
    surface: "threshold-room threshold-room--observatory",
    vignette: "room-vignette-observatory",
  },
  chamber: {
    kind: "chamber",
    whisper: "The deepest room. Structure beneath all structure.",
    surface: "threshold-room threshold-room--chamber",
    vignette: "room-vignette-chamber",
  },
};

/** Map routes to the physical room they occupy */
export function roomForPath(pathname: string): RoomKind | null {
  if (pathname === "/" || pathname === "/welcome") return null;
  const loc = WORLD_LOCATIONS[locationForPath(pathname)];
  return loc.roomKind;
}

export function roomKindForPath(pathname: string): RoomKind {
  return roomForPath(pathname) ?? "reading";
}
