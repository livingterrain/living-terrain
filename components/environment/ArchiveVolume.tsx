"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { Book } from "@/lib/content/types";

interface ArchiveVolumeProps {
  book: Book;
  index: number;
}

const statusWhispers: Record<Book["status"], string> = {
  published: "On the shelf",
  "in-progress": "Still being written",
  forthcoming: "Not yet arrived",
};

export function ArchiveVolume({ book, index }: ArchiveVolumeProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const shelfOffset = index % 3;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: 1.3,
        delay: index * 0.07,
        ease: [0.45, 0.05, 0.55, 0.95],
      }}
      className={cn(
        "relative",
        shelfOffset === 1 && "sm:mt-8",
        shelfOffset === 2 && "sm:mt-4",
      )}
    >
      <Link href={`/library/${book.slug}`} className="group block">
        <div className="relative border border-rule/60 bg-ivory/60 px-8 py-10 transition-colors duration-700 group-hover:border-forest/30 group-hover:bg-ivory/80 sm:px-10 sm:py-12">
          <div className="absolute inset-x-0 top-0 h-1 bg-ivory-shadow/80" />
          <p className="type-folio">{statusWhispers[book.status]}</p>
          <h3 className="type-entry mt-4 text-charcoal transition-colors duration-700 group-hover:text-forest">
            {book.title}
          </h3>
          {book.subtitle && (
            <p className="type-lead mt-2 text-base">{book.subtitle}</p>
          )}
          <p className="type-body mt-5 text-[0.9375rem]">{book.description}</p>
          {book.publishedYear && (
            <p className="type-meta mt-6">
              {book.publishedYear}
              {book.publisher ? ` · ${book.publisher}` : ""}
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
