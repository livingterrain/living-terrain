"use client";

import { useMemo } from "react";
import { REALM_PARTICLE_SPEED, REALM_PULSE_SEC } from "@/lib/realms/ambience";
import { getRealmMetaphor } from "@/lib/realms/metaphors";
import { useCircadian } from "@/lib/atmosphere/useCircadian";
import type { RealmPalette, RealmSlug } from "@/lib/realms/types";
import { RippleField } from "./metaphor-effects";

interface RealmAtmosphereProps {
  palette: RealmPalette;
  slug: RealmSlug;
  variant?: "default" | "cathedral" | "network";
}

const PARTICLE_ANIM: Record<string, string> = {
  flow: "realm-drift-flow",
  weave: "realm-drift-weave",
  illuminate: "realm-drift-twinkle",
  crystallize: "realm-drift-inward",
  grow: "realm-drift-rise",
  stabilize: "realm-drift-still",
  support: "realm-drift-still",
  expand: "realm-drift-expand",
  branch: "realm-drift-flow",
  ripple: "realm-drift-ripple",
};

export function RealmAtmosphere({
  palette,
  slug,
  variant = "default",
}: RealmAtmosphereProps) {
  const metaphor = getRealmMetaphor(slug);
  const circadian = useCircadian();

  const particles = useMemo(
    () =>
      Array.from({ length: slug === "reality" ? 22 : 16 }, (_, i) => ({
        id: i,
        x: ((i * 73 + 11) % 100),
        y: ((i * 47 + 23) % 100),
        size: i % 5 === 0 ? 2 : 1,
        opacity: 0.06 + (i % 7) * 0.03,
        duration: 40 + (i % 6) * 12,
        delay: i * 2.1,
      })),
    [slug],
  );

  const driftClass = PARTICLE_ANIM[metaphor.metaphor] ?? "realm-drift-still";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: palette.bgGradient }}
      />

      <div
        className="absolute inset-[-20%] opacity-60 atmosphere-breathe-slow"
        style={{
          background: `radial-gradient(ellipse 50% 40% at 50% 35%, ${palette.glow}, transparent 70%)`,
          animationDuration: `${REALM_PULSE_SEC[slug]}s`,
        }}
      />

      {variant === "cathedral" && (
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.07]"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <path
            d="M0 100 L0 40 Q25 10 50 40 Q75 10 100 40 L100 100"
            fill="none"
            stroke={palette.accent}
            strokeWidth="0.15"
          />
          <path
            d="M15 100 L15 55 Q35 35 50 55 Q65 35 85 55 L85 100"
            fill="none"
            stroke={palette.accent}
            strokeWidth="0.08"
            opacity="0.6"
          />
        </svg>
      )}

      {metaphor.metaphor === "ripple" && (
        <svg
          className="absolute inset-0 h-full w-full opacity-40"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <RippleField cx={48} cy={48} stroke={palette.line} active />
        </svg>
      )}

      {particles.map((p) => (
        <span
          key={p.id}
          className={`realm-particle absolute rounded-full ${driftClass}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: palette.particle,
            opacity: p.opacity,
            animationDuration: `${(p.duration / REALM_PARTICLE_SPEED[slug]) * circadian.particleMul}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <div
        className="absolute inset-0 transition-opacity duration-[300s]"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 45%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          opacity: 0.45 + circadian.shadowDepth * 0.55,
        }}
      />
    </div>
  );
}
