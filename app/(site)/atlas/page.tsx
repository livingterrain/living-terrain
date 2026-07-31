import type { Metadata } from "next";
import { AtlasV1 } from "@/components/atlas-v1/AtlasV1";

export const metadata: Metadata = {
  title: "The Atlas",
  description:
    "Enter Living Terrain through a living question. Think through relationships drawn from the published writing — maps of completed investigations wait beyond.",
};

/**
 * The Atlas — public entry.
 * The Void (attention threshold) → questions → Journey → Evidence → Pause.
 * Charted map plates remain at /atlas/[slug]; the finding aid at /atlas/charts.
 */
export default function AtlasPage() {
  return <AtlasV1 />;
}
