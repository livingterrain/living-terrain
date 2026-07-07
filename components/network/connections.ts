import type { ConnectionItem } from "./ConnectionWeb";
import {
  getBookById,
  getEssayById,
  getEssayReadUrl,
  getFieldNoteById,
  getQuestionById,
} from "@/lib/content";

export function questionsToConnections(questionIds: string[]): ConnectionItem[] {
  return questionIds
    .map((id) => getQuestionById(id))
    .filter(Boolean)
    .map((q) => ({
      href: `/questions/${q!.slug}`,
      title: q!.title,
      subtitle: q!.subtitle,
    }));
}

export function essaysToConnections(essayIds: string[]): ConnectionItem[] {
  return essayIds
    .map((id) => getEssayById(id))
    .filter(Boolean)
    .map((e) => ({
      href: getEssayReadUrl(e!),
      title: e!.title,
      subtitle: e!.subtitle ?? e!.excerpt,
      external: true,
    }));
}

export function booksToConnections(bookIds: string[]): ConnectionItem[] {
  return bookIds
    .map((id) => getBookById(id))
    .filter(Boolean)
    .map((b) => ({
      href: `/atlas/${b!.slug}`,
      title: b!.title,
      subtitle: b!.subtitle,
    }));
}

export function fieldNotesToConnections(noteIds: string[]): ConnectionItem[] {
  return noteIds
    .map((id) => getFieldNoteById(id))
    .filter(Boolean)
    .map((fn) => ({
      href: `/field-notes/${fn!.slug}`,
      title: fn!.title ?? "Field observation",
      subtitle: fn!.body.slice(0, 80) + (fn!.body.length > 80 ? "…" : ""),
    }));
}

export function sectionsToConnections(
  sections: { slug: string; title: string; excerpt: string }[],
): ConnectionItem[] {
  return sections.map((s) => ({
    href: `/structure-beneath-reality/${s.slug}`,
    title: s.title,
    subtitle: s.excerpt,
  }));
}
