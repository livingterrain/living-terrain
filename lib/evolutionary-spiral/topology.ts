import type {
  SpiralTrajectory,
  SpiralTrajectoryAnchor,
  SpiralTrajectoryEdge,
  SpiralTrajectoryShape,
} from "./types";

/**
 * Trajectory topology — what happens inside a domain process.
 *
 * Edges here are never Spiral comparisons. No function in this module reads
 * relationships, operations, or geometry.
 */

/**
 * Shapes whose topology cannot be read from step order. Only these may let a
 * step lead to more than one next step, and they must declare transitions.
 */
export const EXPLICIT_TOPOLOGY_SHAPES: ReadonlySet<SpiralTrajectoryShape> = new Set([
  "branching",
  "recurrent",
]);

export type SpiralTopologySource = "explicit" | "ordered";

/** Declared transitions are authoritative; otherwise steps are read in order. */
export function topologySource(trajectory: SpiralTrajectory): SpiralTopologySource {
  return trajectory.transitions ? "explicit" : "ordered";
}

/** Consecutive steps, in order, with no closing edge. */
export function orderedEdges(trajectory: SpiralTrajectory): SpiralTrajectoryEdge[] {
  return trajectory.steps.slice(1).map((to, i) => {
    const from = trajectory.steps[i]!;
    return { id: `ordered:${from.id}->${to.id}`, from: from.id, to: to.id };
  });
}

/** Every edge of the trajectory. Explicit topology never gains adjacency edges. */
export function trajectoryEdges(
  trajectory: SpiralTrajectory,
): readonly SpiralTrajectoryEdge[] {
  return trajectory.transitions ?? orderedEdges(trajectory);
}

export function findEdge(
  trajectory: SpiralTrajectory,
  from: string,
  to: string,
): SpiralTrajectoryEdge | undefined {
  return trajectoryEdges(trajectory).find((e) => e.from === from && e.to === to);
}

export function outgoingEdges(
  trajectory: SpiralTrajectory,
  stepId: string,
): SpiralTrajectoryEdge[] {
  return trajectoryEdges(trajectory).filter((e) => e.from === stepId);
}

export function incomingEdges(
  trajectory: SpiralTrajectory,
  stepId: string,
): SpiralTrajectoryEdge[] {
  return trajectoryEdges(trajectory).filter((e) => e.to === stepId);
}

/**
 * Steps with no outgoing edge. Structural only: whether the process ends
 * there or research simply stops there is said by the incoming edge's
 * outcome and the trajectory's research notes, not by this.
 */
export function sinkStepIds(trajectory: SpiralTrajectory): string[] {
  const edges = trajectoryEdges(trajectory);
  return trajectory.steps
    .filter((s) => !edges.some((e) => e.from === s.id))
    .map((s) => s.id);
}

export type SpiralSpanResolution =
  | { ok: true; path: readonly string[] }
  | {
      ok: false;
      reason: "unknown-step" | "ambiguous" | "not-a-path";
      path: readonly string[];
    };

/**
 * The authored path a span covers. Never chooses between branches: without
 * `via`, a span resolves only to in-order steps of an ordered trajectory or to
 * a single explicit edge. Cycles are allowed; a path may revisit a step.
 */
export function resolveSpan(
  trajectory: SpiralTrajectory,
  anchor: Extract<SpiralTrajectoryAnchor, { kind: "span" }>,
): SpiralSpanResolution {
  const ids = trajectory.steps.map((s) => s.id);
  const authored = [anchor.from, ...(anchor.via ?? []), anchor.to];
  if (authored.some((id) => !ids.includes(id))) {
    return { ok: false, reason: "unknown-step", path: authored };
  }

  if (!anchor.via && topologySource(trajectory) === "ordered") {
    const a = ids.indexOf(anchor.from);
    const b = ids.indexOf(anchor.to);
    return a <= b
      ? { ok: true, path: ids.slice(a, b + 1) }
      : { ok: false, reason: "not-a-path", path: authored };
  }

  for (let i = 1; i < authored.length; i++) {
    if (!findEdge(trajectory, authored[i - 1]!, authored[i]!)) {
      return {
        ok: false,
        reason: anchor.via ? "not-a-path" : "ambiguous",
        path: authored,
      };
    }
  }
  return { ok: true, path: authored };
}
