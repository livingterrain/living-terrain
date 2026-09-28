import type { Metadata } from "next";
import { withCanonical } from "@/lib/seo";
import { AtlasV1 } from "@/components/atlas-v1/AtlasV1";
import { getAtlasCanonicalView } from "@/lib/canonical/atlas-view";

export const metadata: Metadata = withCanonical("/atlas", {
  title: "The Atlas",
  description:
    "Follow relationships across the work of Living Terrain. Enter through a living question — maps of completed investigations wait beyond.",
});

/**
 * The Atlas — public entry.
 * The Void (attention threshold) → questions → Journey → Evidence → Pause.
 * Charted map plates remain at /atlas/[slug]; the finding aid at /atlas/charts.
 */
export default function AtlasPage() {
  const canonical = getAtlasCanonicalView();
  return <AtlasV1 canonical={canonical} />;
}
