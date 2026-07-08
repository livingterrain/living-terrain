"use client";

import Link from "next/link";
import type { Theme } from "@/lib/content/types";
import { RecordObservationForm } from "@/components/observatory/RecordObservationForm";
import { ObservatoryEmergence } from "./ObservatoryEmergence";

interface ObservatoryWitnessProps {
  concepts: Theme[];
}

/**
 * A quiet ledger at the edge of the infinite — not social, not performative.
 */
export function ObservatoryWitness({ concepts }: ObservatoryWitnessProps) {
  return (
    <>
      <ObservatoryEmergence minHeight="min-h-[80vh]" delay={0.05}>
        <div className="mx-auto max-w-md text-center">
          <p className="obs-universe-whisper text-base italic leading-relaxed sm:text-lg">
            Something may be worth recording.
          </p>
          <p className="obs-universe-whisper mt-6 text-sm">
            The lamps stay on. The work continues.
          </p>
        </div>
      </ObservatoryEmergence>

      <ObservatoryEmergence minHeight="min-h-[70vh]" delay={0.15}>
        <div className="obs-universe-witness mx-auto w-full max-w-lg">
          <p className="obs-universe-chamber text-center">Record an observation</p>
          <p className="obs-universe-whisper mx-auto mt-4 max-w-sm text-center text-sm">
            Not a comment — a piece of evidence added to the shared ledger.
          </p>
          <div className="observatory-form mt-14">
            <RecordObservationForm concepts={concepts} />
          </div>
        </div>
      </ObservatoryEmergence>

      <ObservatoryEmergence minHeight="min-h-[50vh]" delay={0.2}>
        <div className="flex flex-col items-center gap-8 pb-32 text-center">
          <Link
            href="/"
            className="obs-universe-horizon-link text-sm"
          >
            Outward — to the carved map
          </Link>
          <p className="obs-universe-whisper max-w-xs text-xs italic opacity-70">
            Carry what you noticed. The lamps will still be burning.
          </p>
        </div>
      </ObservatoryEmergence>
    </>
  );
}
