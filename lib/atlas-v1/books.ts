/**
 * Atlas V1 — book participation via repository theme metadata.
 * Does not invent relationships: books surface when their catalog themes
 * intersect the concept’s established theme field.
 */

import type { AtlasV1ConceptId } from "./content";
import { LIVING_TERRAIN_SERIES } from "@/lib/atlas/imports/books/series-catalog";

export type AtlasV1RelatedBook = {
  slug: string;
  title: string;
  href: string;
};

/** Atlas concepts → Living Terrain theme ids (existing atlas theme vocabulary) */
const CONCEPT_THEME_IDS: Record<AtlasV1ConceptId, readonly string[]> = {
  body: ["th-embodiment"],
  relationship: ["th-relationship"],
  feedback: ["th-information", "th-relationship"],
  technology: ["th-identity", "th-language", "th-relationship"],
  adaptation: ["th-embodiment", "th-identity", "th-consciousness"],
  constraint: ["th-structure", "th-freedom", "th-embodiment"],
  participation: ["th-freedom", "th-embodiment", "th-meaning"],
  time: ["th-time"],
  meaning: ["th-meaning", "th-consciousness"],
  reality: ["th-reality", "th-structure", "th-consciousness"],
};

/** Flagship book (not in Amazon series array) — themes from atlas data */
const STRUCTURE_BENEATH = {
  slug: "the-structure-beneath-reality",
  title: "The Structure Beneath Reality",
  themes: ["th-reality", "th-structure", "th-consciousness", "th-meaning"],
} as const;

const ALL_BOOKS: ReadonlyArray<{
  slug: string;
  title: string;
  themes: readonly string[];
}> = [
  STRUCTURE_BENEATH,
  ...LIVING_TERRAIN_SERIES.map((b) => ({
    slug: b.slug,
    title: b.title,
    themes: b.themes,
  })),
];

/**
 * LEGACY / NON-CANONICAL theme-overlap book list.
 * Atlas V1 no longer reads this as trusted relational content.
 * Kept because other legacy code may still call it.
 * Must never populate lib/canonical relations.
 */
export function relatedBooksForConcept(
  conceptId: AtlasV1ConceptId,
): AtlasV1RelatedBook[] {
  const themes = new Set(CONCEPT_THEME_IDS[conceptId] ?? []);
  if (themes.size === 0) return [];

  return ALL_BOOKS.filter((book) =>
    book.themes.some((t) => themes.has(t)),
  ).map((book) => ({
    slug: book.slug,
    title: book.title,
    href: `/atlas/${book.slug}`,
  }));
}
