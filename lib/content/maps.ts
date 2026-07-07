import type { Book } from "./types";

/** Cover art path — explicit field or conventional location */
export function resolveMapCoverSrc(
  map: Pick<Book, "slug" | "coverImage">,
): string {
  return map.coverImage ?? `/images/maps/${map.slug}.jpg`;
}
