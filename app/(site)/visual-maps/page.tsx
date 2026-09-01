import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { collectionHref, getVisualMapCollections } from "@/lib/visual-maps";

export const metadata: Metadata = {
  title: "Visual Maps",
  description: "Visual reference plates nested under The Shelves.",
};

export default function VisualMapsPage() {
  const collections = getVisualMapCollections();

  return (
    <Room kind="library">
      <RoomThreshold
        kind="library"
        title="Visual Maps"
        whisper="Reference plates."
        align="left"
      />

      <section className="pb-24 pt-2 sm:pb-32">
        <Container narrow>
          {collections.length > 0 && (
            <ul className="threshold-carved-list max-w-[40rem]">
              {collections.map((collection) => (
                <li key={collection.slug}>
                  <Link
                    href={collectionHref(collection.slug)}
                    className="terrain-list-link group"
                  >
                    <h2 className="mt-2 font-heading text-xl text-charcoal transition-colors duration-700 group-hover:text-forest sm:text-2xl">
                      {collection.title}
                    </h2>
                    {collection.whisper && (
                      <p className="type-body mt-4 text-[0.9375rem] text-charcoal-muted">
                        {collection.whisper}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <nav
            className="threshold-carved threshold-carved--edge mt-16 pt-10"
            aria-label="Return"
          >
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
