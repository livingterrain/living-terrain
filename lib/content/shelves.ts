import type { Book } from "./types";

/** Shelf order — flagship, then Living Terrain series sequence (current editions) */
export const BOOK_SHELF_ORDER = [
  "the-structure-beneath-reality",
  "the-biology-of-becoming-revised-expanded",
  "the-second-birth",
  "below-criticality",
  "embodied-physics",
  "a-field-guide-to-the-experience",
  "feedback-is-god",
] as const;

export function sortBooksForShelf(books: Book[]): Book[] {
  const rank = new Map(BOOK_SHELF_ORDER.map((slug, i) => [slug, i]));
  return [...books].sort((a, b) => {
    const ra = rank.get(a.slug as (typeof BOOK_SHELF_ORDER)[number]) ?? 999;
    const rb = rank.get(b.slug as (typeof BOOK_SHELF_ORDER)[number]) ?? 999;
    if (ra !== rb) return ra - rb;
    return a.title.localeCompare(b.title);
  });
}

export function essayBodyLines(essay: {
  subtitle?: string;
  excerpt?: string;
}): {
  subtitle?: string;
  excerpt?: string;
} {
  const subtitle = essay.subtitle?.trim() || undefined;
  const excerpt = essay.excerpt?.trim() || undefined;
  if (!excerpt) return { subtitle };
  if (!subtitle) return { excerpt };
  if (subtitle.toLowerCase() === excerpt.toLowerCase()) {
    return { subtitle };
  }
  return { subtitle, excerpt };
}
