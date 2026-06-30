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

  if (pathname.startsWith("/structure-beneath-reality")) return "chamber";
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
  if (pathname.startsWith("/quotations")) return "reading";

  return "reading";
}

export const SCENE_CROSSFADE_SEC = 4.5;

/** Target layer gains per scene (0–1) — sparse, restorative */
export const SCENE_LAYER_GAINS: Record<
  SoundScene,
  Partial<Record<string, number>>
> = {
  silence: {},
  constellation: {
    harmonic: 0.14,
    wind: 0.22,
  },
  "realm-reality": {
    harmonic: 0.09,
    wind: 0.07,
    realmReality: 0.28,
  },
  "realm-relationship": {
    harmonic: 0.1,
    wind: 0.06,
    realmRelationship: 0.27,
  },
  "realm-meaning": {
    harmonic: 0.07,
    wind: 0.05,
    realmMeaning: 0.25,
  },
  "realm-identity": {
    harmonic: 0.08,
    wind: 0.05,
    realmIdentity: 0.24,
  },
  "realm-language": {
    harmonic: 0.06,
    wind: 0.04,
    realmLanguage: 0.21,
  },
  "realm-time": {
    harmonic: 0.07,
    wind: 0.06,
    realmTime: 0.26,
  },
  "realm-embodiment": {
    harmonic: 0.08,
    wind: 0.05,
    realmIdentity: 0.22,
  },
  "realm-freedom": {
    harmonic: 0.09,
    wind: 0.08,
    realmMeaning: 0.2,
  },
  "realm-consciousness": {
    harmonic: 0.08,
    wind: 0.06,
    realmRelationship: 0.18,
  },
  chamber: {
    harmonic: 0.08,
    wind: 0.1,
    chamberDrone: 0.16,
  },
  archive: {
    harmonic: 0.04,
    wind: 0.03,
    archiveRoom: 0.22,
  },
  "field-notes": {
    harmonic: 0.05,
    wind: 0.13,
    fieldWind: 0.24,
  },
  observatory: {
    harmonic: 0.1,
    wind: 0.12,
    observatoryAir: 0.14,
  },
  reading: {
    harmonic: 0.07,
    wind: 0.04,
  },
  pathways: {
    harmonic: 0.08,
    wind: 0.07,
  },
};
