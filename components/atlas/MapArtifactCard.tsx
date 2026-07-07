import Link from "next/link";
import { MapCover } from "./MapCover";
import type { Book } from "@/lib/content/types";

interface MapArtifactCardProps {
  map: Book;
  index: number;
}

/** One map plate in The Atlas hall — cover holds the journal; caption leads to the territory */
export function MapArtifactCard({ map, index }: MapArtifactCardProps) {
  return (
    <li className="map-artifact flex flex-col items-center sm:items-start">
      <MapCover
        map={map}
        journalUrl={map.purchaseUrl}
        scale="hall"
        priority={index < 2}
      />

      <Link
        href={`/atlas/${map.slug}`}
        className="group/territory mt-10 flex max-w-[18rem] flex-col text-center sm:mt-12 sm:max-w-xs sm:text-left"
      >
        <p className="type-folio text-[0.625rem] uppercase tracking-[0.18em] text-charcoal-faint">
          Charted region
        </p>
        <h2 className="type-entry mt-3 text-charcoal transition-colors duration-[1.2s] group-hover/territory:text-charcoal/90">
          {map.title}
        </h2>
        {map.subtitle && (
          <p className="type-body mt-3 text-[0.8125rem] leading-relaxed text-charcoal-muted line-clamp-3">
            {map.subtitle}
          </p>
        )}
        <span className="type-body mt-6 text-[0.8125rem] text-charcoal-faint transition-colors duration-[1.2s] group-hover/territory:text-charcoal-muted">
          Approach the map →
        </span>
      </Link>
    </li>
  );
}
