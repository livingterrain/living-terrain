/**
 * Living Terrain Atlas — canonical model of intellectual geography.
 *
 * Every node in the constellation, relationship engine, search index,
 * and future AI guide reads from this schema.
 */

export type AtlasEntryType =
  | "major-concept"
  | "concept"
  | "chamber"
  | "book"
  | "essay"
  | "question"
  | "field-note"
  | "observation"
  | "quotation";

export type AtlasStatus = "draft" | "published";

/** Semantic edge between atlas entries — maps to relationship engine kinds */
export type ConnectionKind =
  | "pathway"
  | "thread"
  | "volume"
  | "observation"
  | "echo"
  | "parent"
  | "child"
  | "quotation"
  | "theme"
  | "chamber"
  | "parent-concept";

export type ConnectionSource = "explicit" | "inferred";

export interface AtlasConnection {
  id: string;
  from: string;
  to: string;
  kind: ConnectionKind;
  source: ConnectionSource;
  weight?: number;
  /** Why this connection exists — shown in Follow the Thread */
  rationale?: string;
  /** Optional margin voice carried along the thread */
  quote?: string;
}

export interface AtlasSiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  author: string;
  mediumUrl: string;
  amazonBookUrl: string;
  seriesUrl?: string;
}

/** Shared fields on every atlas entry */
export interface AtlasEntryBase {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** Concept IDs this entry belongs to or orbits */
  themes: string[];
  /** Direct parent concepts in the hierarchy (major or sub-concept) */
  parentConcepts: string[];
  /** Populated at registry build from the connection graph */
  connectedItems: string[];
  publishedAt?: string;
  route: string;
  /** Reserved for future AI guide — null until generated */
  aiSummary?: string | null;
  status: AtlasStatus;
}

export interface MajorConceptMeta {
  isContinent: true;
  order?: number;
}

export interface ConceptMeta {
  parentConceptId: string;
}

export interface ChamberMeta {
  bookId: string;
  subtitle?: string;
  introduction: string;
  whyExists: string;
  statusLabel: string;
  statusDescription: string;
  centralQuestion: string;
  purchaseUrl?: string;
  timeline: Array<{
    id: string;
    date: string;
    title: string;
    description: string;
  }>;
  whereToBegin: Array<{
    id: string;
    title: string;
    description: string;
    href: string;
  }>;
}

export interface BookMeta {
  subtitle?: string;
  publishedYear?: number;
  publisher?: string;
  purchaseUrl?: string;
  /** Public path to map plate cover art e.g. /images/maps/my-slug.jpg */
  coverImage?: string;
  bookStatus: "published" | "in-progress" | "forthcoming";
  chapters: Array<{
    id: string;
    slug: string;
    title: string;
    order: number;
    excerpt: string;
    body: string;
  }>;
}

export interface EssayMeta {
  subtitle?: string;
  excerpt: string;
  topics: string[];
  externalUrl?: string;
  /** Public path e.g. /images/essays/my-slug.jpg */
  featuredImage?: string;
  /** Standard essay or signal-style field digest */
  style?: "essay" | "field-digest";
  updatedAt?: string;
}

export interface QuestionMeta {
  subtitle?: string;
  featured?: boolean;
  order?: number;
}

export interface FieldNoteMeta {
  body: string;
  location?: string;
  displayTitle?: string;
}

export interface ObservationMeta {
  body: string;
}

export interface QuotationMeta {
  text: string;
  attribution?: string;
  source?: string;
}

export type AtlasEntryMeta =
  | MajorConceptMeta
  | ConceptMeta
  | ChamberMeta
  | BookMeta
  | EssayMeta
  | QuestionMeta
  | FieldNoteMeta
  | ObservationMeta
  | QuotationMeta;

export type AtlasEntry = AtlasEntryBase & {
  type: AtlasEntryType;
  meta: AtlasEntryMeta;
};

export interface AtlasData {
  version: number;
  site: AtlasSiteConfig;
  entries: AtlasEntry[];
  connections: AtlasConnection[];
}

export interface AtlasSearchResult {
  id: string;
  type: AtlasEntryType;
  title: string;
  excerpt: string;
  route: string;
}

/** Indexes built once at startup — O(1) lookups for thousands of entries */
export interface AtlasIndexes {
  byId: Map<string, AtlasEntry>;
  bySlug: Map<string, AtlasEntry>;
  byType: Map<AtlasEntryType, AtlasEntry[]>;
  connectionsByFrom: Map<string, AtlasConnection[]>;
  connectionsByTo: Map<string, AtlasConnection[]>;
  majorConcepts: AtlasEntry[];
  published: AtlasEntry[];
}
