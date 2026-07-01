import Link from "next/link";
import { TextLink } from "@/components/design-system";
import { TerrainConnectionInvite } from "@/components/reading/TerrainConnectionInvite";
import type { Book, Essay, FieldNote } from "@/lib/content/types";
import {
  refFromBook,
  refFromEssay,
  refFromFieldNote,
} from "@/lib/relationships";
import { formatDate } from "@/lib/utils";

interface InquiryHubProps {
  essays: Essay[];
  books: Book[];
  fieldNotes: FieldNote[];
}

export function InquiryHub({ essays, books, fieldNotes }: InquiryHubProps) {
  return (
    <div className="space-y-20 sm:space-y-24">
      {essays.length > 0 && (
        <section aria-labelledby="inquiry-essays">
          <h2 id="inquiry-essays" className="type-folio text-charcoal-faint">
            Essays
          </h2>
          <ul className="threshold-carved-list mt-8">
            {essays.map((essay) => (
              <li key={essay.id}>
                <Link
                  href={`/essays/${essay.slug}`}
                  className="terrain-list-link group"
                >
                  <p className="type-meta text-forest-faint">
                    {formatDate(essay.publishedAt)}
                  </p>
                  <h3 className="mt-2 font-heading text-xl text-charcoal transition-colors duration-700 group-hover:text-forest sm:text-2xl">
                    {essay.title}
                  </h3>
                  {essay.subtitle && (
                    <p className="type-lead mt-2 text-base text-charcoal-muted">
                      {essay.subtitle}
                    </p>
                  )}
                  <p className="type-body mt-4 line-clamp-3 text-[0.9375rem]">
                    {essay.excerpt}
                  </p>
                </Link>
                <TerrainConnectionInvite
                  nodeRef={refFromEssay(essay)}
                  className="mt-5"
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {books.length > 0 && (
        <section aria-labelledby="inquiry-volumes">
          <h2 id="inquiry-volumes" className="type-folio text-charcoal-faint">
            Volumes
          </h2>
          <ul className="threshold-carved-list mt-8">
            {books.map((book) => (
              <li key={book.id}>
                <Link href={`/library/${book.slug}`} className="terrain-list-link group">
                  {book.publishedYear && (
                    <p className="type-meta text-forest-faint">
                      {book.publishedYear}
                    </p>
                  )}
                  <h3 className="mt-2 font-heading text-xl text-charcoal transition-colors duration-700 group-hover:text-forest sm:text-2xl">
                    {book.title}
                  </h3>
                  {book.subtitle && (
                    <p className="type-lead mt-2 text-base text-charcoal-muted">
                      {book.subtitle}
                    </p>
                  )}
                  <p className="type-body mt-4 text-[0.9375rem]">
                    {book.description}
                  </p>
                </Link>
                <TerrainConnectionInvite
                  nodeRef={refFromBook(book)}
                  className="mt-5"
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {fieldNotes.length > 0 && (
        <section aria-labelledby="inquiry-notes">
          <h2 id="inquiry-notes" className="type-folio text-charcoal-faint">
            Field notes
          </h2>
          <ul className="threshold-carved-list mt-8">
            {fieldNotes.map((note) => (
              <li key={note.id}>
                <Link
                  href={`/field-notes/${note.slug}`}
                  className="terrain-list-link group"
                >
                  <p className="type-meta text-forest-faint">
                    {formatDate(note.publishedAt)}
                    {note.location ? ` · ${note.location}` : ""}
                  </p>
                  <h3 className="mt-2 font-heading text-xl text-charcoal transition-colors duration-700 group-hover:text-forest">
                    {note.title ?? "Field observation"}
                  </h3>
                  <p className="type-body mt-4 line-clamp-4 text-[0.9375rem] italic text-charcoal-muted">
                    {note.body}
                  </p>
                </Link>
                <TerrainConnectionInvite
                  nodeRef={refFromFieldNote(note)}
                  className="mt-5"
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="threshold-carved threshold-carved--edge pt-12 text-center">
        <p className="type-body text-sm text-charcoal-muted">
          Prefer to wander visually?
        </p>
        <TextLink href="/" className="mt-3 inline-flex min-h-11 items-center text-sm">
          Explore the Living Terrain →
        </TextLink>
      </footer>
    </div>
  );
}
