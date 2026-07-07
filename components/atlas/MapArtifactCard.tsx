import Link from "next/link";
import { MapCover } from "./MapCover";
import type { Book } from "@/lib/content/types";

interface MapArtifactCardProps {
  map: Book;
  index: number;
}

/** One map plate in The Atlas hall */
export function MapArtifactCard({ map, index }: MapArtifactCardProps) {
  return (
    <li className="map-artifact">
      <Link
        href={`/atlas/${map.slug}`}
        className="group flex flex-col items-center text-center sm:items-start sm:text-left"
      >
        <MapCover map={map} scale="hall" priority={index < 2} />
        <div className="mt-8 max-w-[16rem] sm:max-w-xs">
          <p className="type-folio text-[0.625rem] uppercase tracking-[0.18em] text-charcoal-faint">
            Charted region
          </p>
          <h2 className="type-entry mt-3 text-charcoal transition-colors duration-700 group-hover:text-forest">
            {map.title}
          </h2>
          {map.subtitle && (
            <p className="type-body mt-2 text-[0.8125rem] text-charcoal-muted line-clamp-2">
              {map.subtitle}
            </p>
          )}
        </div>
      </Link>
    </li>
  );
}
