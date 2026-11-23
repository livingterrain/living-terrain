"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TerrainLink } from "@/components/navigation";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { CurrentlyInvestigating } from "@/components/home/CurrentlyInvestigating";
import { siteConfig } from "@/lib/content/data";
import { TERRAIN_MENU } from "@/lib/world/orientation";
import { cn } from "@/lib/utils";
import "./home-v2.css";

type Region = "atlas" | "observatory" | "shelves";

type Locus = {
  href: string;
  label: string;
  hint: string;
  region: Region;
};

/** Threshold invitation language — href/label from TERRAIN_MENU; order follows the field axis. */
const HOME_LOCI_ORDER = ["/observatory", "/atlas", "/inquiry"] as const;

const HOME_LOCI_HINTS: Record<(typeof HOME_LOCI_ORDER)[number], string> = {
  "/observatory": "Begin with a question",
  "/atlas": "Follow the connections",
  "/inquiry": "Explore the body of work",
};

const HOME_LOCI_REGIONS: Record<(typeof HOME_LOCI_ORDER)[number], Region> = {
  "/observatory": "observatory",
  "/atlas": "atlas",
  "/inquiry": "shelves",
};

const LOCI: Locus[] = HOME_LOCI_ORDER.map((href) => {
  const destination = TERRAIN_MENU.find((entry) => entry.href === href);
  if (!destination) {
    throw new Error(`Home locus missing from TERRAIN_MENU: ${href}`);
  }
  return {
    href: destination.href,
    label: destination.label,
    hint: HOME_LOCI_HINTS[href],
    region: HOME_LOCI_REGIONS[href],
  };
});

/**
 * Living Terrain — Visual System V2 / The Living Observatory (Home only).
 * Dark botanical natural-history atmosphere: field, axis, orbit, node, thread.
 * Isolated under .lt-v2; does not propagate site-wide.
 */
export function HomeV2() {
  const [attend, setAttend] = useState<Region | null>(null);
  const leaveTimer = useRef<number | null>(null);

  const clearLeave = useCallback(() => {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  }, []);

  const onEnter = useCallback(
    (region: Region) => {
      clearLeave();
      setAttend(region);
    },
    [clearLeave],
  );

  const onLeave = useCallback(() => {
    clearLeave();
    leaveTimer.current = window.setTimeout(() => setAttend(null), 320);
  }, [clearLeave]);

  useEffect(() => () => clearLeave(), [clearLeave]);

  return (
    <div
      className={cn("lt-v2", attend && `lt-v2--attend-${attend}`)}
      data-visual-system="v2"
      data-atmosphere="living-observatory"
    >
      {/* Field grammar — not decoration */}
      <div className="lt-v2__field" aria-hidden>
        <div className="lt-v2__void" />
        <div className="lt-v2__depth" />
        <div className="lt-v2__orbit" />
        <div className="lt-v2__axis" />
        <div className="lt-v2__horizon" />
        <div className="lt-v2__grain" />
        {LOCI.map((l) => (
          <span
            key={l.region}
            className={cn("lt-v2__node", `lt-v2__node--${l.region}`)}
            data-active={attend === l.region ? "true" : undefined}
          />
        ))}
        <div
          className={cn("lt-v2__thread", attend && "lt-v2__thread--on")}
          data-to={attend ?? undefined}
        />
      </div>

      <div className="lt-v2__stage">
        <div className="lt-v2__west">
          <header className="lt-v2__identity">
            <p className="lt-v2__byline">
              <TerrainLink href="/about">{siteConfig.author}</TerrainLink>
            </p>
            <h1 className="lt-v2__title">Living Terrain</h1>
            <p className="lt-v2__statement">Everything is in relationship.</p>
            <p className="lt-v2__description">
              An evolving exploration of life, intelligence, adaptation,
              meaning, and the structures through which we understand reality.
            </p>
            <p className="lt-v2__orient">Choose where your curiosity begins.</p>
          </header>
        </div>

        <nav className="lt-v2__loci" aria-label="Destinations">
          {LOCI.map((l) => (
            <TerrainLink
              key={l.href}
              href={l.href}
              data-region={l.region}
              className={cn("lt-v2__locus", `lt-v2__locus--${l.region}`)}
              onPointerEnter={() => onEnter(l.region)}
              onPointerLeave={onLeave}
              onFocus={() => onEnter(l.region)}
              onBlur={onLeave}
            >
              <span className="lt-v2__locus-dot" aria-hidden />
              <span className="lt-v2__locus-label">{l.label}</span>
              <span className="lt-v2__locus-hint">{l.hint}</span>
            </TerrainLink>
          ))}
        </nav>

        <CurrentlyInvestigating />
      </div>
      <NewsletterSignup variant="home" />
    </div>
  );
}
