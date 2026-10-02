"use client";

import { getSpiralStage, type SpiralSequenceStop } from "@/lib/evolutionary-spiral";
import { cn } from "@/lib/utils";

type Props = {
  sequence: readonly SpiralSequenceStop[];
  selectedId: string;
  onSelect: (occurrenceId: string) => void;
};

/** Compact horizontal jump navigation — shares occurrenceId with helix + panel. */
export function SpiralStageRail({ sequence, selectedId, onSelect }: Props) {
  return (
    <div className="spiral-rail" role="group" aria-label="Spiral stages">
      <div className="spiral-rail__track">
        {sequence.map((stop) => {
          const stage = getSpiralStage(stop.stageId);
          const label = stop.labelOverride ?? stage?.name ?? stop.stageId;
          const selected = stop.occurrenceId === selectedId;
          const short =
            stop.cycleIndex > 0
              ? "Again"
              : (stage?.name ?? stop.stageId).slice(0, 4);

          return (
            <button
              key={stop.occurrenceId}
              type="button"
              className={cn(
                "spiral-rail__btn",
                selected && "spiral-rail__btn--selected",
              )}
              aria-pressed={selected}
              aria-label={`${String(stop.order).padStart(2, "0")} ${label}`}
              onClick={() => onSelect(stop.occurrenceId)}
            >
              <span className="spiral-rail__n">
                {String(stop.order).padStart(2, "0")}
              </span>
              <span className="spiral-rail__name">{short}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
