import Link from "next/link";
import type { ReactNode } from "react";
import type { NodeRef } from "@/lib/relationships";
import { Thread } from "@/components/thread";
import { cn } from "@/lib/utils";

interface ObservatoryReadingShellProps {
  collection: "Essay" | "Field Note" | "Thread" | "Growing Idea" | "Recorded observation";
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  children: ReactNode;
  nodeRef?: NodeRef;
  returnHref: string;
  threadHref?: string;
  threadTitle?: string;
}

export function ObservatoryReadingShell({
  collection,
  title,
  subtitle,
  meta,
  children,
  nodeRef,
  returnHref,
  threadHref,
  threadTitle,
}: ObservatoryReadingShellProps) {
  return (
    <div className="observatory-realm relative min-h-[calc(100dvh-4.5rem)] sm:min-h-[calc(100dvh-5rem)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, #c4a06a 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <article className="relative z-10 mx-auto max-w-[36rem] px-7 py-16 sm:px-12 sm:py-24 lg:px-14">
        <header className="border-b border-[var(--obs-border)] pb-12">
          <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-[var(--obs-amber-dim)]">
            {collection}
          </p>
          <h1 className="mt-5 font-heading text-[1.75rem] leading-[1.15] text-[var(--obs-ivory)] sm:text-[2.125rem]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 font-heading text-lg italic leading-relaxed text-[var(--obs-muted)]">
              {subtitle}
            </p>
          )}
          {meta && (
            <div className="mt-5 text-[0.8125rem] text-[var(--obs-faint)]">{meta}</div>
          )}
        </header>

        <div className="observatory-prose py-12">{children}</div>

        {nodeRef && (
          <div className="observatory-thread border-t border-[var(--obs-border)] pt-12">
            <Thread
              nodeRef={nodeRef}
              returnHref={returnHref}
              variant="observatory"
            />
          </div>
        )}

        <nav
          className="mt-16 space-y-4 border-t border-[var(--obs-border)] pt-10"
          aria-label="Continue wandering"
        >
          {threadHref && threadTitle && (
            <Link
              href={threadHref}
              className="block text-[0.875rem] text-[var(--obs-muted)] transition-colors duration-700 hover:text-[var(--obs-amber)]"
            >
              ↓ Continue thread: {threadTitle}
            </Link>
          )}
          <Link
            href="/observatory"
            className="block text-[0.875rem] text-[var(--obs-muted)] transition-colors duration-700 hover:text-[var(--obs-amber)]"
          >
            ↓ Return to the Observatory
          </Link>
          <Link
            href="/"
            className={cn(
              "block text-[0.875rem] text-[var(--obs-faint)] transition-colors duration-700 hover:text-[var(--obs-muted)]",
            )}
          >
            ↓ Back to the terrain
          </Link>
        </nav>
      </article>
    </div>
  );
}
