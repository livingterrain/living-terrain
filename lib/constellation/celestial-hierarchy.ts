import type { GraphLevel, GraphNode, GraphNodeKind } from "@/lib/concepts/graph";

/** Four visual scales — bodies in the sky, not pages in an app */
export type CelestialTier = "origin" | "constellation" | "supporting" | "observation";

export const CELESTIAL_TIER: Record<
  CelestialTier,
  { level: GraphLevel; title: string; description: string }
> = {
  origin: {
    level: 1,
    title: "Origin",
    description: "Foundational ideas — radiant, immovable",
  },
  constellation: {
    level: 2,
    title: "Major constellation",
    description: "Architecture of thought — large, clearly labeled",
  },
  supporting: {
    level: 3,
    title: "Supporting idea",
    description: "Essays and volumes — medium bodies in orbit",
  },
  observation: {
    level: 4,
    title: "Observation",
    description: "Field notes, questions, echoes — tiny stars",
  },
};

export function tierFromLevel(level: GraphLevel): CelestialTier {
  switch (level) {
    case 1:
      return "origin";
    case 2:
      return "constellation";
    case 3:
      return "supporting";
    case 4:
      return "observation";
  }
}

export function tierFromNode(node: GraphNode): CelestialTier {
  return tierFromLevel(node.level);
}

export interface CelestialBodyStyle {
  tier: CelestialTier;
  /** Minimum radius as fraction of viewBox width */
  sizeFloor: number;
  sizeBoost: number;
  haloMul: number;
  glowRest: number;
  glowHover: number;
  glowExplored: number;
  hoverScale: number;
  restingOpacity: number;
  exploredOpacity: number;
  minorOpacity: number;
  pulseSec: number;
  pulseOpacity: string;
  breathe: boolean;
  labelAlways: boolean;
  labelOnExplore: boolean;
  labelOnHoverOnly: boolean;
  fontScale: number;
  fontWeight: number;
  letterSpacing: string;
  labelStroke: boolean;
  filterId: string;
  renderAsStar: boolean;
}

const STYLES: Record<CelestialTier, CelestialBodyStyle> = {
  origin: {
    tier: "origin",
    sizeFloor: 0.011,
    sizeBoost: 1.42,
    haloMul: 5.4,
    glowRest: 0.58,
    glowHover: 1.52,
    glowExplored: 0.88,
    hoverScale: 1,
    restingOpacity: 1,
    exploredOpacity: 1,
    minorOpacity: 1,
    pulseSec: 24,
    pulseOpacity: "0.04;0.11;0.04",
    breathe: true,
    labelAlways: false,
    labelOnExplore: false,
    labelOnHoverOnly: false,
    fontScale: 0.0054,
    fontWeight: 600,
    letterSpacing: "0.06em",
    labelStroke: true,
    filterId: "halo-origin",
    renderAsStar: false,
  },
  constellation: {
    tier: "constellation",
    sizeFloor: 0.0078,
    sizeBoost: 1.18,
    haloMul: 4.2,
    glowRest: 0.38,
    glowHover: 0.92,
    glowExplored: 0.62,
    hoverScale: 1,
    restingOpacity: 0.42,
    exploredOpacity: 0.78,
    minorOpacity: 0.35,
    pulseSec: 12.5,
    pulseOpacity: "0.06;0.14;0.06",
    breathe: false,
    labelAlways: false,
    labelOnExplore: false,
    labelOnHoverOnly: true,
    fontScale: 0.0044,
    fontWeight: 500,
    letterSpacing: "0.045em",
    labelStroke: true,
    filterId: "halo-constellation",
    renderAsStar: false,
  },
  supporting: {
    tier: "supporting",
    sizeFloor: 0.0026,
    sizeBoost: 0.78,
    haloMul: 2.4,
    glowRest: 0.14,
    glowHover: 0.42,
    glowExplored: 0.3,
    hoverScale: 1,
    restingOpacity: 0.38,
    exploredOpacity: 0.62,
    minorOpacity: 0.26,
    pulseSec: 14,
    pulseOpacity: "0.02;0.07;0.02",
    breathe: false,
    labelAlways: false,
    labelOnExplore: true,
    labelOnHoverOnly: false,
    fontScale: 0.0032,
    fontWeight: 400,
    letterSpacing: "0.03em",
    labelStroke: false,
    filterId: "halo-supporting",
    renderAsStar: false,
  },
  observation: {
    tier: "observation",
    sizeFloor: 0.0012,
    sizeBoost: 0.68,
    haloMul: 1.6,
    glowRest: 0.08,
    glowHover: 0.24,
    glowExplored: 0.14,
    hoverScale: 1,
    restingOpacity: 0.16,
    exploredOpacity: 0.42,
    minorOpacity: 0.1,
    pulseSec: 16,
    pulseOpacity: "0.02;0.05;0.02",
    breathe: false,
    labelAlways: false,
    labelOnExplore: false,
    labelOnHoverOnly: true,
    fontScale: 0.0026,
    fontWeight: 400,
    letterSpacing: "0.02em",
    labelStroke: false,
    filterId: "halo-observation",
    renderAsStar: true,
  },
};

