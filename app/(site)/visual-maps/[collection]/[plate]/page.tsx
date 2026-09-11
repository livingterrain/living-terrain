import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { withCanonical } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Room } from "@/components/environment";
import { VisualMapLightbox } from "@/components/visual-maps/VisualMapLightbox";
import {
  collectionHref,
  getVisualMapCollections,
  getVisualMapPlate,
  plateHref,
} from "@/lib/visual-maps";

interface PageProps {
  params: Promise<{ collection: string; plate: string }>;
}

export function generateStaticParams() {
  return getVisualMapCollections().flatMap((c) =>
    c.items.map((p) => ({ collection: c.slug, plate: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { collection: cSlug, plate: pSlug } = await params;
  const found = getVisualMapPlate(cSlug, pSlug);
  if (!found) return { title: "Visual Map" };
  return withCanonical(`/visual-maps/${cSlug}/${pSlug}`, {
    title: `${found.plate.title} · ${found.collection.title}`,
    description: found.collection.description,
  });
}

export default async function VisualMapPlatePage({ params }: PageProps) {
  const { collection: cSlug, plate: pSlug } = await params;
  const found = getVisualMapPlate(cSlug, pSlug);
  if (!found) notFound();

  const { collection, plate, index } = found;
  const prev = collection.items[index - 1];
  const next = collection.items[index + 1];
  const backHref = collectionHref(collection.slug);

  return (
    <Room kind="library">
      <section className="visual-map-plate pb-20 pt-10 sm:pb-28 sm:pt-14">
        <Container className="max-w-[52rem]">
          <header className="threshold-carved threshold-carved--edge pb-8 sm:pb-10">
            <p className="type-folio text-charcoal-faint">
              Visual Maps · {collection.title}
            </p>
            <h1 className="mt-4 font-heading text-[1.75rem] leading-[1.15] text-charcoal sm:text-[2.125rem]">
              {plate.title}
            </h1>
            <p className="type-meta mt-4 text-forest-faint">
              {index + 1} of {collection.items.length}
            </p>
          </header>

          <VisualMapLightbox
            src={plate.image}
            alt={plate.alt}
            width={plate.width}
            height={plate.height}
            title={plate.title}
          />

          <nav
            className="visual-map-plate__nav mt-10 flex flex-col gap-4 sm:mt-12"
            aria-label="Plate sequence"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              {prev ? (
                <Link
                  href={plateHref(collection.slug, prev.slug)}
                  className="lantern-link flex min-h-11 items-center text-[0.875rem]"
                >
                  ← {prev.title}
                </Link>
              ) : (
                <span className="min-h-11" aria-hidden />
              )}
              {next ? (
                <Link
                  href={plateHref(collection.slug, next.slug)}
                  className="lantern-link flex min-h-11 items-center text-[0.875rem] sm:ml-auto"
                >
                  {next.title} →
                </Link>
              ) : (
                <span className="min-h-11" aria-hidden />
              )}
            </div>

            <div className="threshold-carved threshold-carved--edge space-y-3 pt-8">
              <Link
                href={backHref}
                className="lantern-link flex min-h-11 items-center text-[0.875rem]"
              >
                ← {collection.title}
              </Link>
              <Link
                href="/visual-maps"
                className="lantern-link flex min-h-11 items-center text-[0.875rem]"
              >
                ← Visual Maps
              </Link>
            </div>
          </nav>
        </Container>
      </section>
    </Room>
  );
}
