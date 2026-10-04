/**
 * Pure geometry for trajectory figures. Positions carry no meaning about
 * Spiral operations — a step's place on the wheel is never a mapping.
 */

import type { SpiralTrajectoryStep } from "./types";

export const TRAJECTORY_WHEEL = {
  width: 240,
  height: 206,
  cx: 120,
  cy: 103,
  r: 64,
  /** A recurrence step sits inside the ring: the return is not to the same place. */
  rRecurrence: 38,
  labelOffset: 13,
} as const;

export type WheelNode = {
  step: SpiralTrajectoryStep;
  index: number;
  x: number;
  y: number;
  angle: number;
  labelX: number;
  labelY: number;
  anchor: "start" | "middle" | "end";
};

export type WheelSegment = {
  from: string;
  to: string;
  d: string;
};

function polar(r: number, angle: number) {
  const { cx, cy } = TRAJECTORY_WHEEL;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

/** First non-recurrence step at the top; clockwise. */
export function wheelNodes(steps: readonly SpiralTrajectoryStep[]): WheelNode[] {
  const { r, rRecurrence, labelOffset } = TRAJECTORY_WHEEL;
  const ring = steps.filter((s) => !s.recurrence);
  const slice = (Math.PI * 2) / Math.max(ring.length, 1);
  let ringIndex = 0;
  return steps.map((step, index) => {
    if (step.recurrence) {
      const angle = -Math.PI / 2;
      const p = polar(rRecurrence, angle);
      return {
        step,
        index,
        x: p.x,
        y: p.y,
        angle,
        labelX: p.x,
        labelY: p.y + 11,
        anchor: "middle",
      };
    }
    const angle = -Math.PI / 2 + ringIndex * slice;
    ringIndex += 1;
    const p = polar(r, angle);
    const l = polar(r + labelOffset, angle);
    const cos = Math.cos(angle);
    const anchor = Math.abs(cos) < 0.2 ? "middle" : cos > 0 ? "start" : "end";
    const vertical = Math.sin(angle);
    return {
      step,
      index,
      x: p.x,
      y: p.y,
      angle,
      labelX: l.x,
      labelY: l.y + (Math.abs(vertical) > 0.8 ? (vertical > 0 ? 4 : 0) : 2.5),
      anchor,
    };
  });
}

/** Passages between consecutive steps: arcs on the ring, a curve into a recurrence. */
export function wheelSegments(nodes: readonly WheelNode[]): WheelSegment[] {
  const { r, cx, cy } = TRAJECTORY_WHEEL;
  const segments: WheelSegment[] = [];
  for (let i = 1; i < nodes.length; i++) {
    const a = nodes[i - 1]!;
    const b = nodes[i]!;
    let d: string;
    if (b.step.recurrence) {
      const mid = (a.angle + Math.PI * 2 + b.angle) / 2;
      const cr = (r + TRAJECTORY_WHEEL.rRecurrence) / 2 + 8;
      const c = { x: cx + cr * Math.cos(mid), y: cy + cr * Math.sin(mid) };
      d = `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} Q ${c.x.toFixed(2)} ${c.y.toFixed(2)} ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
    } else {
      d = `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${r} ${r} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
    }
    segments.push({ from: a.step.id, to: b.step.id, d });
  }
  return segments;
}

/** CSS percentage position for an HTML hit target over the wheel SVG. */
export function wheelHitStyle(x: number, y: number): { left: string; top: string } {
  return {
    left: `${(x / TRAJECTORY_WHEEL.width) * 100}%`,
    top: `${(y / TRAJECTORY_WHEEL.height) * 100}%`,
  };
}
