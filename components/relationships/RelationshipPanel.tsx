import Link from "next/link";
import { resolveRelationships } from "@/lib/relationships";
import type { NodeRef } from "@/lib/relationships";
import { cn } from "@/lib/utils";

interface RelationshipPanelProps {
  nodeRef: NodeRef;
  className?: string;
}

/**
 * The relationship layer — roots, pathways, threads, echoes.
 * Reveals what already exists beneath every piece of content.
 */
export function RelationshipPanel({ nodeRef, className }: RelationshipPanelProps) {
  const bundle = resolveRelationships(nodeRef);

  if (bundle.groups.length === 0) return null;

  return (
    <aside
      className={cn("mt-12 border-t border-rule/40 pt-10", className)}
      aria-label={bundle.heading}
    >
      <h2 className="type-folio">{bundle.heading}…</h2>

      {bundle.origin.themes.length > 0 && (
        <p className="type-meta mt-4 text-forest-faint">
          {bundle.origin.themes.slice(0, 6).join(" · ")}
        </p>
      )}

      <div className="mt-8 space-y-0">
        {bundle.groups.map((group) => (
          <section
            key={group.id}
            className="border-t border-rule/30 py-8 first:border-t-0 first:pt-0"
          >
            <p className="type-chamber text-charcoal-faint">{group.phrase}</p>
            <ul className="mt-4 space-y-4">
              {group.nodes.map((node) => (
                <li key={`${node.ref.kind}-${node.ref.id}`}>
                  <RelationLink node={node} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  );
}

function RelationLink({
  node,
}: {
  node: {
    href: string;
    external?: boolean;
    title: string;
    subtitle?: string;
    excerpt?: string;
    ref: NodeRef;
  };
}) {
  const classes =
    "group block transition-colors duration-700 hover:text-forest";

  const content = (
    <>
      <span className="font-heading text-lg text-charcoal transition-colors duration-700 group-hover:text-forest">
        {node.title}
      </span>
      {(node.subtitle ?? node.excerpt) && (
        <span className="type-body mt-1 block text-[0.875rem] text-charcoal-faint line-clamp-2">
          {node.subtitle ?? node.excerpt}
        </span>
      )}
    </>
  );

  if (node.external) {
    return (
      <a
        href={node.href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={node.href} className={classes}>
      {content}
    </Link>
  );
}
