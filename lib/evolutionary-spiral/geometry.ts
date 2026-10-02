/**
 * Pure helix geometry for The Evolutionary Spiral (Phase 2).
 * Driven by SPIRAL_SEQUENCE — does not alter stage/canon data.
 *
 * Vertical: Emergence¹ at bottom → Emergence again at top.
 * Ascent = accumulated history / changed conditions (not progress).
 */

import { SPIRAL_SEQUENCE } from "./stages";
import type { SpiralSequenceStop } from "./types";

export const SPIRAL_VIEWBOX = {
  width: 100,
  height: 168,
} as const;

/** Geometry constants — unit space of SPIRAL_VIEWBOX. */
export const SPIRAL_GEOM = {
  cx: 50,
  yBottom: 152,
  yTop: 14,
  /** Slightly more than one turn so interlacing reads as a helix. */
  turns: 1.22,
  r0: 28,
  /** Mild taper toward the apex (perspective / densifying history). */
  taper: 0.14,
  /** Phase offset so Continuity and Transformation oppose each other. */
  phase: -Math.PI / 2,
  /** Samples for smooth current paths. */
  pathSamples: 96,
  /** Half-window in t for local-arc highlight around a selected stop. */
  arcHalfWindow: 0.065,
} as const;

export type SpiralPoint = {
  x: number;
  y: number;
  /** Depth cue: +1 front, -1 back (projection). */
  depth: number;
};

export type SpiralNodeGeometry = {
  stop: SpiralSequenceStop;
  index: number;
  /** 0 at Emergence¹ → 1 at Emergence again. */
  t: number;
  x: number;
  y: number;
  theta: number;
  radius: number;
  /** Label side to reduce collisions. */
  labelSide: "left" | "right";
};

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

export function tForIndex(index: number, count = SPIRAL_SEQUENCE.length): number {
  if (count <= 1) return 0;
  return index / (count - 1);
}

export function axisY(t: number): number {
  const { yBottom, yTop } = SPIRAL_GEOM;
  return yBottom - clamp01(t) * (yBottom - yTop);
}

export function helixRadius(t: number): number {
  const { r0, taper } = SPIRAL_GEOM;
  return r0 * (1 - taper * clamp01(t));
}

export function helixTheta(t: number): number {
  const { turns, phase } = SPIRAL_GEOM;
  return phase + clamp01(t) * turns * Math.PI * 2;
}

/** Continuity current point at parameter t. */
export function continuityPoint(t: number): SpiralPoint {
  const { cx } = SPIRAL_GEOM;
  const theta = helixTheta(t);
  const r = helixRadius(t);
  return {
    x: cx + r * Math.cos(theta),
    y: axisY(t),
    depth: Math.sin(theta),
  };
}

/** Transformation current — opposite phase, equal weight. */
export function transformationPoint(t: number): SpiralPoint {
  const { cx } = SPIRAL_GEOM;
  const theta = helixTheta(t) + Math.PI;
  const r = helixRadius(t);
  return {
    x: cx + r * Math.cos(theta),
    y: axisY(t),
    depth: Math.sin(theta),
  };
}

export function axisPoint(t: number): SpiralPoint {
  return { x: SPIRAL_GEOM.cx, y: axisY(t), depth: 0 };
}

export function pathDFromPoints(points: readonly SpiralPoint[]): string {
  if (points.length === 0) return "";
  let d = `M ${points[0]!.x.toFixed(3)} ${points[0]!.y.toFixed(3)}`;
  for (let i = 1; i < points.length; i++) {
    const p = points[i]!;
    d += ` L ${p.x.toFixed(3)} ${p.y.toFixed(3)}`;
  }
  return d;
}

function sampleCurrent(
  current: "continuity" | "transformation",
  samples: number,
): SpiralPoint[] {
  const pts: SpiralPoint[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    pts.push(current === "continuity" ? continuityPoint(t) : transformationPoint(t));
  }
  return pts;
}

