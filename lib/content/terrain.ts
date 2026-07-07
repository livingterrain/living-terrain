import {
  getAtlas,
  getLegacyQuestions,
  getLegacyEssays,
  getLegacyBooks,
  getLegacyFieldNotes,
  getLegacyProject,
} from "../atlas";
import { getPeerRefs } from "../relationships/graph";
import { getBundledObservations } from "../observatory/observations-bundle";
import { displayTitle } from "../observatory/display";
import type {
  Book,
  Essay,
  FieldNote,
  ProjectTimelineEntry,
  Question,
} from "./types";

export interface QuestionHub {
  question: Question;
  essays: Essay[];
  books: Book[];
  fieldNotes: FieldNote[];
  peerIds: string[];
}

export interface EssayCluster {
  question: Question | null;
  essays: Essay[];
}

export type SignalKind = "essay" | "field-note" | "observation" | "pulse";

export interface ObservatorySignal {
  id: string;
  kind: SignalKind;
  date: string;
  title: string;
  excerpt: string;
  href: string;
  /** Discovery graph — related content node IDs */
  peerIds: string[];
}

export type SiteTimelineKind =
  | "essay"
  | "field-note"
  | "book"
  | "project"
  | "milestone";

export interface SiteTimelineEntry {
  id: string;
  date: string;
  sortKey: number;
  title: string;
  description: string;
  href?: string;
  kind: SiteTimelineKind;
  peerIds: string[];
}

function publishedEssays(): Essay[] {
  return getLegacyEssays(getAtlas()).filter((e) => e.status === "published");
}

function questions() {
  return getLegacyQuestions(getAtlas());
}

function fieldNotes() {
  return getLegacyFieldNotes(getAtlas());
}

function books() {
  return getLegacyBooks(getAtlas());
}

function flagshipProject() {
  return getLegacyProject(getAtlas());
}

function parseSortKey(date: string): number {
  const year = parseInt(date.slice(0, 4), 10);
  if (!Number.isNaN(year) && year > 1000) return year;
  return 0;
}

export function getQuestionHub(questionId: string): QuestionHub | undefined {
  const question = questions().find((q) => q.id === questionId);
  if (!question) return undefined;

  const hubEssays = publishedEssays().filter((e) =>
    e.questionIds.includes(questionId),
  );
  const hubBooks = books().filter((b) => b.questionIds.includes(questionId));
  const hubNotes = fieldNotes().filter((fn) =>
    fn.questionIds.includes(questionId),
  );

  const peerIds = getPeerRefs({ kind: "question", id: question.id }).map(
    (r) => r.id,
  );

  return {
    question,
    essays: hubEssays,
    books: hubBooks,
    fieldNotes: hubNotes,
    peerIds,
  };
}

export function getAllQuestionHubs(): QuestionHub[] {
  return questions()
    .map((q) => getQuestionHub(q.id))
    .filter((hub): hub is QuestionHub => hub !== undefined)
    .sort((a, b) => (a.question.order ?? 0) - (b.question.order ?? 0));
}

export function getEssayClusters(): EssayCluster[] {
  const all = publishedEssays();
  const clustered = new Map<string, Essay[]>();
  const unmapped: Essay[] = [];

  for (const essay of all) {
    const primary = essay.questionIds[0];
    if (!primary) {
      unmapped.push(essay);
      continue;
    }
    const list = clustered.get(primary) ?? [];
    list.push(essay);
    clustered.set(primary, list);
  }

  const clusters: EssayCluster[] = questions()
    .filter((q) => clustered.has(q.id))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((question) => ({
      question,
      essays: clustered.get(question.id) ?? [],
    }));

  if (unmapped.length > 0) {
    clusters.push({ question: null, essays: unmapped });
  }

  return clusters;
}

export function getEssayPeerIds(essay: Essay): string[] {
  return getPeerRefs({ kind: "essay", id: essay.id }).map((r) => r.id);
}

function fieldNotePeerIds(note: FieldNote): string[] {
  return getPeerRefs({ kind: "field-note", id: note.id }).map((r) => r.id);
}

function bookPeerIds(book: Book): string[] {
  return getPeerRefs({ kind: "book", id: book.id }).map((r) => r.id);
}

