"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PathwayLink } from "@/components/design-system/threshold";
import { Container } from "@/components/layout/Container";
import { TerrainOrientation } from "@/components/layout/TerrainOrientation";
import { SearchDialog } from "@/components/search/SearchDialog";
import { placeForPath, locationForPath } from "@/lib/world/location-for-path";
import { PATHWAYS, pathwayIsActive } from "@/lib/world/pathways";
import { cn } from "@/lib/utils";
import { roomForPath } from "@/lib/rooms";

/**
 * Site header — Living Terrain orientation + quiet pathway echoes.
 * Primary escape is Menu (via TerrainOrientation), not cryptic Further / ···.
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
            "relative flex items-center justify-between gap-3 transition-[height,padding] duration-[2400ms]",
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

          <div
            className={cn(
              "ml-auto flex shrink-0 items-center gap-1.5 sm:gap-4 md:gap-6",
              homeField && !scrolled && "pointer-events-auto",
            )}
          >
            <nav
              className={cn(
                "hidden items-center gap-8 xl:flex",
                homeField && !scrolled
                  ? "pointer-events-none opacity-0"
                  : present
                    ? "opacity-70"
                    : "opacity-0",
              )}
              aria-label="Directions"
            >
              {PATHWAYS.map((p) => (
                <PathwayLink
                  key={p.href}
                  href={p.href}
                  active={pathwayIsActive(pathname, p.href)}
                  className="text-[0.8125rem]"
                >
                  {p.label}
                </PathwayLink>
              ))}
            </nav>

            <div
              className={cn(
                "[&_button]:relative [&_button]:flex [&_button]:min-h-11 [&_button]:min-w-11 [&_button]:items-center [&_button]:justify-center [&_button]:touch-manipulation",
                homeField && !scrolled
                  ? "opacity-35 hover:opacity-70 [&_button]:text-ivory/50"
                  : present
                    ? "opacity-100"
                    : "opacity-75",
              )}
            >
              <SearchDialog />
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
