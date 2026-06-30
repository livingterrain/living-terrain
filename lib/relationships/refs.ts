import type { ContentRef } from "../content/types";
import type { Essay, Question, Book, FieldNote, Project } from "../content/types";
import type { NodeRef } from "./types";

export function refQuestion(id: string): NodeRef {
  return { kind: "question", id };
}

export function refEssay(id: string): NodeRef {
  return { kind: "essay", id };
}

export function refBook(id: string): NodeRef {
  return { kind: "book", id };
}

export function refFieldNote(id: string): NodeRef {
  return { kind: "field-note", id };
}

export function refProject(id: string): NodeRef {
  return { kind: "project", id };
}

export function refQuotation(id: string): NodeRef {
  return { kind: "quotation", id };
}

export function refTheme(id: string): NodeRef {
  return { kind: "theme", id };
}

export function refFromEssay(essay: Essay): NodeRef {
  return refEssay(essay.id);
}

export function refFromQuestion(question: Question): NodeRef {
  return refQuestion(question.id);
}

export function refFromBook(book: Book): NodeRef {
  return refBook(book.id);
}

export function refFromFieldNote(note: FieldNote): NodeRef {
  return refFieldNote(note.id);
}

export function refFromProject(project: Project): NodeRef {
  return refProject(project.id);
}

export function refFromTheme(theme: { id: string }): NodeRef {
  return refTheme(theme.id);
}

export function refFromQuotation(quotation: { id: string }): NodeRef {
  return refQuotation(quotation.id);
}

export function refBookChapter(bookId: string, chapterId: string): NodeRef {
  return { kind: "book-chapter", id: `${bookId}:${chapterId}` };
}

export function refTimelineEvent(projectId: string, eventId: string): NodeRef {
  return { kind: "timeline-event", id: `${projectId}:${eventId}` };
}

export function refFromBookChapter(
  book: { id: string },
  chapter: { id: string },
): NodeRef {
  return refBookChapter(book.id, chapter.id);
}

export function refFromTimelineEvent(
  project: { id: string },
  event: { id: string },
): NodeRef {
  return refTimelineEvent(project.id, event.id);
}

export function isContentRef(value: ContentRef): value is ContentRef {
  return Boolean(value?.kind && value?.id);
}
