/**
 * Contemplation tempo — movements breathe ~18% slower than a typical UI.
 */
export const INHALE = 1.18;

export function breathe(ms: number): number {
  return Math.round(ms * INHALE);
}

export const THRESHOLD = {
  revealMs: breathe(2800),
  introHoldMs: breathe(2400),
  crossingMs: breathe(3200),
} as const;

export const THREAD = {
  segmentMs: breathe(2600),
  fadeMs: breathe(900),
  voidMs: breathe(1400),
  emergeMs: breathe(2200),
} as const;

export const MOTION = {
  fade: breathe(700),
  camera: breathe(1500),
  hoverMinMs: breathe(140),
} as const;

/** Cinematic route crossings — 600–1200ms, intentional, never abrupt */
export const NAVIGATION = {
  ease: [0.45, 0.05, 0.55, 0.95] as const,
  mapToReading: { exit: breathe(900), enter: breathe(850) },
  readingToMap: { exit: breathe(1000), enter: breathe(950) },
  toTheme: { exit: breathe(800), enter: breathe(1100) },
  themeToMap: { exit: breathe(900), enter: breathe(850) },
  themeToReading: { exit: breathe(850), enter: breathe(800) },
  themeToTheme: { exit: breathe(750), enter: breathe(900) },
  toThread: { exit: breathe(700), enter: breathe(950) },
  soft: { exit: breathe(650), enter: breathe(750) },
  /** Foreground reveal after atmosphere settles */
  foreground: {
    delayMs: breathe(220),
    durationMs: breathe(680),
    blurPx: 7,
    softBlurPx: 3,
    softDurationMs: breathe(520),
  },
  /** Persistent atmosphere crossfade on zone change */
  zoneCrossfadeMs: breathe(820),
} as const;

/** Quiet discovery while reading — earned, never advertised */
export const DISCOVERY = {
  minDwellMs: breathe(6500),
  minScroll: 0.28,
  revealDuration: breathe(2200),
} as const;

/** Observatory reflections — the terrain noticing patterns, never the person */
export const REFLECTION = {
  minStops: 3,
  minDistinctKinds: 2,
  restAfterStops: 6,
  cooldownMs: breathe(180_000),
  pageDwellMs: breathe(12_000),
  revealDuration: breathe(3200),
} as const;
