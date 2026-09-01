import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { ShelvesFoyer } from "@/components/reading/ShelvesFoyer";
import { getAllMaps, getAllEssays } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Shelves",
  description: "Books, essays, and visual maps — work made for Living Terrain.",
};

export default function InquiryPage() {
  const books = getAllMaps();
  const essays = getAllEssays().filter((e) => e.status === "published");

  return (
    <Room kind="library">
      <RoomThreshold
        kind="library"
        title="The Shelves"
        whisper="What has been made."
        align="left"
        className="py-6 sm:py-12 md:py-16"
      />

      <section className="pb-20 pt-0 sm:pb-24">
        <Container>
          <ShelvesFoyer books={books} essays={essays} />
        </Container>
      </section>
    </Room>
  );
}
