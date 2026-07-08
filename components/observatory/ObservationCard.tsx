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
    <article className="observation-evidence group">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="sm:max-w-xl">
          <p className="observation-evidence__label">Recorded observation</p>
          <Link href={href} className="mt-2 block">
            <h3 className="font-heading text-lg text-[var(--obs-ivory)] transition-colors duration-700 group-hover:text-[var(--obs-brass)] sm:text-xl">
              {displayTitle(observation)}
            </h3>
          </Link>
          {!compact && (
            <p className="type-body mt-3 text-[0.9375rem] leading-relaxed text-[var(--obs-muted)] line-clamp-4">
              {observation.body}
            </p>
          )}
          {themes.length > 0 && (
            <p className="type-meta mt-4 text-[var(--obs-brass-dim)]">
              {themes.join(" · ")}
            </p>
          )}
          {observation.terrainLocation && (
            <p className="type-meta mt-2 text-[var(--obs-faint)]">
              {observation.terrainLocation}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <time className="type-meta block text-[var(--obs-faint)]">
            {formatDate(observation.createdAt)}
          </time>
          <p className="type-meta mt-2 text-[var(--obs-faint)]/80">
            {contributorLabel(observation)}
          </p>
        </div>
      </div>
    </article>
  );
}
