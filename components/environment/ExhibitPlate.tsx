"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { Question } from "@/lib/content/types";

interface ExhibitPlateProps {
  question: Question;
  index: number;
}

export function ExhibitPlate({ question, index }: ExhibitPlateProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const alignRight = index % 2 === 1;

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
      className={cn(
        "relative py-16 sm:py-20",
        alignRight ? "sm:ml-auto sm:max-w-xl" : "sm:max-w-xl",
      )}
    >
      <Link href={`/questions/${question.slug}`} className="group block">
        <div className="relative border border-rule/80 bg-ivory/50 px-8 py-10 shadow-[0_1px_0_0] shadow-rule/40 sm:px-10 sm:py-12">
          <span className="type-folio absolute -top-3 left-8 bg-ivory px-2">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="type-entry text-charcoal transition-colors duration-700 group-hover:text-forest">
            {question.title}
          </h3>
          {question.subtitle && (
            <p className="type-lead mt-3 text-base">{question.subtitle}</p>
          )}
          <p className="type-body mt-5 text-[0.9375rem]">{question.description}</p>
        </div>
      </Link>
    </motion.article>
  );
}
