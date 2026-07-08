"use client";

import Link from "next/link";
import type { GrowingLight } from "@/lib/observatory/universe-layout";
import type { GrowingMaturity } from "@/lib/observatory/growing-ideas-data";
import { ObservatoryEmergence } from "./ObservatoryEmergence";

interface ObservatoryGrowingLightsProps {
  lights: GrowingLight[];
}

/** How close an investigation is to being charted in The Atlas. */
const MATURATION_LABEL: Record<GrowingMaturity, string> = {
  seed: "Recently opened",
  sprout: "Under observation",
  blooming: "Approaching the Atlas",
};

export function ObservatoryGrowingLights({ lights }: ObservatoryGrowingLightsProps) {
  return (
    <ObservatoryEmergence minHeight="min-h-[80vh] sm:min-h-[105vh]" delay={0.1}>
      <div className="obs-universe-growing mx-auto w-full max-w-2xl">
        <div className="obs-fx obs-fx--board obs-specimen-board relative mx-auto">
          <span className="obs-fx__pins" aria-hidden />
          <div className="obs-fx__plaque obs-specimen-board__plaque">
            Specimen board
          </div>
          <p className="obs-specimen-board__note">
            Specimens still under the lamp — some drawing closer to a finished
            map, some content to stay open.
          </p>

          <div className="obs-specimen-surface relative mx-auto mt-10 aspect-[16/10] w-full rounded-sm p-6 sm:p-8">
          {lights.map(({ idea, x, y, intensity }) => (
            <Link
              key={idea.id}
              href={`/observatory/growing/${idea.slug}`}
              className="obs-universe-growing__light group absolute touch-manipulation"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                "--light-intensity": intensity,
              } as React.CSSProperties}
            >
              <span className="obs-universe-growing__halo" aria-hidden />
              <span className="obs-universe-growing__core" aria-hidden />
              <span className="obs-universe-growing__meta">
                {MATURATION_LABEL[idea.maturity]}
              </span>
              <span className="obs-universe-growing__title">{idea.title}</span>
            </Link>
          ))}
          </div>
        </div>
      </div>
    </ObservatoryEmergence>
  );
}
