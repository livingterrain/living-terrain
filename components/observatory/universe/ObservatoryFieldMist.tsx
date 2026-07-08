"use client";

import Link from "next/link";
import { useState } from "react";
import type { FieldSpark } from "@/lib/observatory/universe-layout";
import { ObservatoryEmergence } from "./ObservatoryEmergence";

interface ObservatoryFieldMistProps {
  sparks: FieldSpark[];
}

export function ObservatoryFieldMist({ sparks }: ObservatoryFieldMistProps) {
  const [revealed, setRevealed] = useState<string | null>(null);

  return (
    <ObservatoryEmergence minHeight="min-h-[75vh] sm:min-h-[100vh]" delay={0.08}>
      <div className="obs-universe-mist mx-auto w-full max-w-3xl">
        <p className="obs-universe-chamber text-center">Field notes</p>
        <p className="obs-universe-whisper mx-auto mt-4 max-w-md text-center text-sm">
          Fragments from the lower drawers — observations caught before they
          knew what they were becoming.
        </p>

        <div className="obs-specimen-surface relative mx-auto mt-24 aspect-[4/3] w-full max-w-2xl rounded-sm p-6 sm:mt-28 sm:p-8">
          {sparks.map(({ note, x, y, depth }) => (
            <Link
              key={note.id}
              href={`/field-notes/${note.slug}`}
              className="obs-universe-mist__spark group absolute touch-manipulation"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                opacity: 0.35 + depth * 0.5,
              }}
              onMouseEnter={() => setRevealed(note.id)}
              onMouseLeave={() => setRevealed(null)}
              onFocus={() => setRevealed(note.id)}
              onBlur={() => setRevealed(null)}
            >
              <span className="obs-universe-mist__glow" aria-hidden />
              <span
                className="obs-universe-mist__text"
                data-visible={revealed === note.id ? "true" : "false"}
              >
                {note.title ?? "Untitled note"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </ObservatoryEmergence>
  );
}
