import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { Prose, renderBody } from "@/components/reading/Prose";
import { Thread } from "@/components/thread";
import { TextLink } from "@/components/design-system";
import { FadeIn } from "@/components/motion/FadeIn";
import { getAllQuotations, getQuotationBySlug } from "@/lib/content";
import { refFromQuotation } from "@/lib/relationships";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllQuotations().map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const quotation = getQuotationBySlug(slug);
  if (!quotation) return { title: "Quotation Not Found" };

  return {
    title: quotation.text.slice(0, 60),
    description: quotation.attribution ?? quotation.text,
  };
}

export default async function QuotationPage({ params }: PageProps) {
  const { slug } = await params;
  const quotation = getQuotationBySlug(slug);
  if (!quotation) notFound();

  return (
    <Room kind="notebook">
      <RoomThreshold kind="notebook" whisper="A voice in the margin">
        {quotation.attribution && (
          <p className="type-meta mt-2">{quotation.attribution}</p>
        )}
      </RoomThreshold>

      <section className="pb-32 pt-10 sm:pb-40">
        <Container narrow>
          <FadeIn>
            <Prose className="italic text-lg sm:text-xl">
              {renderBody(quotation.text)}
            </Prose>
            {quotation.source && (
              <p className="type-meta mt-6 text-forest-faint">{quotation.source}</p>
            )}
            <Thread
              nodeRef={refFromQuotation(quotation)}
              returnHref={`/quotations/${quotation.slug}`}
            />
          </FadeIn>

          <div className="mt-16 border-t border-rule/50 pt-8">
            <TextLink href="/" className="type-body text-sm">
              ← Back to the threshold
            </TextLink>
          </div>
        </Container>
      </section>
    </Room>
  );
}
