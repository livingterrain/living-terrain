"use client";

import type { ReactNode } from "react";
import { CircadianRoomWash } from "@/components/atmosphere/CircadianRoomWash";
import { LingerWhisper, ScrollDepth } from "@/components/atmosphere";
import { cn } from "@/lib/utils";
import type { RoomKind } from "@/lib/rooms";
import { rooms } from "@/lib/rooms";
import {
  DiscoveryCursor,
  DiscoveryField,
  DiscoveryProvider,
} from "@/components/discovery";
import { RoomAtmosphere } from "./RoomAtmosphere";

interface RoomProps {
  kind: RoomKind;
  children: ReactNode;
  className?: string;
  /** Enable cursor discovery layer */
  discovery?: boolean;
}

export function Room({
  kind,
  children,
  className,
  discovery = false,
}: RoomProps) {
  const profile = rooms[kind];

  return (
    <DiscoveryProvider enabled={discovery}>
      <div
        className={cn(
          "relative min-h-[calc(100dvh-4.5rem)] sm:min-h-[calc(100dvh-5rem)]",
          profile.surface,
          className,
        )}
      >
        {discovery && <ScrollDepth kind={kind} />}
        {discovery && <DiscoveryField kind={kind} />}
        <RoomAtmosphere kind={kind} />
        <CircadianRoomWash />
        <div
          className="circadian-shadow-vignette pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void/[0.07]"
          aria-hidden
        />
        {discovery && <DiscoveryCursor />}
        <div className={cn("relative z-10", profile.vignette)}>{children}</div>
        {discovery && <LingerWhisper variant="room" delay={28000} />}
      </div>
    </DiscoveryProvider>
  );
}
