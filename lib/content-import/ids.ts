import type { AtlasEntry } from "../atlas/types";

const ESSAY_ID_RE = /^e(\d+)$/;

/** Next essay id across core atlas + imported entries */
export function nextEssayId(entries: AtlasEntry[]): string {
  let max = 0;
  for (const entry of entries) {
    if (entry.type !== "essay") continue;
    const match = ESSAY_ID_RE.exec(entry.id);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `e${max + 1}`;
}
