import type { Metadata } from "next";
import { withCanonical } from "@/lib/seo";
import { EvolutionarySpiralPage } from "@/components/evolutionary-spiral";
import { SPIRAL_COPY } from "@/lib/evolutionary-spiral";

export const metadata: Metadata = withCanonical("/evolutionary-spiral", {
  title: SPIRAL_COPY.name,
  description: SPIRAL_COPY.oneSentenceDefinition,
});

export default function EvolutionarySpiralRoutePage() {
  return <EvolutionarySpiralPage />;
}
