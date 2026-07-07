"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { locationForPath, placeForPath } from "@/lib/world/location-for-path";
import { CircadianRoomWash } from "@/components/atmosphere/CircadianRoomWash";
import { cn } from "@/lib/utils";
import type { RoomKind } from "@/lib/rooms";
import { rooms } from "@/lib/rooms";
import { RoomAtmosphere } from "./RoomAtmosphere";
import { CuriosityContinuation } from "@/components/world/CuriosityContinuation";

interface RoomProps {
  kind: RoomKind;
  children: ReactNode;
  className?: string;
}

export function Room({ kind, children, className }: RoomProps) {
  const pathname = usePathname();
  const profile = rooms[kind];
  const worldLoc = locationForPath(pathname);
  const place = placeForPath(pathname);

  return (
    <div
      className={cn(
        "relative min-h-[calc(100dvh-4.5rem)] sm:min-h-[calc(100dvh-5rem)]",
        profile.surface,
        className,
      )}
      data-world-location={worldLoc}
      data-world-place={place}
    >
      <RoomAtmosphere kind={kind} />
      <CircadianRoomWash />
      <div
        className="circadian-shadow-vignette pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void/[0.07]"
        aria-hidden
      />
      <div className={cn("relative z-10", profile.vignette)}>
        {children}
        <CuriosityContinuation />
      </div>
    </div>
  );
}
