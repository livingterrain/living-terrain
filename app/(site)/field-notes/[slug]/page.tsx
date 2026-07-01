import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanternReadingShell } from "@/components/world/LanternReadingShell";
import { renderBody } from "@/components/reading/Prose";
import { getAllFieldNotes, getFieldNoteBySlug } from "@/lib/content";
import { refFromFieldNote } from "@/lib/relationships";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllFieldNotes().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getFieldNoteBySlug(slug);
  if (!note) return { title: "Field Note Not Found" };

  return {
    title: note.title ?? "Field Note",
    description: note.body.slice(0, 160),
  };
}

export default async function FieldNotePage({ params }: PageProps) {
  const { slug } = await params;
  const note = getFieldNoteBySlug(slug);
  if (!note) notFound();

  const nodeRef = refFromFieldNote(note);

  return (
    <LanternReadingShell
      collection="Field Note"
      title={note.title ?? "Field Note"}
      meta={
        <>
          {formatDate(note.publishedAt)}
          {note.location ? ` · ${note.location}` : ""}
        </>
      }
      nodeRef={nodeRef}
      returnHref="/field-notes"
      variant="notebook"
    >
      <div className="italic">{renderBody(note.body)}</div>
    </LanternReadingShell>
  );
}
