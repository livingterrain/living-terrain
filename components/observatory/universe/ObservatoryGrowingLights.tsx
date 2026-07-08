"use client";

import Link from "next/link";
import type { GrowingLight } from "@/lib/observatory/universe-layout";
import { growingMaturityLabel } from "@/lib/observatory/growing-ideas-data";
import { ObservatoryEmergence } from "./ObservatoryEmergence";

interface ObservatoryGrowingLightsProps {
  lights: GrowingLight[];
}

export function ObservatoryGrowingLights({ lights }: ObservatoryGrowingLightsProps) {
  return (
    <ObservatoryEmergence minHeight="min-h-[80vh] sm:min-h-[105vh]" delay={0.1}>
      <div className="obs-universe-growing mx-auto w-full max-w-3xl">
        <p className="obs-universe-chamber text-center">Still forming</p>
        <p className="obs-universe-whisper mx-auto mt-4 max-w-md text-center text-sm">
          Specimens on the workbench — labeled, but not yet catalogued. Some may
          never be.
        </p>

        <div className="obs-specimen-surface relative mx-auto mt-24 aspect-[16/10] w-full max-w-2xl rounded-sm p-6 sm:mt-32 sm:p-8">
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
                {growingMaturityLabel(idea.maturity)}
              </span>
              <span className="obs-universe-growing__title">{idea.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </ObservatoryEmergence>
  );
}
