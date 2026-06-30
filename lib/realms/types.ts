import type {
  Book,
  Essay,
  FieldNote,
  Question,
  Quotation,
  Theme,
} from "@/lib/content/types";
import type { SiteTimelineEntry } from "@/lib/content/terrain";

export type RealmSlug =
  | "reality"
  | "relationship"
  | "meaning"
  | "identity"
  | "language"
  | "time"
  | "embodiment"
  | "freedom"
  | "consciousness";

export interface RealmPalette {
  bg: string;
  bgGradient: string;
  glow: string;
  accent: string;
  accentSoft: string;
  text: string;
  textMuted: string;
  particle: string;
  line: string;
}

export interface RealmTopic {
  id: string;
  label: string;
  whisper: string;
  href?: string;
  contentId?: string;
}

export interface RealmConfig {
  slug: RealmSlug;
  themeId: string;
  whisper: string;
  mood: string;
  palette: RealmPalette;
  topics: RealmTopic[];
}

export interface RealmThread {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  kind: "essay" | "book" | "question" | "field-note" | "quotation" | "concept";
  year?: string;
}

export interface RealmNetworkNode {
  id: string;
  label: string;
  whisper?: string;
  href?: string;
  x: number;
  y: number;
  kind: "topic" | "content" | "center";
  connectedIds: string[];
  /** Concentric depth — identity, reality nesting */
  ring?: number;
  /** Vertical layer — nested systems */
  layer?: number;
  /** Lateral branch — time memories, language tributaries */
  branch?: "left" | "right" | "center";
}

export interface RealmNetworkEdge {
  from: string;
  to: string;
}

export interface WordOccurrence {
  word: string;
  href: string;
  title: string;
  excerpt: string;
}

export interface ThemeHub {
  theme: Theme;
  config: RealmConfig;
  whisper: string;
  subConcepts: Theme[];
  essays: Essay[];
  books: Book[];
  questions: Question[];
  fieldNotes: FieldNote[];
  quotations: Quotation[];
  topics: RealmTopic[];
  threads: RealmThread[];
  network: RealmNetworkNode[];
  networkEdges: RealmNetworkEdge[];
  timeline: SiteTimelineEntry[];
  wordLinks: WordOccurrence[];
  chapters: RealmChapter[];
  peerIds: string[];
}

export interface RealmChapter {
  id: string;
  title: string;
  subtitle?: string;
  body: string;
  href?: string;
  kind: "essay" | "question" | "field-note" | "topic";
}
