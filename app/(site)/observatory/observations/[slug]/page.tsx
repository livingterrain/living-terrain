import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ObservatoryReadingShell } from "@/components/observatory/ObservatoryReadingShell";
import { renderBody } from "@/components/reading/Prose";
import {
  contributorLabel,
  displayTitle,
  themeTitlesForObservation,
} from "@/lib/observatory/display";
import {
  getVisitorObservationBySlug,
  getAllVisitorObservations,
} from "@/lib/observatory/visitor-observations.server";
import type { NodeRef } from "@/lib/relationships";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllVisitorObservations().map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const observation = getVisitorObservationBySlug(slug);
  if (!observation) return { title: "Observation Not Found" };

  return {
    title: displayTitle(observation),
    description: observation.body.slice(0, 160),
  };
}

export default async function ObservationPage({ params }: PageProps) {
  const { slug } = await params;
  const observation = getVisitorObservationBySlug(slug);
  if (!observation) notFound();

  const themes = themeTitlesForObservation(observation);
  const nodeRef: NodeRef = { kind: "observation", id: observation.id };

  return (
    <ObservatoryReadingShell
      collection="Field Note"
      title={displayTitle(observation)}
      meta={
        <>
          {formatDate(observation.createdAt)}
          {observation.terrainLocation ? ` · ${observation.terrainLocation}` : ""}
          {themes.length > 0 && (
            <span className="mt-1 block">{themes.join(" · ")}</span>
          )}
          <span className="mt-1 block">{contributorLabel(observation)}</span>
        </>
      }
      nodeRef={nodeRef}
      returnHref={`/observatory/observations/${observation.slug}`}
    >
      {renderBody(observation.body)}
    </ObservatoryReadingShell>
  );
}
