import Link from "next/link";
import type { Book, Essay } from "@/lib/content/types";
import { displayEssayTitle } from "@/lib/content/essay-display";
import { formatDate } from "@/lib/utils";
import { getVisualMapCollections } from "@/lib/visual-maps";

interface ShelvesFoyerProps {
  books: Book[];
  essays: Essay[];
}

export function ShelvesFoyer({ books, essays }: ShelvesFoyerProps) {
  const publishedBooks = books.filter((b) => b.status === "published");
  const newest = essays[0];
  const visualMaps = getVisualMapCollections();

  const bookLabel =
    publishedBooks.length === 1 ? "investigation" : "investigations";
  const mapLabel =
    visualMaps.length === 1 ? "collection" : "collections";

  return (
    <nav aria-label="Shelves">
      <ul className="space-y-10 sm:space-y-14 md:space-y-20">
        <li>
          <Link
            href="/books"
            data-shelf-signal="books"
            className="terrain-list-link shelves-signal shelves-signal--books group block max-w-[36rem]"
          >
            <h2 className="font-heading text-xl text-charcoal transition-colors duration-700 group-hover:text-forest sm:text-2xl">
              Books
            </h2>
            <p className="type-lead mt-3 text-[1.0625rem] italic leading-relaxed text-charcoal-muted sm:mt-4 sm:text-lg">
              Longer investigations.
            </p>
            {publishedBooks.length > 0 && (
              <p className="type-meta mt-3 text-[0.8125rem] text-charcoal-faint/85">
                {publishedBooks.length} {bookLabel}
              </p>
            )}
            <p className="type-meta mt-5 text-[0.8125rem] tracking-[0.04em] text-forest-faint transition-colors duration-700 group-hover:text-forest sm:mt-7">
              Enter →
            </p>
          </Link>
        </li>

        <li>
          <Link
            href="/essays"
            data-shelf-signal="essays"
            className="terrain-list-link shelves-signal shelves-signal--essays group block max-w-[36rem]"
          >
            <h2 className="font-heading text-xl text-charcoal transition-colors duration-700 group-hover:text-forest sm:text-2xl">
              Essays
            </h2>
            <p className="type-lead mt-3 text-[1.0625rem] italic leading-relaxed text-charcoal-muted sm:mt-4 sm:text-lg">
              Scout reports from the edges.
            </p>
            {newest && (
              <p className="type-meta mt-3 text-[0.8125rem] leading-relaxed text-charcoal-faint/85">
                {formatDate(newest.publishedAt)}
                <span className="mt-1 block text-charcoal-muted/80">
                  {displayEssayTitle(newest.title)}
                </span>
              </p>
            )}
            <p className="type-meta mt-5 text-[0.8125rem] tracking-[0.04em] text-forest-faint transition-colors duration-700 group-hover:text-forest sm:mt-7">
              Enter →
            </p>
          </Link>
        </li>

        <li>
          <Link
            href="/visual-maps"
            data-shelf-signal="visual-maps"
            className="terrain-list-link shelves-signal shelves-signal--maps group block max-w-[36rem]"
          >
            <h2 className="font-heading text-xl text-charcoal transition-colors duration-700 group-hover:text-forest sm:text-2xl">
              Visual Maps
            </h2>
            <p className="type-lead mt-3 text-[1.0625rem] italic leading-relaxed text-charcoal-muted sm:mt-4 sm:text-lg">
              Reference plates.
            </p>
            {visualMaps.length > 0 && (
              <p className="type-meta mt-3 text-[0.8125rem] text-charcoal-faint/85">
                {visualMaps.length} {mapLabel}
              </p>
            )}
            <p className="type-meta mt-5 text-[0.8125rem] tracking-[0.04em] text-forest-faint transition-colors duration-700 group-hover:text-forest sm:mt-7">
              Enter →
            </p>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
