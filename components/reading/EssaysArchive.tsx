"use client";

import { useState } from "react";
import Link from "next/link";
import type { Essay } from "@/lib/content/types";
import { displayEssayTitle } from "@/lib/content/essay-display";
import { essayBodyLines } from "@/lib/content/shelves";
import { formatDate } from "@/lib/utils";

const INITIAL_COUNT = 12;

interface EssaysArchiveProps {
  essays: Essay[];
}

function EssayRow({ essay }: { essay: Essay }) {
  const { subtitle, excerpt } = essayBodyLines(essay);
  const title = displayEssayTitle(essay.title);

  return (
    <li>
      <Link
        href={`/essays/${essay.slug}`}
        className="terrain-list-link group block py-1"
      >
        <p className="type-meta text-[0.6875rem] tracking-[0.04em] text-charcoal-faint/80">
          {formatDate(essay.publishedAt)}
        </p>
        <h2 className="mt-1.5 font-heading text-[1.1875rem] leading-snug tracking-[-0.01em] text-charcoal transition-colors duration-700 group-hover:text-forest sm:text-[1.3125rem]">
          {title}
        </h2>
        {subtitle && (
          <p className="type-lead mt-1 text-[0.9375rem] italic leading-snug text-charcoal-muted/85">
            {subtitle}
          </p>
        )}
        {excerpt && (
          <p className="type-body mt-2 line-clamp-2 text-[0.875rem] leading-[1.65] text-charcoal-muted/75">
            {excerpt}
          </p>
        )}
      </Link>
    </li>
  );
}

export function EssaysArchive({ essays }: EssaysArchiveProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = essays.length > INITIAL_COUNT;
  const visible =
    expanded || !hasMore ? essays : essays.slice(0, INITIAL_COUNT);
  return (
    <section aria-labelledby="essays-archive">
      <h2 id="essays-archive" className="sr-only">
        Essays
      </h2>
      <ul id="essays-recent" className="shelf-essay-list mt-2 max-w-[40rem]">
        {visible.map((essay) => (
          <EssayRow key={essay.id} essay={essay} />
        ))}
      </ul>

      {hasMore && !expanded && (
        <p className="mt-12 max-w-[40rem]">
          <button
            type="button"
            className="type-meta min-h-11 text-left text-[0.8125rem] tracking-[0.04em] text-forest-faint transition-colors duration-700 hover:text-forest"
            onClick={() => setExpanded(true)}
          >
            Continue through the archive ↓
          </button>
        </p>
      )}

      {hasMore && expanded && (
        <p className="mt-12 max-w-[40rem]">
          <button
            type="button"
            className="type-meta min-h-11 text-left text-[0.8125rem] tracking-[0.04em] text-forest-faint transition-colors duration-700 hover:text-forest"
            onClick={() => {
              setExpanded(false);
              document
                .getElementById("essays-recent")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Return to recent writing ↑
          </button>
        </p>
      )}
    </section>
  );
}
