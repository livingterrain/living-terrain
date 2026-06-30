import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import {
  FieldFragment,
  Room,
  RoomThreshold,
} from "@/components/environment";
import { getAllFieldNotes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Field Notes",
  description:
    "Short observations from Living Terrain — moments of attention, recorded in the field.",
};

export default function FieldNotesPage() {
  const notes = getAllFieldNotes();

  return (
    <Room kind="notebook">
      <RoomThreshold
        kind="notebook"
        description="Brief entries — impressions, fragments, things noticed in passing. The notebook beside the longer work."
      />

      <section className="pb-24 pt-8 sm:pb-32">
        <Container narrow>
          {notes.map((note, index) => (
            <FieldFragment key={note.id} note={note} index={index} />
          ))}
        </Container>
      </section>
    </Room>
  );
}
