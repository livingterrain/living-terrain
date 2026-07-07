import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { QuestionsConstellation } from "@/components/rooms";
import { getAllQuestionHubs, getSiteTimeline } from "@/lib/content";

const IdeaStrata = dynamic(
  () =>
    import("@/components/rooms/IdeaStrata").then((m) => ({
      default: m.IdeaStrata,
    })),
  { loading: () => null },
);

export const metadata: Metadata = {
  title: "Questions",
  description:
    "Living inquiries — each a hub connecting essays, books, field notes, and ideas across the terrain.",
};

export default function QuestionsPage() {
  const hubs = getAllQuestionHubs();
  const timeline = getSiteTimeline();

  return (
    <Room kind="pathways">
      <RoomThreshold kind="pathways" />

      <section className="pb-24 pt-8 sm:pb-32">
        <Container>
          <QuestionsConstellation hubs={hubs} />

          <IdeaStrata
            entries={timeline}
            className="mx-auto mt-24 max-w-3xl border-t border-rule/40 pt-16"
            title="How the terrain has grown"
            subtitle="A cross-section of ideas as they accumulated — hover to see what connects."
            compact
          />
        </Container>
      </section>
    </Room>
  );
}
