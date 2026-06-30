import type { CircadianTokens } from "@/lib/atmosphere/circadian";
import {
  getRouteZone,
  themeAtmosphereForPath,
  type RouteZone,
} from "@/lib/atmosphere/route-zone";

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

const ZONE_BASE: Record<RouteZone, Omit<AtmosphereMorph, "voidColor" | "starColor" | "paperColor" | "glowColor">> = {
  map: {
    voidOpacity: 1,
    paperOpacity: 0,
    starOpacity: 0.88,
    starDriftSec: 95,
    particleOpacity: 0.42,
    particleDriftSec: 48,
    glowOpacity: 0.22,
    fieldOpacity: 0,
    themeOpacity: 0,
    fogOpacity: 0.55,
    fogWarmth: 0.35,
  },
  reading: {
    voidOpacity: 0,
    paperOpacity: 0.97,
    starOpacity: 0.035,
    starDriftSec: 140,
    particleOpacity: 0.08,
    particleDriftSec: 90,
    glowOpacity: 0.14,
    fieldOpacity: 0.38,
    themeOpacity: 0,
    fogOpacity: 0.08,
    fogWarmth: 0.65,
  },
  theme: {
    voidOpacity: 0.9,
    paperOpacity: 0,
    starOpacity: 0.2,
    starDriftSec: 110,
    particleOpacity: 0.28,
    particleDriftSec: 62,
    glowOpacity: 0.32,
    fieldOpacity: 0,
    themeOpacity: 1,
    fogOpacity: 0.38,
    fogWarmth: 0.5,
  },
  neutral: {
    voidOpacity: 0,
    paperOpacity: 0.95,
    starOpacity: 0.025,
    starDriftSec: 130,
    particleOpacity: 0.06,
    particleDriftSec: 85,
    glowOpacity: 0.12,
    fieldOpacity: 0.4,
    themeOpacity: 0,
    fogOpacity: 0.06,
    fogWarmth: 0.55,
  },
};

export function atmosphereMorphForPath(
  path: string,
  circadian: CircadianTokens,
): AtmosphereMorph {
  const zone = getRouteZone(path);
  const base = ZONE_BASE[zone];

  const starOpacity =
    base.starOpacity *
    (zone === "map" ? circadian.starMul : 0.85 + circadian.starMul * 0.15);

  const particleOpacity =
    base.particleOpacity *
    (zone === "map" ? 1 : 0.7) *
    (1 / circadian.particleMul);

  const starDriftSec = base.starDriftSec * circadian.particleMul;
  const particleDriftSec = base.particleDriftSec * circadian.particleMul;

  return {
    voidColor: zone === "map" ? circadian.voidBase : "#06080c",
    voidOpacity: base.voidOpacity,
    paperColor: circadian.ivoryTint,
    paperOpacity: base.paperOpacity + circadian.ivoryMix * 0.04,
    starOpacity,
    starColor: circadian.starColor,
    starDriftSec,
    particleOpacity,
    particleDriftSec,
    glowOpacity: base.glowOpacity * circadian.lightPoolOpacity,
    glowColor:
      zone === "reading" || zone === "neutral"
        ? circadian.ivoryTint
        : circadian.ambientTop,
    fieldOpacity: base.fieldOpacity * circadian.fieldOpacity,
    themeOpacity: base.themeOpacity,
    fogOpacity: base.fogOpacity * circadian.fogMul,
    fogWarmth: base.fogWarmth * circadian.fogWarmth + circadian.warmth * 0.2,
  };
}

export function themeBackgroundForPath(path: string): string | undefined {
  return themeAtmosphereForPath(path);
}
