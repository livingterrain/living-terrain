"use client";

import type { RoomKind } from "@/lib/rooms";

interface RoomAtmosphereProps {
  kind: RoomKind;
}

/**
 * Regional interior grammar for V2 — sparse structure, not taupe glow.
 * Shared field comes from PersistentTerrainAtmosphere; these only differentiate rooms.
 */
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
    <svg
      className="absolute inset-0 h-full w-full text-[color:var(--lt-bone)]"
      viewBox="0 0 1440 2400"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="0.4" opacity="0.06">
        <path d="M720 0 V800" />
        <path d="M720 400 C520 500, 280 620, 80 760" />
        <path d="M720 400 C920 500, 1160 620, 1360 760" />
        <path d="M720 800 C480 920, 240 1080, 40 1280" />
        <path d="M720 800 C960 920, 1200 1080, 1400 1280" />
      </g>
    </svg>
  );
}

function LanternLayers() {
  return (
    <>
      <div className="world-lantern-reading__glow absolute inset-0 opacity-40" />
      <div className="world-lantern-reading__walls absolute inset-0 opacity-30" />
    </>
  );
}

function LibraryLayers() {
  /* Shelves — fine rules only; objects carry the material */
  return (
    <svg
      className="absolute inset-0 h-full w-full text-[color:var(--lt-bone)]"
      viewBox="0 0 1440 2000"
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="0.3" opacity="0.045">
        <path d="M96 0 V2000" />
        <path d="M1344 0 V2000" />
        <path d="M96 320 H1344" />
        <path d="M96 640 H1344" />
        <path d="M96 960 H1344" />
      </g>
    </svg>
  );
}

function GuideLayers() {
  return (
    <svg
      className="absolute inset-0 h-full w-full text-[color:var(--lt-bone)]"
      viewBox="0 0 1440 1600"
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="0.35" opacity="0.05">
        <path d="M720 0 V1600" strokeDasharray="2 18" />
        <ellipse cx="720" cy="420" rx="260" ry="110" />
      </g>
    </svg>
  );
}

function NotebookLayers() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 27px, var(--lt-rule) 27px, var(--lt-rule) 28px)",
          backgroundPosition: "3rem 0",
        }}
      />
      <div className="absolute left-12 top-0 h-full w-px bg-[color:var(--lt-rule)] sm:left-16" />
    </>
  );
}

function ArchiveLayers() {
  return (
    <svg
      className="absolute inset-0 h-full w-full text-[color:var(--lt-bone)]"
      viewBox="0 0 1440 2400"
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="0.3" opacity="0.045">
        <path d="M200 0 V2400" />
        <path d="M480 0 V2400" />
        <path d="M760 0 V2400" />
        <path d="M1040 0 V2400" />
      </g>
    </svg>
  );
}

function ObservatoryLayers() {
  return (
    <svg
      className="world-observatory-marks absolute inset-0 h-full w-full text-[color:var(--lt-cool)]"
      viewBox="0 0 1440 2400"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="0.35" opacity="0.07">
        <path d="M88 0 V2400" />
        <path d="M1352 0 V2400" />
      </g>
      <g stroke="currentColor" strokeWidth="0.25" opacity="0.04" strokeDasharray="1.5 40">
        <path d="M0 640 H1440" />
        <path d="M0 1760 H1440" />
      </g>
      <g stroke="currentColor" strokeWidth="0.5" opacity="0.1">
        <path d="M64 104 H108 M88 80 V124" />
        <path d="M1332 104 H1376 M1352 80 V124" />
      </g>
      <path
        d="M420 180 A300 120 0 0 1 1020 180"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.05"
      />
    </svg>
  );
}

function ChamberLayers() {
  return (
    <svg
      className="absolute inset-0 h-full w-full text-[color:var(--lt-bone)]"
      viewBox="0 0 1440 2400"
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="0.28" opacity="0.05">
        <path d="M720 0 V2400" />
        <path d="M360 0 V2400" strokeDasharray="3 16" />
        <path d="M1080 0 V2400" strokeDasharray="3 16" />
        <path d="M0 200 H1440" />
        <path d="M0 600 H1440" />
      </g>
    </svg>
  );
}
