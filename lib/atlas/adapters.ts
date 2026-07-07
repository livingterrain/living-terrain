import type {
  Book,
  BookChapter,
  ContentRef,
  Essay,
  FieldNote,
  Observation,
  Project,
  Question,
  Quotation,
  SearchResult,
  Theme,
} from "../content/types";
import type { LivingTerrainAtlas } from "./registry";
import type { AtlasEntry, AtlasEntryType } from "./types";
import { atlasTypeToContentKind } from "./routes";
import type {
  BookMeta,
  ChamberMeta,
  EssayMeta,
  FieldNoteMeta,
  ObservationMeta,
  QuotationMeta,
  QuestionMeta,
} from "./types";

function contentRef(entry: AtlasEntry): ContentRef {
  return {
    kind: atlasTypeToContentKind(entry.type),
    id: entry.id,
  };
}

function refsOfType(
  atlas: LivingTerrainAtlas,
  id: string,
  targetType: AtlasEntryType,
  kinds: Parameters<LivingTerrainAtlas["getConnectedIds"]>[1][],
): string[] {
  const ids = new Set<string>();
  for (const kind of kinds) {
    for (const cid of atlas.getConnectedIds(id, kind, "both")) {
      const entry = atlas.getById(cid);
      if (entry?.type === targetType) ids.add(cid);
    }
  }
  return [...ids];
}

function parentChildRefs(
  atlas: LivingTerrainAtlas,
  id: string,
): { parentRefs: ContentRef[]; childRefs: ContentRef[] } {
  const parentRefs: ContentRef[] = [];
  const childRefs: ContentRef[] = [];

  for (const c of atlas.getConnections(id)) {
    const otherId = c.from === id ? c.to : c.from;
    const other = atlas.getById(otherId);
    if (!other || other.type === "major-concept" || other.type === "concept") {
      continue;
    }
    if (c.kind === "parent" && c.from === id && other) {
      parentRefs.push(contentRef(other));
    }
    if (c.kind === "child" && c.from === id && other) {
      childRefs.push(contentRef(other));
    }
  }

  return { parentRefs, childRefs };
}

export function toTheme(entry: AtlasEntry): Theme {
  const parentThemeId =
    entry.type === "concept" && "parentConceptId" in entry.meta
      ? (entry.meta as { parentConceptId: string }).parentConceptId
      : undefined;

  return {
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    parentThemeId,
  };
}

export function toQuestion(entry: AtlasEntry, atlas: LivingTerrainAtlas): Question {
  const meta = entry.meta as QuestionMeta;
  const { parentRefs, childRefs } = parentChildRefs(atlas, entry.id);

  return {
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    subtitle: meta.subtitle,
    description: entry.description,
    featured: meta.featured,
    order: meta.order,
    relatedEssayIds: refsOfType(atlas, entry.id, "essay", ["thread"]),
    relatedBookIds: refsOfType(atlas, entry.id, "book", ["volume"]),
    relatedFieldNoteIds: refsOfType(atlas, entry.id, "field-note", [
      "observation",
    ]),
    themeIds: entry.themes,
    parentRefs,
    childRefs,
    quotationIds: refsOfType(atlas, entry.id, "quotation", ["quotation"]),
    observationIds: refsOfType(atlas, entry.id, "observation", ["observation"]),
  };
}

export function toEssay(entry: AtlasEntry, atlas: LivingTerrainAtlas): Essay {
  const meta = entry.meta as EssayMeta;
  const { parentRefs, childRefs } = parentChildRefs(atlas, entry.id);

  return {
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    subtitle: meta.subtitle,
    publishedAt: entry.publishedAt ?? "",
    updatedAt: meta.updatedAt,
    excerpt: meta.excerpt,
    topics: meta.topics,
    questionIds: refsOfType(atlas, entry.id, "question", ["pathway"]),
    projectIds: refsOfType(atlas, entry.id, "chamber", ["chamber"]),
    bookIds: refsOfType(atlas, entry.id, "book", ["volume"]),
    relatedEssayIds: refsOfType(atlas, entry.id, "essay", ["echo", "thread"]),
    themeIds: entry.themes,
    parentRefs,
    childRefs,
    quotationIds: refsOfType(atlas, entry.id, "quotation", ["quotation"]),
    observationIds: refsOfType(atlas, entry.id, "observation", ["observation"]),
    externalUrl: meta.externalUrl,
    featuredImage: meta.featuredImage,
    style: meta.style,
    status: entry.status === "published" ? "published" : "draft",
  };
}

export function toBook(entry: AtlasEntry, atlas: LivingTerrainAtlas): Book {
  const meta = entry.meta as BookMeta;
  const { parentRefs, childRefs } = parentChildRefs(atlas, entry.id);

  return {
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    subtitle: meta.subtitle,
    description: entry.description,
    publishedYear: meta.publishedYear,
    publisher: meta.publisher,
    questionIds: refsOfType(atlas, entry.id, "question", ["pathway"]),
    chapters: meta.chapters as BookChapter[],
    status: meta.bookStatus,
    themeIds: entry.themes,
    parentRefs,
    childRefs,
    quotationIds: refsOfType(atlas, entry.id, "quotation", ["quotation"]),
    observationIds: refsOfType(atlas, entry.id, "observation", ["observation"]),
    purchaseUrl: meta.purchaseUrl,
    coverImage: meta.coverImage,
  };
}

