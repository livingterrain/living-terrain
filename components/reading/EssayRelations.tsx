import { RelationshipPanel } from "@/components/relationships";
import { resolveRelationships, refFromEssay } from "@/lib/relationships";
import type { Essay } from "@/lib/content/types";

interface EssayRelationsProps {
  essay: Essay;
  className?: string;
}

/** @deprecated Use RelationshipPanel directly */
export function EssayRelations({ essay, className }: EssayRelationsProps) {
  return <RelationshipPanel nodeRef={refFromEssay(essay)} className={className} />;
}

/** Inline relation hints for catalog cards */
export function EssayRelationHints({ essay }: { essay: Essay }) {
  const bundle = resolveRelationships(refFromEssay(essay));
  const pathways = bundle.groups.find((g) => g.kind === "pathway");
  const chamber = bundle.groups.find((g) => g.kind === "chamber");

  if (!pathways?.nodes.length && !chamber?.nodes.length) return null;

  return (
    <div className="mt-5 space-y-2 border-t border-rule/30 pt-5">
      {pathways && pathways.nodes.length > 0 && (
        <p className="type-meta">
          <span className="text-charcoal-faint">Neighboring paths · </span>
          {pathways.nodes.map((n) => n.title).join(" · ")}
        </p>
      )}
      {chamber && chamber.nodes.length > 0 && (
        <p className="type-meta">
          <span className="text-charcoal-faint">Chamber · </span>
          {chamber.nodes[0].title}
        </p>
      )}
    </div>
  );
}
