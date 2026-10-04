"use client";

import {
  SPIRAL_LENSES,
  SPIRAL_SEQUENCE,
  SPIRAL_STAGES,
  getSpiralStage,
  relationshipsForTrajectory,
  type SpiralLensId,
} from "@/lib/evolutionary-spiral";

const SHAPE_LABEL = {
  cyclical: "cyclical",
  directional: "directional",
  branching: "branching",
  recurrent: "recurrent",
  process: "process",
} as const;

const FUTURE_COMPARISONS = [
  "convergence",
  "repeated operations",
  "structural resemblance",
  "disagreement",
  "comparison breaks",
  "missing operations",
  "recurrence",
  "directional vs cyclical behavior",
  "scale differences",
  "evidence and epistemic differences",
] as const;

type Props = {
  onSelectLens: (lensId: SpiralLensId) => void;
};

/**
 * Across compares authored trajectories against the same reference Spiral.
 * Scaffold only: rows report what is authored; nothing is synthesized.
 */
export function SpiralAcrossScaffold({ onSelectLens }: Props) {
  const lenses = SPIRAL_LENSES.filter((l) => l.status !== "scaffold");
  return (
    <div className="spiral-across">
      <p className="spiral-across__lede">
        Across compares authored trajectories—not lens names—against the same
        reference Spiral. It becomes meaningful as trajectories are researched
        and authored.
      </p>

      <table className="spiral-across__table">
        <caption className="sr-only">
          Trajectories available for comparison
        </caption>
        <thead>
          <tr>
            <th scope="col">Lens</th>
            <th scope="col">Trajectory</th>
            <th scope="col">Authored relationships</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Reference</th>
            <td>
              The Evolutionary Spiral
              <span className="spiral-across__meta">
                {SPIRAL_STAGES.length} operations · {SPIRAL_SEQUENCE.length}{" "}
                occurrences
              </span>
            </td>
            <td className="spiral-across__muted">—</td>
          </tr>
          {lenses.flatMap((lens) =>
            lens.trajectories.length === 0
              ? [
                  <tr key={lens.id}>
                    <th scope="row">
                      <button
                        type="button"
                        className="spiral-across__lens"
                        onClick={() => onSelectLens(lens.id)}
                      >
                        {lens.label}
                      </button>
                    </th>
                    <td className="spiral-across__muted">
                      No trajectory authored yet
                    </td>
                    <td className="spiral-across__muted">—</td>
                  </tr>,
                ]
              : lens.trajectories.map((t) => {
                  const rels = relationshipsForTrajectory(t.id);
                  const ops = Array.from(
                    new Set(
                      rels.flatMap((r) =>
                        r.operations.map(
                          (ref) => getSpiralStage(ref.stageId)?.name ?? ref.stageId,
                        ),
                      ),
                    ),
                  );
                  return (
                    <tr key={t.id}>
                      <th scope="row">
                        <button
                          type="button"
                          className="spiral-across__lens"
                          onClick={() => onSelectLens(lens.id)}
                        >
                          {lens.label}
                        </button>
                      </th>
                      <td>
                        {t.title}
                        <span className="spiral-across__meta">
                          {SHAPE_LABEL[t.shape]} · {t.steps.length} steps
                        </span>
                      </td>
                      <td>
                        {rels.length}
                        {ops.length > 0 && (
                          <span className="spiral-across__meta">
                            at {ops.join(", ")}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                }),
          )}
        </tbody>
      </table>

      <div className="spiral-across__future">
        <p className="spiral-across__future-label">
          What Across will eventually compare
        </p>
        <p className="spiral-across__future-list">
          {FUTURE_COMPARISONS.join(" · ")}
        </p>
      </div>

      <p className="spiral-across__note">
        Nothing here is synthesized yet. Unfinished trajectories are not treated
        as evidence, and an operation with no authored relationship is not
        counted as agreement.
      </p>
    </div>
  );
}
