"use client";

import Image from "next/image";
import { useState } from "react";
import { fieldJournalWhisper } from "@/lib/atlas/field-journal";
import { resolveMapCoverSrc } from "@/lib/content/maps";
import type { Book } from "@/lib/content/types";
import { cn } from "@/lib/utils";

interface MapCoverProps {
  map: Pick<Book, "slug" | "title" | "subtitle" | "coverImage">;
  /** Official field journal URL — cover opens this in a new tab when set */
  journalUrl?: string;
  /** hall = gallery scale; threshold = dominant arrival */
  scale?: "hall" | "threshold";
  className?: string;
  priority?: boolean;
  /** Show quiet journal whisper beneath the plate */
  showJournalWhisper?: boolean;
}

/**
 * Map plate — cover art as cartographic artifact, with engraved fallback.
 * When a journal URL exists, the plate gently opens the bound record externally.
 */
export function MapCover({
  map,
  journalUrl,
  scale = "hall",
  className,
  priority = false,
  showJournalWhisper = Boolean(journalUrl),
}: MapCoverProps) {
  const [failed, setFailed] = useState(false);
  const src = resolveMapCoverSrc(map);
  const whisper = fieldJournalWhisper(map.slug);

  const frameClass =
    scale === "threshold"
      ? "max-w-sm sm:max-w-[17rem]"
      : "max-w-[12rem] sm:max-w-[13.5rem]";

  const plate = (
    <div
      className={cn(
        "map-cover__frame relative aspect-[2/3] overflow-hidden bg-[#121418]",
        "border border-[#2a2824]/80",
        "shadow-[2px_6px_18px_-4px_rgba(4,6,8,0.45),inset_0_1px_0_rgba(255,255,255,0.04)]",
        journalUrl &&
          "transition-[box-shadow,transform] duration-[1.2s] ease-[cubic-bezier(0.45,0.05,0.55,0.95)] hover:shadow-[3px_8px_22px_-4px_rgba(4,6,8,0.5)]",
      )}
    >
      {!failed ? (
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          sizes={
            scale === "threshold"
              ? "(max-width: 640px) 80vw, 272px"
              : "(max-width: 640px) 45vw, 216px"
          }
          priority={priority}
          onError={() => setFailed(true)}
        />
      ) : (
        <MapCoverFallback title={map.title} subtitle={map.subtitle} />
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#040608]/30"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#c4a06a]/[0.07]"
        aria-hidden="true"
      />
    </div>
  );

  return (
    <figure
      className={cn("map-cover relative mx-auto", frameClass, className)}
    >
      {journalUrl ? (
        <a
          href={journalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="map-cover__journal group/journal block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest/40"
          aria-label={`${whisper} (opens in new tab)`}
        >
          {plate}
        </a>
      ) : (
        plate
      )}

      {scale === "threshold" && (
        <div
          className="mx-auto mt-4 h-px w-10 bg-gradient-to-r from-transparent via-[#c4a06a]/25 to-transparent"
          aria-hidden="true"
        />
      )}

      {journalUrl && showJournalWhisper && (
        <figcaption
          className={cn(
            "type-body text-center text-[0.6875rem] leading-relaxed tracking-wide text-charcoal-faint/90",
            scale === "threshold" ? "mt-5" : "mt-4",
            journalUrl && "group-hover/journal:text-charcoal-muted",
          )}
        >
          {whisper}
        </figcaption>
      )}
    </figure>
  );
}

function MapCoverFallback({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex h-full flex-col justify-end bg-[linear-gradient(168deg,#161a20_0%,#0c1014_50%,#14181c_100%)] p-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#9a9080 1px, transparent 1px), linear-gradient(90deg, #9a9080 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />
      <p className="type-folio relative text-[0.625rem] uppercase tracking-[0.2em] text-[#9a9080]/80">
        Charted territory
      </p>
      <p className="type-entry relative mt-3 text-balance text-ivory/85 text-lg leading-snug">
        {title}
      </p>
      {subtitle && (
        <p className="type-body relative mt-2 text-[0.8125rem] text-ivory/45">
          {subtitle}
        </p>
      )}
    </div>
  );
}
