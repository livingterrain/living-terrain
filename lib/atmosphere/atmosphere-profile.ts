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

const ZONE_BASE: Record<
  RouteZone,
  Omit<AtmosphereMorph, "voidColor" | "starColor" | "paperColor" | "glowColor">
> = {
  map: {
    voidOpacity: 1,
    paperOpacity: 0,
    starOpacity: 0.75,
    starDriftSec: THRESHOLD_MOTION.driftSec,
    particleOpacity: 0.28,
    particleDriftSec: THRESHOLD_MOTION.crossingSec,
    glowOpacity: 0.18,
    fieldOpacity: 0,
    themeOpacity: 0,
    fogOpacity: 0.42,
    fogWarmth: 0.32,
  },
  reading: {
    voidOpacity: 0.72,
    paperOpacity: 0.42,
    starOpacity: 0.04,
    starDriftSec: THRESHOLD_MOTION.dawnSec,
    particleOpacity: 0.045,
    particleDriftSec: THRESHOLD_MOTION.dawnSec,
    glowOpacity: 0.1,
    fieldOpacity: 0.22,
    themeOpacity: 0,
    fogOpacity: 0.14,
    fogWarmth: 0.58,
  },
  theme: {
    voidOpacity: 0.88,
    paperOpacity: 0,
    starOpacity: 0.14,
    starDriftSec: THRESHOLD_MOTION.crossingSec,
    particleOpacity: 0.18,
    particleDriftSec: THRESHOLD_MOTION.driftSec,
    glowOpacity: 0.24,
    fieldOpacity: 0,
    themeOpacity: 1,
    fogOpacity: 0.32,
    fogWarmth: 0.48,
  },
  neutral: {
    voidOpacity: 0.68,
    paperOpacity: 0.38,
    starOpacity: 0.032,
    starDriftSec: THRESHOLD_MOTION.dawnSec,
    particleOpacity: 0.04,
    particleDriftSec: THRESHOLD_MOTION.crossingSec,
    glowOpacity: 0.09,
    fieldOpacity: 0.24,
    themeOpacity: 0,
    fogOpacity: 0.12,
    fogWarmth: 0.52,
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
    voidColor: zone === "map" ? circadian.voidBase : "#06080c",
    voidOpacity: Math.min(1, base.voidOpacity + depth * 0.22),
    paperColor: circadian.ivoryTint,
    paperOpacity: Math.max(0, base.paperOpacity - depth * 0.18),
    starOpacity,
    starColor: circadian.starColor,
    starDriftSec,
    particleOpacity,
    particleDriftSec,
    glowOpacity: base.glowOpacity * circadian.lightPoolOpacity * (1 - depth * 0.15),
    glowColor:
      zone === "reading" || zone === "neutral"
        ? circadian.ivoryTint
        : circadian.ambientTop,
    fieldOpacity: base.fieldOpacity * circadian.fieldOpacity * (1 - depth * 0.2),
    themeOpacity: base.themeOpacity,
    fogOpacity: base.fogOpacity * circadian.fogMul * depthMul,
    fogWarmth: base.fogWarmth * circadian.fogWarmth + circadian.warmth * 0.15,
  };
}

export function themeBackgroundForPath(path: string): string | undefined {
  return themeAtmosphereForPath(path);
}
