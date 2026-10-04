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
 * Resonances are authored only where research already exists.
 * Transformation: transitions from the M1D-6 research — no per-sign matches.
 * Every other operation (including Emergence again) has zero resonances
 * until researched as its own intersection.
 */
export const ZODIAC_CYCLE_TRAJECTORY: SpiralTrajectory = {
  id: "zodiac-cycle",
  lensId: "symbolic-zodiac",
  title: "The zodiacal cycle",
  inPhrase: "the zodiacal trajectory",
  note: "Signs are not matched to operations. When a comparison is offered, it usually lives in a transition between signs.",
  steps: ZODIAC_CYCLE_STEPS,
  resonances: [
    {
      id: "zod-res-transformation-libra-scorpio",
      stageId: "transformation",
      from: "libra",
      to: "scorpio",
      strength: "candidate",
      transitionId: "zod-tr-libra-scorpio",
    },
    {
      id: "zod-res-transformation-scorpio-sagittarius",
      stageId: "transformation",
      from: "scorpio",
      to: "sagittarius",
      strength: "context",
      transitionId: "zod-tr-scorpio-sagittarius",
    },
    {
      id: "zod-res-transformation-capricorn-aquarius",
      stageId: "transformation",
      from: "capricorn",
      to: "aquarius",
      strength: "candidate",
      transitionId: "zod-tr-capricorn-aquarius",
    },
    {
      id: "zod-res-transformation-pisces-aries",
      stageId: "transformation",
      from: "pisces",
      to: "aries-again",
      strength: "ambiguous",
      transitionId: "zod-tr-pisces-aries",
    },
  ],
};
