import type { AtlasEntryType } from "./types";

const ROUTES: Record<AtlasEntryType, (slug: string) => string> = {
  "major-concept": (slug) => `/themes/${slug}`,
  concept: (slug) => `/themes/${slug}`,
  chamber: () => "/structure-beneath-reality",
  book: (slug) => `/library/${slug}`,
  essay: (slug) => `/essays/${slug}`,
  question: (slug) => `/questions/${slug}`,
  "field-note": (slug) => `/field-notes/${slug}`,
  observation: (slug) => `/observatory/observations/${slug}`,
  quotation: (slug) => `/quotations/${slug}`,
};

export function resolveAtlasRoute(type: AtlasEntryType, slug: string): string {
  return ROUTES[type](slug);
}

export function atlasSearchType(
  type: AtlasEntryType,
): AtlasEntryType | "theme" {
  if (type === "major-concept" || type === "concept") return "theme";
  return type;
}

/** Map atlas types to legacy ContentKind for the relationship engine */
export function atlasTypeToContentKind(
  type: AtlasEntryType,
): import("../content/types").ContentKind {
  switch (type) {
    case "major-concept":
    case "concept":
      return "theme";
    case "chamber":
      return "project";
    default:
      return type;
  }
}
