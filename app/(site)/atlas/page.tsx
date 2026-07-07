import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { MapArtifactCard } from "@/components/atlas";
import { Room, RoomThreshold } from "@/components/environment";
import { getAllMaps } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Atlas",
  description:
    "Maps of completed investigations — enduring cartography from surveys of the terrain.",
};

export default function AtlasPage() {
  const maps = getAllMaps();

  return (
    <Room kind="atlas">
      <RoomThreshold
        kind="atlas"
        title="The Atlas"
        description="Completed investigations endure here as maps — not the journals themselves, but the cartography that remains after the survey."
        align="center"
      />

      <section
        className="pb-32 pt-8 sm:pb-44 sm:pt-12"
        aria-label="Charted territories"
      >
        <Container narrow>
          <p className="type-body mx-auto mb-20 max-w-md text-center text-[0.9375rem] leading-relaxed text-charcoal-muted sm:mb-28">
            Stand before a region. Choose which territory to enter.
          </p>
          <ul className="mx-auto grid max-w-4xl gap-24 sm:grid-cols-2 sm:gap-x-16 sm:gap-y-32 lg:gap-x-20 lg:gap-y-40">
            {maps.map((map, index) => (
              <MapArtifactCard key={map.id} map={map} index={index} />
            ))}
          </ul>
        </Container>
      </section>
    </Room>
  );
}
