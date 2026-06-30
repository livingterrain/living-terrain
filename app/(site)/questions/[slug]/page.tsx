import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { QuestionHubRoom } from "@/components/rooms";
import { Thread } from "@/components/thread";
import { QuietDiscovery } from "@/components/reading/QuietDiscovery";
import { TerrainConnectionInvite } from "@/components/reading/TerrainConnectionInvite";
import { getQuestionBySlug, getQuestionHub, getAllQuestions } from "@/lib/content";
import { refFromQuestion } from "@/lib/relationships";
import { pickDiscoveryCue } from "@/lib/reading/discovery-cue";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllQuestions().map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);
  if (!question) return { title: "Question Not Found" };

  return {
    title: question.title,
    description: question.description,
  };
}

export default async function QuestionPage({ params }: PageProps) {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);
  if (!question) notFound();

  const hub = getQuestionHub(question.id);
  if (!hub) notFound();

  const nodeRef = refFromQuestion(question);
  const discoveryCue = pickDiscoveryCue(nodeRef);

  return (
    <Room kind="pathways">
      <RoomThreshold kind="pathways" title={question.title}>
        {question.subtitle && (
          <p className="type-lead mt-4 text-base sm:text-lg">{question.subtitle}</p>
        )}
      </RoomThreshold>

      <section className="pb-24 pt-8 sm:pb-32">
        <Container narrow>
          <QuestionHubRoom hub={hub} />
          <TerrainConnectionInvite nodeRef={nodeRef} className="mt-10" />
          <Thread
            nodeRef={nodeRef}
            returnHref={`/questions/${question.slug}`}
          />
        </Container>
      </section>

      {discoveryCue && <QuietDiscovery nodeRef={nodeRef} cue={discoveryCue} />}
    </Room>
  );
}
