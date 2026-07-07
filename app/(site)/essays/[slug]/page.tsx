import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanternReadingShell } from "@/components/world/LanternReadingShell";
import { TextLink } from "@/components/design-system";
import {
  getAllEssays,
  getEssayBySlug,
  getEssayReadUrl,
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

  const nodeRef = refFromEssay(essay);

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
      nodeRef={nodeRef}
      returnHref="/essays"
      variant="library"
    >
      <p>{essay.excerpt}</p>
      <p className="mt-8 text-[0.9375rem] text-charcoal-muted">
        The full essay is published on Medium. Living Terrain holds it here as
        part of a connected investigation.
      </p>
      <TextLink
        href={getEssayReadUrl(essay)}
        external
        className="mt-8 inline-block"
      >
        Read on Medium
      </TextLink>
    </LanternReadingShell>
  );
}
