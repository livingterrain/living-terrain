"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { ProjectTimelineEntry } from "@/lib/content/types";

interface ChamberStrataProps {
  timeline: ProjectTimelineEntry[];
}

export function ChamberStrata({ timeline }: ChamberStrataProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section ref={ref} aria-labelledby="chamber-strata">
      <h2 id="chamber-strata" className="type-folio">
        Strata — evolution of the project
      </h2>

      <div className="relative mt-10">
        {/* Geological spine */}
        <div
          className="absolute bottom-0 left-3 top-0 w-px bg-gradient-to-b from-transparent via-forest/25 to-transparent sm:left-4"
          aria-hidden="true"
        />

        <ol className="space-y-0">
          {timeline.map((entry, index) => (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
              transition={{
                duration: 1.2,
                delay: index * 0.1,
                ease: [0.45, 0.05, 0.55, 0.95],
              }}
              className="relative pl-10 sm:pl-12"
            >
              {/* Stratum node */}
              <span
                className="absolute left-1.5 top-2 h-3 w-3 rounded-full border border-forest/30 bg-ivory sm:left-2.5"
                aria-hidden="true"
              />

              <div className="border-b border-rule/30 py-8 sm:py-9">
                <time className="type-folio">{entry.date}</time>
                <h3 className="type-entry mt-2 text-charcoal">{entry.title}</h3>
                <p className="type-body mt-3 max-w-2xl text-[0.9375rem]">
                  {entry.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
