"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BotanicalSpecimen } from "./ObservatorySpecimens";

export interface TableLatestEntry {
  title: string;
  href: string;
  kind: "observation" | "field-note";
}

interface ObservatoryTableProps {
  latest?: TableLatestEntry;
}

const ease = [0.42, 0.03, 0.38, 0.96] as const;

/**
 * Zone 1 — The Observation Table.
 * The quiet centre of the room: an open notebook, pinned specimen sketches,
 * astronomical and geological studies. Standing evidence that someone is
 * actively paying attention. This also carries the moment of arrival.
 */
export function ObservatoryTable({ latest }: ObservatoryTableProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      className="obs-table-zone relative flex min-h-[100dvh] flex-col items-center justify-center pb-24 pt-28 text-center sm:pb-28 sm:pt-32"
      style={{
        paddingLeft: "max(1.25rem, env(safe-area-inset-left, 0px))",
        paddingRight: "max(1.25rem, env(safe-area-inset-right, 0px))",
      }}
    >
      <motion.p
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.8, ease }}
        className="obs-universe-chamber"
      >
        The Observatory
      </motion.p>

      <motion.p
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.6, delay: reduced ? 0 : 0.35, ease }}
        className="obs-universe-whisper mx-auto mt-6 max-w-sm text-[0.9375rem] leading-[1.8] sm:max-w-md"
      >
        The observation table. Nothing here is finished — the work is simply
        left open where it was set down.
      </motion.p>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 26, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 2.6, delay: reduced ? 0 : 0.7, ease }}
        className="obs-table relative mx-auto mt-16 w-full max-w-2xl sm:mt-20"
      >
        {/* An aged research table — the notebook lies open upon it */}
        <div className="obs-fx obs-fx--table obs-research-table mx-auto">
          <span className="obs-fx__legs" aria-hidden />
          <div className="obs-notebook obs-notebook--placed mx-auto max-w-md">
            <div className="obs-notebook__page obs-notebook__page--left hidden sm:flex">
              <BotanicalSpecimen className="obs-notebook__pressed h-full w-auto" />
              <span className="obs-notebook__caption">Specimen — undated</span>
            </div>

            <div className="obs-notebook__page obs-notebook__page--right">
              <p className="obs-notebook__heading">Field notebook · open</p>
              <div className="obs-notebook__lines">
                <p>Patterns emerge slowly.</p>
                <p>The investigation continues.</p>
                <p>Observations accumulate.</p>
                <p className="obs-notebook__aside">
                  Begin where something catches your attention.
                </p>
              </div>

              {latest ? (
                <Link href={latest.href} className="obs-notebook__latest group">
                  <span className="obs-notebook__latest-label">
                    Last set down
                  </span>
                  <span className="obs-notebook__latest-title">
                    {latest.title}
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.4, delay: reduced ? 0 : 1.7, ease }}
        className="obs-universe-arrival__scroll mt-16 sm:mt-20"
        aria-hidden
      >
        <span className="obs-universe-arrival__scroll-line" />
      </motion.div>
    </section>
  );
}
