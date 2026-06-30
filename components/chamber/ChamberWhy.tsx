"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ChamberWhyProps {
  text: string;
}

export function ChamberWhy({ text }: ChamberWhyProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section ref={ref} aria-labelledby="chamber-why">
      <h2 id="chamber-why" className="type-folio">
        Why this project exists
      </h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.6, ease: [0.45, 0.05, 0.55, 0.95] }}
        className="type-body mt-8 max-w-2xl sm:text-lg"
      >
        {text}
      </motion.p>
    </section>
  );
}
