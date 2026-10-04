"use client";

import { useMemo } from "react";
import {
  SPIRAL_LENSES,
  SPIRAL_SEQUENCE,
  SPIRAL_STAGES,
  TRAJECTORY_WHEEL,
  anchorStepIds,
  getSpiralStage,
  relationshipsForTrajectory,
  wheelNodes,
  wheelSegments,
  type SpiralLens,
  type SpiralLensId,
  type SpiralTrajectory,
  type SpiralTrajectoryRelationship,
} from "@/lib/evolutionary-spiral";
import { cn } from "@/lib/utils";

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
  showInvestigate: boolean;
  researchOpen: boolean;
  onResearchToggle: () => void;
  researchId: string;
};

function operationNames(rels: readonly SpiralTrajectoryRelationship[]): string[] {
  return Array.from(
    new Set(
      rels.flatMap((r) =>
        r.operations.map((ref) => getSpiralStage(ref.stageId)?.name ?? ref.stageId),
      ),
    ),
  );
}

/** Ring of steps; authored passages drawn — no labels, no Spiral alignment. */
function MiniWheel({
  trajectory,
  relationships,
}: {
  trajectory: SpiralTrajectory;
  relationships: readonly SpiralTrajectoryRelationship[];
}) {
  const nodes = useMemo(() => wheelNodes(trajectory.steps), [trajectory.steps]);
  const segments = useMemo(() => wheelSegments(nodes), [nodes]);
  const { cx, cy, r } = TRAJECTORY_WHEEL;
  return (
    <svg
      className="spiral-mini__svg"
      viewBox={`${cx - r - 14} ${cy - r - 14} ${(r + 14) * 2} ${(r + 14) * 2}`}
      aria-hidden
    >
      {segments.map((s) => (
        <path key={`${s.from}-${s.to}`} d={s.d} className="spiral-mini__seg" />
      ))}
      {relationships.flatMap((rel) => {
        const ids = anchorStepIds(trajectory, rel.anchor);
        return ids.slice(1).flatMap((to, i) => {
          const seg = segments.find((s) => s.from === ids[i] && s.to === to);
          return seg
            ? [
                <path
                  key={`${rel.id}-${seg.from}`}
                  d={seg.d}
                  className={cn("spiral-mini__rel", `spiral-rel--${rel.status}`)}
                  data-mini-rel={i === 0 ? rel.id : undefined}
                />,
              ]
            : [];
        });
      })}
      {nodes.map((n) => (
        <circle
          key={n.step.id}
          cx={n.x}
          cy={n.y}
          r={n.step.recurrence ? 2.6 : 3}
          className={cn(
            "spiral-mini__dot",
            n.step.recurrence && "spiral-mini__dot--recurrence",
          )}
        />
      ))}
    </svg>
  );
}

/** A line of steps — directional runs onward; process is one continuous body. */
function MiniPath({
  trajectory,
  relationships,
}: {
  trajectory: SpiralTrajectory;
  relationships: readonly SpiralTrajectoryRelationship[];
}) {
  const n = trajectory.steps.length;
  const gap = 10;
  const w = (n - 1) * gap + 24;
  const y = 12;
  const xFor = (i: number) => 6 + i * gap;
  const indexOf = (id: string) => trajectory.steps.findIndex((s) => s.id === id);
  const directional = trajectory.shape === "directional";
  return (
    <svg className="spiral-mini__svg spiral-mini__svg--path" viewBox={`0 0 ${w} 24`} aria-hidden>
      <path
        d={`M ${xFor(0)} ${y} L ${xFor(n - 1) + (directional ? 12 : 0)} ${y}`}
        className={cn("spiral-mini__seg", !directional && "spiral-mini__seg--process")}
      />
      {directional && (
        <path
          d={`M ${xFor(n - 1) + 9} ${y - 3} L ${xFor(n - 1) + 13} ${y} L ${xFor(n - 1) + 9} ${y + 3}`}
          className="spiral-mini__seg"
        />
      )}
      {relationships.map((rel) => {
        const ids = anchorStepIds(trajectory, rel.anchor);
        const a = indexOf(ids[0]!);
        const b = indexOf(ids[ids.length - 1]!);
        return (
          <path
            key={rel.id}
            d={`M ${xFor(a)} ${y} L ${xFor(b)} ${y}`}
            className={cn("spiral-mini__rel", `spiral-rel--${rel.status}`)}
            data-mini-rel={rel.id}
          />
        );
      })}
      {trajectory.steps.map((s, i) => (
        <circle
          key={s.id}
          cx={xFor(i)}
          cy={y}
          r={trajectory.shape === "process" ? 3.2 : 2.4}
          className="spiral-mini__dot"
        />
      ))}
    </svg>
  );
}

