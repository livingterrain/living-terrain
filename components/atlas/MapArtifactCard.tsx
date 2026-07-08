import Link from "next/link";
import { MapCover } from "./MapCover";
import type { Book } from "@/lib/content/types";

interface MapArtifactCardProps {
  map: Book;
  index: number;
}

/** One map plate in The Atlas hall — cover holds the journal; plaque leads to the territory */
export function MapArtifactCard({ map, index }: MapArtifactCardProps) {
  return (
    <li className="map-artifact flex flex-col items-center">
      <MapCover
        map={map}
        journalUrl={map.purchaseUrl}
        scale="hall"
        priority={index < 2}
      />

      <div className="map-artifact__plaque mt-14 w-full max-w-md sm:mt-16">
        <p className="type-folio text-center text-[0.5625rem] uppercase tracking-[0.22em] text-charcoal-faint/90">
          Charted region
        </p>
        <h2 className="type-entry mt-4 text-center text-balance text-charcoal">
          {map.title}
        </h2>
        {map.subtitle && (
          <p className="type-body mt-3 text-center text-[0.8125rem] italic leading-relaxed text-charcoal-muted/90">
            {map.subtitle}
          </p>
        )}
        <p className="type-body mt-6 border-t border-[#c4a06a]/12 pt-6 text-center text-[0.8125rem] leading-[1.75] text-charcoal-muted/85">
          {map.description}
        </p>
      </div>

      <Link
        href={`/atlas/${map.slug}`}
        className="group/territory type-body mt-10 text-[0.8125rem] tracking-wide text-charcoal transition-colors duration-[1.2s] hover:text-charcoal/85 sm:mt-12"
      >
        Enter the territory →
      </Link>
    </li>
  );
}
