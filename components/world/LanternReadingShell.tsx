"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { NodeRef } from "@/lib/relationships";
import { Thread } from "@/components/thread";
import { CuriosityContinuation } from "@/components/world/CuriosityContinuation";
import { cn } from "@/lib/utils";

interface LanternReadingShellProps {
  collection: string;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  children: ReactNode;
  nodeRef?: NodeRef;
  returnHref: string;
  threadHref?: string;
  threadTitle?: string;
  /** Field desk vs library shelf */
  variant?: "library" | "notebook";
}

/**
 * A quiet reading room — lantern light, carved stone walls, one text.
 */
export function LanternReadingShell({
  collection,
  title,
  subtitle,
  meta,
  children,
  nodeRef,
  returnHref,
  threadHref,
  threadTitle,
  variant = "library",
}: LanternReadingShellProps) {
  return (
    <div
      className={cn(
        "world-lantern-reading relative min-h-[calc(100dvh-4.5rem)] sm:min-h-[calc(100dvh-5rem)]",
        variant === "notebook" && "world-lantern-reading--notebook",
      )}
    >
      <div className="world-lantern-reading__glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="world-lantern-reading__walls pointer-events-none absolute inset-0" aria-hidden />

      <article className="relative z-10 mx-auto max-w-[36rem] py-14 pl-[max(1.25rem,env(safe-area-inset-left,0px))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] sm:px-12 sm:py-24 lg:px-14">
        <header className="threshold-carved threshold-carved--edge pb-12">
          <p className="type-folio text-forest-faint">{collection}</p>
          <h1 className="mt-5 font-heading text-[1.75rem] leading-[1.15] text-charcoal sm:text-[2.125rem]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 font-heading text-lg italic leading-relaxed text-charcoal-muted">
              {subtitle}
            </p>
          )}
          {meta && (
            <div className="type-meta mt-5 text-charcoal-faint">{meta}</div>
          )}
        </header>

        <div className="type-body py-12 text-[0.9375rem] leading-[1.88] sm:text-base sm:leading-[1.92]">
          {children}
        </div>

        {nodeRef && (
          <div className="threshold-carved threshold-carved--edge pt-12">
            <Thread nodeRef={nodeRef} returnHref={returnHref} />
          </div>
        )}

        <nav
          className="threshold-carved threshold-carved--edge mt-16 space-y-4 pt-10"
          aria-label="Continue wandering"
        >
          {threadHref && threadTitle && (
            <Link
              href={threadHref}
              className="flex min-h-11 items-center text-[0.875rem] text-charcoal-muted transition-colors duration-[1200ms] hover:text-forest active:text-forest/80"
            >
              ↓ Continue thread: {threadTitle}
            </Link>
          )}
          <Link
            href={returnHref}
            className="flex min-h-11 items-center text-[0.875rem] text-charcoal-muted transition-colors duration-[1200ms] hover:text-forest active:text-forest/80"
          >
            ← Return to the shelf
          </Link>
        </nav>
      </article>

      <CuriosityContinuation />
    </div>
  );
}
