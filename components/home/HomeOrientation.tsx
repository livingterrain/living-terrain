"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TerrainLink } from "@/components/navigation";
import { cn } from "@/lib/utils";

type Destination = {
  href: string;
  label: string;
  hint: string;
  primary?: boolean;
};

const DESTINATIONS: Destination[] = [
  {
    href: "/atlas",
    label: "Atlas",
    hint: "Begin with a question.",
    primary: true,
  },
  {
    href: "/observatory",
    label: "Observatory",
    hint: "Research before it becomes a map.",
  },
  {
    href: "/inquiry",
    label: "The Shelves",
    hint: "Writing from the edges.",
  },
  {
    href: "/atlas/charts",
    label: "Charted maps",
    hint: "Completed investigations.",
  },
];

/** Quiet field stars — atmosphere only, not navigation */
const FIELD_STARS: ReadonlyArray<{ cx: number; cy: number; r: number; o: number }> = [
  { cx: 8, cy: 12, r: 0.11, o: 0.28 },
  { cx: 18, cy: 8, r: 0.08, o: 0.22 },
  { cx: 31, cy: 15, r: 0.12, o: 0.34 },
  { cx: 44, cy: 7, r: 0.07, o: 0.2 },
  { cx: 58, cy: 13, r: 0.1, o: 0.3 },
  { cx: 72, cy: 9, r: 0.08, o: 0.24 },
  { cx: 86, cy: 16, r: 0.11, o: 0.32 },
  { cx: 12, cy: 28, r: 0.08, o: 0.2 },
  { cx: 27, cy: 34, r: 0.1, o: 0.26 },
  { cx: 49, cy: 30, r: 0.09, o: 0.22 },
  { cx: 67, cy: 36, r: 0.08, o: 0.2 },
  { cx: 91, cy: 28, r: 0.1, o: 0.28 },
  { cx: 6, cy: 62, r: 0.08, o: 0.16 },
  { cx: 22, cy: 71, r: 0.09, o: 0.18 },
  { cx: 41, cy: 66, r: 0.07, o: 0.15 },
  { cx: 63, cy: 74, r: 0.1, o: 0.2 },
  { cx: 81, cy: 68, r: 0.08, o: 0.17 },
  { cx: 94, cy: 78, r: 0.09, o: 0.19 },
];

function HomeFieldAtmosphere() {
  return (
    <div className="home-orient__field" aria-hidden>
      <div className="home-orient__void" />
      <div className="home-orient__horizon" />
      <div className="home-orient__fog" />
      <svg
        className="home-orient__stars"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {FIELD_STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="#c8d0dc"
            opacity={s.o}
          />
        ))}
        {/* faint constellation traces — not interactive */}
        <g className="home-orient__traces" stroke="#9aa6b8" fill="none">
          <path d="M18 8 L31 15 L44 7" />
          <path d="M58 13 L72 9 L86 16" />
          <path d="M27 34 L49 30 L67 36" />
        </g>
      </svg>
      <div className="home-orient__vignette" />
    </div>
  );
}

function PresenceOrb({
  attended,
  onEnter,
  onLeave,
}: {
  attended: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "home-orient__orb",
        attended && "home-orient__orb--near",
      )}
      aria-label="Living Terrain presence"
      aria-describedby="home-orient-orb-line"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={onEnter}
    />
  );
}

export function HomeOrientation() {
  const [orbNear, setOrbNear] = useState(false);
  const leaveTimer = useRef<number | null>(null);

  const clearLeave = useCallback(() => {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  }, []);

  const onOrbEnter = useCallback(() => {
    clearLeave();
    setOrbNear(true);
  }, [clearLeave]);

  const onOrbLeave = useCallback(() => {
    clearLeave();
    leaveTimer.current = window.setTimeout(() => setOrbNear(false), 420);
  }, [clearLeave]);

  useEffect(() => () => clearLeave(), [clearLeave]);

  return (
    <div className="home-orient">
      <HomeFieldAtmosphere />

      <main className="home-orient__main">
        <header className="home-orient__identity">
          <div className="home-orient__title-row">
            <h1 className="home-orient__brand">Living Terrain</h1>
            <PresenceOrb
              attended={orbNear}
              onEnter={onOrbEnter}
              onLeave={onOrbLeave}
            />
          </div>
          <p
            id="home-orient-orb-line"
            className={cn(
              "home-orient__orb-line",
              orbNear && "home-orient__orb-line--in",
            )}
            aria-live="polite"
            aria-hidden={!orbNear}
          >
            What brought you here?
          </p>
          <p className="home-orient__orient">
            A living system for exploring the body, technology, relationships,
            time, and the patterns beneath experience.
          </p>
        </header>

        <nav className="home-orient__nav" aria-label="Destinations">
          {DESTINATIONS.map((d) => (
            <TerrainLink
              key={d.href}
              href={d.href}
              className={cn(
                "home-orient__dest",
                d.primary && "home-orient__dest--primary",
              )}
            >
              <span className="home-orient__dest-label">{d.label}</span>
              <span className="home-orient__dest-hint">{d.hint}</span>
            </TerrainLink>
          ))}
        </nav>
      </main>
    </div>
  );
}
