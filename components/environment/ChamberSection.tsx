"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { StructureSection } from "@/lib/content/types";

interface ChamberSectionProps {
  section: StructureSection;
  index: number;
}

export function ChamberSection({ section, index }: ChamberSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: 1.4,
        delay: index * 0.08,
        ease: [0.45, 0.05, 0.55, 0.95],
      }}
    >
      <Link
        href={`/structure-beneath-reality/${section.slug}`}
        className="group block border-b border-rule/50 py-10 transition-colors duration-700 hover:border-forest/20 sm:py-12"
      >
        <span className="type-folio">{String(section.order).padStart(2, "0")}</span>
        <h2 className="type-entry mt-3 text-charcoal transition-colors duration-700 group-hover:text-forest">
          {section.title}
        </h2>
        <p className="type-body mt-4 max-w-2xl text-[0.9375rem]">{section.excerpt}</p>
      </Link>
    </motion.article>
  );
}
