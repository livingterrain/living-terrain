import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { InquiryHub } from "@/components/reading/InquiryHub";
import { getAllEssays, getAllFieldNotes } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Shelves",
  description:
    "Essays, field notes, and shorter writing from the edges of the terrain.",
};

export default function InquiryPage() {
  const essays = getAllEssays().filter((e) => e.status === "published");
  const fieldNotes = getAllFieldNotes();

  return (
    <Room kind="library">
      <RoomThreshold
        kind="library"
        title="The Shelves"
        whisper="Writing from the edges of the terrain."
        description="Essays, observations, and shorter inquiry — ongoing exploration, not the charted maps."
        align="center"
      />

      <section className="pb-24 pt-4 sm:pb-32">
        <Container narrow>
          <InquiryHub essays={essays} fieldNotes={fieldNotes} />
        </Container>
      </section>
    </Room>
  );
}
