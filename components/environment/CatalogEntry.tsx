"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TextLink } from "@/components/design-system";
import { EssayRelationHints } from "@/components/reading/EssayRelations";
import type { Essay } from "@/lib/content/types";
import { getEssayReadUrl } from "@/lib/content";
import { formatDate } from "@/lib/utils";

interface CatalogEntryProps {
  essay: Essay;
  index: number;
}

export function CatalogEntry({ essay, index }: CatalogEntryProps) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: 1.2,
        delay: index * 0.06,
        ease: [0.45, 0.05, 0.55, 0.95],
      }}
      className="relative border-l border-rule pl-8 sm:pl-10"
    >
      <div className="absolute -left-px top-0 h-full w-px bg-forest/0 transition-colors duration-700 group-hover:bg-forest/40" />
      <article className="group py-10 sm:py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div className="sm:max-w-lg">
            <Link href={`/essays/${essay.slug}`} className="block">
              <h3 className="type-entry text-charcoal transition-colors duration-700 group-hover:text-forest">
                {essay.title}
              </h3>
              {essay.subtitle && (
                <p className="type-lead mt-2 text-base">{essay.subtitle}</p>
              )}
              <p className="type-body mt-4 text-[0.9375rem]">{essay.excerpt}</p>
            </Link>
            <EssayRelationHints essay={essay} />
          </div>
          <div className="flex shrink-0 flex-col sm:items-end sm:text-right">
            <p className="type-meta">{formatDate(essay.publishedAt)}</p>
            {essay.topics.length > 0 && (
              <p className="type-meta mt-3 text-forest-faint">
                {essay.topics.join(" · ")}
              </p>
            )}
            <TextLink href={getEssayReadUrl(essay)} external className="mt-5">
              Read on Medium
            </TextLink>
          </div>
        </div>
      </article>
    </motion.li>
  );
}
