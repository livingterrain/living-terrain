import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { ManuscriptArchive } from "@/components/rooms";
import { getAllBooks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Library",
  description:
    "Manuscripts in the archive — volumes that extend the inquiries explored across Living Terrain.",
};

export default function LibraryPage() {
  const books = getAllBooks();

  return (
    <Room kind="archive">
      <RoomThreshold
        kind="archive"
        description="Not a storefront — an archive. Each volume rests here as part of a longer inquiry, connected to questions and discoveries across the terrain."
      />

      <section className="pb-24 pt-8 sm:pb-32">
        <Container narrow>
          <ManuscriptArchive books={books} />
        </Container>
      </section>
    </Room>
  );
}
