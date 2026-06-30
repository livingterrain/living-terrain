import type { RealmSlug } from "@/lib/realms/types";

export type SoundLayerId =
  | "harmonic"
  | "wind"
  | "realmReality"
  | "realmRelationship"
  | "realmMeaning"
  | "realmIdentity"
  | "realmLanguage"
  | "realmTime"
  | "chamberDrone"
  | "archiveRoom"
  | "fieldWind"
  | "observatoryAir";

export type SoundScene =
  | "silence"
  | "constellation"
  | `realm-${RealmSlug}`
  | "chamber"
  | "archive"
  | "field-notes"
  | "observatory"
  | "reading"
  | "pathways";

export interface TerrainSoundState {
  /** User has crossed the threshold — sound may play */
  activated: boolean;
  muted: boolean;
  scene: SoundScene;
}

export const SOUND_MUTE_KEY = "lt-sound-muted";
