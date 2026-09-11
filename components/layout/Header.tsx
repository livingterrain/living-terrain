"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { TerrainOrientation } from "@/components/layout/TerrainOrientation";
import { placeForPath, locationForPath } from "@/lib/world/location-for-path";
import { cn } from "@/lib/utils";
import { roomForPath } from "@/lib/rooms";

/**
 * Site header — Living Terrain · location whisper · Join · Menu.
 * Global destinations live in Menu; Join also whispers in the desktop trail.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const room = roomForPath(pathname);
  const inWorld = isHome || room !== null;
  const place = placeForPath(pathname);
  const location = locationForPath(pathname);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 64);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const present = inWorld && (scrolled || !isHome);
  const homeField = isHome;

  return (
    <header
      className={cn(
        "world-presence sticky top-0 z-40 transition-all duration-[1200ms]",
        homeField && !scrolled
          ? "pointer-events-none border-b border-transparent bg-transparent"
          : present
            ? "world-presence--awake border-b border-rule/20 bg-[color-mix(in_srgb,#06080c_90%,transparent)] backdrop-blur-[4px]"
            : "border-b border-transparent bg-transparent",
      )}
      data-world-location={location}
      data-world-place={place}
      data-home-field={isHome ? "true" : undefined}
    >
      <Container>
        <div
          className={cn(
            "relative flex items-center transition-[height,padding] duration-[2400ms]",
            homeField && !scrolled
              ? "h-12 sm:h-14"
              : present
                ? "h-14 sm:h-16 md:h-[4.25rem]"
                : "h-14 sm:h-16",
          )}
        >
          <div
            className={cn(
              "min-w-0 flex-1",
              homeField && !scrolled && "pointer-events-auto",
            )}
          >
            <TerrainOrientation homeField={homeField && !scrolled} />
          </div>
        </div>
      </Container>
    </header>
  );
}
