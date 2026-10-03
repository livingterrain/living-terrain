"use client";

import {
  getSpiralDomain,
  SPIRAL_LENS_ORDER,
  type SpiralExploreViewId,
  type SpiralStageExploration,
} from "@/lib/evolutionary-spiral";
import { cn } from "@/lib/utils";

type Props = {
  exploration: SpiralStageExploration;
  viewId: SpiralExploreViewId;
  onSelect: (viewId: SpiralExploreViewId) => void;
};

/**
 * Compact lens selector — sibling to stage selection.
 * Quiet “Viewed through” orientation: one stage, multiple lenses.
 * Does not alter occurrenceId / stage identity.
 */
export function SpiralLensRail({ exploration, viewId, onSelect }: Props) {
  const lenses = SPIRAL_LENS_ORDER.filter((id) =>
    exploration.lenses.some((l) => l.lensId === id),
  );

  return (
    <div className="spiral-lens-rail">
      <p className="spiral-lens-rail__orient" id="spiral-lens-orient">
        Viewed through
      </p>
      <div
        className="spiral-lens-rail__track"
        role="tablist"
        aria-labelledby="spiral-lens-orient"
      >
        {lenses.map((lensId) => {
          const domain = getSpiralDomain(lensId);
          const selected = viewId === lensId;
          return (
            <button
              key={lensId}
              type="button"
              role="tab"
              aria-selected={selected}
              className={cn(
                "spiral-lens-rail__btn",
                selected && "spiral-lens-rail__btn--selected",
              )}
              onClick={() => onSelect(lensId)}
            >
              {domain?.shortLabel ?? lensId}
            </button>
          );
        })}
        {exploration.across && (
          <button
            type="button"
            role="tab"
            aria-selected={viewId === "across"}
            className={cn(
              "spiral-lens-rail__btn",
              "spiral-lens-rail__btn--across",
              viewId === "across" && "spiral-lens-rail__btn--selected",
            )}
            onClick={() => onSelect("across")}
          >
            Across
          </button>
        )}
      </div>
    </div>
  );
}
