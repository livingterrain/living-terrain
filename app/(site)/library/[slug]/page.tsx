import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { Thread } from "@/components/thread";
import { QuietDiscovery } from "@/components/reading/QuietDiscovery";
import { TerrainConnectionInvite } from "@/components/reading/TerrainConnectionInvite";
import { TextLink } from "@/components/design-system";
import { FadeIn } from "@/components/motion/FadeIn";
import { getAllBooks, getBookBySlug } from "@/lib/content";
import { refFromBook } from "@/lib/relationships";
import { pickDiscoveryCue } from "@/lib/reading/discovery-cue";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const statusWhispers = {
  published: "On the shelf",
  "in-progress": "Still being written",
  forthcoming: "Not yet arrived",
};

export async function generateStaticParams() {
  return getAllBooks().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return { title: "Book Not Found" };

  return {
    title: book.title,
    description: book.description,
  };
}

export default async function BookPage({ params }: PageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();

  const isFlagship = slug === "the-structure-beneath-reality";
  const nodeRef = refFromBook(book);
  const discoveryCue = pickDiscoveryCue(nodeRef);

  return (
    <Room kind="archive">
      <RoomThreshold
        kind="archive"
        title={book.title}
        whisper={statusWhispers[book.status]}
        description={book.description}
      >
        {book.subtitle && (
          <p className="type-lead mt-4 text-base sm:text-lg">{book.subtitle}</p>
        )}
        {book.publishedYear && (
          <p className="type-meta mt-6">
            {book.publishedYear}
            {book.publisher ? ` · ${book.publisher}` : ""}
          </p>
        )}
        {isFlagship && book.purchaseUrl && (
          <TextLink href={book.purchaseUrl} external muted className="mt-6 inline-block type-body text-sm">
            Purchase the book
          </TextLink>
        )}
        {isFlagship && (
          <TextLink
            href="/structure-beneath-reality"
            className="mt-8 inline-block type-body text-sm"
          >
            Enter the deepest room →
          </TextLink>
        )}
      </RoomThreshold>

      <section className="pb-32 pt-10 sm:pb-40">
        <Container narrow>
          <FadeIn>
            {book.chapters.length > 0 && (
              <>
                <p className="type-folio mb-6">Contents</p>
                <ol className="space-y-2">
                  {book.chapters
                    .sort((a, b) => a.order - b.order)
                    .map((chapter) => (
                      <li key={chapter.id}>
                        <div className="border-b border-rule/40 py-6">
                          <ChapterPreview chapter={chapter} />
                        </div>
                      </li>
                    ))}
                </ol>
              </>
            )}

            {isFlagship && book.chapters.length === 0 && (
              <p className="type-body text-[0.9375rem]">
                The full volume is available in print and digital. Living Terrain
                maps the ongoing inquiry around it — questions, essays, and field
                notes that extend the work.
              </p>
            )}

            <TerrainConnectionInvite nodeRef={nodeRef} className="mt-10" />

            <Thread
              nodeRef={nodeRef}
              returnHref={`/library/${book.slug}`}
            />
          </FadeIn>

          {discoveryCue && (
            <QuietDiscovery nodeRef={nodeRef} cue={discoveryCue} />
          )}

          <div className="mt-16 border-t border-rule/50 pt-8">
            <TextLink href="/library" className="type-body text-sm">
              ← Back among the shelves
            </TextLink>
          </div>
        </Container>
      </section>
    </Room>
  );
}

function ChapterPreview({
  chapter,
}: {
  chapter: { title: string; excerpt: string; order: number };
}) {
  return (
    <>
      <span className="type-folio">{String(chapter.order).padStart(2, "0")}</span>
      <h3 className="type-entry mt-2 text-charcoal transition-colors duration-700 group-hover:text-forest">
        {chapter.title}
      </h3>
      <p className="type-body mt-2 text-[0.9375rem]">{chapter.excerpt}</p>
    </>
  );
}
