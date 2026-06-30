import {
  getAtlas,
  atlasSearchToLegacy,
  toQuestion,
  toEssay,
  toBook,
  toFieldNote,
  toQuotation,
  toObservation,
  toProject,
  toTheme,
  getLegacyProject,
} from "../atlas";
import type {
  Book,
  Essay,
  FieldNote,
  Project,
  Question,
  SearchResult,
  StructureSection,
  Theme,
  Quotation,
  Observation,
} from "./types";

const atlas = () => getAtlas();

export function getAllQuestions(): Question[] {
  return atlas()
    .getPublished("question")
    .map((e) => toQuestion(e, atlas()))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getFeaturedQuestions(): Question[] {
  return getAllQuestions().filter((q) => q.featured);
}

export function getQuestionBySlug(slug: string): Question | undefined {
  const entry = atlas().getBySlug("question", slug);
  return entry ? toQuestion(entry, atlas()) : undefined;
}

export function getAllEssays(): Essay[] {
  return atlas()
    .getPublished("essay")
    .map((e) => toEssay(e, atlas()))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export function getEssayBySlug(slug: string): Essay | undefined {
  const entry = atlas().getBySlug("essay", slug);
  return entry ? toEssay(entry, atlas()) : undefined;
}

export function getEssaysByQuestionId(questionId: string): Essay[] {
  return getAllEssays().filter((e) => e.questionIds.includes(questionId));
}

export function getAllBooks(): Book[] {
  return atlas()
    .getPublished("book")
    .map((e) => toBook(e, atlas()));
}

export function getBookBySlug(slug: string): Book | undefined {
  const entry = atlas().getBySlug("book", slug);
  return entry ? toBook(entry, atlas()) : undefined;
}

export function getBooksByQuestionId(questionId: string): Book[] {
  return getAllBooks().filter((b) => b.questionIds.includes(questionId));
}

export function getAllFieldNotes(): FieldNote[] {
  return atlas()
    .getPublished("field-note")
    .map((e) => toFieldNote(e, atlas()))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export function getRecentFieldNotes(limit = 5): FieldNote[] {
  return getAllFieldNotes().slice(0, limit);
}

export function getFieldNoteBySlug(slug: string): FieldNote | undefined {
  const entry = atlas().getBySlug("field-note", slug);
  return entry ? toFieldNote(entry, atlas()) : undefined;
}

export function getFieldNotesByQuestionId(questionId: string): FieldNote[] {
  return getAllFieldNotes().filter((fn) =>
    fn.questionIds.includes(questionId),
  );
}

export function getFlagshipBook(): Book {
  const chamber = atlas().getChamber();
  const bookId =
    chamber && "bookId" in chamber.meta
      ? (chamber.meta as { bookId: string }).bookId
      : getAllBooks()[0]?.id;
  return getBookById(bookId)!;
}

export function getFlagshipProject(): Project {
  return getLegacyProject(atlas());
}

export function getProjectBySlug(slug: string): Project | undefined {
  const entry = atlas().getBySlug("chamber", slug);
  return entry ? toProject(entry, atlas()) : undefined;
}

export function getProjectEssays(project: Project): Essay[] {
  const ids = new Set(project.essayIds);
  return getAllEssays().filter(
    (e) => ids.has(e.id) || e.projectIds?.includes(project.id),
  );
}

export function getEssayReadUrl(essay: Essay): string {
  return essay.externalUrl ?? atlas().site.mediumUrl;
}

export function essayHasDirectUrl(essay: Essay): boolean {
  return Boolean(essay.externalUrl);
}

export function getProjectQuestions(project: Project): Question[] {
  return project.questionIds
    .map((id) => getQuestionById(id))
    .filter((q): q is Question => q !== undefined);
}

export function getProjectFieldNotes(project: Project): FieldNote[] {
  return project.fieldNoteIds
    .map((id) => getFieldNoteById(id))
    .filter((fn): fn is FieldNote => fn !== undefined);
}

export function getProjectBooks(project: Project): Book[] {
  const primary = getBookById(project.bookId);
  const related = project.relatedBookIds
    .map((id) => getBookById(id))
    .filter((b): b is Book => b !== undefined);
  if (!primary) return related;
  return [primary, ...related.filter((b) => b.id !== primary.id)];
}

export function getProjectById(id: string): Project | undefined {
  const entry = atlas().getById(id);
  return entry?.type === "chamber" ? toProject(entry, atlas()) : undefined;
}

export function getEssayById(id: string): Essay | undefined {
  const entry = atlas().getById(id);
  return entry?.type === "essay" && entry.status === "published"
    ? toEssay(entry, atlas())
    : undefined;
}

export function getBookById(id: string): Book | undefined {
  const entry = atlas().getById(id);
  return entry?.type === "book" ? toBook(entry, atlas()) : undefined;
}

export function getFieldNoteById(id: string): FieldNote | undefined {
  const entry = atlas().getById(id);
  return entry?.type === "field-note" ? toFieldNote(entry, atlas()) : undefined;
}

export function essayBelongsToFlagship(essayId: string): boolean {
  const project = getFlagshipProject();
  const essay = getEssayById(essayId);
  return (
    project.essayIds.includes(essayId) ||
    Boolean(essay?.projectIds?.includes(project.id))
  );
}

export const structureSections: StructureSection[] = [];

export function getStructureSections(): StructureSection[] {
  return [...structureSections].sort((a, b) => a.order - b.order);
}

export function getStructureSectionBySlug(
  slug: string,
): StructureSection | undefined {
  return structureSections.find((s) => s.slug === slug);
}

export function getQuestionById(id: string): Question | undefined {
  const entry = atlas().getById(id);
  return entry?.type === "question" ? toQuestion(entry, atlas()) : undefined;
}

export function getAllThemes(): Theme[] {
  return [
    ...atlas().getMajorConcepts().map(toTheme),
    ...atlas().getPublished("concept").map(toTheme),
  ];
}

export function getThemeBySlug(slug: string): Theme | undefined {
  const major = atlas().getBySlug("major-concept", slug);
  if (major) return toTheme(major);
  const sub = atlas().getBySlug("concept", slug);
  return sub ? toTheme(sub) : undefined;
}

export function getThemeById(id: string): Theme | undefined {
  const entry = atlas().getById(id);
  if (entry?.type === "major-concept" || entry?.type === "concept") {
    return toTheme(entry);
  }
  return undefined;
}

export function getAllQuotations(): Quotation[] {
  return atlas()
    .getPublished("quotation")
    .map((e) => toQuotation(e, atlas()));
}

export function getQuotationBySlug(slug: string): Quotation | undefined {
  const entry = atlas().getBySlug("quotation", slug);
  return entry ? toQuotation(entry, atlas()) : undefined;
}

export function getQuotationById(id: string): Quotation | undefined {
  const entry = atlas().getById(id);
  return entry?.type === "quotation" ? toQuotation(entry, atlas()) : undefined;
}

export function getAllObservations(): Observation[] {
  return atlas()
    .getPublished("observation")
    .map((e) => toObservation(e, atlas()));
}

export function getObservationBySlug(slug: string): Observation | undefined {
  const entry = atlas().getBySlug("observation", slug);
  return entry ? toObservation(entry, atlas()) : undefined;
}

export function buildSearchIndex(): SearchResult[] {
  return atlas()
    .buildSearchIndex()
    .filter((item) => item.type !== "chamber")
    .map(atlasSearchToLegacy);
}

export function searchContent(query: string): SearchResult[] {
  return atlas()
    .search(query)
    .filter((item) => item.type !== "chamber")
    .map(atlasSearchToLegacy);
}

export { siteConfig } from "./data";

export {
  getQuestionHub,
  getAllQuestionHubs,
  getEssayClusters,
  getEssayPeerIds,
  getObservatorySignals,
  getSiteTimeline,
  projectTimelineToSite,
} from "./terrain";

export {
  resolveRelationships,
  refFromEssay,
  refFromQuestion,
  refFromBook,
  refFromFieldNote,
  refFromProject,
  refFromTheme,
  refFromQuotation,
  getPeerRefs,
  themes,
  quotations,
} from "../relationships";

export type {
  QuestionHub,
  EssayCluster,
  ObservatorySignal,
  SiteTimelineEntry,
  SignalKind,
  SiteTimelineKind,
} from "./terrain";

export type {
  NodeRef,
  RelationshipBundle,
  RelationshipGroup,
  ResolvedNode,
  EdgeKind,
} from "../relationships";

export { getAtlas } from "../atlas";
