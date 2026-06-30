import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import {
  ConstellationConcept,
  DrawersConcept,
  NotebookConcept,
  MyceliumConcept,
  FieldConcept,
} from "@/components/concepts";
import { concepts, getConcept, type ConceptSlug } from "@/lib/concepts";

const prototypes: Record<ConceptSlug, () => ReactElement> = {
  constellation: () => <ConstellationConcept />,
  drawers: () => <DrawersConcept />,
  notebook: () => <NotebookConcept />,
  mycelium: () => <MyceliumConcept />,
  field: () => <FieldConcept />,
};

export function generateStaticParams() {
  return concepts.map((c) => ({ slug: c.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ConceptPage({ params }: PageProps) {
  const { slug } = await params;
  const concept = getConcept(slug);
  if (!concept) notFound();

  const Prototype = prototypes[concept.slug as ConceptSlug];
  return <Prototype />;
}