function projectPeerIds(): string[] {
  return getPeerRefs({ kind: "project", id: flagshipProject().id }).map(
    (r) => r.id,
  );
}

export function getObservatorySignals(limit = 8): ObservatorySignal[] {
  const signals: ObservatorySignal[] = [];

  for (const essay of publishedEssays()) {
    signals.push({
      id: `sig-${essay.id}`,
      kind: "essay",
      date: essay.publishedAt,
      title: essay.title,
      excerpt: essay.excerpt,
      href: `/essays/${essay.slug}`,
      peerIds: getEssayPeerIds(essay),
    });
  }

  for (const note of fieldNotes()) {
    signals.push({
      id: `sig-${note.id}`,
      kind: "field-note",
      date: note.publishedAt,
      title: note.title ?? "Field note",
      excerpt: note.body.slice(0, 140) + (note.body.length > 140 ? "…" : ""),
      href: `/field-notes/${note.slug}`,
      peerIds: fieldNotePeerIds(note),
    });
  }

  for (const observation of getBundledObservations()) {
    signals.push({
      id: `sig-${observation.id}`,
      kind: "observation",
      date: observation.createdAt,
      title: displayTitle(observation),
      excerpt:
        observation.body.slice(0, 140) +
        (observation.body.length > 140 ? "…" : ""),
      href: `/observatory/observations/${observation.slug}`,
      peerIds: getPeerRefs({ kind: "observation", id: observation.id }).map(
        (r) => r.id,
      ),
    });
  }

  signals.push({
    id: "sig-pulse",
    kind: "pulse",
    date: new Date().toISOString().slice(0, 10),
    title: "The inquiry continues",
    excerpt: flagshipProject().status.description,
    href: "/chambers/the-structure-beneath-reality",
    peerIds: projectPeerIds(),
  });

  return signals
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    .slice(0, limit);
}

export function getSiteTimeline(): SiteTimelineEntry[] {
  const entries: SiteTimelineEntry[] = [];

  for (const entry of flagshipProject().timeline) {
    entries.push({
      id: `tl-${entry.id}`,
      date: entry.date,
      sortKey: parseSortKey(entry.date),
      title: entry.title,
      description: entry.description,
      href: "/chambers/the-structure-beneath-reality",
      kind: "project",
      peerIds: projectPeerIds(),
    });
  }

  for (const essay of publishedEssays()) {
    entries.push({
      id: `tl-${essay.id}`,
      date: essay.publishedAt,
      sortKey: parseSortKey(essay.publishedAt),
      title: essay.title,
      description: essay.excerpt,
      href: `/essays/${essay.slug}`,
      kind: "essay",
      peerIds: getEssayPeerIds(essay),
    });
  }

  for (const note of fieldNotes()) {
    entries.push({
      id: `tl-${note.id}`,
      date: note.publishedAt,
      sortKey: parseSortKey(note.publishedAt),
      title: note.title ?? "Field observation",
      description: note.body.slice(0, 120) + (note.body.length > 120 ? "…" : ""),
      href: `/field-notes/${note.slug}`,
      kind: "field-note",
      peerIds: fieldNotePeerIds(note),
    });
  }

  for (const book of books()) {
    if (!book.publishedYear) continue;
    entries.push({
      id: `tl-${book.id}`,
      date: String(book.publishedYear),
      sortKey: book.publishedYear,
      title: book.title,
      description: book.description,
      href: `/atlas/${book.slug}`,
      kind: "book",
      peerIds: bookPeerIds(book),
    });
  }

  return entries.sort((a, b) => {
    if (a.sortKey !== b.sortKey) return a.sortKey - b.sortKey;
    return a.date.localeCompare(b.date);
  });
}

export function projectTimelineToSite(
  timeline: ProjectTimelineEntry[],
  peerIds: string[],
): SiteTimelineEntry[] {
  return timeline.map((entry) => ({
    id: `tl-${entry.id}`,
    date: entry.date,
    sortKey: parseSortKey(entry.date),
    title: entry.title,
    description: entry.description,
    kind: "milestone" as const,
    peerIds,
  }));
}
