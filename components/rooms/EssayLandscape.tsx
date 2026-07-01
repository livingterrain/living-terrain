"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useBreakpoint } from "@/lib/atmosphere/use-breakpoint";
import { DiscoveryNode } from "@/components/discovery";
import { TextLink } from "@/components/design-system";
import { EssayRelationHints } from "@/components/reading/EssayRelations";
import type { EssayCluster } from "@/lib/content";
import { getEssayPeerIds, getEssayReadUrl } from "@/lib/content";
import { formatDate } from "@/lib/utils";

interface EssayLandscapeProps {
  clusters: EssayCluster[];
}

export function EssayLandscape({ clusters }: EssayLandscapeProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const { isMobile } = useBreakpoint();

  if (clusters.length === 0) {
    return (
      <p className="type-body mt-16 text-center text-[0.9375rem]">
        Discoveries will appear here as they connect to the terrain.
      </p>
    );
  }

  return (
    <section ref={ref} aria-label="Essay landscape">
      <p className="type-body max-w-xl text-[0.9375rem]">
        Essays are not arranged by date. They appear where the inquiry leads —
        clustered by the questions they extend.
      </p>

      <div className="mt-14 space-y-20">
        {clusters.map((cluster, clusterIndex) => (
          <motion.div
            key={cluster.question?.id ?? "unmapped"}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: 1.2,
              delay: clusterIndex * 0.1,
              ease: [0.45, 0.05, 0.55, 0.95],
            }}
          >
            <div className="threshold-carved threshold-carved--edge pt-10">
              {cluster.question ? (
                <Link
                  href={`/questions/${cluster.question.slug}`}
                  className="group inline-block"
                >
                  <p className="type-folio">Territory of inquiry</p>
                  <h2 className="type-entry mt-2 text-charcoal transition-colors duration-700 group-hover:text-forest">
                    {cluster.question.title}
                  </h2>
                </Link>
              ) : (
                <>
                  <p className="type-folio">Open ground</p>
                  <h2 className="type-entry mt-2 text-charcoal">
                    Unmapped discoveries
                  </h2>
                </>
              )}

              <ul className="mt-8 space-y-6">
                {cluster.essays.map((essay, essayIndex) => (
                  <motion.li
                    key={essay.id}
                    initial={{ opacity: 0, x: isMobile ? 0 : essayIndex % 2 === 0 ? -6 : 6 }}
                    animate={
                      inView
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: isMobile ? 0 : essayIndex % 2 === 0 ? -6 : 6 }
                    }
                    transition={{
                      duration: 1.1,
                      delay: clusterIndex * 0.08 + essayIndex * 0.06,
                      ease: [0.45, 0.05, 0.55, 0.95],
                    }}
                  >
                    <DiscoveryNode
                      id={essay.id}
                      peers={getEssayPeerIds(essay)}
                      as="article"
                      className="threshold-carved threshold-carved--edge px-0 py-8 sm:py-10"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">
                        <div className="sm:max-w-lg">
                          <Link href={`/essays/${essay.slug}`} className="terrain-list-link group block">
                            <h3 className="type-entry text-charcoal transition-colors duration-700 group-hover:text-forest">
                              {essay.title}
                            </h3>
                            {essay.subtitle && (
                              <p className="type-lead mt-2 text-base">
                                {essay.subtitle}
                              </p>
                            )}
                            <p className="type-body mt-4 text-[0.9375rem]">
                              {essay.excerpt}
                            </p>
                          </Link>
                          <EssayRelationHints essay={essay} />
                        </div>
                        <div className="flex shrink-0 flex-col sm:items-end sm:text-right">
                          <p className="type-meta">{formatDate(essay.publishedAt)}</p>
                          {essay.topics.length > 0 && (
                            <p className="type-meta mt-2 text-forest-faint">
                              {essay.topics.slice(0, 3).join(" · ")}
                            </p>
                          )}
                          <TextLink
                            href={getEssayReadUrl(essay)}
                            external
                            className="mt-4"
                          >
                            Read on Medium
                          </TextLink>
                        </div>
                      </div>
                    </DiscoveryNode>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
