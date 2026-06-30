"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { DiscoveryNode } from "@/components/discovery";
import type { SiteTimelineEntry } from "@/lib/content";
import { cn } from "@/lib/utils";

interface IdeaStrataProps {
  entries: SiteTimelineEntry[];
  title?: string;
  subtitle?: string;
  className?: string;
  compact?: boolean;
}

const kindWhispers: Record<SiteTimelineEntry["kind"], string> = {
  essay: "Essay",
  "field-note": "Field note",
  book: "Volume",
  project: "Project",
  milestone: "Milestone",
};

export function IdeaStrata({
  entries,
  title = "Strata — evolution of ideas",
  subtitle,
  className,
  compact = false,
}: IdeaStrataProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  if (entries.length === 0) return null;

  return (
    <section ref={ref} className={cn(className)} aria-labelledby="idea-strata">
      <h2 id="idea-strata" className="type-folio">
        {title}
      </h2>
      {subtitle && (
        <p className="type-body mt-3 max-w-xl text-[0.9375rem]">{subtitle}</p>
      )}

      <div className="relative mt-10">
        <div
          className="absolute bottom-0 left-3 top-0 w-px bg-gradient-to-b from-transparent via-forest/20 to-transparent sm:left-4"
          aria-hidden="true"
        />

        <ol className="space-y-0">
          {entries.map((entry, index) => (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, x: -6 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
              transition={{
                duration: 1.1,
                delay: index * 0.06,
                ease: [0.45, 0.05, 0.55, 0.95],
              }}
            >
              <DiscoveryNode
                id={entry.id}
                peers={entry.peerIds}
                as="article"
                className={cn(
                  "relative pl-10 sm:pl-12",
                  compact ? "py-5" : "py-7 sm:py-8",
                )}
              >
                <span
                  className="absolute left-1.5 top-3 h-2.5 w-2.5 rounded-full border border-forest/25 bg-ivory sm:left-2.5"
                  aria-hidden="true"
                />

                <div className="border-b border-rule/25 pb-6">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <time className="type-folio">{entry.date}</time>
                    <span className="type-chamber text-forest-faint">
                      {kindWhispers[entry.kind]}
                    </span>
                  </div>

                  {entry.href ? (
                    <Link href={entry.href} className="group mt-2 block">
                      <h3 className="type-entry text-charcoal transition-colors duration-700 group-hover:text-forest">
                        {entry.title}
                      </h3>
                      {!compact && (
                        <p className="type-body mt-2 max-w-2xl text-[0.9375rem]">
                          {entry.description}
                        </p>
                      )}
                    </Link>
                  ) : (
                    <>
                      <h3 className="type-entry mt-2 text-charcoal">
                        {entry.title}
                      </h3>
                      {!compact && (
                        <p className="type-body mt-2 max-w-2xl text-[0.9375rem]">
                          {entry.description}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </DiscoveryNode>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