/**
 * Continuous current paths. Equal visual weight — no stage-band dominance.
 * Back/front variants use depth to soften the far side of the projection.
 */
export function currentPaths(samples = SPIRAL_GEOM.pathSamples): {
  continuityFull: string;
  transformationFull: string;
  continuityBack: string;
  continuityFront: string;
  transformationBack: string;
  transformationFront: string;
  axisFull: string;
} {
  const cont = sampleCurrent("continuity", samples);
  const trans = sampleCurrent("transformation", samples);

  const depthSplit = (pts: SpiralPoint[]) => {
    // Soft split: keep continuity of stroke by drawing full path twice with
    // different opacities in the component; expose full + filtered for layering.
    const back = pts.filter((p) => p.depth < 0.05);
    const front = pts.filter((p) => p.depth >= -0.05);
    return {
      full: pathDFromPoints(pts),
      back: pathDFromPoints(back.length > 1 ? back : pts),
      front: pathDFromPoints(front.length > 1 ? front : pts),
    };
  };

  const c = depthSplit(cont);
  const tr = depthSplit(trans);

  return {
    continuityFull: c.full,
    transformationFull: tr.full,
    continuityBack: c.back,
    continuityFront: c.front,
    transformationBack: tr.back,
    transformationFront: tr.front,
    axisFull: pathDFromPoints([axisPoint(0), axisPoint(1)]),
  };
}

/** Build node geometry for every sequence stop (includes Emergence again). */
export function buildSpiralNodes(
  sequence: readonly SpiralSequenceStop[] = SPIRAL_SEQUENCE,
): SpiralNodeGeometry[] {
  return sequence.map((stop, index) => {
    const t = tForIndex(index, sequence.length);
    const theta = helixTheta(t);
    const radius = helixRadius(t);
    const { x, y } = axisPoint(t);
    const labelSide: "left" | "right" = index % 2 === 0 ? "left" : "right";
    return {
      stop,
      index,
      t,
      x,
      y,
      theta,
      radius,
      labelSide,
    };
  });
}

/** Local arc window in t around a selected node index. */
export function arcWindowForIndex(
  index: number,
  count = SPIRAL_SEQUENCE.length,
): { tMin: number; tMax: number } {
  const t = tForIndex(index, count);
  const half = SPIRAL_GEOM.arcHalfWindow;
  return { tMin: clamp01(t - half), tMax: clamp01(t + half) };
}

/** Build a path D for only the local arc of a current. */
export function localArcPath(
  current: "continuity" | "transformation",
  tMin: number,
  tMax: number,
  samples = 28,
): string {
  if (tMax <= tMin) return "";
  const pts: SpiralPoint[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = tMin + ((tMax - tMin) * i) / samples;
    pts.push(current === "continuity" ? continuityPoint(t) : transformationPoint(t));
  }
  return pathDFromPoints(pts);
}

/** Axis segment for the local selected band. */
export function localAxisPath(tMin: number, tMax: number): string {
  return pathDFromPoints([axisPoint(tMin), axisPoint(tMax)]);
}

/** CSS percentage positions for HTML hit targets over the SVG. */
export function nodeHitStyle(node: SpiralNodeGeometry): {
  left: string;
  top: string;
} {
  return {
    left: `${(node.x / SPIRAL_VIEWBOX.width) * 100}%`,
    top: `${(node.y / SPIRAL_VIEWBOX.height) * 100}%`,
  };
}

export function displayNameForStop(
  stop: SpiralSequenceStop,
  stageName: string,
): string {
  return stop.labelOverride ?? stageName;
}

export const SPIRAL_ASCENT_CAPTION =
  "History accumulates upward. Ascent marks changed conditions, not guaranteed improvement.";

/** Default selected occurrence — Emergence¹. */
export const SPIRAL_DEFAULT_OCCURRENCE_ID = SPIRAL_SEQUENCE[0]!.occurrenceId;
