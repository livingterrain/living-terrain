import { CINEMATIC_SCENES } from "./scenes";

/**
 * Slice 1 timing — superseded by CINEMATIC_JOURNEY.
 * Kept for reference; first transition is now ~1.0vh.
 */
export const CINEMATIC_SLICE_1 = {
  from: CINEMATIC_SCENES["01-threshold"],
  to: CINEMATIC_SCENES["02-first-reveal"],
  journeyVh: 1.12,
  thresholdPauseUntil: 0.02,
  movementStart: 0.03,
  overlapStart: 0.05,
  overlapEnd: 0.62,
  arrivalHoldUntil: 0.82,
} as const;
