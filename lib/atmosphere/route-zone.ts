import {
  isMapPath,
  isReadingPath,
  isThemePath,
} from "@/lib/atmosphere/navigation";
import { roomForPath } from "@/lib/rooms";
import { getRealmConfig } from "@/lib/realms/config";

export type RouteZone = "map" | "reading" | "theme" | "neutral";

export interface ZoneLayerOpacities {
  void: number;
  stars: number;
  paper: number;
  field: number;
  theme: number;
}

const ZONE_LAYERS: Record<RouteZone, ZoneLayerOpacities> = {
  map: { void: 1, stars: 0.92, paper: 0, field: 0, theme: 0 },
  reading: { void: 0, stars: 0.04, paper: 0.98, field: 0.35, theme: 0 },
  theme: { void: 0.88, stars: 0.22, paper: 0, field: 0, theme: 1 },
  neutral: { void: 0, stars: 0.03, paper: 0.96, field: 0.42, theme: 0 },
};

export function getRouteZone(path: string): RouteZone {
  if (isMapPath(path)) return "map";
  if (isThemePath(path)) return "theme";
  if (isReadingPath(path) || roomForPath(path)) return "reading";
  return "neutral";
}

export function zoneLayerOpacities(zone: RouteZone): ZoneLayerOpacities {
  return ZONE_LAYERS[zone];
}

export function themeAtmosphereForPath(path: string): string | undefined {
  const match = path.match(/^\/themes\/([^/]+)$/);
  if (!match) return undefined;
  const config = getRealmConfig(match[1]);
  return config?.palette.bgGradient ?? config?.palette.bg;
}
