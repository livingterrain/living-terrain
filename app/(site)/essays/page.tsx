import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Room, RoomThreshold } from "@/components/environment";
import { EssaysArchive } from "@/components/reading/EssaysArchive";
import { PublicationLink } from "@/components/reading/PublicationLink";
import { getAllEssays } from "@/lib/content";

export const metadata: Metadata = {
  title: "Essays",
  description:
    "Scout reports from the edges — published writing gathered on The Shelves.",
};

export default function EssaysPage() {
  const essays = getAllEssays().filter((e) => e.status === "published");

  return (
    <Room kind="library">
      <RoomThreshold
        kind="library"
        title="Essays"
        whisper="Scout reports from the edges."
        align="center"
      />

      <section className="pb-24 pt-4 sm:pb-32">
        <Container narrow>
          <div className="mb-10 text-center sm:mb-12">
            <PublicationLink className="text-[0.8125rem]" />
          </div>

          <EssaysArchive essays={essays} />

          <nav
            className="threshold-carved threshold-carved--edge mt-20 pt-10"
            aria-label="Return"
          >
            <Link
              href="/inquiry"
              className="lantern-link flex min-h-11 items-center text-[0.875rem]"
            >
              ← The Shelves
            </Link>
          </nav>
        </Container>
      </section>
    </Room>
  );
}
