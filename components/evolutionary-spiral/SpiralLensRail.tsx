"use client";

import { SPIRAL_LENSES, type SpiralLensId } from "@/lib/evolutionary-spiral";
import { cn } from "@/lib/utils";

type Props = {
  activeLensId: SpiralLensId | null;
  onSelect: (lensId: SpiralLensId | null) => void;
};

/**
 * Whole-instrument lens control. Scoped to the entire helix, never to the
 * selected operation. Mapped lenses carry a filled mark, uncharted lenses an
 * open one; Across keeps its dashed edge.
 */
export function SpiralLensRail({ activeLensId, onSelect }: Props) {
  return (
    <div id="spiral-lenses" className="spiral-lens-rail" tabIndex={-1}>
      <p className="spiral-lens-rail__orient" id="spiral-lens-orient">
        Explore the pattern through
      </p>
      <div
        className="spiral-lens-rail__track"
        role="group"
        aria-labelledby="spiral-lens-orient"
      >
        <button
          type="button"
          aria-pressed={activeLensId === null}
          className={cn(
            "spiral-lens-rail__btn spiral-lens-rail__btn--spiral",
            activeLensId === null && "spiral-lens-rail__btn--selected",
          )}
          onClick={() => onSelect(null)}
        >
          Spiral
          <span className="sr-only">, no comparison</span>
        </button>
        {SPIRAL_LENSES.map((lens) => {
          const selected = activeLensId === lens.id;
          const scaffold = lens.status === "scaffold";
          const charted = lens.trajectories.length > 0;
          return (
            <button
              key={lens.id}
              type="button"
              aria-pressed={selected}
              data-lens-state={scaffold ? "across" : charted ? "charted" : "uncharted"}
              className={cn(
                "spiral-lens-rail__btn",
                scaffold && "spiral-lens-rail__btn--scaffold",
                !scaffold && !charted && "spiral-lens-rail__btn--uncharted",
                selected && "spiral-lens-rail__btn--selected",
              )}
              onClick={() => onSelect(selected ? null : lens.id)}
            >
              {!scaffold && (
                <span
                  className={cn(
                    "spiral-lens-rail__mark",
                    charted && "spiral-lens-rail__mark--charted",
                  )}
                  aria-hidden="true"
                />
              )}
              {lens.label}
              {!scaffold && !charted && (
                <span className="sr-only">, not yet charted</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
