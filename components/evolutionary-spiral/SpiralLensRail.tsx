"use client";

import { SPIRAL_LENSES, type SpiralLensId } from "@/lib/evolutionary-spiral";
import { cn } from "@/lib/utils";

type Props = {
  activeLensId: SpiralLensId | null;
  onSelect: (lensId: SpiralLensId | null) => void;
};

/**
 * Whole-instrument lens control — "View through".
 * Scoped to the entire helix, never to the selected operation.
 * Selecting a lens does not alter occurrenceId; selecting an operation
 * does not alter the lens.
 */
export function SpiralLensRail({ activeLensId, onSelect }: Props) {
  return (
    <div id="spiral-lenses" className="spiral-lens-rail" tabIndex={-1}>
      <p className="spiral-lens-rail__orient" id="spiral-lens-orient">
        View the whole Spiral through
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
        </button>
        {SPIRAL_LENSES.map((lens) => {
          const selected = activeLensId === lens.id;
          return (
            <button
              key={lens.id}
              type="button"
              aria-pressed={selected}
              className={cn(
                "spiral-lens-rail__btn",
                lens.status === "scaffold" && "spiral-lens-rail__btn--scaffold",
                selected && "spiral-lens-rail__btn--selected",
              )}
              onClick={() => onSelect(selected ? null : lens.id)}
            >
              {lens.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
