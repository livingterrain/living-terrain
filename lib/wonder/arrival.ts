/**
 * Wonder arrival — compressed choreography.
 * Map appears in ~2.5s; atmosphere refines through 8s.
 * Chrome and labels wait — the universe does not.
 */

export const WONDER_ARRIVAL = {
  /** Constellation fully visible */
  mapSettledMs: 4_000,
  /** Subtle star / particle refinement tail */
  durationMs: 8_000,
  /** Explanations may emerge after this if visitor is still */
  chromeDelayMs: 6_000,
  /** Chamber name earned after exploration or this delay */
  chamberLabelDelayMs: 10_000,
  /** Meaningful pointer travel before counting as engagement (px) */
  pointerEngagePx: 48,
} as const;

/** Phase boundaries as fraction of mapSettledMs (4s) */
const PHASE = {
  veilEnd: 0.125, // 0.5s — threshold dissolves
  chamberEnd: 0.375, // 1.5s — chamber ignites
  constellationEnd: 0.625, // 2.5s — ring complete
  settled: 1, // 4.0s — atmosphere settled
} as const;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/** Master map choreography — 0 at entry, 1 when universe feels complete (~4s) */
export function awakeningProgress(
  elapsedMs: number,
  durationMs = WONDER_ARRIVAL.mapSettledMs,
): number {
  return smoothstep(0, durationMs, elapsedMs);
}

/** 0–0.5s — dark hold dissolves */
export function veilOpacity(awakening: number): number {
  return 1 - smoothstep(0, PHASE.veilEnd, awakening);
}

/** 0.5–1.5s — center ignites */
export function chamberPresence(awakening: number): number {
  return smoothstep(PHASE.veilEnd, PHASE.chamberEnd, awakening);
}

/** 1.5–2.5s — bodies emerge together, barely staggered */
export function conceptPresence(
  awakening: number,
  index: number,
  count: number,
): number {
  const stagger = count > 0 ? (index / count) * 0.04 : 0;
  return smoothstep(
    PHASE.chamberEnd + stagger,
    PHASE.constellationEnd,
    awakening,
  );
}

/** Edges trail the ring slightly */
export function edgePresence(awakening: number): number {
  return smoothstep(0.48, PHASE.constellationEnd, awakening);
}

/** Stars ignite fast, refine as atmosphere settles */
export function starFieldStrength(
  awakening: number,
  elapsedMs = 0,
): number {
  const ignite =
    smoothstep(0, PHASE.veilEnd, awakening) * 0.55 +
    smoothstep(PHASE.chamberEnd, PHASE.settled, awakening) * 0.45;
  const refine = atmosphereRefinement(elapsedMs) * 0.1;
  return Math.min(1, ignite + refine);
}

/** 4–8s — breathing tail after map is present */
export function atmosphereRefinement(elapsedMs: number): number {
  return smoothstep(
    WONDER_ARRIVAL.mapSettledMs,
    WONDER_ARRIVAL.durationMs,
    elapsedMs,
  );
}

/** Chrome ghosts in after explanations are allowed */
export function chromeOpacity(visible: boolean, elapsedMs: number): number {
  if (!visible) return 0;
  const start = WONDER_ARRIVAL.chromeDelayMs;
  return smoothstep(start, start + 900, elapsedMs);
}

/** Chamber label earned — understanding waits */
export function chamberLabelPresence(
  awakening: number,
  engaged: boolean,
  elapsedMs: number,
): number {
  if (engaged) return smoothstep(0, 0.22, awakening);
  if (elapsedMs >= WONDER_ARRIVAL.chamberLabelDelayMs) {
    return smoothstep(0.72, 1, awakening);
  }
  return 0;
}

/** Attention brightens the field — curiosity response */
export function attentionGlow(
  ax: number,
  ay: number,
  sx: number,
  sy: number,
  radius = 0.18,
): number {
  const d = Math.hypot(ax - sx, ay - sy);
  if (d >= radius) return 0;
  const t = 1 - d / radius;
  return t * t * 0.35;
}
