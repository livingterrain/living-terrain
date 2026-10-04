"use client";

import { useId, useMemo } from "react";
import {
  TRAJECTORY_WHEEL,
  anchorStepIds,
  getSpiralStage,
  wheelHitStyle,
  wheelNodes,
  wheelSegments,
  type SpiralTrajectory,
  type SpiralTrajectoryRelationship,
} from "@/lib/evolutionary-spiral";
import { cn } from "@/lib/utils";

type Props = {
  trajectory: SpiralTrajectory;
  /** Every authored relationship for this trajectory. */
  relationships: readonly SpiralTrajectoryRelationship[];
  /** Relationships in the current focus (all of them when nothing is focused). */
  activeIds: ReadonlySet<string>;
  selectedStepId: string | null;
  onSelectStep: (stepId: string) => void;
  onSelectRelationship: (relationshipId: string) => void;
};

function operationNames(r: SpiralTrajectoryRelationship): string {
  return r.operations
    .map((ref) => getSpiralStage(ref.stageId)?.name ?? ref.stageId)
    .join(", ");
}

function relClass(r: SpiralTrajectoryRelationship, activeIds: ReadonlySet<string>) {
  return cn(
    `spiral-rel--${r.status}`,
    activeIds.has(r.id) ? "spiral-rel--active" : "spiral-rel--dormant",
  );
}

function stepAriaLabel(
  trajectory: SpiralTrajectory,
  index: number,
  related: readonly SpiralTrajectoryRelationship[],
): string {
  const step = trajectory.steps[index]!;
  const base = `${step.label}, ${index + 1} of ${trajectory.steps.length}`;
  if (related.length === 0) return `${base}. No researched relationship.`;
  return `${base}. Part of ${related.length} researched relationship${
    related.length === 1 ? "" : "s"
  } with ${Array.from(new Set(related.map(operationNames))).join(", ")}.`;
}

function useStepRelationships(
  trajectory: SpiralTrajectory,
  relationships: readonly SpiralTrajectoryRelationship[],
) {
  return useMemo(() => {
    const map = new Map<string, SpiralTrajectoryRelationship[]>();
    for (const r of relationships) {
      for (const id of anchorStepIds(trajectory, r.anchor)) {
        map.set(id, [...(map.get(id) ?? []), r]);
      }
    }
    return map;
  }, [trajectory, relationships]);
}

/** Space-separated relationship ids anchored at a step — read by the arc layer. */
function anchorAttr(related: readonly SpiralTrajectoryRelationship[] | undefined) {
  return related && related.length > 0
    ? related.map((r) => r.id).join(" ")
    : undefined;
}

