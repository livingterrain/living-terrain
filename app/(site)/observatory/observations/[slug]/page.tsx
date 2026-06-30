import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { Prose, renderBody } from "@/components/reading/Prose";
import { Thread } from "@/components/thread";
import { TextLink } from "@/components/design-system";
import { FadeIn } from "@/components/motion/FadeIn";
import {
  contributorLabel,
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

  const title = observation.title ?? "Observation";
  return {
    title,
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
    <Room kind="observatory">
      <RoomThreshold
        kind="observatory"
        title={observation.title ?? undefined}
        whisper="An observation from the field"
      >
        <p className="type-meta mt-4">
          {formatDate(observation.createdAt)}
          {observation.terrainLocation ? ` · ${observation.terrainLocation}` : ""}
        </p>
        {themes.length > 0 && (
          <p className="type-meta mt-3 text-forest-faint">{themes.join(" · ")}</p>
        )}
        <p className="type-meta mt-3 text-charcoal-faint/80">
          {contributorLabel(observation)}
        </p>
      </RoomThreshold>

      <section className="pb-32 pt-10 sm:pb-40">
        <Container narrow>
          <FadeIn>
            <Prose className="text-[1.0625rem] leading-relaxed sm:text-lg">
              {renderBody(observation.body)}
            </Prose>

            <Thread
              nodeRef={nodeRef}
              returnHref={`/observatory/observations/${observation.slug}`}
            />
          </FadeIn>

          <div className="mt-16 border-t border-rule/50 pt-8">
            <TextLink href="/observatory" className="type-body text-sm">
              ← Back to the Observatory
            </TextLink>
          </div>
        </Container>
      </section>
    </Room>
  );
}
