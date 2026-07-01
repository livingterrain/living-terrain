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
          <p className="obs-universe-whisper text-lg italic leading-relaxed sm:text-xl">
            You have walked far enough to notice something.
          </p>
          <p className="obs-universe-whisper mt-6 text-sm">
            The observatory does not end. It only grows quieter as you leave.
          </p>
        </div>
      </ObservatoryEmergence>

      <ObservatoryEmergence minHeight="min-h-[70vh]" delay={0.15}>
        <div className="obs-universe-witness mx-auto w-full max-w-lg">
          <p className="obs-universe-chamber text-center">Leave a mark</p>
          <p className="obs-universe-whisper mx-auto mt-4 max-w-sm text-center text-sm">
            Not a comment — an observation added to the shared investigation.
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
            Carry what you noticed. The sky will still be here.
          </p>
        </div>
      </ObservatoryEmergence>
    </>
  );
}
