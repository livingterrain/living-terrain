"use client";

import Image from "next/image";
import { useState } from "react";
import { resolveMapCoverSrc } from "@/lib/content/maps";
import type { Book } from "@/lib/content/types";
import { cn } from "@/lib/utils";

interface MapCoverProps {
  map: Pick<Book, "slug" | "title" | "subtitle" | "coverImage">;
  /** hall = gallery scale; threshold = dominant arrival */
  scale?: "hall" | "threshold";
  className?: string;
  priority?: boolean;
}

/**
 * Map plate — cover art as cartographic artifact, with engraved fallback.
 */
export function MapCover({
  map,
  scale = "hall",
  className,
  priority = false,
}: MapCoverProps) {
  const [failed, setFailed] = useState(false);
  const src = resolveMapCoverSrc(map);

  const frameClass =
    scale === "threshold"
      ? "max-w-sm sm:max-w-md"
      : "max-w-[11rem] sm:max-w-[12.5rem]";

  return (
    <div
      className={cn(
        "map-cover relative mx-auto",
        frameClass,
        className,
      )}
    >
      <div
        className={cn(
          "map-cover__frame relative overflow-hidden border border-rule/50 bg-[#0e1014] shadow-[0_24px_64px_-12px_rgba(4,6,8,0.55)]",
          scale === "threshold" ? "aspect-[2/3]" : "aspect-[2/3]",
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
                ? "(max-width: 640px) 80vw, 400px"
                : "(max-width: 640px) 40vw, 200px"
            }
            priority={priority}
            onError={() => setFailed(true)}
          />
        ) : (
          <MapCoverFallback title={map.title} subtitle={map.subtitle} />
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040608]/50 via-transparent to-[#c4a06a]/5"
          aria-hidden="true"
        />
      </div>
      {scale === "threshold" && (
        <div
          className="mx-auto mt-3 h-px w-12 bg-gradient-to-r from-transparent via-[#c4a06a]/40 to-transparent"
          aria-hidden="true"
        />
      )}
    </div>
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
    <div className="flex h-full flex-col justify-end bg-[linear-gradient(165deg,#141820_0%,#0a0e14_45%,#12161c_100%)] p-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#c4a06a 1px, transparent 1px), linear-gradient(90deg, #c4a06a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />
      <p className="type-folio relative text-[0.625rem] uppercase tracking-[0.2em] text-[#c4a06a]/70">
        Charted territory
      </p>
      <p className="type-entry relative mt-3 text-balance text-ivory/90 text-lg leading-snug">
        {title}
      </p>
      {subtitle && (
        <p className="type-body relative mt-2 text-[0.8125rem] text-ivory/50">
          {subtitle}
        </p>
      )}
    </div>
  );
}
