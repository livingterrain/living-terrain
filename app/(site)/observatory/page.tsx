import type { Metadata } from "next";
import { ObservatoryShell } from "@/components/observatory/ObservatoryShell";
import { ObservatoryUniverse } from "@/components/observatory/universe";
import { getMajorConceptThemes } from "@/lib/concepts/major-concepts";
import { getEssayClusters } from "@/lib/content";
import { getObservatoryCollections } from "@/lib/observatory/collections";

export const metadata: Metadata = {
  title: "Observatory",
  description:
    "A warm cabinet of living observations — where evidence quietly accumulates and questions remain open.",
};

export default function ObservatoryPage() {
  const { fieldNotes, threads, growingIdeas } = getObservatoryCollections();
  const clusters = getEssayClusters();
  const concepts = getMajorConceptThemes();

  return (
    <ObservatoryShell className="obs-universe-realm">
      <ObservatoryUniverse
        clusters={clusters}
        fieldNotes={fieldNotes}
        threads={threads}
        growingIdeas={growingIdeas}
        concepts={concepts}
      />
    </ObservatoryShell>
  );
}
