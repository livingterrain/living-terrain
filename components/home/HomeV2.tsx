"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TerrainLink } from "@/components/navigation";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { CurrentlyInvestigating } from "@/components/home/CurrentlyInvestigating";
import { cn } from "@/lib/utils";
import "./home-v2.css";

type Region = "atlas" | "observatory" | "shelves";

type Locus = {
  href: string;
  label: string;
  hint: string;
  region: Region;
};

/** Destinations and meanings unchanged — encountered as states in one field. */
const LOCI: Locus[] = [
  {
    href: "/observatory",
    label: "Observatory",
    hint: "Where ideas are still forming.",
    region: "observatory",
  },
  {
    href: "/atlas",
    label: "Atlas",
    hint: "Follow what connects.",
    region: "atlas",
  },
  {
    href: "/inquiry",
    label: "The Shelves",
    hint: "Books, essays, and visual maps.",
    region: "shelves",
  },
];

/**
 * Living Terrain — Visual System V2 (Home only).
 * Cinematic scientific mysticism: field, axis, orbit, node, thread, light.
 * Isolated from prior Home treatments; does not propagate site-wide.
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
            <h1 className="lt-v2__title">Living Terrain</h1>
            <p className="lt-v2__orient">What brought you here?</p>
          </header>
          <CurrentlyInvestigating />
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
      </div>
      <NewsletterSignup variant="home" />
    </div>
  );
}
