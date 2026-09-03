"use client";

/**
 * Atlas Branch — quiet peripheral lateral opening.
 * Distinct from PATH bonds (vertical) and SOURCE depth (evidence rail).
 */

import { getConcept } from "@/lib/atlas-v1/content";
import type { AtlasBranchOffer } from "@/lib/atlas/branches";
import { cn } from "@/lib/utils";

type Props = {
  branch: AtlasBranchOffer;
  terminal: boolean;
  onFollow: (branch: AtlasBranchOffer) => void;
  className?: string;
};

export function AtlasBranchCue({
  branch,
  terminal,
  onFollow,
  className,
}: Props) {
  const destination = getConcept(branch.toConceptId);

  return (
    <aside
      className={cn(
        "atlas-branch",
        terminal && "atlas-branch--terminal",
        className,
      )}
      aria-label={`Branch toward ${destination.name}`}
    >
      <div className="atlas-branch__geometry" aria-hidden>
        <span className="atlas-branch__stem" />
        <span className="atlas-branch__joint" />
        <span className="atlas-branch__arm" />
      </div>
      <div className="atlas-branch__body">
        <p className="atlas-branch__orient">Another direction opens</p>
        <p className="atlas-branch__copy">{branch.copy}</p>
        <button
          type="button"
          className="atlas-branch__dest"
          onClick={() => onFollow(branch)}
        >
          <span className="atlas-branch__dest-name">{destination.name}</span>
        </button>
      </div>
    </aside>
  );
}
