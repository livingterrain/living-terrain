import type { Book } from "./types";

/** Native dimensions of official cover art — preserves each book's aspect ratio */
export const MAP_COVER_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "the-structure-beneath-reality": { width: 334, height: 500 },
  "the-biology-of-becoming": { width: 313, height: 500 },
  "the-second-birth": { width: 313, height: 500 },
  "below-criticality": { width: 333, height: 500 },
  "embodied-physics": { width: 334, height: 500 },
  "a-field-guide-to-the-experience": { width: 313, height: 500 },
  "feedback-is-god": { width: 333, height: 500 },
};

const DEFAULT_COVER_DIMENSIONS = { width: 2, height: 3 };

/** Cover art path — explicit field or conventional location */
export function resolveMapCoverSrc(
  map: Pick<Book, "slug" | "coverImage">,
): string {
  return map.coverImage ?? `/images/maps/${map.slug}.jpg`;
}

export function resolveMapCoverDimensions(slug: string): {
  width: number;
  height: number;
} {
  return MAP_COVER_DIMENSIONS[slug] ?? DEFAULT_COVER_DIMENSIONS;
}
