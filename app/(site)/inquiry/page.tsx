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
    <Room kind="library">
      <RoomThreshold
        kind="library"
        whisper="Essays, volumes, and field observations — resting in the quiet."
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
