import { EssayNewsletterCTA } from "@/components/newsletter/EssayNewsletterCTA";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl, withCanonical } from "@/lib/seo";
import { siteConfig } from "@/lib/content/data";
import type { EssayPublicationSource } from "@/lib/content/publication-cta";
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
    authors: [{ name: siteConfig.author, url: absoluteUrl("/about") }],
    openGraph: {
      type: "article",
      title: essay.title,
      description: essay.excerpt,
      url: absoluteUrl(`/essays/${slug}`),
      siteName: siteConfig.name,
      locale: "en_US",
      publishedTime: essay.publishedAt,
      authors: [siteConfig.author],
      ...(essay.featuredImage ? { images: [{ url: essay.featuredImage }] } : {}),
    },
  });
}

function essayJsonLd(essay: NonNullable<ReturnType<typeof getEssayBySlug>>) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: essay.title,
    description: essay.excerpt,
    datePublished: essay.publishedAt,
    url: absoluteUrl(`/essays/${essay.slug}`),
    ...(essay.featuredImage ? { image: essay.featuredImage } : {}),
    author: {
      "@type": "Person",
      name: siteConfig.author,
      url: absoluteUrl("/about"),
    },
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
  };
}

function fullEssayNotice(source: EssayPublicationSource): string {
  if (source === "Substack") {
    return "The full essay is published on Substack. This page holds its place in Living Terrain, where it connects to the rest of the work.";
  }
  if (source === "Medium") {
    return "This earlier essay is still published on Medium. This page holds its place in Living Terrain, where it connects to the rest of the work.";
  }
  return "The full essay is published elsewhere. This page holds its place in Living Terrain, where it connects to the rest of the work.";
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
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(essayJsonLd(essay)).replace(/</g, "\\u003c") }}
    />
    <LanternReadingShell
      collection="Essay"
      title={essay.title}
      subtitle={essay.subtitle}
      meta={
        <>
          {siteConfig.author} · {formatDate(essay.publishedAt)}
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
          {publication.href && publication.source && publication.sourceLabel ? (
            <>
              <p className="lantern-meta mt-8 text-[0.9375rem]">
                {fullEssayNotice(publication.source)}
              </p>
              <TextLink
                href={publication.href}
                external
                className="lantern-link mt-8 inline-block"
              >
                Read the full essay on {publication.sourceLabel}
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
    </>
  );
}
