/**
 * Threshold Design System
 *
 * The site is not a website — it is an observatory landscape.
 * Motion is glacial. Surfaces are carved, not boxed. Navigation is pathway, not menu.
 */

/** Ambient motion — 8–30 seconds, nearly imperceptible */
export const THRESHOLD_MOTION = {
  /** Quickest allowed ambient cycle */
  ambientMinSec: 8,
  driftSec: 18,
  crossingSec: 24,
  dawnSec: 30,
  /** Route atmosphere morph — still intentional, not instant */
  zoneCrossfadeMs: 3200,
  /** Content emergence when entering a chamber */
  chamberRevealMs: 2400,
  chamberStaggerMs: 180,
  ease: [0.45, 0.05, 0.55, 0.95] as const,
} as const;

/** Observatory palette — dawn at the threshold */
export const THRESHOLD_PALETTE = {
  void: "#06080c",
  voidDeep: "#040608",
  skyZenith: "#0a1018",
  skyMid: "#182028",
  terrainFar: "#1e2834",
  terrainMid: "#121820",
  terrainNear: "#0a0e14",
  mist: "#98a4b0",
  mistWarm: "#b8b0a8",
  horizonAmber: "#c4a06a",
  horizonGold: "#d4b878",
  star: "#c8d0dc",
  ivoryLift: "#e9e0d0",
} as const;

/** Spatial rhythm — silence and spaciousness */
export const THRESHOLD_SPACE = {
  chamberPy: "py-24 sm:py-32",
  chamberGap: "space-y-24 sm:space-y-32",
  passagePy: "py-20 sm:py-28",
  pathwayGap: "gap-10 sm:gap-14",
} as const;

/** Depth labels for the journey inward */
export const THRESHOLD_DEPTH_LABELS = [
  "threshold",
  "vestibule",
  "passage",
  "gallery",
  "archive",
  "observatory",
  "chamber",
] as const;
