"use client";

import { getSpiralStage, type SpiralSequenceStop } from "@/lib/evolutionary-spiral";
import { cn } from "@/lib/utils";

type Props = {
  sequence: readonly SpiralSequenceStop[];
  selectedId: string;
  onSelect: (occurrenceId: string) => void;
  /** Occurrences with local material under the active lens (quiet mark). */
  markedIds?: ReadonlySet<string>;
  lensLabel?: string;
};

/** Compact horizontal jump navigation — shares occurrenceId with helix + panel. */
export function SpiralStageRail({
  sequence,
  selectedId,
  onSelect,
  markedIds,
  lensLabel,
}: Props) {
  const hasMarks = Boolean(markedIds && markedIds.size > 0);
  return (
    <div className="spiral-rail" role="group" aria-labelledby="spiral-rail-label">
      <p className="spiral-rail__label" id="spiral-rail-label">
        Choose an operation
        {hasMarks && lensLabel ? (
          <span className="spiral-rail__key">
            <span className="spiral-rail__dot" aria-hidden="true" /> has{" "}
            {lensLabel} material
          </span>
        ) : null}
      </p>
      <div className="spiral-rail__track">
        {sequence.map((stop) => {
          const stage = getSpiralStage(stop.stageId);
          const label = stop.labelOverride ?? stage?.name ?? stop.stageId;
          const selected = stop.occurrenceId === selectedId;
          const marked = markedIds?.has(stop.occurrenceId) ?? false;
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
                marked && "spiral-rail__btn--marked",
              )}
              aria-pressed={selected}
              aria-label={`${String(stop.order).padStart(2, "0")} ${label}${
                marked && lensLabel ? ` — has ${lensLabel} material` : ""
              }`}
              onClick={() => onSelect(stop.occurrenceId)}
            >
              <span className="spiral-rail__n">
                {String(stop.order).padStart(2, "0")}
              </span>
              <span className="spiral-rail__name">{short}</span>
              {marked && <span className="spiral-rail__dot" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
