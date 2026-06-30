"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { WhereToBeginEntry } from "@/lib/content/types";

function isExternal(href: string) {
  return href.startsWith("http");
}

interface ChamberBeginProps {
  entries: WhereToBeginEntry[];
}

export function ChamberBegin({ entries }: ChamberBeginProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section ref={ref} aria-labelledby="chamber-begin">
      <h2 id="chamber-begin" className="type-folio">
        Where should I begin?
      </h2>
      <p className="type-body mt-4 max-w-xl text-[0.9375rem]">
        New to this inquiry? These entry points offer different depths of
        immersion.
      </p>

      <ul className="mt-10 space-y-4">
        {entries.map((entry, index) => (
          <motion.li
            key={entry.id}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: 1.2,
              delay: index * 0.08,
              ease: [0.45, 0.05, 0.55, 0.95],
            }}
          >
            <BeginCard entry={entry} />
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

function BeginCard({ entry }: { entry: WhereToBeginEntry }) {
  const className =
    "group block border border-rule/60 bg-ivory/40 px-7 py-8 transition-[border-color,background-color,transform] duration-700 hover:border-forest/25 hover:bg-ivory/70 hover:translate-x-[2px] sm:px-9 sm:py-9";

  const content = (
    <>
      <h3 className="type-entry text-charcoal transition-colors duration-700 group-hover:text-forest">
        {entry.title}
      </h3>
      <p className="type-body mt-3 text-[0.9375rem]">{entry.description}</p>
    </>
  );

  if (isExternal(entry.href)) {
    return (
      <a
        href={entry.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={entry.href} className={className}>
      {content}
    </Link>
  );
}
