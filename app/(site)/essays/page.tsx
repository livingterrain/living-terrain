import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { EssayLandscape } from "@/components/rooms";
import { MediumPublicationLink } from "@/components/reading/MediumPublicationLink";
import { getEssayClusters } from "@/lib/content";

export const metadata: Metadata = {
  title: "Essays",
  description:
    "Discoveries in an evolving landscape — essays mapped by inquiry, not chronology.",
};

export default function EssaysPage() {
  const clusters = getEssayClusters();

  return (
    <Room kind="library">
      <RoomThreshold
        kind="library"
        title="Essays"
        whisper="The library — discoveries mapped by inquiry, not chronology."
      />

      <section className="pb-24 pt-4 sm:pb-32">
        <Container narrow>
          <div className="threshold-carved threshold-carved--edge px-0 py-8 text-center sm:py-10">
            <p className="type-body mx-auto max-w-lg text-[0.9375rem]">
              The full text of each essay lives on Medium. Living Terrain maps
              them here — tracing how they connect to questions and volumes
              across the terrain.
            </p>
            <MediumPublicationLink prominent className="mt-6" />
          </div>

          <EssayLandscape clusters={clusters} />
        </Container>
      </section>
    </Room>
  );
}
