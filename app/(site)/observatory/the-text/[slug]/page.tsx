import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Room } from "@/components/environment";
import { ObservatoryRoomTone } from "@/components/observatory/ObservatoryRoomTone";
import { PassageExperience } from "@/components/observatory/the-text";
import {
  getPassageBySlug,
  getPassageSummaries,
  getReadyPassageSlugs,
} from "@/lib/observatory/the-text";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getReadyPassageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const passage = getPassageBySlug(slug);
  if (!passage) {
    const summary = getPassageSummaries().find((p) => p.slug === slug);
    return { title: summary?.reference ?? "Passage" };
  }
  return {
    title: passage.reference,
    description: passage.whisper,
  };
}

export default async function PassagePage({ params }: Props) {
  const { slug } = await params;
  const passage = getPassageBySlug(slug);
  if (!passage) notFound();

  return (
    <Room kind="observatory">
      <ObservatoryRoomTone />
      <section className="obs-bench pb-28 pt-10 sm:pb-36 sm:pt-14">
        <Container className="max-w-[46rem]">
          <PassageExperience passage={passage} />
        </Container>
      </section>
    </Room>
  );
}
