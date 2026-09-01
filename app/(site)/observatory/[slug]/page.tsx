import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Room } from "@/components/environment";
import { InvestigationView } from "@/components/observatory/InvestigationView";
import { ObservatoryRoomTone } from "@/components/observatory/ObservatoryRoomTone";
import {
  DISSOLVED_INVESTIGATIONS,
  getInvestigationBySlug,
  getInvestigations,
} from "@/lib/observatory/investigations";

type Props = { params: Promise<{ slug: string }> };

const RESERVED = new Set([
  "growing",
  "observations",
  "proto",
  "cinematic",
  "legacy",
  "threads",
  "q",
]);

export function generateStaticParams() {
  return [...getInvestigations(), ...DISSOLVED_INVESTIGATIONS].map((i) => ({
    slug: i.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const investigation = getInvestigationBySlug(slug);
  if (!investigation) return { title: "Investigation" };
  return {
    title: investigation.title ?? "Investigation",
    description: investigation.description ?? investigation.whisper ?? undefined,
  };
}

export default async function InvestigationPage({ params }: Props) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();

  const investigation = getInvestigationBySlug(slug);
  if (!investigation) notFound();

  return (
    <Room kind="observatory">
      <ObservatoryRoomTone />

      <section className="obs-bench pb-28 pt-10 sm:pb-36 sm:pt-14">
        <Container className="max-w-[46rem]">
          <InvestigationView investigation={investigation} />
        </Container>
      </section>
    </Room>
  );
}
