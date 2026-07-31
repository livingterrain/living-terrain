import type { Metadata } from "next";
import Link from "next/link";
import { AtlasArchive } from "@/components/atlas/AtlasArchive";
import { Room } from "@/components/environment";

export const metadata: Metadata = {
  title: "Charted Maps · The Atlas",
  description:
    "Domains of inquiry and completed investigations hung as cartographic plates in Living Terrain.",
};

/**
 * Finding aid for charted maps — secondary to the Atlas journey at /atlas.
 */
export default function AtlasChartsPage() {
  return (
    <Room kind="atlas">
      <div className="px-6 pt-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/atlas"
            className="type-meta transition-colors duration-[1.4s] hover:text-charcoal-muted"
          >
            ← Enter through a question
          </Link>
        </div>
      </div>
      <AtlasArchive />
    </Room>
  );
}
