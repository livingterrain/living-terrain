"use client";

import type { ThemeHub } from "@/lib/realms/types";
import { RealityRealm } from "./RealityRealm";
import { RelationshipRealm } from "./RelationshipRealm";
import { MeaningRealm } from "./MeaningRealm";
import { IdentityRealm } from "./IdentityRealm";
import { LanguageRealm } from "./LanguageRealm";
import { TimeRealm } from "./TimeRealm";
import { EmbodimentRealm } from "./EmbodimentRealm";
import { FreedomRealm } from "./FreedomRealm";
import { ConsciousnessRealm } from "./ConsciousnessRealm";

interface RealmExperienceProps {
  hub: ThemeHub;
}

export function RealmExperience({ hub }: RealmExperienceProps) {
  switch (hub.config.slug) {
    case "reality":
      return <RealityRealm hub={hub} />;
    case "relationship":
      return <RelationshipRealm hub={hub} />;
    case "meaning":
      return <MeaningRealm hub={hub} />;
    case "identity":
      return <IdentityRealm hub={hub} />;
    case "language":
      return <LanguageRealm hub={hub} />;
    case "time":
      return <TimeRealm hub={hub} />;
    case "embodiment":
      return <EmbodimentRealm hub={hub} />;
    case "freedom":
      return <FreedomRealm hub={hub} />;
    case "consciousness":
      return <ConsciousnessRealm hub={hub} />;
    default:
      return null;
  }
}
