"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { fieldJournalWhisper } from "@/lib/atlas/field-journal";
import {
  resolveMapCoverDimensions,
  resolveMapCoverSrc,
} from "@/lib/content/maps";
import type { Book } from "@/lib/content/types";
import { cn } from "@/lib/utils";

interface MapCoverProps {
  map: Pick<Book, "slug" | "title" | "subtitle" | "coverImage">;
  /** Primary action — cover approaches the territory */
  territoryHref?: string;
  /** Quiet secondary — printed field journal */
  journalUrl?: string;
  /** hall = gallery scale; threshold = dominant arrival */
  scale?: "hall" | "threshold";
  className?: string;
  priority?: boolean;
  showJournalWhisper?: boolean;
}

/**
 * Official cover as mounted artifact. Cover enters the territory;
 * the bound record remains a quiet secondary whisper.
 */
export function MapCover({
  map,
  territoryHref,
  journalUrl,
  scale = "hall",
  className,
  priority = false,
  showJournalWhisper = Boolean(journalUrl),
}: MapCoverProps) {
  const [failed, setFailed] = useState(false);
  const src = resolveMapCoverSrc(map);
  const dims = resolveMapCoverDimensions(map.slug);
  const whisper = fieldJournalWhisper(map.slug);

  const frameClass =
    scale === "threshold"
      ? "max-w-[16rem] sm:max-w-[22rem]"
      : "max-w-[15rem] sm:max-w-[21rem]";

  const imageSizes =
    scale === "threshold"
      ? "(max-width: 640px) 80vw, 352px"
      : "(max-width: 640px) 72vw, 336px";

  const plate = (
    <div className="map-cover__mount">
      <div
        className="map-cover__frame relative overflow-hidden bg-[#0e1012]"
        style={{ aspectRatio: `${dims.width} / ${dims.height}` }}
      >
        {!failed ? (
          <Image
            src={src}
            alt=""
            width={dims.width}
            height={dims.height}
            className="h-auto w-full object-contain"
            sizes={imageSizes}
            priority={priority}
            onError={() => setFailed(true)}
          />
        ) : (
          <MapCoverFallback title={map.title} subtitle={map.subtitle} />
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#040608]/8 via-transparent to-[#040608]/18"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#c4a06a]/[0.06]"
          aria-hidden="true"
        />
      </div>
    </div>
  );

  return (
    <figure
      className={cn("map-cover relative mx-auto", frameClass, className)}
    >
      {territoryHref ? (
        <Link
          href={territoryHref}
          className="map-cover__artifact group/artifact block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest/40"
          aria-label={`Enter ${map.title}`}
        >
          {plate}
        </Link>
      ) : (
        plate
      )}

      {scale === "threshold" && (
        <div
          className="mx-auto mt-6 h-px w-12 bg-gradient-to-r from-transparent via-[#c4a06a]/20 to-transparent"
          aria-hidden="true"
        />
      )}

      {journalUrl && showJournalWhisper && (
        <figcaption className={cn(scale === "threshold" ? "mt-7" : "mt-6")}>
          <a
            href={journalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="type-body block text-center text-[0.625rem] leading-relaxed tracking-[0.04em] text-charcoal-faint/75 transition-colors duration-[1.4s] hover:text-charcoal-muted/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest/35"
          >
            {whisper}
          </a>
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
    <div className="flex aspect-[2/3] h-full flex-col justify-end bg-[linear-gradient(168deg,#161a20_0%,#0c1014_50%,#14181c_100%)] p-6">
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
