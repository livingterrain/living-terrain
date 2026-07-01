"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { DiscoveryNode } from "@/components/discovery";
import type { QuestionHub } from "@/lib/content";
import { cn } from "@/lib/utils";

interface QuestionsConstellationProps {
  hubs: QuestionHub[];
}

export function QuestionsConstellation({ hubs }: QuestionsConstellationProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });

  return (
    <section ref={ref} aria-label="Question constellation" className="relative">
      <div
        className="pointer-events-none absolute inset-x-0 top-32 mx-auto hidden h-[calc(100%-8rem)] max-w-3xl sm:block"
        aria-hidden="true"
      >
        <div className="absolute bottom-24 left-1/2 top-12 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-forest/15 to-transparent" />
      </div>

      <ol className="relative mx-auto max-w-3xl space-y-0">
        {hubs.map((hub, index) => (
          <QuestionHubPlate
            key={hub.question.id}
            hub={hub}
            index={index}
            inView={inView}
          />
        ))}
      </ol>
    </section>
  );
}

function QuestionHubPlate({
  hub,
  index,
  inView,
}: {
  hub: QuestionHub;
  index: number;
  inView: boolean;
}) {
  const alignRight = index % 2 === 1;
  const { question, essays, books, fieldNotes, peerIds } = hub;
  const threadCount = essays.length + books.length + fieldNotes.length;

  return (
    <motion.li
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: 1.3,
        delay: index * 0.1,
        ease: [0.45, 0.05, 0.55, 0.95],
      }}
      className={cn(
        "relative py-10 sm:py-14",
        alignRight ? "sm:ml-auto sm:max-w-xl" : "sm:max-w-xl",
      )}
    >
      <DiscoveryNode id={question.id} peers={peerIds} as="article">
        <Link href={`/questions/${question.slug}`} className="terrain-list-link group block">
          <div className="relative border border-rule/70 bg-ivory/45 px-6 py-8 transition-colors duration-700 group-hover:border-forest/20 group-hover:bg-ivory/65 sm:px-10 sm:py-12">
            <span className="type-folio absolute -top-3 left-6 bg-ivory px-2 sm:left-8">
              Hub {String(index + 1).padStart(2, "0")}
            </span>

            <h3 className="type-entry text-charcoal transition-colors duration-700 group-hover:text-forest">
              {question.title}
            </h3>
            {question.subtitle && (
              <p className="type-lead mt-3 text-base">{question.subtitle}</p>
            )}
            <p className="type-body mt-5 text-[0.9375rem]">
              {question.description}
            </p>

            {threadCount > 0 && (
              <div className="mt-8 border-t border-rule/40 pt-6">
                <p className="type-folio">Threads opening from here</p>
                <ul className="mt-4 space-y-2">
                  {essays.slice(0, 2).map((e) => (
                    <li
                      key={e.id}
                      className="type-body text-[0.8125rem] text-charcoal-muted"
                    >
                      <span className="text-forest-faint">Essay · </span>
                      {e.title}
                    </li>
                  ))}
                  {books.map((b) => (
                    <li
                      key={b.id}
                      className="type-body text-[0.8125rem] text-charcoal-muted"
                    >
                      <span className="text-forest-faint">Volume · </span>
                      {b.title}
                    </li>
                  ))}
                  {fieldNotes.slice(0, 1).map((fn) => (
                    <li
                      key={fn.id}
                      className="type-body text-[0.8125rem] text-charcoal-muted"
                    >
                      <span className="text-forest-faint">Note · </span>
                      {fn.title ?? "Field observation"}
                    </li>
                  ))}
                  {threadCount > 4 && (
                    <li className="type-meta">
                      + {threadCount - 4} more paths
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </Link>
      </DiscoveryNode>
    </motion.li>
  );
}
