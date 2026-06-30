"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { DiscoveryNode } from "@/components/discovery";
import { TextLink } from "@/components/design-system";
import {
  QuietDiscoveries,
  RecentObservations,
  RecordObservationForm,
  UnexpectedConnections,
} from "@/components/observatory";
import type { Theme } from "@/lib/content/types";
import type { ObservatorySignal, SiteTimelineEntry } from "@/lib/content";
import type {
  QuietDiscovery,
  UnexpectedConnection,
  VisitorObservation,
} from "@/lib/observatory/types";
import { formatDate } from "@/lib/utils";
import { IdeaStrata } from "./IdeaStrata";

const signalWhispers: Record<ObservatorySignal["kind"], string> = {
  essay: "Essay",
  "field-note": "Field note",
  observation: "Observation",
  pulse: "Inquiry pulse",
};

interface ObservatoryRoomProps {
  concepts: Theme[];
  recentObservations: VisitorObservation[];
  unexpectedConnections: UnexpectedConnection[];
  quietDiscoveries: QuietDiscovery[];
  signals: ObservatorySignal[];
  timeline: SiteTimelineEntry[];
}

export function ObservatoryRoom({
  concepts,
  recentObservations,
  unexpectedConnections,
  quietDiscoveries,
  signals,
  timeline,
}: ObservatoryRoomProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });

  return (
    <div ref={ref}>
      <section
        aria-labelledby="record-observation"
        className="border-b border-rule/35 pb-16"
      >
        <h2 id="record-observation" className="type-folio">
          Record an observation
        </h2>
        <p className="type-body mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-charcoal-muted">
          Add what you noticed to the shared investigation. Not an opinion to
          defend — an observation to place on the terrain.
        </p>
        <div className="mt-10 max-w-lg">
          <RecordObservationForm concepts={concepts} />
        </div>
      </section>

      <RecentObservations observations={recentObservations} />
      <UnexpectedConnections connections={unexpectedConnections} />
      <QuietDiscoveries discoveries={quietDiscoveries} />

      <section
        aria-labelledby="observatory-signals"
        className="mt-20 border-t border-rule/35 pt-16"
      >
        <h2 id="observatory-signals" className="type-folio">
          Signals across the terrain
        </h2>
        <p className="type-body mt-3 max-w-xl text-[0.9375rem] text-charcoal-muted">
          Writing, field notes, and pulses from the inquiry — traced as the
          terrain evolves.
        </p>

        <ul className="mt-12 space-y-0">
          {signals.map((signal, index) => (
            <motion.li
              key={signal.id}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{
                duration: 1.2,
                delay: index * 0.07,
                ease: [0.45, 0.05, 0.55, 0.95],
              }}
            >
              <DiscoveryNode
                id={signal.id}
                peers={signal.peerIds}
                as="article"
                className="relative border-b border-rule/40 py-8 sm:py-10"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="sm:max-w-xl">
                    <p className="type-folio">{signalWhispers[signal.kind]}</p>
                    <Link href={signal.href} className="group mt-2 block">
                      <h3 className="type-entry text-charcoal transition-colors duration-700 group-hover:text-forest">
                        {signal.title}
                      </h3>
                      <p className="type-body mt-3 text-[0.9375rem]">
                        {signal.excerpt}
                      </p>
                    </Link>
                  </div>
                  <time className="type-meta shrink-0">
                    {formatDate(signal.date)}
                  </time>
                </div>
              </DiscoveryNode>
            </motion.li>
          ))}
        </ul>
      </section>

      <IdeaStrata
        entries={timeline}
        className="mt-20 border-t border-rule/40 pt-16"
        subtitle="Ideas accumulate in layers — essays, notes, volumes, and milestones traced across time."
        compact
      />

      <div className="mt-16 border-t border-rule/35 pt-10">
        <TextLink href="/" className="text-sm">
          Return to the constellation →
        </TextLink>
      </div>
    </div>
  );
}
