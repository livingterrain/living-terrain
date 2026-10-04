import type { SpiralTrajectory, SpiralTrajectoryStep } from "../types";

/**
 * Zodiacal cycle — the first whole-helix trajectory.
 * Glosses mix historical/developmental reading with Living Terrain synthesis
 * (see the lens-level research provenance note). Steps are not Spiral
 * stages and not canonical objects.
 */
export const ZODIAC_CYCLE_STEPS: readonly SpiralTrajectoryStep[] = [
  {
    id: "aries",
    label: "Aries",
    gloss: "release / initiation / emergence",
  },
  {
    id: "taurus",
    label: "Taurus",
    gloss: "stabilization / embodiment / productive containment",
  },
  {
    id: "gemini",
    label: "Gemini",
    gloss: "differentiation / connection / exchange",
  },
  {
    id: "cancer",
    label: "Cancer",
    gloss: "boundary / interior center / belonging",
  },
  {
    id: "leo",
    label: "Leo",
    gloss: "expression / creation / projection from established identity",
  },
  {
    id: "virgo",
    label: "Virgo",
    gloss: "discrimination / adjustment / correction",
  },
  {
    id: "libra",
    label: "Libra",
    gloss: "relationship / evaluation / social participation",
  },
  {
    id: "scorpio",
    label: "Scorpio",
    gloss:
      "deeper participation / altered boundaries / later transformation symbolism",
  },
  {
    id: "sagittarius",
    label: "Sagittarius",
    gloss: "extension of meaning / horizon / interpretation",
  },
  {
    id: "capricorn",
    label: "Capricorn",
    gloss: "crystallization / structure / collective organization",
  },
  {
    id: "aquarius",
    label: "Aquarius",
    gloss: "release / reform / reorganization of established structure",
  },
  {
    id: "pisces",
    label: "Pisces",
    gloss:
      "completion / dissolution / accumulated residue / transition",
  },
  {
    id: "aries-again",
    label: "Aries again",
    gloss: "another emergence",
    recurrence: true,
  },
];

/**
 * Trajectory data only. Relationships to Spiral operations live in
 * `../comparisons/zodiac.ts`.
 */
export const ZODIAC_CYCLE_TRAJECTORY: SpiralTrajectory = {
  id: "zodiac-cycle",
  lensId: "symbolic-zodiac",
  title: "Zodiacal sequence",
  inPhrase: "the zodiacal trajectory",
  description:
    "Signs are not matched to operations. When a comparison is offered, it usually lives in a transition between signs.",
  shape: "cyclical",
  steps: ZODIAC_CYCLE_STEPS,
};
