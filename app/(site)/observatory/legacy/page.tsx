import type { Metadata } from "next";
import { ObservatoryShell } from "@/components/observatory/ObservatoryShell";
import { ObservatoryUniverse } from "@/components/observatory/universe";
import type { ObservationSlip } from "@/components/observatory/universe/ObservatoryRecentObservations";
import type { TableLatestEntry } from "@/components/observatory/universe/ObservatoryTable";
import { getMajorConceptThemes } from "@/lib/concepts/major-concepts";
import { getEssayClusters } from "@/lib/content";
import { getObservatoryCollections } from "@/lib/observatory/collections";
import {
  contributorLabel,
  displayTitle,
  themeTitlesForObservation,
} from "@/lib/observatory/display";
import { getRecentObservations } from "@/lib/observatory/visitor-observations.server";

export const metadata: Metadata = {
  title: "Observatory — Legacy",
  description:
    "The previous content-based Observatory — preserved for reference.",
  robots: { index: false, follow: false },
};

const MAX_SLIPS = 6;

function excerptOf(body: string): string {
  const trimmed = body.trim();
  if (trimmed.length <= 150) return trimmed;
  return `${trimmed.slice(0, 149).trim()}…`;
}

export default function ObservatoryLegacyPage() {
  const { fieldNotes, threads, growingIdeas } = getObservatoryCollections();
  const clusters = getEssayClusters();
  const concepts = getMajorConceptThemes();

  const observationSlips: ObservationSlip[] = getRecentObservations(4).map(
    (o) => ({
      id: o.id,
      kind: "observation",
      title: displayTitle(o),
      excerpt: excerptOf(o.body),
      href: `/observatory/observations/${o.slug}`,
      date: o.createdAt,
      themes: themeTitlesForObservation(o),
      attribution: contributorLabel(o),
    }),
  );

  const noteSlips: ObservationSlip[] = [...fieldNotes]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 4)
    .map((n) => ({
      id: n.id,
      kind: "field-note",
      title: n.title ?? "Field note",
      excerpt: excerptOf(n.body),
      href: `/field-notes/${n.slug}`,
      date: n.publishedAt,
      themes: [],
      attribution: n.location,
    }));

  const slips = [...observationSlips, ...noteSlips]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, MAX_SLIPS);

  const first = slips[0];
  const latest: TableLatestEntry | undefined = first
    ? { title: first.title, href: first.href, kind: first.kind }
    : undefined;

  return (
    <ObservatoryShell className="obs-universe-realm">
      <ObservatoryUniverse
        clusters={clusters}
        slips={slips}
        latest={latest}
        threads={threads}
        growingIdeas={growingIdeas}
        concepts={concepts}
      />
    </ObservatoryShell>
  );
}