export function celestialStyle(level: GraphLevel): CelestialBodyStyle {
  return STYLES[tierFromLevel(level)];
}

export function celestialStyleFor(node: GraphNode): CelestialBodyStyle {
  return celestialStyle(node.level);
}

/** Body radius in viewBox units — scale communicates rank before any label is read */
export function celestialRadius(node: GraphNode, viewBoxW: number): number {
  const style = celestialStyleFor(node);
  const kindMul =
    node.kind === "essay"
      ? 0.86
      : node.kind === "book"
        ? 1.04
        : node.kind === "field-note" || node.kind === "observation"
          ? 0.78
          : node.kind === "question" || node.kind === "quotation"
            ? 0.72
            : 1;
  const scaled = node.size * (viewBoxW / 1500) * style.sizeBoost * kindMul;
  const floor = viewBoxW * style.sizeFloor;
  return Math.max(scaled, floor);
}

export function celestialLabelSize(node: GraphNode, viewBoxW: number): number {
  const style = celestialStyleFor(node);
  const mins = { origin: 20, constellation: 16, supporting: 9, observation: 7 } as const;
  return Math.max(mins[style.tier], viewBoxW * style.fontScale);
}

export function celestialLabelOffset(r: number, level: GraphLevel): number {
  const mul = { 1: 3.6, 2: 2.75, 3: 2.35, 4: 2 } as const;
  return r * mul[level];
}

export function shouldShowCelestialLabel(opts: {
  level: GraphLevel;
  discoveryAwake: boolean;
  isHovered: boolean;
  isExplored: boolean;
  conceptReveal?: number;
  isConcept?: boolean;
}): boolean {
  const style = celestialStyle(opts.level);
  if (!opts.discoveryAwake && opts.level > 1) return false;
  if (style.labelAlways) {
    if (opts.isConcept && opts.conceptReveal !== undefined && opts.conceptReveal < 0.55) {
      return false;
    }
    return true;
  }
  if (style.labelOnExplore && (opts.isExplored || opts.isHovered)) return true;
  if (style.labelOnHoverOnly && opts.isHovered) return true;
  if (!style.labelOnHoverOnly && !style.labelOnExplore && opts.isHovered) return true;
  return opts.isHovered;
}

export function celestialGroupOpacity(opts: {
  level: GraphLevel;
  discoveryAwake: boolean;
  isHovered: boolean;
  isExplored: boolean;
  conceptReveal?: number;
  isChamber?: boolean;
  isConcept?: boolean;
  inReveal?: boolean;
}): number {
  const style = celestialStyle(opts.level);
  if (opts.isChamber) return 1;
  if (opts.isConcept && opts.inReveal && opts.conceptReveal !== undefined) {
    return opts.conceptReveal * 0.92;
  }
  if (!opts.discoveryAwake && opts.level > 1) return 0.06;
  if (opts.isHovered || opts.isExplored) return 1;
  if (opts.level === 2) return style.restingOpacity;
  if (opts.level >= 3) return style.minorOpacity;
  return style.restingOpacity;
}

export function celestialGlowOpacity(
  style: CelestialBodyStyle,
  isHovered: boolean,
  isExplored: boolean,
): number {
  if (isHovered) return Math.min(style.glowHover, style.glowRest * 1.35);
  if (isExplored) return style.glowExplored;
  return style.glowRest;
}

/** Zoom span when focusing a body */
export function celestialFocusSpan(level: GraphLevel): number {
  return { 1: 1850, 2: 1200, 3: 820, 4: 520 }[level];
}

export const CELESTIAL_KIND_LABEL: Record<GraphNodeKind, string> = {
  chamber: "Origin",
  concept: "Constellation",
  essay: "Idea",
  book: "Volume",
  question: "Inquiry",
  "field-note": "Field note",
  quotation: "Echo",
  observation: "Observation",
};
