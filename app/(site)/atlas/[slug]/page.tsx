import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { TerritoryThreshold } from "@/components/atlas";
import { Room } from "@/components/environment";
import { getMapBySlug, getTerritoryForMap } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { getAllMaps } = await import("@/lib/content");
  return getAllMaps().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const map = getMapBySlug(slug);
  if (!map) return { title: "Map Not Found" };

  return {
    title: map.title,
    description: map.description,
  };
}

export default async function MapTerritoryPage({ params }: PageProps) {
  const { slug } = await params;
  const map = getMapBySlug(slug);
  if (!map) notFound();

  const territory = getTerritoryForMap(slug);

  return (
    <Room kind="atlas">
      <div className="border-b border-rule/30 px-6 py-16 sm:px-10 sm:py-20">
        <Container narrow>
          <TerritoryThreshold map={map} territory={territory} />
        </Container>
      </div>
    </Room>
  );
}
