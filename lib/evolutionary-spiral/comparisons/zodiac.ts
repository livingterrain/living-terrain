import type { SpiralTrajectoryRelationship } from "../types";

/**
 * Zodiacal sequence ↔ Spiral. Authored only where research exists:
 * the Transformation passages (no per-sign matches). Every other operation,
 * including Emergence again, has zero relationships until researched.
 */
export const ZODIAC_RELATIONSHIPS: readonly SpiralTrajectoryRelationship[] = [
  {
    id: "zod-res-transformation-libra-scorpio",
    trajectoryId: "zodiac-cycle",
    anchor: { kind: "transition", from: "libra", to: "scorpio" },
    operations: [{ stageId: "transformation" }],
    status: "candidate",
    transitionId: "zod-tr-libra-scorpio",
  },
  {
    id: "zod-res-transformation-scorpio-sagittarius",
    trajectoryId: "zodiac-cycle",
    anchor: { kind: "transition", from: "scorpio", to: "sagittarius" },
    operations: [{ stageId: "transformation" }],
    status: "context",
    transitionId: "zod-tr-scorpio-sagittarius",
  },
  {
    id: "zod-res-transformation-capricorn-aquarius",
    trajectoryId: "zodiac-cycle",
    anchor: { kind: "transition", from: "capricorn", to: "aquarius" },
    operations: [{ stageId: "transformation" }],
    status: "ambiguous",
    transitionId: "zod-tr-capricorn-aquarius",
  },
  {
    id: "zod-res-transformation-pisces-aries",
    trajectoryId: "zodiac-cycle",
    anchor: { kind: "transition", from: "pisces", to: "aries-again" },
    operations: [{ stageId: "transformation" }],
    status: "ambiguous",
    transitionId: "zod-tr-pisces-aries",
  },
];
