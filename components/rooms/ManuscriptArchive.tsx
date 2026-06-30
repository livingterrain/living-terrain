"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { DiscoveryNode } from "@/components/discovery";
import type { Book } from "@/lib/content/types";
import { getEssaysByQuestionId } from "@/lib/content";
import { cn } from "@/lib/utils";

interface ManuscriptArchiveProps {
  books: Book[];
}

const statusLabels: Record<Book["status"], string> = {
  published: "In the collection",
  "in-progress": "Still being composed",
  forthcoming: "Awaiting arrival",
};

export function ManuscriptArchive({ books }: ManuscriptArchiveProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });

  return (
    <section ref={ref} aria-label="Manuscript archive">
      {/* Shelf rail */}
      <div
        className="mb-2 h-px bg-gradient-to-r from-transparent via-rule to-transparent"
        aria-hidden="true"
      />

      <ul className="relative space-y-0">
        {books.map((book, index) => {
          const relatedEssays = book.questionIds.flatMap((qId) =>
            getEssaysByQuestionId(qId).filter((e) =>
              e.bookIds?.includes(book.id),
            ),
          );
          const peerIds = [
            book.id,
            ...book.questionIds,
            ...relatedEssays.map((e) => e.id),
          ];
          const depth = index % 3;

          return (
            <motion.li
              key={book.id}
              initial={{ opacity: 0, x: depth === 1 ? 12 : depth === 2 ? -8 : 0 }}
              animate={
                inView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: depth === 1 ? 12 : depth === 2 ? -8 : 0 }
              }
              transition={{
                duration: 1.3,
                delay: index * 0.12,
                ease: [0.45, 0.05, 0.55, 0.95],
              }}
              className={cn(
                "relative",
                depth === 1 && "sm:pl-8",
                depth === 2 && "sm:pr-6",
              )}
            >
              <DiscoveryNode
                id={book.id}
                peers={peerIds}
                as="article"
                className="group"
              >
                <Link
                  href={`/library/${book.slug}`}
                  className="flex flex-col gap-0 sm:flex-row"
                >
                  {/* Spine */}
                  <div
                    className={cn(
                      "relative flex w-full shrink-0 flex-col justify-center border border-rule/60 bg-ivory-shadow/30 px-5 py-8 transition-colors duration-700 group-hover:border-forest/25 group-hover:bg-ivory-shadow/50 sm:w-16 sm:px-3 sm:py-12",
                      depth === 1 && "sm:min-h-[14rem]",
                      depth === 2 && "sm:min-h-[12rem]",
                      depth === 0 && "sm:min-h-[13rem]",
                    )}
                    aria-hidden="true"
                  >
                    <span
                      className="type-chamber mx-auto hidden max-h-48 overflow-hidden text-center leading-relaxed sm:block"
                      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                    >
                      {book.title}
                    </span>
                  </div>

                  {/* Codex face */}
                  <div className="flex-1 border border-l-0 border-rule/60 bg-ivory/50 px-8 py-10 transition-colors duration-700 group-hover:border-forest/20 group-hover:bg-ivory/70 sm:px-10 sm:py-12">
                    <p className="type-folio">{statusLabels[book.status]}</p>
                    <h3 className="type-entry mt-3 text-charcoal transition-colors duration-700 group-hover:text-forest">
                      {book.title}
                    </h3>
                    {book.subtitle && (
                      <p className="type-lead mt-2 text-base">{book.subtitle}</p>
                    )}
                    <p className="type-body mt-5 max-w-xl text-[0.9375rem]">
                      {book.description}
                    </p>

                    {book.questionIds.length > 0 && (
                      <p className="type-meta mt-8 text-forest-faint">
                        Connected to {book.questionIds.length} inquir
                        {book.questionIds.length === 1 ? "y" : "ies"}
                      </p>
                    )}

                    {book.publishedYear && (
                      <p className="type-meta mt-3">
                        {book.publishedYear}
                        {book.publisher ? ` · ${book.publisher}` : ""}
                      </p>
                    )}
                  </div>
                </Link>
              </DiscoveryNode>

              {/* Shelf shadow */}
              <div
                className="mt-0 h-3 bg-gradient-to-b from-ivory-shadow/40 to-transparent"
                aria-hidden="true"
              />
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
