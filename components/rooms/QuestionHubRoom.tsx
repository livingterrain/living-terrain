"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { DiscoveryNode } from "@/components/discovery";
import { TextLink } from "@/components/design-system";
import type { QuestionHub } from "@/lib/content";

interface QuestionHubRoomProps {
  hub: QuestionHub;
}

export function QuestionHubRoom({ hub }: QuestionHubRoomProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  const { question, essays, books, fieldNotes, peerIds } = hub;

  const branches = [
  essays.length > 0 && {
      id: "branch-essays",
      label: "Essays along this path",
      kind: "continues" as const,
      items: essays.map((e) => ({
        id: e.id,
        href: `/essays/${e.slug}`,
        title: e.title,
        subtitle: e.excerpt.slice(0, 100) + (e.excerpt.length > 100 ? "…" : ""),
        peers: [e.id, ...e.questionIds, ...(e.relatedEssayIds ?? [])],
      })),
    },
    books.length > 0 && {
      id: "branch-books",
      label: "Volumes in the archive",
      kind: "explore" as const,
      items: books.map((b) => ({
        id: b.id,
        href: `/atlas/${b.slug}`,
        title: b.title,
        subtitle: b.subtitle,
        peers: [b.id, ...b.questionIds],
      })),
    },
    fieldNotes.length > 0 && {
      id: "branch-notes",
      label: "Field notes",
      kind: "connects" as const,
      items: fieldNotes.map((fn) => ({
        id: fn.id,
        href: `/field-notes/${fn.slug}`,
        title: fn.title ?? "Field observation",
        subtitle: fn.body.slice(0, 90) + (fn.body.length > 90 ? "…" : ""),
        peers: [fn.id, ...fn.questionIds],
      })),
    },
  ].filter(Boolean) as Array<{
    id: string;
    label: string;
    kind: "continues" | "explore" | "connects";
    items: Array<{
      id: string;
      href: string;
      title: string;
      subtitle?: string;
      peers: string[];
    }>;
  }>;

  return (
    <section ref={ref} className="relative">
      {/* Central hub */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.45, 0.05, 0.55, 0.95] }}
        className="relative mx-auto max-w-2xl text-center"
      >
        <DiscoveryNode
          id={question.id}
          peers={peerIds}
          className="mx-auto rounded-sm border border-forest/15 bg-ivory/50 px-8 py-10 sm:px-12 sm:py-14"
        >
          <p className="type-folio">Central inquiry</p>
          <h2 className="type-display mt-4 text-charcoal">{question.title}</h2>
          {question.subtitle && (
            <p className="type-lead mx-auto mt-4 max-w-lg text-base">
              {question.subtitle}
            </p>
          )}
          <p className="type-body mx-auto mt-6 max-w-xl text-[0.9375rem]">
            {question.description}
          </p>
        </DiscoveryNode>
      </motion.div>

      {/* Branches */}
      {branches.length > 0 ? (
        <div className="relative mx-auto mt-16 max-w-3xl">
          <div
            className="pointer-events-none absolute left-1/2 top-0 hidden h-16 w-px -translate-x-1/2 bg-gradient-to-b from-forest/20 to-transparent sm:block"
            aria-hidden="true"
          />

          <div className="grid gap-10 sm:gap-12">
            {branches.map((branch, branchIndex) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{
                  duration: 1.1,
                  delay: 0.15 + branchIndex * 0.1,
                  ease: [0.45, 0.05, 0.55, 0.95],
                }}
              >
                <p className="type-folio">{branch.label}</p>
                <ul className="mt-5 space-y-4">
                  {branch.items.map((item) => (
                    <li key={item.id}>
                      <DiscoveryNode
                        id={item.id}
                        peers={[...peerIds, ...item.peers]}
                        className="border border-rule/50 bg-ivory/35 px-6 py-5 sm:px-8 sm:py-6"
                      >
                        <Link href={item.href} className="group block">
                          <h3 className="font-heading text-lg text-charcoal transition-colors duration-700 group-hover:text-forest">
                            {item.title}
                          </h3>
                          {item.subtitle && (
                            <p className="type-body mt-2 text-[0.875rem] text-charcoal-faint">
                              {item.subtitle}
                            </p>
                          )}
                        </Link>
                      </DiscoveryNode>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <p className="type-body mt-16 text-center">
          Writing for this inquiry is forthcoming.
        </p>
      )}

      <div className="mt-16 border-t border-rule/40 pt-8">
        <TextLink href="/questions" className="type-body text-sm">
          ← Back among the paths
        </TextLink>
      </div>
    </section>
  );
}
