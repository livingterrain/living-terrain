"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { PathwayLink } from "@/components/design-system/threshold";
import { Container } from "@/components/layout/Container";
import { TerrainLink } from "@/components/navigation";
import { SearchDialog } from "@/components/search/SearchDialog";
import { placeForPath, locationForPath, whisperForPath } from "@/lib/world/location-for-path";
import { PATHWAYS, PATHWAY_DEEPER } from "@/lib/world/pathways";
import { cn } from "@/lib/utils";
import { roomForPath } from "@/lib/rooms";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const room = roomForPath(pathname);
  const inWorld = isHome || room !== null;
  const place = placeForPath(pathname);
  const whisper = whisperForPath(pathname);
  const location = locationForPath(pathname);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 64);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const present = inWorld && (scrolled || open || !isHome);

  return (
    <header
      className={cn(
        "world-presence sticky top-0 z-40 transition-all duration-[3200ms]",
        present
          ? "world-presence--awake border-b border-rule/10 bg-[color-mix(in_srgb,var(--color-ivory)_55%,transparent)] backdrop-blur-[4px]"
          : "border-b border-transparent bg-transparent",
      )}
      data-world-location={location}
      data-world-place={place}
    >
      <Container>
        <div
          className={cn(
            "flex items-center justify-between transition-[height,padding] duration-[2400ms]",
            present ? "h-16 sm:h-[4.25rem]" : "h-14 sm:h-16",
          )}
        >
          <TerrainLink
            href="/"
            className={cn(
              "touch-zone relative flex min-h-11 items-center font-heading tracking-tight transition-colors duration-[1200ms]",
              present
                ? "text-[0.9375rem] text-charcoal/85 sm:text-base"
                : "text-[1rem] text-charcoal/70 sm:text-lg",
              pathname === "/" && present && "text-forest/90",
            )}
          >
            Living Terrain
          </TerrainLink>

          {present && !isHome && (
            <p className="world-presence__place pointer-events-none absolute left-1/2 hidden max-w-[9rem] -translate-x-1/2 truncate font-heading text-[0.75rem] italic text-charcoal-muted/70 min-[420px]:block sm:max-w-[12rem] sm:text-[0.8125rem] lg:max-w-xs">
              {place}
            </p>
          )}

          <div className="flex items-center gap-4 sm:gap-6">
            <nav
              className={cn(
                "hidden items-center gap-8 lg:flex",
                present ? "opacity-100" : "opacity-0 pointer-events-none",
              )}
              aria-label="Directions"
            >
              {PATHWAYS.slice(0, 3).map((p) => (
                <PathwayLink
                  key={p.href}
                  href={p.href}
                  active={
                    pathname === p.href || pathname.startsWith(`${p.href}/`)
                  }
                  className="text-[0.8125rem]"
                >
                  {p.label}
                </PathwayLink>
              ))}
            </nav>

            <div
              className={cn(
                "[&_button]:relative [&_button]:flex [&_button]:min-h-11 [&_button]:min-w-11 [&_button]:items-center [&_button]:justify-center [&_button]:touch-manipulation",
                present ? "opacity-100" : "opacity-75",
              )}
            >
              <SearchDialog />
            </div>

            <button
              type="button"
              onClick={() => setOpen(!open)}
              className={cn(
                "world-presence__further touch-zone relative flex min-h-11 min-w-11 items-center justify-center font-heading text-lg text-charcoal-muted/75 transition-colors duration-[1200ms] hover:text-charcoal/90 active:text-charcoal lg:hidden",
                present && "opacity-100",
              )}
              aria-label={open ? "Close" : "Further directions"}
              aria-expanded={open}
            >
              {open ? "×" : "…"}
            </button>

            <button
              type="button"
              onClick={() => setOpen(!open)}
              className={cn(
                "world-presence__further hidden min-h-10 items-center font-heading text-[0.8125rem] italic text-charcoal-muted/70 transition-colors duration-[1200ms] hover:text-charcoal/90 lg:flex",
                present ? "opacity-100" : "opacity-70",
              )}
              aria-expanded={open}
            >
              {open ? "Close" : "Further…"}
            </button>
          </div>
        </div>
      </Container>

      {open && (
        <div
          className="world-presence__horizon fixed inset-x-0 bottom-0 z-[60]"
          role="dialog"
          aria-label="Directions through the terrain"
        >
          <Container className="flex min-h-full flex-col justify-center py-12 sm:py-20">
            {!isHome && (
              <p className="mx-auto max-w-md text-center font-heading text-lg italic leading-relaxed text-charcoal-muted">
                {whisper}
              </p>
            )}

            <nav
              className="mx-auto mt-10 flex w-full max-w-sm flex-col gap-8 sm:mt-14 sm:gap-10"
              aria-label="Pathways"
            >
              {PATHWAYS.map((p) => (
                <PathwayLink
                  key={p.href}
                  href={p.href}
                  active={
                    pathname === p.href || pathname.startsWith(`${p.href}/`)
                  }
                  onClick={() => setOpen(false)}
                  rich
                >
                  <span>{p.label}</span>
                  <span className="world-pathway-rich__hint">{p.hint}</span>
                </PathwayLink>
              ))}
            </nav>

            <div className="threshold-carved threshold-carved--edge mx-auto my-12 w-full max-w-sm" />

            <nav className="mx-auto flex w-full max-w-sm flex-col gap-8">
              {PATHWAY_DEEPER.map((p) => (
                <PathwayLink
                  key={p.href}
                  href={p.href}
                  active={
                    pathname === p.href || pathname.startsWith(`${p.href}/`)
                  }
                  onClick={() => setOpen(false)}
                  rich
                  className="text-sm"
                >
                  <span>{p.label}</span>
                  <span className="world-pathway-rich__hint">{p.hint}</span>
                </PathwayLink>
              ))}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
