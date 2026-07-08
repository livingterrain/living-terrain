"use client";

import Link from "next/link";
import { useState } from "react";
import type { ConstellationLayout } from "@/lib/observatory/universe-layout";
import { ObservatoryEmergence } from "./ObservatoryEmergence";
import { cn } from "@/lib/utils";

interface ObservatoryConstellationFieldProps {
  constellations: ConstellationLayout[];
}

export function ObservatoryConstellationField({
  constellations,
}: ObservatoryConstellationFieldProps) {
  return (
    <div className="obs-universe-constellations">
      <ObservatoryEmergence minHeight="min-h-[55vh] sm:min-h-[70vh]" delay={0.1}>
        <p className="obs-universe-whisper mx-auto max-w-md text-center">
          Inquiry charts — constellations of question, not answers. Each cluster
          marks a region still under observation.
        </p>
      </ObservatoryEmergence>

      {constellations.map((constellation, index) => (
        <ObservatoryEmergence
          key={constellation.id}
          minHeight="min-h-[80vh] sm:min-h-[95vh]"
          delay={0.15 + index * 0.08}
        >
          <ConstellationCluster constellation={constellation} index={index} />
        </ObservatoryEmergence>
      ))}
    </div>
  );
}

function ConstellationCluster({
  constellation,
  index,
}: {
  constellation: ConstellationLayout;
  index: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className="obs-universe-constellation mx-auto w-full max-w-2xl"
      style={{ "--constellation-phase": index } as React.CSSProperties}
    >
      <p className="obs-universe-chamber text-center">{constellation.label}</p>
      <p className="obs-universe-whisper mx-auto mt-4 max-w-sm text-center text-sm">
        {constellation.whisper}
      </p>

      <div className="relative mx-auto mt-16 aspect-[5/4] w-full max-w-xl sm:mt-20">
        <svg
          viewBox="0 0 100 80"
          className="h-full w-full overflow-visible"
          aria-hidden
        >
          {constellation.lines.map(([a, b], i) => {
            const sa = constellation.stars[a];
            const sb = constellation.stars[b];
            if (!sa || !sb) return null;
            return (
              <line
                key={`line-${i}`}
                x1={sa.x}
                y1={sa.y}
                x2={sb.x}
                y2={sb.y}
                className={cn(
                  "obs-universe-constellation__line",
                  hovered !== null &&
                    (hovered === a || hovered === b) &&
                    "obs-universe-constellation__line--lit",
                )}
              />
            );
          })}
        </svg>

        {constellation.stars.map((star, si) => (
          <Link
            key={star.essay.id}
            href={`/essays/${star.essay.slug}`}
            className="obs-universe-constellation__star group absolute touch-manipulation"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              transform: "translate(-50%, -50%)",
              "--star-brightness": star.brightness,
            } as React.CSSProperties}
            onMouseEnter={() => setHovered(si)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(si)}
            onBlur={() => setHovered(null)}
          >
            <span className="obs-universe-constellation__glow" aria-hidden />
            <span className="obs-universe-constellation__core" aria-hidden />
            <span className="obs-universe-constellation__label">
              {star.essay.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
