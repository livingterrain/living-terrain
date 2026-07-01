import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ObservatoryReadingShell } from "@/components/observatory/ObservatoryReadingShell";
import {
  getGrowingIdeaBySlug,
  getGrowingIdeas,
  growingMaturityLabel,
} from "@/lib/observatory/growing-ideas-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getGrowingIdeas().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const idea = getGrowingIdeaBySlug(slug);
  if (!idea) return { title: "Growing Idea Not Found" };
  return {
    title: idea.title,
    description: idea.body ?? "An idea still becoming.",
  };
}

export default async function GrowingIdeaPage({ params }: PageProps) {
  const { slug } = await params;
  const idea = getGrowingIdeaBySlug(slug);
  if (!idea) notFound();

  return (
    <ObservatoryReadingShell
      collection="Growing Idea"
      title={idea.title}
      meta={growingMaturityLabel(idea.maturity)}
      returnHref={`/observatory/growing/${idea.slug}`}
    >
      {idea.body ? (
        <p>{idea.body}</p>
      ) : (
        <p className="italic text-[var(--obs-muted)]">
          Still a seed — the shape has not yet formed.
        </p>
      )}
    </ObservatoryReadingShell>
  );
}
