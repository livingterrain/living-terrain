"use client";

import { useId, useState } from "react";
import {
  SPIRAL_DEFAULT_OCCURRENCE_ID,
  SPIRAL_SEQUENCE,
  getSpiralStage,
} from "@/lib/evolutionary-spiral";
import { SpiralHelix } from "./SpiralHelix";
import { SpiralStagePanel } from "./SpiralStagePanel";
import { SpiralStageRail } from "./SpiralStageRail";

/**
 * Client island: helix + rail + panel share one occurrenceId.
 * Default selection = Emergence¹ so the figure teaches immediately.
 */
export function SpiralHelixExperience() {
  const panelId = useId();
  const [selectedId, setSelectedId] = useState(SPIRAL_DEFAULT_OCCURRENCE_ID);
  const selected =
    SPIRAL_SEQUENCE.find((s) => s.occurrenceId === selectedId) ??
    SPIRAL_SEQUENCE[0]!;
  const stage = getSpiralStage(selected.stageId);

  return (
    <section
      className="spiral-experience"
      aria-label="Evolutionary Spiral instrument"
    >
      <header className="spiral-experience__head">
        <h2 className="spiral-page__section-title">The instrument</h2>
        <p className="spiral-page__section-lead">
          Two currents wind through one developmental process. Select a stage to
          see the local state of the whole — not a part where one current takes
          over.
        </p>
      </header>

      <SpiralStageRail
        sequence={SPIRAL_SEQUENCE}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <div className="spiral-experience__stage">
        <SpiralHelix
          sequence={SPIRAL_SEQUENCE}
          selectedId={selectedId}
          onSelect={setSelectedId}
          panelId={panelId}
        />
        <SpiralStagePanel stop={selected} panelId={panelId} />
      </div>

      <p className="spiral-experience__selected-sr sr-only">
        Selected: {selected.labelOverride ?? stage?.name}.{" "}
        {stage?.whisper}
      </p>
    </section>
  );
}
