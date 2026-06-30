import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Hairline, SectionIntro } from "@/components/design-system";
import type { FieldNote } from "@/lib/content/types";
import { formatDate } from "@/lib/utils";

interface FieldNotesSectionProps {
  notes: FieldNote[];
}

export function FieldNotesSection({ notes }: FieldNotesSectionProps) {
  return (
    <section className="border-t border-rule py-24 sm:py-32 lg:py-36">
      <Container narrow>
        <SectionIntro
          label="Field journal"
          title="Field notes"
          description="Brief observations — recorded without hurry. The notebook kept alongside the longer work."
          href="/field-notes"
          linkText="All field notes"
        />

        <Hairline motif className="my-16 sm:my-20" />

        <ul className="space-y-12 sm:space-y-16">
          {notes.map((note) => {
            const preview =
              note.body.length > 200
                ? `${note.body.slice(0, 200)}…`
                : note.body;

            return (
              <li key={note.id}>
                <Link
                  href={`/field-notes/${note.slug}`}
                  className="group grid gap-4 sm:grid-cols-[7rem_1fr] sm:gap-10"
                >
                  <div className="border-l-2 border-forest/25 pl-4">
                    <time className="type-folio block">
                      {formatDate(note.publishedAt)}
                    </time>
                    {note.location && (
                      <span className="type-meta mt-1 block">
                        {note.location}
                      </span>
                    )}
                  </div>
                  <div>
                    {note.title && (
                      <h3 className="font-heading text-lg text-charcoal transition-colors duration-500 group-hover:text-forest">
                        {note.title}
                      </h3>
                    )}
                    <p className="type-lead mt-2 text-[0.9375rem] leading-[1.85]">
                      {preview}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
