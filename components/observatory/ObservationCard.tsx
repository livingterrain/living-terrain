import Link from "next/link";
import {
  contributorLabel,
  displayTitle,
  themeTitlesForObservation,
} from "@/lib/observatory/display";
import type { VisitorObservation } from "@/lib/observatory/types";
import { formatDate } from "@/lib/utils";

interface ObservationCardProps {
  observation: VisitorObservation;
  compact?: boolean;
}

export function ObservationCard({ observation, compact }: ObservationCardProps) {
  const themes = themeTitlesForObservation(observation);
  const href = `/observatory/observations/${observation.slug}`;

  return (
    <article className="group border-b border-rule/35 py-7 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="sm:max-w-xl">
          <Link href={href} className="block">
            <h3 className="font-heading text-lg text-charcoal transition-colors duration-700 group-hover:text-forest sm:text-xl">
              {displayTitle(observation)}
            </h3>
          </Link>
          {!compact && (
            <p className="type-body mt-3 text-[0.9375rem] leading-relaxed text-charcoal-muted line-clamp-4">
              {observation.body}
            </p>
          )}
          {themes.length > 0 && (
            <p className="type-meta mt-4 text-forest-faint">
              {themes.join(" · ")}
            </p>
          )}
          {observation.terrainLocation && (
            <p className="type-meta mt-2 text-charcoal-faint/80">
              {observation.terrainLocation}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <time className="type-meta block">
            {formatDate(observation.createdAt)}
          </time>
          <p className="type-meta mt-2 text-charcoal-faint/70">
            {contributorLabel(observation)}
          </p>
        </div>
      </div>
    </article>
  );
}
