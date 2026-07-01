"use client";

import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { Essay, FieldNote } from "@/lib/content/types";
import type { GrowingIdea } from "@/lib/observatory/growing-ideas-data";
import { growingMaturityLabel } from "@/lib/observatory/growing-ideas-data";
import type { ObservatoryThread } from "@/lib/observatory/threads-data";
import { formatDate } from "@/lib/utils";
import { RecordObservationForm } from "./RecordObservationForm";
import {
  ObservatoryCollectionDivider,
} from "./ObservatoryShell";
import type { Theme } from "@/lib/content/types";

const ease = [0.45, 0.05, 0.55, 0.95] as const;

interface ObservatoryHubProps {
  essays: Essay[];
  fieldNotes: FieldNote[];
  threads: ObservatoryThread[];
  growingIdeas: GrowingIdea[];
  concepts: Theme[];
}

export function ObservatoryHub({
  essays,
  fieldNotes,
  threads,
  growingIdeas,
  concepts,
}: ObservatoryHubProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-4% 0px" });
  const reduced = useReducedMotion();

  const fade = (delay: number) =>
    reduced
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 6 },
          animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 },
          transition: { duration: 1.4, delay, ease },
        };

  return (
    <div ref={ref} className="mx-auto max-w-2xl px-7 pb-28 pt-16 sm:px-12 sm:pb-36 sm:pt-20 lg:px-14">
      {/* Essays */}
      <motion.section {...fade(0)} aria-labelledby="obs-essays">
        <ObservatoryCollectionDivider label="Essays" />
        <p
          id="obs-essays"
          className="mt-8 text-[0.8125rem] leading-relaxed text-[var(--obs-faint)]"
        >
          Long-form finished writing.
        </p>
        <ul className="mt-10 space-y-12">
          {essays.map((essay) => (
            <li key={essay.id}>
              <Link href={`/essays/${essay.slug}`} className="group block">
                <h3 className="font-heading text-xl text-[var(--obs-ivory)] transition-colors duration-700 group-hover:text-[var(--obs-amber)] sm:text-[1.375rem]">
                  {essay.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-[1.82] text-[var(--obs-muted)]">
                  {essay.excerpt}
                </p>
                <p className="mt-4 text-[0.6875rem] tracking-[0.08em] text-[var(--obs-faint)]">
                  {formatDate(essay.publishedAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Field Notes */}
      <motion.section {...fade(0.08)} className="mt-24" aria-labelledby="obs-notes">
        <ObservatoryCollectionDivider label="Field Notes" />
        <p
          id="obs-notes"
          className="mt-8 text-[0.8125rem] leading-relaxed text-[var(--obs-faint)]"
        >
          Short observations. Patterns. Questions. Fragments.
        </p>
        <ul className="mt-10 space-y-10">
          {fieldNotes.map((note) => (
            <li key={note.id}>
              <Link href={`/field-notes/${note.slug}`} className="group block">
                <h3 className="font-heading text-lg italic text-[var(--obs-ivory)] transition-colors duration-700 group-hover:text-[var(--obs-amber)]">
                  {note.title ?? "Untitled note"}
                </h3>
                <p className="mt-2 line-clamp-3 text-[0.9375rem] leading-[1.82] text-[var(--obs-muted)]">
                  {note.body}
                </p>
                <p className="mt-3 text-[0.6875rem] tracking-[0.08em] text-[var(--obs-faint)]">
                  {formatDate(note.publishedAt)}
                  {note.location ? ` · ${note.location}` : ""}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Threads */}
      <motion.section {...fade(0.12)} className="mt-24" aria-labelledby="obs-threads">
        <ObservatoryCollectionDivider label="Threads" />
        <p
          id="obs-threads"
          className="mt-8 text-[0.8125rem] leading-relaxed text-[var(--obs-faint)]"
        >
          Curated pathways — follow an investigation instead of reading in
          isolation.
        </p>
        <ul className="mt-12 space-y-16">
          {threads.map((thread) => (
            <li key={thread.id}>
              <Link
                href={`/observatory/threads/${thread.slug}`}
                className="group block"
              >
                <h3 className="font-heading text-xl text-[var(--obs-ivory)] transition-colors duration-700 group-hover:text-[var(--obs-amber)]">
                  {thread.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--obs-muted)]">
                  {thread.premise}
                </p>
                <ol className="mt-8 space-y-0">
                  {thread.steps.map((step) => (
                    <li key={step.slug} className="observatory-path-step py-1">
                      <span className="font-heading text-[0.9375rem] text-[var(--obs-ivory)]/75">
                        {step.title}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 text-[0.6875rem] tracking-[0.1em] text-[var(--obs-amber-dim)] transition-colors duration-700 group-hover:text-[var(--obs-amber)]">
                  Follow this thread →
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Growing Ideas */}
      <motion.section {...fade(0.16)} className="mt-24" aria-labelledby="obs-growing">
        <ObservatoryCollectionDivider label="Growing Ideas" />
        <p
          id="obs-growing"
          className="mt-8 text-[0.8125rem] leading-relaxed text-[var(--obs-faint)]"
        >
          Ideas still becoming — some are seeds, others almost ready to bloom.
        </p>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {growingIdeas.map((idea) => (
            <li key={idea.id}>
              <Link
                href={`/observatory/growing/${idea.slug}`}
                className="group flex h-full flex-col rounded-sm border border-[var(--obs-border)] bg-[var(--obs-elevated)]/60 px-5 py-6 transition-[border-color,background-color] duration-700 hover:border-[color-mix(in_srgb,var(--obs-amber)_28%,transparent)] hover:bg-[var(--obs-elevated)]"
              >
                <p className="text-[0.5625rem] uppercase tracking-[0.16em] text-[var(--obs-amber-dim)]">
                  {growingMaturityLabel(idea.maturity)}
                </p>
                <h3 className="mt-3 font-heading text-[1.0625rem] leading-snug text-[var(--obs-ivory)] transition-colors duration-700 group-hover:text-[var(--obs-amber)]">
                  {idea.title}
                </h3>
                {idea.body && (
                  <p className="mt-3 line-clamp-3 text-[0.8125rem] leading-relaxed text-[var(--obs-muted)]">
                    {idea.body}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Quiet observation — secondary, not social */}
      <motion.section
        {...fade(0.2)}
        className="mt-28 border-t border-[var(--obs-border)] pt-16"
        aria-labelledby="obs-record"
      >
        <h2
          id="obs-record"
          className="text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--obs-faint)]"
        >
          Place an observation
        </h2>
        <p className="mt-4 max-w-md text-[0.875rem] leading-relaxed text-[var(--obs-muted)]">
          Not a comment — an observation to add to the shared investigation.
        </p>
        <div className="observatory-form mt-10 max-w-lg">
          <RecordObservationForm concepts={concepts} />
        </div>
      </motion.section>

      <div className="mt-20 border-t border-[var(--obs-border)] pt-10">
        <Link
          href="/"
          className="text-[0.8125rem] text-[var(--obs-muted)] transition-colors duration-700 hover:text-[var(--obs-amber)]"
        >
          ← Return to the terrain
        </Link>
      </div>
    </div>
  );
}
