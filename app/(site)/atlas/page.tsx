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

      <section className="pb-28 pt-4 sm:pb-36" aria-label="Charted territories">
        <Container narrow>
          <p className="type-body mx-auto mb-16 max-w-xl text-center text-[0.9375rem] text-charcoal-muted">
            Stand before a region. Choose which territory to enter.
          </p>
          <ul className="grid gap-20 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-24 lg:gap-y-28">
            {maps.map((map, index) => (
              <MapArtifactCard key={map.id} map={map} index={index} />
            ))}
          </ul>
        </Container>
      </section>
    </Room>
  );
}
