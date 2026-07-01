"use client";

import { cn } from "@/lib/utils";

interface HeadingBloomProps {
  children: React.ReactNode;
  className?: string;
  bloomClassName?: string;
}

/** Faint volumetric light behind major headings — dawn observatory, not a spotlight. */
export function HeadingBloom({ children, className, bloomClassName }: HeadingBloomProps) {
  return (
    <span className={cn("relative inline-block", className)}>
      <span
        className={cn("threshold-heading-bloom pointer-events-none", bloomClassName)}
        aria-hidden
      />
      <span className="relative">{children}</span>
    </span>
  );
}
