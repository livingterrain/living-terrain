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
  /** Leave headroom so the Emergence-again label is not clipped. */
  yTop: 18,
  /** Slightly more than one turn so interlacing reads as a helix. */
  turns: 1.22,
  r0: 28,
  /** Mild taper toward the apex (perspective / densifying history). */
  taper: 0.2,
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
  /** Depth cue: +1 toward viewer, -1 away (projection). */
  depth: number;
};

/** Contiguous stroke of one current on one depth side. */
export type SpiralDepthSegment = {
  d: string;
  /** Average projected depth in [-1, 1]. */
  depth: number;
  side: "front" | "back";
  current: "continuity" | "transformation";
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

function sideForDepth(depth: number): "front" | "back" {
  return depth >= 0 ? "front" : "back";
}

function averageDepth(pts: readonly SpiralPoint[]): number {
  if (pts.length === 0) return 0;
  let sum = 0;
  for (const p of pts) sum += p.depth;
  return sum / pts.length;
}

/**
 * Split a sampled current into contiguous front/back strokes so SVG paint
 * order can occlude at crossings. Crossing samples are shared by both sides
 * so the stroke does not open a gap.
 */
export function segmentCurrentByDepth(
  current: "continuity" | "transformation",
  samples = SPIRAL_GEOM.pathSamples,
): SpiralDepthSegment[] {
  const pts = sampleCurrent(current, samples);
  if (pts.length < 2) return [];

  const segments: SpiralDepthSegment[] = [];
  let bucket: SpiralPoint[] = [pts[0]!];
  let side = sideForDepth(pts[0]!.depth);

  for (let i = 1; i < pts.length; i++) {
    const p = pts[i]!;
    const nextSide = sideForDepth(p.depth);
    if (nextSide === side) {
      bucket.push(p);
      continue;
    }
    // Close current side through the crossing sample, then start the other side.
    bucket.push(p);
    if (bucket.length >= 2) {
      segments.push({
        d: pathDFromPoints(bucket),
        depth: averageDepth(bucket),
        side,
        current,
      });
    }
    bucket = [p];
    side = nextSide;
  }

  if (bucket.length >= 2) {
    segments.push({
      d: pathDFromPoints(bucket),
      depth: averageDepth(bucket),
      side,
      current,
    });
  }

  return segments;
}

/** Stroke width in viewBox units from projected depth (near thicker, far thinner). */
export function strokeWidthForDepth(depth: number): number {
  const n = (depth + 1) / 2; // 0 far → 1 near
  return 0.32 + 0.95 * n;
}

/** Core opacity from projected depth. */
export function opacityForDepth(depth: number): number {
  const n = (depth + 1) / 2;
  return 0.14 + 0.68 * n;
}

/**
 * Continuous current paths + depth segments for layered occlusion.
 * Equal conceptual weight — visual near/far is projection, not hierarchy.
 */
export function currentPaths(samples = SPIRAL_GEOM.pathSamples): {
  continuityFull: string;
  transformationFull: string;
  continuitySegments: SpiralDepthSegment[];
  transformationSegments: SpiralDepthSegment[];
  /** Paint order: farthest first. */
  segmentsPaintOrder: SpiralDepthSegment[];
  axisFull: string;
} {
  const cont = sampleCurrent("continuity", samples);
  const trans = sampleCurrent("transformation", samples);
  const continuitySegments = segmentCurrentByDepth("continuity", samples);
  const transformationSegments = segmentCurrentByDepth(
    "transformation",
    samples,
  );
  const segmentsPaintOrder = [
    ...continuitySegments,
    ...transformationSegments,
  ].sort((a, b) => a.depth - b.depth);

  return {
    continuityFull: pathDFromPoints(cont),
    transformationFull: pathDFromPoints(trans),
    continuitySegments,
    transformationSegments,
    segmentsPaintOrder,
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
