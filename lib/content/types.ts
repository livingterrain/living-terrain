export type ContentStatus = "draft" | "published";

export type ContentKind =
  | "question"
  | "essay"
  | "book"
  | "book-chapter"
  | "field-note"
  | "quotation"
  | "observation"
  | "project"
  | "theme"
  | "timeline-event";

/** Reference to any node in the relationship graph */
export interface ContentRef {
  kind: ContentKind;
  id: string;
}

export interface Question {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  featured?: boolean;
  order?: number;
  relatedEssayIds: string[];
  relatedBookIds: string[];
  relatedFieldNoteIds: string[];
  themeIds?: string[];
  parentRefs?: ContentRef[];
  childRefs?: ContentRef[];
  quotationIds?: string[];
  observationIds?: string[];
}

export interface Essay {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  /** ISO date string */
  publishedAt: string;
  updatedAt?: string;
  excerpt: string;
  topics: string[];
  /** Question IDs this essay explores */
  questionIds: string[];
  /** Project IDs this essay connects to — auto-links on project pages */
  projectIds?: string[];
  /** Book IDs this essay relates to */
  bookIds?: string[];
  /** Other essay IDs in the same thread */
  relatedEssayIds?: string[];
  /** Theme node IDs */
  themeIds?: string[];
  /** Parent ideas this grows from */
  parentRefs?: ContentRef[];
  /** Ideas this opens into */
  childRefs?: ContentRef[];
  quotationIds?: string[];
  observationIds?: string[];
  /** Full essay on Medium — falls back to publication URL when omitted */
  externalUrl?: string;
  status: ContentStatus;
}

export interface BookChapter {
  id: string;
  slug: string;
  title: string;
  order: number;
  excerpt: string;
  body: string;
}

export type BookStatus = "published" | "in-progress" | "forthcoming";

export interface Book {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  publishedYear?: number;
  publisher?: string;
  questionIds: string[];
  chapters: BookChapter[];
  status: BookStatus;
  themeIds?: string[];
  parentRefs?: ContentRef[];
  childRefs?: ContentRef[];
  quotationIds?: string[];
  observationIds?: string[];
  /** Quiet purchase link — not a storefront */
  purchaseUrl?: string;
}

export interface FieldNote {
  id: string;
  slug: string;
  title?: string;
  body: string;
  publishedAt: string;
  location?: string;
  questionIds: string[];
  themeIds?: string[];
  parentRefs?: ContentRef[];
  childRefs?: ContentRef[];
  quotationIds?: string[];
  observationIds?: string[];
  relatedEssayIds?: string[];
}

export interface Theme {
  id: string;
  slug: string;
  title: string;
  description?: string;
  parentThemeId?: string;
  childThemeIds?: string[];
}

export interface Quotation {
  id: string;
  slug: string;
  text: string;
  attribution?: string;
  source?: string;
  questionIds: string[];
  themeIds?: string[];
  relatedEssayIds?: string[];
  relatedBookIds?: string[];
  parentRefs?: ContentRef[];
  status: ContentStatus;
}

export interface Observation {
  id: string;
  slug: string;
  title: string;
  body: string;
  publishedAt: string;
  questionIds: string[];
  themeIds?: string[];
  relatedEssayIds?: string[];
  relatedFieldNoteIds?: string[];
  parentRefs?: ContentRef[];
  status: ContentStatus;
}

export interface StructureSection {
  id: string;
  slug: string;
  title: string;
  order: number;
  excerpt: string;
  body: string;
}

export interface ProjectTheme {
  title: string;
  description: string;
}

export interface ProjectTimelineEntry {
  id: string;
  /** Display date — year or ISO */
  date: string;
  title: string;
  description: string;
}

export interface WhereToBeginEntry {
  id: string;
  title: string;
  description: string;
  href: string;
}

export interface Project {
  id: string;
  slug: string;
  bookId: string;
  title: string;
  subtitle?: string;
  introduction: string;
  /** Why this inquiry exists */
  whyExists: string;
  status: {
    label: string;
    description: string;
  };
  centralQuestion: string;
  themes: ProjectTheme[];
  essayIds: string[];
  questionIds: string[];
  fieldNoteIds: string[];
  relatedBookIds: string[];
  timeline: ProjectTimelineEntry[];
  whereToBegin: WhereToBeginEntry[];
  purchaseUrl?: string;
}

export interface SearchResult {
  id: string;
  type:
    | "essay"
    | "book"
    | "question"
    | "field-note"
    | "theme"
    | "quotation"
    | "observation";
  title: string;
  excerpt: string;
  href: string;
}

export type ContentType = SearchResult["type"];
