import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { withCanonical } from "@/lib/seo";
import { LanternReadingShell } from "@/components/world/LanternReadingShell";
import { ThreadEssayList } from "@/components/reading/ThreadEssayList";
import { getEssaysByThreadId } from "@/lib/content";
import {
  THREAD_IDS,
  getThreadByParam,
  threadEssayCountLabel,
  threadHref,
} from "@/lib/threads";

interface PageProps {
  params: Promise<{ threadId: string }>;
}

export function generateStaticParams() {
  return THREAD_IDS.map((threadId) => ({ threadId }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { threadId } = await params;
  const thread = getThreadByParam(threadId);
  if (!thread) return { title: "Thread Not Found" };

  return withCanonical(threadHref(thread.id), {
    title: thread.label,
    description: thread.description,
  });
}

export default async function ThreadPage({ params }: PageProps) {
  const { threadId } = await params;
  const thread = getThreadByParam(threadId);
  if (!thread) notFound();

  const essays = getEssaysByThreadId(thread.id);

  return (
    <LanternReadingShell
      collection="Thread"
      title={thread.label}
      afterContent={
        <section
          className="thread-gathering threshold-carved threshold-carved--edge"
          aria-labelledby="thread-gathering-heading"
        >
          <h2 id="thread-gathering-heading" className="type-chamber">
            {threadEssayCountLabel(essays.length)}
          </h2>
          <ThreadEssayList essays={essays} />
        </section>
      }
      returnHref="/essays"
      variant="library"
    >
      <p>{thread.description}</p>
    </LanternReadingShell>
  );
}
