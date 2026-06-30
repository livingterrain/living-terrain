"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { sceneFromPathname } from "@/lib/sound/scenes";
import { useTerrainSoundOptional } from "./TerrainSoundProvider";

/** Adapts soundscape to the current route after threshold activation */
export function SoundNavigationBridge() {
  const pathname = usePathname();
  const sound = useTerrainSoundOptional();

  useEffect(() => {
    if (!sound?.activated) return;
    if (pathname === "/") return;
    sound.setScene(sceneFromPathname(pathname));
  }, [pathname, sound]);

  return null;
}
