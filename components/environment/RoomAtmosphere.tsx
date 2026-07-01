"use client";

import type { RoomKind } from "@/lib/rooms";

interface RoomAtmosphereProps {
  kind: RoomKind;
}

export function RoomAtmosphere({ kind }: RoomAtmosphereProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {kind === "pathways" && <PathwaysLayers />}
      {kind === "reading" && <LanternLayers />}
      {kind === "library" && <LibraryLayers />}
      {kind === "guide" && <GuideLayers />}
      {kind === "notebook" && <NotebookLayers />}
      {kind === "archive" && <ArchiveLayers />}
      {kind === "observatory" && <ObservatoryLayers />}
      {kind === "chamber" && <ChamberLayers />}
    </div>
  );
}

function PathwaysLayers() {
  return (
    <>
      <svg
        className="absolute inset-0 h-full w-full text-forest animate-drift-slow"
        viewBox="0 0 1440 2400"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.45" opacity="0.08">
          <path d="M720 0 V800" />
          <path d="M720 400 C520 500, 280 620, 80 760" />
          <path d="M720 400 C920 500, 1160 620, 1360 760" />
          <path d="M720 800 C480 920, 240 1080, 40 1280" />
          <path d="M720 800 C960 920, 1200 1080, 1400 1280" />
        </g>
        <g stroke="currentColor" strokeWidth="0.3" opacity="0.05">
          <path d="M-40 1400 C300 1360, 500 1440, 720 1380 S1160 1340, 1480 1400" />
        </g>
      </svg>
      <div className="world-pathways-glow absolute left-1/2 top-[10%] h-72 w-72 -translate-x-1/2" />
    </>
  );
}

function LanternLayers() {
  return (
    <>
      <div className="world-lantern-reading__glow absolute inset-0 opacity-70" />
      <div className="world-lantern-reading__walls absolute inset-0 opacity-50" />
    </>
  );
}

function LibraryLayers() {
  return (
    <>
      <div className="world-library-glow absolute inset-0" />
      <svg
        className="absolute inset-0 h-full w-full text-charcoal"
        viewBox="0 0 1440 2000"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.35" opacity="0.06">
          <path d="M80 0 V2000" />
          <path d="M1360 0 V2000" />
          <path d="M80 280 H1360" />
          <path d="M80 560 H1360" />
          <path d="M80 840 H1360" />
          <path d="M80 1120 H1360" />
        </g>
        <g stroke="currentColor" strokeWidth="0.25" opacity="0.04">
          <path d="M200 120 H1240" />
          <path d="M200 400 H1240" />
          <path d="M200 680 H1240" />
        </g>
      </svg>
      <div className="world-library-shelves absolute inset-x-0 top-0 h-full" />
    </>
  );
}

function GuideLayers() {
  return (
    <>
      <div className="world-guide-glow absolute inset-0" />
      <svg
        className="absolute inset-0 h-full w-full text-charcoal"
        viewBox="0 0 1440 1600"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.4" opacity="0.05">
          <path d="M720 0 V1600" strokeDasharray="2 16" />
          <ellipse cx="720" cy="420" rx="280" ry="120" opacity="0.5" />
        </g>
      </svg>
      <div className="world-guide-alcove absolute inset-x-0 bottom-0 h-[45%]" />
    </>
  );
}

function NotebookLayers() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 27px, var(--color-rule) 27px, var(--color-rule) 28px)",
          backgroundPosition: "3rem 0",
        }}
      />
      <div className="absolute left-12 top-0 h-full w-px bg-forest/8 sm:left-16" />
      <div className="world-lantern-reading__glow absolute inset-0 opacity-40" />
    </>
  );
}

function ArchiveLayers() {
  return (
    <>
      <svg
        className="absolute inset-0 h-full w-full text-charcoal"
        viewBox="0 0 1440 2400"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.35" opacity="0.06">
          <path d="M180 0 V2400" />
          <path d="M480 0 V2400" />
          <path d="M780 0 V2400" />
          <path d="M1080 0 V2400" />
          <path d="M60 400 H1380" />
          <path d="M60 800 H1380" />
          <path d="M60 1200 H1380" />
        </g>
      </svg>
      <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#06080c]/12 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#06080c]/12 to-transparent" />
    </>
  );
}

function ObservatoryLayers() {
  return (
    <>
      <div className="world-observatory-amber absolute inset-0" />
      <div className="world-observatory-ring absolute left-1/2 top-[18%] h-[26rem] w-[26rem] -translate-x-1/2" />
      <svg
        className="absolute left-1/2 top-[18%] h-[26rem] w-[26rem] -translate-x-1/2 text-[#c4a06a] animate-drift-slow"
        viewBox="0 0 200 200"
        fill="none"
      >
        <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.25" opacity="0.1" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.25" opacity="0.1" />
        <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.25" opacity="0.08" />
      </svg>
    </>
  );
}

function ChamberLayers() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080c]/14 via-transparent to-[#06080c]/20" />
      <svg
        className="absolute inset-0 h-full w-full text-charcoal"
        viewBox="0 0 1440 2400"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.3" opacity="0.05">
          <path d="M0 200 H1440" />
          <path d="M0 600 H1440" />
          <path d="M720 0 V2400" />
          <path d="M360 0 L360 2400" strokeDasharray="3 14" />
          <path d="M1080 0 L1080 2400" strokeDasharray="3 14" />
        </g>
      </svg>
      <div className="absolute bottom-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-forest/15" />
    </>
  );
}
