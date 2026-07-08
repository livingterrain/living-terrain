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
        className="pb-36 pt-6 sm:pb-48 sm:pt-10"
        aria-label="Charted territories"
      >
        <Container narrow>
          <p className="type-body mx-auto mb-24 max-w-sm text-center text-[0.875rem] leading-relaxed tracking-wide text-charcoal-muted/90 sm:mb-32">
            Stand before a region. Choose which territory to enter.
          </p>
          <ul className="mx-auto flex max-w-lg flex-col gap-36 sm:gap-44">
            {maps.map((map, index) => (
              <MapArtifactCard key={map.id} map={map} index={index} />
            ))}
          </ul>
        </Container>
      </section>
    </Room>
  );
}
