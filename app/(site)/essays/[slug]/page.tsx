import { EssayNewsletterCTA } from "@/components/newsletter/EssayNewsletterCTA";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanternReadingShell } from "@/components/world/LanternReadingShell";
import { TextLink } from "@/components/design-system";
import { renderBody } from "@/components/reading/Prose";
import {
  getAllEssays,
  getEssayBySlug,
  getEssayReadUrl,
  getEssayReadSource,
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

  return {
    title: essay.title,
    description: essay.excerpt,
    ...(essay.featuredImage
      ? { openGraph: { images: [{ url: essay.featuredImage }] } }
      : {}),
  };
}

export default async function EssayPage({ params }: PageProps) {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);
  if (!essay) notFound();

  const hasBody = Boolean(essay.body?.trim());
  const readUrl = getEssayReadUrl(essay);
  const readSource = getEssayReadSource(essay);

  const publicationWhisper = (
    <p className="lantern-meta mt-10 text-[0.8125rem] leading-relaxed">
      Also published on{" "}
      <TextLink
        href={readUrl}
        external
        className="lantern-link text-[0.8125rem]"
      >
        {readSource}
      </TextLink>
      .
    </p>
  );

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
      nodeRef={hasBody ? refFromEssay(essay) : undefined}
      afterThread={<>{hasBody && publicationWhisper}<EssayNewsletterCTA hasFullEssay={hasBody} /></>}
      returnHref="/essays"
      variant="library"
    >
      {hasBody ? (
        <div>{renderBody(essay.body!)}</div>
      ) : (
        <>
          <p>{essay.excerpt}</p>
          <p className="lantern-meta mt-8 text-[0.9375rem]">
            The full essay is published on {readSource}. Living Terrain holds
            it here as part of a connected investigation.
          </p>
          <TextLink
            href={readUrl}
            external
            className="lantern-link mt-8 inline-block"
          >
            Read on {readSource}
          </TextLink>
        </>
      )}
    </LanternReadingShell>
  );
}
