import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { InquiryHub } from "@/components/reading/InquiryHub";
import {
  getAllBooks,
  getAllEssays,
  getAllFieldNotes,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Read the Inquiry",
  description:
    "Essays, volumes, and field notes — a reading room for the Living Terrain inquiry.",
};

export default function InquiryPage() {
  const essays = getAllEssays().filter((e) => e.status === "published");
  const books = getAllBooks();
  const fieldNotes = getAllFieldNotes();

  return (
    <Room kind="reading" discovery={false}>
      <RoomThreshold
        kind="reading"
        title="Read the Inquiry"
        whisper="A quiet room for reading."
        description="Essays, volumes, and field observations — gathered here for reading at your own pace. Connections to the wider terrain are always nearby, never required."
        align="center"
      />

      <section className="pb-24 pt-4 sm:pb-32">
        <Container narrow>
          <InquiryHub essays={essays} books={books} fieldNotes={fieldNotes} />
        </Container>
      </section>
    </Room>
  );
}
