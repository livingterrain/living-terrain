import { MapCover } from "./MapCover";
import type { Book } from "@/lib/content/types";

interface MapArtifactCardProps {
  map: Book;
  index: number;
}

/** One mounted cover in The Atlas hall — cover enters the territory; plaque reads below */
export function MapArtifactCard({ map, index }: MapArtifactCardProps) {
  return (
    <li className="map-artifact flex flex-col items-center">
      <MapCover
        map={map}
        territoryHref={`/atlas/${map.slug}`}
        journalUrl={map.purchaseUrl}
        scale="hall"
        priority={index < 2}
      />

      <div className="map-artifact__plaque mt-16 w-full max-w-md sm:mt-20">
        <p className="type-folio text-center text-[0.5625rem] uppercase tracking-[0.22em] text-charcoal-faint/85">
          Charted region
        </p>
        <h2 className="type-entry mt-4 text-center text-balance text-charcoal">
          {map.title}
        </h2>
        {map.subtitle && (
          <p className="type-body mt-3 text-center text-[0.8125rem] italic leading-relaxed text-charcoal-muted/85">
            {map.subtitle}
          </p>
        )}
        <p className="type-body mt-6 border-t border-[#c4a06a]/10 pt-6 text-center text-[0.8125rem] leading-[1.8] text-charcoal-muted/80">
          {map.description}
        </p>
      </div>
    </li>
  );
}
