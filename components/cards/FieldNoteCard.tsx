import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import type { FieldNote } from "@/lib/content/types";
import { formatDate } from "@/lib/utils";

interface FieldNoteCardProps {
  note: FieldNote;
}

export function FieldNoteCard({ note }: FieldNoteCardProps) {
  const preview =
    note.body.length > 160 ? `${note.body.slice(0, 160)}…` : note.body;

  return (
    <article className="group">
      <Link href={`/field-notes/${note.slug}`} className="block">
        <div className="border-l-2 border-border py-4 pl-6 transition-all duration-300 group-hover:border-accent group-hover:bg-cream-dark/30">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Tag>Field Note</Tag>
            <time className="font-body text-xs text-ink-faint">
              {formatDate(note.publishedAt)}
            </time>
            {note.location && (
              <span className="font-body text-xs text-ink-faint">
                · {note.location}
              </span>
            )}
          </div>
          {note.title && (
            <h3 className="mt-2 font-heading text-lg text-ink transition-colors duration-300 group-hover:text-accent">
              {note.title}
            </h3>
          )}
          <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted italic">
            {preview}
          </p>
        </div>
      </Link>
    </article>
  );
}
