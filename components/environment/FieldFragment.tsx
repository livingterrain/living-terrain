"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { FieldNote } from "@/lib/content/types";
import { formatDate } from "@/lib/utils";

interface FieldFragmentProps {
  note: FieldNote;
  index: number;
}

const offsets = [
  "sm:ml-0 sm:max-w-md",
  "sm:ml-auto sm:max-w-sm",
  "sm:ml-[12%] sm:max-w-md",
  "sm:ml-auto sm:mr-[8%] sm:max-w-sm",
];

export function FieldFragment({ note, index }: FieldFragmentProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const preview =
    note.body.length > 180 ? `${note.body.slice(0, 180)}…` : note.body;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: 1.3,
        delay: index * 0.1,
        ease: [0.45, 0.05, 0.55, 0.95],
      }}
      className={cn("py-8 sm:py-10", offsets[index % offsets.length])}
    >
      <Link href={`/field-notes/${note.slug}`} className="group block">
        <div className="border-l-2 border-forest/20 bg-ivory/40 px-6 py-6 sm:px-8">
          <time className="type-folio block">{formatDate(note.publishedAt)}</time>
          {note.location && (
            <span className="type-meta mt-1 block">{note.location}</span>
          )}
          {note.title && (
            <h3 className="mt-3 font-heading text-lg text-charcoal transition-colors duration-700 group-hover:text-forest">
              {note.title}
            </h3>
          )}
          <p className="type-lead mt-3 text-[0.9375rem] leading-[1.85]">
            {preview}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
