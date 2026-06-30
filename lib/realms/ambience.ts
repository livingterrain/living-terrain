import type { RealmSlug } from "./types";

/** Per-realm observatory pulse — seconds for one breath cycle */
export const REALM_PULSE_SEC: Record<RealmSlug, number> = {
  reality: 14,
  relationship: 9,
  meaning: 18,
  identity: 11,
  language: 16,
  time: 22,
  embodiment: 10,
  freedom: 20,
  consciousness: 13,
};

/** Particle drift multiplier — observatory dust, not space */
export const REALM_PARTICLE_SPEED: Record<RealmSlug, number> = {
  reality: 1.15,
  relationship: 0.85,
  meaning: 1.35,
  identity: 1,
  language: 0.75,
  time: 1.5,
  embodiment: 0.9,
  freedom: 1.25,
  consciousness: 1.1,
};

/** Sound layer LFO rate (Hz) — each realm breathes at its own pace */
export const REALM_SOUND_LFO: Record<RealmSlug, number> = {
  reality: 0.006,
  relationship: 0.011,
  meaning: 0.005,
  identity: 0.009,
  language: 0.014,
  time: 0.004,
  embodiment: 0.01,
  freedom: 0.007,
  consciousness: 0.008,
};
