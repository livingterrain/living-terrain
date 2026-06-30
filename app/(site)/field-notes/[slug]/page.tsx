import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { Prose, renderBody } from "@/components/reading/Prose";
import { Thread } from "@/components/thread";
import { QuietDiscovery } from "@/components/reading/QuietDiscovery";
import { TerrainConnectionInvite } from "@/components/reading/TerrainConnectionInvite";
import { TextLink } from "@/components/design-system";
import { FadeIn } from "@/components/motion/FadeIn";
import { getAllFieldNotes, getFieldNoteBySlug } from "@/lib/content";
import { refFromFieldNote } from "@/lib/relationships";
import { pickDiscoveryCue } from "@/lib/reading/discovery-cue";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllFieldNotes().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getFieldNoteBySlug(slug);
  if (!note) return { title: "Field Note Not Found" };

  return {
    title: note.title ?? "Field Note",
    description: note.body.slice(0, 160),
  };
}

export default async function FieldNotePage({ params }: PageProps) {
  const { slug } = await params;
  const note = getFieldNoteBySlug(slug);
  if (!note) notFound();

  const nodeRef = refFromFieldNote(note);
  const discoveryCue = pickDiscoveryCue(nodeRef);

  return (
    <Room kind="notebook">
      <RoomThreshold
        kind="notebook"
        title={note.title ?? undefined}
        whisper="A page turned."
      >
        <p className="type-meta mt-2">
          {formatDate(note.publishedAt)}
          {note.location ? ` · ${note.location}` : ""}
        </p>
      </RoomThreshold>

      <section className="pb-32 pt-10 sm:pb-40">
        <Container narrow>
          <FadeIn>
            <Prose className="italic">{renderBody(note.body)}</Prose>
            <TerrainConnectionInvite nodeRef={nodeRef} className="mt-10" />
            <Thread
              nodeRef={nodeRef}
              returnHref={`/field-notes/${note.slug}`}
            />
          </FadeIn>

          {discoveryCue && (
            <QuietDiscovery nodeRef={nodeRef} cue={discoveryCue} />
          )}

          <div className="mt-16 border-t border-rule/50 pt-8">
            <TextLink href="/field-notes" className="type-body text-sm">
              ← Back to the notebook
            </TextLink>
          </div>
        </Container>
      </section>
    </Room>
  );
}
