"use client";

import Link from "next/link";
import { useState } from "react";
import type { ObservatoryThread } from "@/lib/observatory/threads-data";
import { threadPathD } from "@/lib/observatory/universe-layout";
import { ObservatoryEmergence } from "./ObservatoryEmergence";
import { cn } from "@/lib/utils";

interface ObservatoryPathwayFieldProps {
  threads: ObservatoryThread[];
}

const VB_W = 100;
const VB_H = 88;

export function ObservatoryPathwayField({ threads }: ObservatoryPathwayFieldProps) {
  return (
    <div className="obs-universe-pathways">
      <ObservatoryEmergence minHeight="min-h-[60vh] sm:min-h-[75vh]" delay={0.05}>
        <p className="obs-universe-whisper mx-auto max-w-lg text-center">
          Pathways wind through the same sky — not categories, but routes someone
          might walk twice and never the same way.
        </p>
      </ObservatoryEmergence>

      {threads.map((thread, ti) => (
        <ObservatoryEmergence
          key={thread.id}
          minHeight="min-h-[85vh] sm:min-h-[110vh]"
          delay={0.12 + ti * 0.1}
        >
          <PathwayThread thread={thread} />
        </ObservatoryEmergence>
      ))}
    </div>
  );
}

function PathwayThread({ thread }: { thread: ObservatoryThread }) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const pathD = threadPathD(thread, 0, VB_W, VB_H);

  const points = thread.steps.map((step, si) => {
    const t = si / Math.max(thread.steps.length - 1, 1);
    const x = 12 + t * 56 + (si % 2 === 0 ? -3 : 3);
    const y = 14 + t * 58;
    return { step, x, y, si };
  });

  return (
    <div className="obs-universe-pathway mx-auto w-full max-w-2xl">
      <Link
        href={`/observatory/threads/${thread.slug}`}
        className="group block text-center"
      >
        <h2 className="obs-universe-pathway__title font-heading text-xl text-[var(--obs-ivory)] transition-colors duration-[1800ms] group-hover:text-[var(--obs-amber)] sm:text-2xl">
          {thread.title}
        </h2>
        <p className="obs-universe-whisper mx-auto mt-4 max-w-md text-sm">
          {thread.premise}
        </p>
      </Link>

      <div className="relative mx-auto mt-20 aspect-[10/8.8] w-full max-w-xl">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="h-full w-full overflow-visible"
          aria-hidden
        >
          <path
            d={pathD}
            fill="none"
            className="obs-universe-pathway__trace"
          />
        </svg>

        {points.map(({ step, x, y, si }) => (
          <Link
            key={step.slug}
            href={step.href}
            className={cn(
              "obs-universe-pathway__node group absolute touch-manipulation",
              activeStep === si && "obs-universe-pathway__node--active",
            )}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onMouseEnter={() => setActiveStep(si)}
            onMouseLeave={() => setActiveStep(null)}
            onFocus={() => setActiveStep(si)}
            onBlur={() => setActiveStep(null)}
          >
            <span className="obs-universe-pathway__beacon" aria-hidden />
            <span className="obs-universe-pathway__name">{step.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
