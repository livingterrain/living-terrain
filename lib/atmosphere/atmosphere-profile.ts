import type { CircadianTokens } from "@/lib/atmosphere/circadian";
import {
  getRouteZone,
  themeAtmosphereForPath,
  type RouteZone,
} from "@/lib/atmosphere/route-zone";
import { THRESHOLD_MOTION } from "@/lib/design-system/threshold";

export interface AtmosphereMorph {
  voidColor: string;
  voidOpacity: number;
  paperColor: string;
  paperOpacity: number;
  starOpacity: number;
  starColor: string;
  starDriftSec: number;
  particleOpacity: number;
  particleDriftSec: number;
  glowOpacity: number;
  glowColor: string;
  fieldOpacity: number;
  themeOpacity: number;
  fogOpacity: number;
  fogWarmth: number;
}

/** V2 morph — cool mineral field; paper/fog warmth suppressed. */
const ZONE_BASE: Record<
  RouteZone,
  Omit<AtmosphereMorph, "voidColor" | "starColor" | "paperColor" | "glowColor">
> = {
  map: {
    voidOpacity: 1,
    paperOpacity: 0,
    starOpacity: 0.55,
    starDriftSec: THRESHOLD_MOTION.driftSec,
    particleOpacity: 0.12,
    particleDriftSec: THRESHOLD_MOTION.crossingSec,
    glowOpacity: 0.08,
    fieldOpacity: 0,
    themeOpacity: 0,
    fogOpacity: 0.08,
    fogWarmth: 0,
  },
  reading: {
    voidOpacity: 1,
    paperOpacity: 0,
    starOpacity: 0.02,
    starDriftSec: THRESHOLD_MOTION.dawnSec,
    particleOpacity: 0.02,
    particleDriftSec: THRESHOLD_MOTION.dawnSec,
    glowOpacity: 0.04,
    fieldOpacity: 0.08,
    themeOpacity: 0,
    fogOpacity: 0.02,
    fogWarmth: 0,
  },
  theme: {
    voidOpacity: 1,
    paperOpacity: 0,
    starOpacity: 0.1,
    starDriftSec: THRESHOLD_MOTION.crossingSec,
    particleOpacity: 0.08,
    particleDriftSec: THRESHOLD_MOTION.driftSec,
    glowOpacity: 0.1,
    fieldOpacity: 0,
    themeOpacity: 1,
    fogOpacity: 0.06,
    fogWarmth: 0,
  },
  neutral: {
    voidOpacity: 1,
    paperOpacity: 0,
    starOpacity: 0.06,
    starDriftSec: THRESHOLD_MOTION.dawnSec,
    particleOpacity: 0.03,
    particleDriftSec: THRESHOLD_MOTION.crossingSec,
    glowOpacity: 0.05,
    fieldOpacity: 0.1,
    themeOpacity: 0,
    fogOpacity: 0.03,
    fogWarmth: 0,
  },
};

export function atmosphereMorphForPath(
  path: string,
  circadian: CircadianTokens,
  depth = 0,
): AtmosphereMorph {
  const zone = getRouteZone(path);
  const base = ZONE_BASE[zone];
  const depthMul = 0.85 + depth * 0.28;

  const starOpacity =
    base.starOpacity *
    (zone === "map" ? circadian.starMul : 0.85 + circadian.starMul * 0.12) *
    (1 - depth * 0.35);

  const particleOpacity =
    base.particleOpacity * (zone === "map" ? 1 : 0.65) * (1 / circadian.particleMul);

  const starDriftSec = Math.max(
    THRESHOLD_MOTION.ambientMinSec,
    base.starDriftSec * circadian.particleMul,
  );
  const particleDriftSec = Math.max(
    THRESHOLD_MOTION.ambientMinSec,
    base.particleDriftSec * circadian.particleMul,
  );

  return {
    voidColor: "#030405",
    voidOpacity: Math.min(1, base.voidOpacity + depth * 0.08),
    paperColor: "transparent",
    paperOpacity: 0,
    starOpacity,
    starColor: circadian.starColor,
    starDriftSec,
    particleOpacity,
    particleDriftSec,
    glowOpacity:
      base.glowOpacity * circadian.lightPoolOpacity * (1 - depth * 0.15),
    glowColor: circadian.ambientTop,
    fieldOpacity: base.fieldOpacity * circadian.fieldOpacity * (1 - depth * 0.2),
    themeOpacity: base.themeOpacity,
    fogOpacity: base.fogOpacity * Math.min(1, circadian.fogMul * 0.35) * depthMul,
    fogWarmth: 0,
  };
}

export function themeBackgroundForPath(path: string): string | undefined {
  return themeAtmosphereForPath(path);
}
