import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { Thread } from "@/components/thread";
import { QuietDiscovery } from "@/components/reading/QuietDiscovery";
import { TerrainConnectionInvite } from "@/components/reading/TerrainConnectionInvite";
import { TextLink } from "@/components/design-system";
import { FadeIn } from "@/components/motion/FadeIn";
import {
  getAllEssays,
  getEssayBySlug,
  getEssayReadUrl,
} from "@/lib/content";
import { refFromEssay } from "@/lib/relationships";
import { pickDiscoveryCue } from "@/lib/reading/discovery-cue";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllEssays().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);
  if (!essay) return { title: "Essay Not Found" };

  return {
    title: essay.title,
    description: essay.excerpt,
  };
}

export default async function EssayPage({ params }: PageProps) {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);
  if (!essay) notFound();

  const nodeRef = refFromEssay(essay);
  const discoveryCue = pickDiscoveryCue(nodeRef);

  return (
    <Room kind="reading">
      <RoomThreshold kind="reading" title={essay.title}>
        {essay.subtitle && (
          <p className="type-lead mt-4 text-base sm:text-lg">{essay.subtitle}</p>
        )}
        <p className="type-meta mt-6">{formatDate(essay.publishedAt)}</p>
        {essay.topics.length > 0 && (
          <p className="type-meta mt-3 text-forest-faint">
            {essay.topics.join(" · ")}
          </p>
        )}
      </RoomThreshold>

      <section className="pb-32 pt-10 sm:pb-40">
        <Container narrow>
          <FadeIn>
            <p className="type-body sm:text-lg">{essay.excerpt}</p>

            <p className="type-body mt-8 text-[0.9375rem]">
              The full essay is published on Medium. Living Terrain links to it
              here as part of a curated map of the work.
            </p>

            <TextLink href={getEssayReadUrl(essay)} external className="mt-8 inline-block">
              Read on Medium
            </TextLink>

            <TerrainConnectionInvite nodeRef={nodeRef} className="mt-12" />

            <Thread
              nodeRef={nodeRef}
              returnHref={`/essays/${essay.slug}`}
            />
          </FadeIn>

          {discoveryCue && (
            <QuietDiscovery nodeRef={nodeRef} cue={discoveryCue} />
          )}

          <div className="mt-16 border-t border-rule/50 pt-8">
            <TextLink href="/essays" className="type-body text-sm">
              ← Back to the reading room
            </TextLink>
          </div>
        </Container>
      </section>
    </Room>
  );
}
