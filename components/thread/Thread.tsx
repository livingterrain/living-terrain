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
}: ThreadProps) {
  const view = resolveThread(nodeRef);
  if (!view || view.followLinks.length === 0) return null;

  return (
    <aside
      className={cn("mt-12 border-t border-rule/40 pt-10", className)}
      aria-label="Follow the thread"
    >
      <h2 className="type-folio text-charcoal-faint">Follow the Thread</h2>

      <ol className="mt-8 space-y-7">
        {view.followLinks.map((link) => (
          <li key={`${link.node.ref.kind}-${link.node.ref.id}`}>
            <ThreadLink
              href={link.node.href}
              external={link.node.external}
              title={link.node.title}
              rationale={link.rationale}
              quote={link.quote}
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
}: {
  href: string;
  external?: boolean;
  title: string;
  rationale: string;
  quote?: string;
}) {
  const classes = "group block transition-colors duration-700";

  const content = (
    <>
      <span className="font-heading text-lg text-charcoal transition-colors duration-700 group-hover:text-forest sm:text-xl">
        {title}
      </span>
      <span className="type-body mt-2 block text-[0.875rem] leading-relaxed text-charcoal-faint">
        ↳ {rationale}
      </span>
      {quote && (
        <span className="type-body mt-3 block border-l border-rule/50 pl-4 text-[0.8125rem] italic text-charcoal-faint/90">
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
