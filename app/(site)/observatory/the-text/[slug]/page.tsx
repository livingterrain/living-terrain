import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { withCanonical } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Room } from "@/components/environment";
import {
  InstrumentListen,
  PassageExperience,
  PassageSpeechProvider,
} from "@/components/observatory/the-text";
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
  return withCanonical(`/observatory/the-text/${slug}`, {
    title: passage.reference,
    description: passage.whisper,
  });
}

export default async function PassagePage({ params }: Props) {
  const { slug } = await params;
  const passage = getPassageBySlug(slug);
  if (!passage) notFound();

  return (
    <Room kind="observatory">
      <PassageSpeechProvider passage={passage}>
        <InstrumentListen
          reading={{
            id: passage.id,
            reference: passage.reference,
            englishText: passage.englishPrimary.text,
            englishLabel: passage.englishPrimary.label,
          }}
        />
        <section className="obs-bench pb-28 pt-10 sm:pb-36 sm:pt-14">
          <Container className="max-w-[46rem]">
            <PassageExperience passage={passage} />
          </Container>
        </section>
      </PassageSpeechProvider>
    </Room>
  );
}
