import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChamberPage } from "@/components/chamber";
import { BecomingChamber } from "@/components/chamber/editorial/BecomingChamber";
import { getAllProjects, getProjectBySlug } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Chamber Not Found" };

  return {
    title: project.title,
    description: project.introduction,
  };
}

export default async function ChamberRoutePage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  // Editorial chamber prototype — The Biology of Becoming only.
  if (slug === "the-biology-of-becoming") {
    return <BecomingChamber project={project} />;
  }

  const lead =
    slug === "the-structure-beneath-reality"
      ? "The deepest room."
      : "A volume chamber in Living Terrain.";

  return <ChamberPage project={project} lead={lead} />;
}
