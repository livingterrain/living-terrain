export type RoomKind =
  | "pathways"
  | "reading"
  | "notebook"
  | "archive"
  | "observatory"
  | "chamber";

export interface RoomProfile {
  kind: RoomKind;
  /** Atmospheric cue — not a section label */
  whisper: string;
  surface: string;
  vignette: string;
}

export const rooms: Record<RoomKind, RoomProfile> = {
  pathways: {
    kind: "pathways",
    whisper: "Paths diverge ahead.",
    surface: "bg-ivory",
    vignette: "room-vignette-pathways",
  },
  reading: {
    kind: "reading",
    whisper: "Something waits to be found.",
    surface: "bg-ivory-deep/30",
    vignette: "room-vignette-reading",
  },
  notebook: {
    kind: "notebook",
    whisper: "Pages worn at the edges.",
    surface: "bg-[#e4d9c8]",
    vignette: "room-vignette-notebook",
  },
  archive: {
    kind: "archive",
    whisper: "Manuscripts rest in the dim.",
    surface: "bg-ivory-shadow/20",
    vignette: "room-vignette-archive",
  },
  observatory: {
    kind: "observatory",
    whisper: "Signals gather here.",
    surface: "bg-void/5",
    vignette: "room-vignette-observatory",
  },
  chamber: {
    kind: "chamber",
    whisper: "The deepest room.",
    surface: "bg-ivory-shadow/40",
    vignette: "room-vignette-chamber",
  },
};

/** Map route prefixes to room atmosphere */
export function roomForPath(pathname: string): RoomKind | null {
  if (pathname === "/") return null;
  if (pathname.startsWith("/inquiry")) return "reading";
  if (pathname.startsWith("/questions")) return "pathways";
  if (pathname.startsWith("/essays")) return "reading";
  if (pathname.startsWith("/field-notes")) return "notebook";
  if (pathname.startsWith("/library")) return "archive";
  if (pathname.startsWith("/observatory")) return "observatory";
  if (pathname.startsWith("/structure-beneath-reality")) return "chamber";
  return null;
}
