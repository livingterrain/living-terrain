import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { ObservatoryHub } from "@/components/observatory/ObservatoryV1";

export const metadata: Metadata = {
  title: "The Observatory",
  description:
    "Where research lives before it becomes essays, books, or Atlas.",
};

export default function ObservatoryPage() {
  return (
    <Room kind="observatory">
      <RoomThreshold
        kind="observatory"
        title="The Observatory"
        whisper="This is where questions begin."
        description="Not every observation becomes a theory. Not every theory survives. Research as it exists before it becomes a map."
        align="center"
      />

      <section className="pb-32 pt-2 sm:pb-40">
        <Container narrow>
          <ObservatoryHub />
        </Container>
      </section>
    </Room>
  );
}
