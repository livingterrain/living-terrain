"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { TerrainLink } from "@/components/navigation";
import { cn } from "@/lib/utils";

type Region = "atlas" | "observatory" | "shelves";

type Destination = {
  href: string;
  label: string;
  hint: string;
  region: Region;
};

/** Same destinations / copy — located in the field, not stacked as UI. */
const DESTINATIONS: Destination[] = [
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
  {
    href: "/observatory",
    label: "Observatory",
    hint: "Where ideas are still forming.",
    region: "observatory",
  },
];

function HomeTerrainField({
  attend,
  parallax,
}: {
  attend: Region | null;
  parallax: { x: number; y: number };
}) {
  return (
    <div
      className="home-orient__field"
      data-attend={attend ?? undefined}
      aria-hidden
      style={
        {
          "--home-px": String(parallax.x),
          "--home-py": String(parallax.y),
        } as CSSProperties
      }
    >
      <div className="home-orient__void" />

      <div className="home-orient__plate">
        <Image
          src="/prototype/home-nocturnal/terrain-field.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="home-orient__img"
        />
      </div>

      <div className="home-orient__reveal home-orient__reveal--atlas" />
      <div className="home-orient__reveal home-orient__reveal--shelves" />
      <div className="home-orient__reveal home-orient__reveal--observatory" />

      <div className="home-orient__haze" />
      <div className="home-orient__grain" />
    </div>
  );
}

export function HomeOrientation() {
  const [attend, setAttend] = useState<Region | null>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
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
    leaveTimer.current = window.setTimeout(() => setAttend(null), 280);
  }, [clearLeave]);

  useEffect(() => () => clearLeave(), [clearLeave]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setParallax({
          x: Math.max(-1, Math.min(1, x)) * 0.35,
          y: Math.max(-1, Math.min(1, y)) * 0.22,
        });
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className={cn(
        "home-orient home-orient--nocturnal home-orient--field",
        attend && `home-orient--attend-${attend}`,
      )}
    >
      <HomeTerrainField attend={attend} parallax={parallax} />

      <div className="home-orient__stage">
        <header className="home-orient__identity">
          <h1 className="home-orient__brand">Living Terrain</h1>
          <p className="home-orient__orient">What brought you here?</p>
        </header>

        <nav className="home-orient__loci" aria-label="Destinations">
          {DESTINATIONS.map((d) => (
            <TerrainLink
              key={d.href}
              href={d.href}
              data-region={d.region}
              className={cn(
                "home-orient__locus",
                `home-orient__locus--${d.region}`,
              )}
              onPointerEnter={() => onEnter(d.region)}
              onPointerLeave={onLeave}
              onFocus={() => onEnter(d.region)}
              onBlur={onLeave}
            >
              <span className="home-orient__locus-label">{d.label}</span>
              <span className="home-orient__locus-hint">{d.hint}</span>
            </TerrainLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
