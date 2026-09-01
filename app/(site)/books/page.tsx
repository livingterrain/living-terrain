import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { BooksGallery } from "@/components/reading/BooksGallery";
import { getAllMaps } from "@/lib/content";

export const metadata: Metadata = {
  title: "Books",
  description: "Longer investigations — the current books of Living Terrain.",
};

export default function BooksPage() {
  const books = getAllMaps();

  return (
    <Room kind="library">
      <RoomThreshold
        kind="library"
        title="Books"
        whisper="Longer investigations."
        align="center"
      />

      <section className="pb-24 pt-4 sm:pb-32">
        <Container>
          <BooksGallery books={books} />

          <nav
            className="threshold-carved threshold-carved--edge mt-20 pt-10"
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
