import type { RealmSlug } from "@/lib/realms/types";
import type { SoundScene } from "./types";

const IMMERSIVE_REALMS: RealmSlug[] = [
  "reality",
  "relationship",
  "meaning",
  "identity",
  "language",
  "time",
  "embodiment",
  "freedom",
  "consciousness",
];

export function sceneFromPathname(pathname: string): SoundScene {
  if (pathname === "/") return "constellation";

  if (pathname.startsWith("/chambers") || pathname.startsWith("/structure-beneath-reality")) {
    return "chamber";
  }
  if (pathname.startsWith("/atlas")) return "atlas";
  if (pathname.startsWith("/library")) return "archive";
  if (pathname.startsWith("/field-notes")) return "field-notes";
  if (pathname.startsWith("/observatory")) return "observatory";
  if (pathname.startsWith("/questions")) return "pathways";

  for (const slug of IMMERSIVE_REALMS) {
    if (pathname === `/themes/${slug}` || pathname.startsWith(`/themes/${slug}/`)) {
      return `realm-${slug}` as SoundScene;
    }
  }

  if (pathname.startsWith("/themes")) return "reading";
  if (pathname.startsWith("/essays")) return "reading";
  if (pathname.startsWith("/inquiry")) return "reading";
  if (pathname.startsWith("/quotations")) return "reading";

  return "reading";
}

export const SCENE_CROSSFADE_SEC = 6;

/**
 * Target layer gains per scene (0–1).
 * Sparse architecture — room tone and air, not music.
 */
export const SCENE_LAYER_GAINS: Record<
  SoundScene,
  Partial<Record<string, number>>
> = {
  silence: {},
  constellation: {
    roomTone: 0.42,
    harmonic: 0.06,
    wind: 0.14,
  },
  "realm-reality": {
    roomTone: 0.32,
    harmonic: 0.04,
    wind: 0.06,
    realmReality: 0.18,
  },
  "realm-relationship": {
    roomTone: 0.32,
    harmonic: 0.04,
    wind: 0.05,
    realmRelationship: 0.17,
  },
  "realm-meaning": {
    roomTone: 0.34,
    harmonic: 0.04,
    wind: 0.05,
    realmMeaning: 0.16,
  },
  "realm-identity": {
    roomTone: 0.32,
    harmonic: 0.04,
    wind: 0.05,
    realmIdentity: 0.15,
  },
  "realm-language": {
    roomTone: 0.3,
    harmonic: 0.03,
    wind: 0.04,
    realmLanguage: 0.14,
  },
  "realm-time": {
    roomTone: 0.36,
    harmonic: 0.04,
    wind: 0.05,
    realmTime: 0.17,
  },
  "realm-embodiment": {
    roomTone: 0.32,
    harmonic: 0.04,
    wind: 0.05,
    realmIdentity: 0.14,
  },
  "realm-freedom": {
    roomTone: 0.32,
    harmonic: 0.04,
    wind: 0.06,
    realmMeaning: 0.13,
  },
  "realm-consciousness": {
    roomTone: 0.34,
    harmonic: 0.04,
    wind: 0.05,
    realmRelationship: 0.12,
  },
  chamber: {
    roomTone: 0.48,
    harmonic: 0.05,
    wind: 0.08,
    chamberDrone: 0.12,
  },
  atlas: {
    roomTone: 0.52,
    harmonic: 0.03,
    wind: 0.06,
    archiveRoom: 0.1,
  },
  archive: {
    roomTone: 0.44,
    harmonic: 0.03,
    wind: 0.04,
    archiveRoom: 0.14,
  },
  "field-notes": {
    roomTone: 0.28,
    harmonic: 0.03,
    wind: 0.1,
    fieldWind: 0.14,
  },
  observatory: {
    roomTone: 0.4,
    harmonic: 0.05,
    wind: 0.08,
    observatoryAir: 0.1,
  },
  reading: {
    roomTone: 0.36,
    harmonic: 0.04,
    wind: 0.05,
  },
  pathways: {
    roomTone: 0.38,
    harmonic: 0.04,
    wind: 0.06,
  },
};
