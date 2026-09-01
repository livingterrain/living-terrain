import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import {
  getVisualMapCollection,
  getVisualMapCollections,
  plateHref,
} from "@/lib/visual-maps";

interface PageProps {
  params: Promise<{ collection: string }>;
}

export function generateStaticParams() {
  return getVisualMapCollections().map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { collection: slug } = await params;
  const collection = getVisualMapCollection(slug);
  if (!collection) return { title: "Visual Map" };
  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function VisualMapCollectionPage({ params }: PageProps) {
  const { collection: slug } = await params;
  const collection = getVisualMapCollection(slug);
  if (!collection) notFound();

  return (
    <Room kind="library">
      <RoomThreshold
        kind="library"
        title={collection.title}
        whisper="Visual Maps"
        description={collection.description}
        align="left"
      />

      <section className="visual-map-collection pb-24 pt-2 sm:pb-32">
        <Container narrow>
          <ol className="visual-map-collection__list" role="list">
            {collection.items.map((plate, i) => (
              <li key={plate.id}>
                <Link
                  href={plateHref(collection.slug, plate.slug)}
                  className="terrain-list-link group visual-map-collection__link"
                >
                  <p className="type-meta text-forest-faint">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 font-heading text-xl text-charcoal transition-colors duration-700 group-hover:text-forest sm:text-2xl">
                    {plate.title}
                  </h2>
                </Link>
              </li>
            ))}
          </ol>

          <nav
            className="threshold-carved threshold-carved--edge mt-16 space-y-3 pt-10"
            aria-label="Return"
          >
            <Link
              href="/visual-maps"
              className="lantern-link flex min-h-11 items-center text-[0.875rem]"
            >
              ← Visual Maps
            </Link>
            <Link
              href="/inquiry"
              className="lantern-link flex min-h-11 items-center text-[0.875rem]"
            >
              ← The Shelves
            </Link>
          </nav>
        </Container>
      </section>
    </Room>
  );
}
