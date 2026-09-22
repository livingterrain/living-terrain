import { EssayNewsletterCTA } from "@/components/newsletter/EssayNewsletterCTA";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { withCanonical } from "@/lib/seo";
import { LanternReadingShell } from "@/components/world/LanternReadingShell";
import { TextLink } from "@/components/design-system";
import { EssayThreadBelonging } from "@/components/reading/EssayThreadBelonging";
import { renderBody } from "@/components/reading/Prose";
import {
  getAllEssays,
  getEssayBySlug,
  getEssayPublicationCta,
} from "@/lib/content";
import { refFromEssay } from "@/lib/relationships";
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

  // SEO canonical stays on Living Terrain — never Medium/Substack.
  return withCanonical(`/essays/${slug}`, {
    title: essay.title,
    description: essay.excerpt,
    ...(essay.featuredImage
      ? { openGraph: { images: [{ url: essay.featuredImage }] } }
      : {}),
  });
}

export default async function EssayPage({ params }: PageProps) {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);
  if (!essay) notFound();

  const hasBody = Boolean(essay.body?.trim());
  const publication = getEssayPublicationCta(essay);

  const publicationWhisper =
    hasBody && publication.href && publication.sourceLabel ? (
      <p className="lantern-meta mt-10 text-[0.8125rem] leading-relaxed">
        Also published on{" "}
        <TextLink
          href={publication.href}
          external
          className="lantern-link text-[0.8125rem]"
        >
          {publication.sourceLabel}
        </TextLink>
        .
      </p>
    ) : null;

  return (
    <LanternReadingShell
      collection="Essay"
      title={essay.title}
      subtitle={essay.subtitle}
      meta={
        <>
          {formatDate(essay.publishedAt)}
          {essay.topics.length > 0 && (
            <span className="mt-1 block">{essay.topics.join(" · ")}</span>
          )}
        </>
      }
      afterContent={<EssayThreadBelonging threadIds={essay.threadIds} />}
      nodeRef={hasBody ? refFromEssay(essay) : undefined}
      afterThread={
        <>
          {publicationWhisper}
          <EssayNewsletterCTA hasFullEssay={hasBody} />
        </>
      }
      returnHref="/essays"
      variant="library"
    >
      {hasBody ? (
        <div>{renderBody(essay.body!)}</div>
      ) : (
        <>
          <p>{essay.excerpt}</p>
          {publication.href && publication.sourceLabel && publication.readLabel ? (
            <>
              <p className="lantern-meta mt-8 text-[0.9375rem]">
                The full essay is published on {publication.sourceLabel}. Living
                Terrain holds it here as part of a connected investigation.
              </p>
              <TextLink
                href={publication.href}
                external
                className="lantern-link mt-8 inline-block"
              >
                {publication.readLabel}
              </TextLink>
            </>
          ) : (
            <p className="lantern-meta mt-8 text-[0.9375rem]">
              Living Terrain holds this piece as part of a connected
              investigation. The full text is not yet available here.
            </p>
          )}
        </>
      )}
    </LanternReadingShell>
  );
}
