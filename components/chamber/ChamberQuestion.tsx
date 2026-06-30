"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ChamberQuestionProps {
  question: string;
}

export function ChamberQuestion({ question }: ChamberQuestionProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section ref={ref} aria-labelledby="chamber-question">
      <h2 id="chamber-question" className="type-folio">
        Central question
      </h2>

      <motion.blockquote
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.6, ease: [0.45, 0.05, 0.55, 0.95] }}
        className="relative mt-8 border-l-2 border-forest/25 pl-8 sm:pl-10"
      >
        {/* Quiet cross-section motif */}
        <svg
          className="pointer-events-none absolute -left-px top-0 h-full w-8 text-forest opacity-[0.06]"
          viewBox="0 0 32 120"
          fill="none"
          aria-hidden="true"
        >
          <path d="M16 0 V120" stroke="currentColor" strokeWidth="0.5" />
          <path d="M0 40 H32" stroke="currentColor" strokeWidth="0.5" />
          <path d="M0 80 H32" stroke="currentColor" strokeWidth="0.5" />
        </svg>

        <p className="type-lead max-w-2xl text-xl sm:text-2xl">{question}</p>
      </motion.blockquote>
    </section>
  );
}
