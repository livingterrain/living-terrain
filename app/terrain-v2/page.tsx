import type { Metadata } from "next";
import { TerrainField } from "@/components/terrain-v2/TerrainField";

export const metadata: Metadata = {
  title: "Terrain v2",
  description:
    "Experimental field — NOTICE → TRACE → CROSS → RETURN. Isolated prototype.",
  robots: { index: false, follow: false },
};

/**
 * Isolated prototype of Living Terrain attention physics.
 * Does not replace /, /atlas, /observatory, or other production rooms.
 */
export default function TerrainV2Page() {
  return <TerrainField />;
}