export function toFieldNote(
  entry: AtlasEntry,
  atlas: LivingTerrainAtlas,
): FieldNote {
  const meta = entry.meta as FieldNoteMeta;
  const { parentRefs, childRefs } = parentChildRefs(atlas, entry.id);

  return {
    id: entry.id,
    slug: entry.slug,
    title: meta.displayTitle,
    body: meta.body,
    publishedAt: entry.publishedAt ?? "",
    location: meta.location,
    questionIds: refsOfType(atlas, entry.id, "question", ["pathway"]),
    themeIds: entry.themes,
    parentRefs,
    childRefs,
    quotationIds: refsOfType(atlas, entry.id, "quotation", ["quotation"]),
    observationIds: refsOfType(atlas, entry.id, "observation", ["observation"]),
    relatedEssayIds: refsOfType(atlas, entry.id, "essay", ["thread", "echo"]),
  };
}

export function toQuotation(
  entry: AtlasEntry,
  atlas: LivingTerrainAtlas,
): Quotation {
  const meta = entry.meta as QuotationMeta;
  const { parentRefs } = parentChildRefs(atlas, entry.id);

  return {
    id: entry.id,
    slug: entry.slug,
    text: meta.text,
    attribution: meta.attribution,
    source: meta.source,
    questionIds: refsOfType(atlas, entry.id, "question", ["pathway"]),
    themeIds: entry.themes,
    relatedEssayIds: refsOfType(atlas, entry.id, "essay", ["echo"]),
    relatedBookIds: refsOfType(atlas, entry.id, "book", ["volume"]),
    parentRefs,
    status: entry.status === "published" ? "published" : "draft",
  };
}

export function toObservation(
  entry: AtlasEntry,
  atlas: LivingTerrainAtlas,
): Observation {
  const meta = entry.meta as ObservationMeta;
  const { parentRefs } = parentChildRefs(atlas, entry.id);

  return {
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    body: meta.body,
    publishedAt: entry.publishedAt ?? "",
    questionIds: refsOfType(atlas, entry.id, "question", ["pathway"]),
    themeIds: entry.themes,
    relatedEssayIds: refsOfType(atlas, entry.id, "essay", ["echo"]),
    relatedFieldNoteIds: refsOfType(atlas, entry.id, "field-note", [
      "observation",
    ]),
    parentRefs,
    status: entry.status === "published" ? "published" : "draft",
  };
}

export function toProject(entry: AtlasEntry, atlas: LivingTerrainAtlas): Project {
  const meta = entry.meta as ChamberMeta;
  const themeIds =
    entry.themes.length > 0
      ? entry.themes
      : (atlas.getById(meta.bookId)?.themes ?? []);

  return {
    id: entry.id,
    slug: entry.slug,
    bookId: meta.bookId,
    title: entry.title,
    subtitle: meta.subtitle,
    introduction: meta.introduction,
    whyExists: meta.whyExists,
    status: {
      label: meta.statusLabel,
      description: meta.statusDescription,
    },
    centralQuestion: meta.centralQuestion,
    themes: themeIds
      .map((id) => atlas.getById(id))
      .filter(
        (c): c is AtlasEntry =>
          !!c && (c.type === "major-concept" || c.type === "concept"),
      )
      .map((c) => ({
        title: c.title,
        description: c.description,
        slug: c.slug,
        href: c.route,
      })),
    essayIds: refsOfType(atlas, entry.id, "essay", ["chamber"]),
    questionIds: refsOfType(atlas, entry.id, "question", ["pathway"]),
    fieldNoteIds: refsOfType(atlas, entry.id, "field-note", ["observation"]),
    relatedBookIds: refsOfType(atlas, entry.id, "book", ["volume"]).filter(
      (id) => id !== meta.bookId,
    ),
    timeline: meta.timeline,
    whereToBegin: meta.whereToBegin,
    purchaseUrl: meta.purchaseUrl,
  };
}

export function atlasSearchToLegacy(result: {
  id: string;
  type: AtlasEntryType;
  title: string;
  excerpt: string;
  route: string;
}): SearchResult {
  const type =
    result.type === "major-concept" || result.type === "concept"
      ? "theme"
      : result.type;

  if (type === "chamber") {
    throw new Error("Chamber entries are not searchable");
  }

  return {
    id: result.id,
    type: type as SearchResult["type"],
    title: result.title,
    excerpt: result.excerpt,
    href: result.route,
  };
}

/** Legacy arrays — derived from atlas for backward-compatible imports */
export function getLegacyQuestions(atlas: LivingTerrainAtlas): Question[] {
  return atlas
    .getPublished("question")
    .map((e) => toQuestion(e, atlas))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getLegacyEssays(atlas: LivingTerrainAtlas): Essay[] {
  return atlas.getPublished("essay").map((e) => toEssay(e, atlas));
}

export function getLegacyBooks(atlas: LivingTerrainAtlas): Book[] {
  return atlas.getPublished("book").map((e) => toBook(e, atlas));
}

export function getLegacyFieldNotes(atlas: LivingTerrainAtlas): FieldNote[] {
  return atlas.getPublished("field-note").map((e) => toFieldNote(e, atlas));
}

export function getLegacyThemes(atlas: LivingTerrainAtlas): Theme[] {
  return [
    ...atlas.getMajorConcepts().map(toTheme),
    ...atlas.getPublished("concept").map(toTheme),
  ];
}

export function getLegacyQuotations(atlas: LivingTerrainAtlas): Quotation[] {
  return atlas.getPublished("quotation").map((e) => toQuotation(e, atlas));
}

export function getLegacyObservations(atlas: LivingTerrainAtlas): Observation[] {
  return atlas.getPublished("observation").map((e) => toObservation(e, atlas));
}

export function getLegacyProject(atlas: LivingTerrainAtlas): Project {
  const chamber = atlas.getChamber();
  if (!chamber) {
    throw new Error("Living Terrain Atlas: no chamber entry defined");
  }
  return toProject(chamber, atlas);
}
