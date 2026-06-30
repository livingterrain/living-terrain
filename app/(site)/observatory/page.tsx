import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { ObservatoryRoom } from "@/components/rooms";
import { ObservatoryPassage } from "@/components/observatory";
import { getMajorConceptThemes } from "@/lib/concepts/major-concepts";
import { getObservatorySignals, getSiteTimeline } from "@/lib/content";
import {
  getRecentObservations,
  getUnexpectedConnections,
  getQuietDiscoveries,
} from "@/lib/observatory/visitor-observations.server";

export const metadata: Metadata = {
  title: "Observatory",
  description:
    "A field station for shared observations — where visitors help humanity notice reality together.",
};

export default function ObservatoryPage() {
  const signals = getObservatorySignals();
  const timeline = getSiteTimeline();
  const concepts = getMajorConceptThemes();
  const recentObservations = getRecentObservations(6);
  const unexpectedConnections = getUnexpectedConnections(3);
  const quietDiscoveries = getQuietDiscoveries(3);

  return (
    <Room kind="observatory">
      <RoomThreshold
        kind="observatory"
        align="center"
        description="A field station for observations — not a forum, not social media. A quiet place where visitors add to a shared investigation."
      />

      <section className="pb-24 pt-4 sm:pb-32">
        <Container narrow>
          <ObservatoryPassage />
          <ObservatoryRoom
            concepts={concepts}
            recentObservations={recentObservations}
            unexpectedConnections={unexpectedConnections}
            quietDiscoveries={quietDiscoveries}
            signals={signals}
            timeline={timeline}
          />
        </Container>
      </section>
    </Room>
  );
}
