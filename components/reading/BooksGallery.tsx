import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/lib/content/types";
import {
  resolveMapCoverDimensions,
  resolveMapCoverSrc,
} from "@/lib/content/maps";
import { sortBooksForShelf } from "@/lib/content/shelves";

interface BooksGalleryProps {
  books: Book[];
}

export function BooksGallery({ books }: BooksGalleryProps) {
  const shelfBooks = sortBooksForShelf(
    books.filter((b) => b.status === "published"),
  );

  if (shelfBooks.length === 0) return null;

  return (
    <section aria-labelledby="books-shelf">
      {shelfBooks.length === 7 && (
        <p className="type-body text-[0.9375rem] text-charcoal-muted/80">
          Seven longer investigations.
        </p>
      )}
      {shelfBooks.length !== 7 && (
        <p className="type-body text-[0.9375rem] text-charcoal-muted/80">
          {shelfBooks.length} longer{" "}
          {shelfBooks.length === 1 ? "investigation" : "investigations"}.
        </p>
      )}

      <ul className="mt-12 grid grid-cols-1 gap-y-20 sm:mt-16 sm:gap-y-24 md:grid-cols-2 md:gap-x-14 md:gap-y-28 lg:gap-x-20 lg:gap-y-32">
        {shelfBooks.map((book, index) => {
          const src = resolveMapCoverSrc(book);
          const dims = resolveMapCoverDimensions(book.slug);
          const href = `/atlas/${book.slug}`;

          return (
            <li key={book.id} className="shelf-book">
              <Link
                href={href}
                className="group block touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest/40"
                aria-label={`${book.title} — Explore the book`}
              >
                <div className="map-cover__mount mx-auto w-full max-w-[15.5rem] transition-[box-shadow,transform] duration-[1400ms] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] sm:max-w-[17rem] md:mx-0 md:max-w-[15.5rem] lg:max-w-[18rem] group-hover:-translate-y-0.5">
                  <div
                    className="map-cover__frame relative overflow-hidden bg-[#0e1012]"
                    style={{
                      aspectRatio: `${dims.width} / ${dims.height}`,
                    }}
                  >
                    <Image
                      src={src}
                      alt=""
                      width={dims.width}
                      height={dims.height}
                      className="h-auto w-full object-contain"
                      sizes="(max-width: 768px) 62vw, 288px"
                      priority={index < 2}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#040608]/8 via-transparent to-[#040608]/18"
                      aria-hidden="true"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#c4a06a]/[0.06]"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="mt-9 max-w-md sm:mt-10 md:mt-11">
                  <h2 className="font-heading text-[1.375rem] leading-snug tracking-[-0.015em] text-charcoal transition-colors duration-700 group-hover:text-forest sm:text-[1.625rem] sm:leading-[1.25]">
                    {book.title}
                  </h2>
                  {book.subtitle && (
                    <p className="type-lead mt-3 text-[0.9375rem] italic leading-relaxed text-charcoal-muted sm:text-base">
                      {book.subtitle}
                    </p>
                  )}
                  <p className="type-body mt-5 line-clamp-4 text-[0.9375rem] leading-[1.75] text-charcoal-muted/90">
                    {book.description}
                  </p>
                  <p className="type-meta mt-7 text-[0.8125rem] tracking-[0.04em] text-forest-faint transition-colors duration-700 group-hover:text-forest">
                    Explore the book →
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