/** Cyclical trajectory — a ring; a recurrence step returns inside it, not to the same place. */
function Wheel({
  trajectory,
  relationships,
  activeIds,
  selectedStepId,
  onSelectStep,
  onSelectRelationship,
}: Props) {
  const markerId = useId();
  const nodes = useMemo(() => wheelNodes(trajectory.steps), [trajectory.steps]);
  const segments = useMemo(() => wheelSegments(nodes), [nodes]);
  const byStep = useStepRelationships(trajectory, relationships);
  const segmentFor = (from: string, to: string) =>
    segments.find((s) => s.from === from && s.to === to);

  const overlays = relationships.flatMap((r) => {
    if (r.anchor.kind === "step") return [];
    const ids = anchorStepIds(trajectory, r.anchor);
    return ids.slice(1).flatMap((to, i) => {
      const seg = segmentFor(ids[i]!, to);
      return seg ? [{ key: `${r.id}-${seg.from}`, d: seg.d, r, first: i === 0 }] : [];
    });
  });

  return (
    <div className="spiral-wheel">
      <svg
        className="spiral-wheel__svg"
        viewBox={`0 0 ${TRAJECTORY_WHEEL.width} ${TRAJECTORY_WHEEL.height}`}
        aria-hidden
      >
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 6 6"
            refX="5"
            refY="3"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L6 3 L0 6 z" className="spiral-wheel__arrow" />
          </marker>
        </defs>
        {segments.map((s) => (
          <path
            key={`${s.from}-${s.to}`}
            d={s.d}
            className="spiral-wheel__seg"
            markerEnd={`url(#${markerId})`}
          />
        ))}
        {overlays.map((o) => (
          <g key={o.key}>
            <path
              d={o.d}
              className={cn("spiral-wheel__rel", relClass(o.r, activeIds))}
              data-rel-anchor={o.first ? o.r.id : undefined}
            />
            {/* Pointer equivalent of the anchor list in the local card */}
            <path
              d={o.d}
              className="spiral-wheel__rel-hit"
              onClick={() => onSelectRelationship(o.r.id)}
            />
          </g>
        ))}
        {nodes.map((n) => {
          const selected = n.step.id === selectedStepId;
          const stepAnchored = relationships.some(
            (r) => r.anchor.kind === "step" && r.anchor.stepId === n.step.id,
          );
          return (
            <g key={n.step.id}>
              {stepAnchored && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={5.5}
                  className="spiral-wheel__ring"
                  data-rel-anchor={anchorAttr(byStep.get(n.step.id))}
                />
              )}
              <circle
                cx={n.x}
                cy={n.y}
                r={selected ? 3.6 : 2.4}
                className={cn(
                  "spiral-wheel__dot",
                  selected && "spiral-wheel__dot--selected",
                  n.step.recurrence && "spiral-wheel__dot--recurrence",
                )}
              />
              <text
                x={n.labelX}
                y={n.labelY}
                textAnchor={n.anchor}
                className={cn(
                  "spiral-wheel__label",
                  selected && "spiral-wheel__label--selected",
                  n.step.recurrence && "spiral-wheel__label--recurrence",
                )}
              >
                {n.step.label}
              </text>
            </g>
          );
        })}
      </svg>
      <ol className="spiral-wheel__hits" aria-label={`${trajectory.title} — steps`}>
        {nodes.map((n) => {
          const selected = n.step.id === selectedStepId;
          const hx = n.step.recurrence ? n.x : (n.x + n.labelX) / 2;
          const hy = n.step.recurrence ? n.y + 4 : (n.y + n.labelY) / 2;
          return (
            <li key={n.step.id}>
              <button
                type="button"
                className={cn(
                  "spiral-wheel__hit",
                  selected && "spiral-wheel__hit--selected",
                )}
                style={wheelHitStyle(hx, hy)}
                aria-pressed={selected}
                aria-label={stepAriaLabel(
                  trajectory,
                  n.index,
                  byStep.get(n.step.id) ?? [],
                )}
                onClick={() => onSelectStep(n.step.id)}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Directional or process trajectory — read in order; directional runs onward. */
function Path({
  trajectory,
  relationships,
  activeIds,
  selectedStepId,
  onSelectStep,
}: Props) {
  const byStep = useStepRelationships(trajectory, relationships);
  const { steps, shape } = trajectory;
  return (
    <ol
      className={cn("spiral-path", `spiral-path--${shape}`)}
      aria-label={`${trajectory.title} — steps`}
    >
      {steps.map((step, index) => {
        const prev = steps[index - 1];
        const passage = prev
          ? relationships.find((r) => {
              const ids = anchorStepIds(trajectory, r.anchor);
              return (
                r.anchor.kind !== "step" &&
                ids.includes(prev.id) &&
                ids.includes(step.id)
              );
            })
          : undefined;
        const covering = byStep.get(step.id) ?? [];
        const span = covering.find((r) => r.anchor.kind === "span");
        const selected = step.id === selectedStepId;
        return (
          <li key={step.id} className="spiral-path__item">
            {index > 0 && (
              <span
                className={cn(
                  "spiral-path__link",
                  passage && "spiral-path__link--rel",
                  passage && relClass(passage, activeIds),
                )}
                aria-hidden="true"
              >
                {shape === "process" ? "" : "→"}
              </span>
            )}
            <button
              type="button"
              className={cn(
                "spiral-path__step",
                selected && "spiral-path__step--selected",
                span && "spiral-path__step--in-span",
                span && relClass(span, activeIds),
              )}
              data-rel-anchor={anchorAttr(covering)}
              aria-pressed={selected}
              aria-label={stepAriaLabel(trajectory, index, covering)}
              onClick={() => onSelectStep(step.id)}
            >
              {step.label}
            </button>
          </li>
        );
      })}
      {shape === "directional" && (
        <li className="spiral-path__onward" aria-hidden="true">
          →
        </li>
      )}
    </ol>
  );
}

/**
 * The whole trajectory, always. Authored relationships are marked on their
 * passages or spans; unresearched parts stay unconnected.
 */
export function SpiralTrajectoryFigure(props: Props) {
  return props.trajectory.shape === "cyclical" ? (
    <Wheel {...props} />
  ) : (
    <Path {...props} />
  );
}
