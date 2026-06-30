"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { Question } from "@/lib/content/types";

interface ArchiveDrawerProps {
  question: Question;
  index: number;
  total: number;
}

export function ArchiveDrawer({ question, index, total }: ArchiveDrawerProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const opensLeft = index % 2 === 1;
  const slideFrom = opensLeft ? 16 : -16;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, x: slideFrom }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: slideFrom }}
      transition={{
        duration: 1.2,
        delay: index * 0.1,
        ease: [0.45, 0.05, 0.55, 0.95],
      }}
      className={cn(
        "relative",
        opensLeft
          ? "sm:pr-[calc(50%+1.75rem)] sm:text-right"
          : "sm:pl-[calc(50%+1.75rem)]",
      )}
    >
      {/* Spine node */}
      <span
        className={cn(
          "absolute top-8 z-20 flex h-7 w-7 items-center justify-center border border-rule/80 bg-ivory font-body text-[0.6875rem] tabular-nums text-forest-faint",
          "left-4 sm:left-1/2 sm:-translate-x-1/2",
        )}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <Link
        href={`/questions/${question.slug}`}
        className={cn(
          "group relative ml-14 block sm:ml-0",
          opensLeft ? "sm:ml-auto sm:max-w-md" : "sm:max-w-md",
        )}
      >
        <div
          className={cn(
            "home-drawer relative border border-rule/70 bg-ivory/50 px-7 py-8 transition-[border-color,background-color,transform,box-shadow] duration-700 sm:px-9 sm:py-10",
            "group-hover:border-forest/25 group-hover:bg-ivory/75",
            opensLeft
              ? "group-hover:translate-x-[-3px]"
              : "group-hover:translate-x-[3px]",
          )}
        >
          {/* Drawer pull — the tab reaching toward the spine */}
          <span
            className={cn(
              "absolute top-8 hidden h-px w-6 bg-rule/80 transition-colors duration-700 group-hover:bg-forest/30 sm:block",
              opensLeft ? "-right-6" : "-left-6",
            )}
            aria-hidden="true"
          />

          <h3 className="type-entry text-charcoal transition-colors duration-700 group-hover:text-forest">
            {question.title}
          </h3>
          {question.subtitle && (
            <p className="type-lead mt-2 text-[0.9375rem]">{question.subtitle}</p>
          )}
          <p className="type-body mt-4 text-[0.875rem] leading-[1.75]">
            {question.description}
          </p>
        </div>
      </Link>

      {/* Path hint between drawers */}
      {index < total - 1 && (
        <div
          className="pointer-events-none absolute left-4 top-full hidden h-16 w-px bg-gradient-to-b from-forest/15 to-transparent sm:left-1/2 sm:block sm:-translate-x-1/2"
          aria-hidden="true"
        />
      )}
    </motion.article>
  );
}