function AcrossTable({
  lenses,
  onSelectLens,
}: {
  lenses: readonly SpiralLens[];
  onSelectLens: (lensId: SpiralLensId) => void;
}) {
  return (
    <table className="spiral-across__table">
      <caption className="sr-only">Trajectories available for comparison</caption>
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
                  <td className="spiral-across__muted">No trajectory authored yet</td>
                  <td className="spiral-across__muted">—</td>
                </tr>,
              ]
            : lens.trajectories.map((t) => {
                const rels = relationshipsForTrajectory(t.id);
                const ops = operationNames(rels);
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
                        <span className="spiral-across__meta">at {ops.join(", ")}</span>
                      )}
                    </td>
                  </tr>
                );
              }),
        )}
      </tbody>
    </table>
  );
}

/**
 * Across at discovery depth: each mapped trajectory in its own shape, with only
 * its authored relationships marked. Nothing is synthesized; the table and the
 * future comparisons wait behind Investigate.
 */
export function SpiralAcrossScaffold({
  onSelectLens,
  showInvestigate,
  researchOpen,
  onResearchToggle,
  researchId,
}: Props) {
  const lenses = SPIRAL_LENSES.filter((l) => l.status !== "scaffold");
  const mapped = lenses.flatMap((lens) =>
    lens.trajectories.map((t) => ({
      lens,
      trajectory: t,
      relationships: relationshipsForTrajectory(t.id),
    })),
  );
  const ops = operationNames(mapped.flatMap((m) => m.relationships));
  const sentence =
    ops.length === 1
      ? `Different trajectories touch ${ops[0]} in different ways.`
      : "Different trajectories touch the Spiral in different ways.";

  return (
    <div className="spiral-across">
      <p className="spiral-across__lede">{sentence}</p>

      <ul className="spiral-mini">
        {mapped.map(({ lens, trajectory, relationships }) => {
          const touched = operationNames(relationships);
          return (
            <li key={trajectory.id} className="spiral-mini__item" data-trajectory={trajectory.id}>
              <button
                type="button"
                className="spiral-mini__btn"
                onClick={() => onSelectLens(lens.id)}
                aria-label={`${lens.label}: ${trajectory.title}, ${SHAPE_LABEL[trajectory.shape]}. ${
                  relationships.length
                } researched relationship${relationships.length === 1 ? "" : "s"}${
                  touched.length ? ` with ${touched.join(", ")}` : ""
                }. Open this comparison.`}
              >
                {trajectory.shape === "cyclical" ? (
                  <MiniWheel trajectory={trajectory} relationships={relationships} />
                ) : (
                  <MiniPath trajectory={trajectory} relationships={relationships} />
                )}
                <span className="spiral-mini__name">{lens.label}</span>
                <span className="spiral-mini__meta">
                  {SHAPE_LABEL[trajectory.shape]}
                  {touched.length > 0 && ` · ↔ ${touched.join(", ")}`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {showInvestigate && (
        <div className="spiral-lens-context__research">
          <button
            type="button"
            className="spiral-op__investigate-toggle"
            aria-expanded={researchOpen}
            aria-controls={researchId}
            onClick={onResearchToggle}
          >
            <span className="spiral-op__investigate-title">Investigate</span>
            <span className="spiral-op__investigate-lead">
              every lens · what Across will compare
            </span>
          </button>
          <div
            id={researchId}
            className="spiral-lens-context__research-body"
            hidden={!researchOpen}
          >
            {researchOpen && (
              <div className="spiral-trajectory__research">
                <p className="spiral-trajectory__research-body">
                  Across compares authored trajectories—not lens names—against
                  the same reference Spiral. It becomes meaningful as
                  trajectories are researched and authored.
                </p>
                <AcrossTable lenses={lenses} onSelectLens={onSelectLens} />
                <div className="spiral-across__future">
                  <p className="spiral-across__future-label">
                    What Across will eventually compare
                  </p>
                  <p className="spiral-across__future-list">
                    {FUTURE_COMPARISONS.join(" · ")}
                  </p>
                </div>
                <p className="spiral-across__note">
                  Nothing here is synthesized yet. Unfinished trajectories are
                  not treated as evidence, and an operation with no authored
                  relationship is not counted as agreement.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
