import type { Metadata } from "next";
import { withCanonical } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { ObservatoryHub } from "@/components/observatory/ObservatoryV1";
import { ObservatoryRoomTone } from "@/components/observatory/ObservatoryRoomTone";

export const metadata: Metadata = withCanonical("/observatory", {
  title: "The Observatory",
  description: "Research as it exists before it becomes a map.",
});

export default function ObservatoryPage() {
  return (
    <Room kind="observatory">
      {/* PHASE 3 — optional room tone; never autoplays */}
      <ObservatoryRoomTone />

      <RoomThreshold
        kind="observatory"
        title="The Observatory"
        whisper="Still forming."
        description="Not every observation becomes a theory. Not every theory survives. Research as it exists before it becomes a map."
        align="left"
        className="obs-arrival"
      />

      <section className="obs-bench pb-28 pt-2 sm:pb-36">
        <Container className="max-w-[46rem]">
          <ObservatoryHub />
        </Container>
      </section>
    </Room>
  );
}
