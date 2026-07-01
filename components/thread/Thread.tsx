import Link from "next/link";
import { resolveThread } from "@/lib/relationships";
import type { NodeRef } from "@/lib/relationships";
import { cn } from "@/lib/utils";
import { ThreadTrace } from "./ThreadTrace";

interface ThreadProps {
  nodeRef: NodeRef;
  returnHref: string;
  returnLabel?: string;
  className?: string;
  variant?: "light" | "observatory";
}

/**
 * Follow the Thread — curated connections that explain why they exist.
 * One relationship engine; every page participates the same way.
 */
export function Thread({
  nodeRef,
  returnHref,
  returnLabel,
  className,
  variant = "light",
}: ThreadProps) {
  const view = resolveThread(nodeRef);
  if (!view || view.followLinks.length === 0) return null;

  const dark = variant === "observatory";

  return (
    <aside
      className={cn(
        "mt-12 border-t pt-10",
        dark ? "border-[var(--obs-border)]" : "border-rule/40",
        className,
      )}
      aria-label="Follow the thread"
    >
      <h2
        className={cn(
          "type-folio",
          dark ? "text-[var(--obs-amber-dim)]" : "text-charcoal-faint",
        )}
      >
        Follow the Thread
      </h2>

      <ol className="mt-8 space-y-7">
        {view.followLinks.map((link) => (
          <li key={`${link.node.ref.kind}-${link.node.ref.id}`}>
            <ThreadLink
              href={link.node.href}
              external={link.node.external}
              title={link.node.title}
              rationale={link.rationale}
              quote={link.quote}
              dark={dark}
            />
          </li>
        ))}
      </ol>

      <ThreadTrace
        nodeRef={nodeRef}
        returnHref={returnHref}
        returnLabel={returnLabel}
      />
    </aside>
  );
}

function ThreadLink({
  href,
  external,
  title,
  rationale,
  quote,
  dark = false,
}: {
  href: string;
  external?: boolean;
  title: string;
  rationale: string;
  quote?: string;
  dark?: boolean;
}) {
  const classes = "group block transition-colors duration-700";

  const content = (
    <>
      <span
        className={cn(
          "font-heading text-lg transition-colors duration-700 sm:text-xl",
          dark
            ? "text-[var(--obs-ivory)] group-hover:text-[var(--obs-amber)]"
            : "text-charcoal group-hover:text-forest",
        )}
      >
        {title}
      </span>
      <span
        className={cn(
          "type-body mt-2 block text-[0.875rem] leading-relaxed",
          dark ? "text-[var(--obs-muted)]" : "text-charcoal-faint",
        )}
      >
        ↳ {rationale}
      </span>
      {quote && (
        <span
          className={cn(
            "type-body mt-3 block border-l pl-4 text-[0.8125rem] italic",
            dark
              ? "border-[var(--obs-border)] text-[var(--obs-faint)]"
              : "border-rule/50 text-charcoal-faint/90",
          )}
        >
          {quote}
        </span>
      )}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
