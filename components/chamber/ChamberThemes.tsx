"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { ProjectTheme } from "@/lib/content/types";

interface ChamberThemesProps {
  themes: ProjectTheme[];
}

export function ChamberThemes({ themes }: ChamberThemesProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section ref={ref} aria-labelledby="chamber-themes">
      <h2 id="chamber-themes" className="type-folio">
        Major themes
      </h2>
      <ul className="mt-8 space-y-0">
        {themes.map((theme, index) => (
          <motion.li
            key={theme.title}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: 1.2,
              delay: index * 0.06,
              ease: [0.45, 0.05, 0.55, 0.95],
            }}
            className="group border-b border-rule/40 py-7 transition-colors duration-700 hover:border-forest/15 sm:py-8"
          >
            <h3 className="type-entry text-charcoal transition-colors duration-700 group-hover:text-forest">
              {theme.title}
            </h3>
            <p className="type-body mt-2 max-w-2xl text-[0.9375rem]">
              {theme.description}
            </p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
