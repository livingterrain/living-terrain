"use client";

import type { RoomKind } from "@/lib/rooms";

interface RoomAtmosphereProps {
  kind: RoomKind;
}

export function RoomAtmosphere({ kind }: RoomAtmosphereProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {kind === "pathways" && <PathwaysLayers />}
      {kind === "reading" && <ReadingLayers />}
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
        className="absolute inset-0 h-full w-full animate-drift-slow text-forest"
        viewBox="0 0 1440 2400"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.5" opacity="0.09">
          <path d="M720 0 V800" />
          <path d="M720 400 C520 500, 280 620, 80 760" />
          <path d="M720 400 C920 500, 1160 620, 1360 760" />
          <path d="M720 800 C480 920, 240 1080, 40 1280" />
          <path d="M720 800 C960 920, 1200 1080, 1400 1280" />
          <path d="M200 600 C400 700, 560 820, 720 960" />
          <path d="M1240 600 C1040 700, 880 820, 720 960" />
        </g>
        <g stroke="currentColor" strokeWidth="0.35" opacity="0.06">
          <path d="M-40 1400 C300 1360, 500 1440, 720 1380 S1160 1340, 1480 1400" />
          <path d="M-40 1700 C280 1660, 480 1740, 700 1680 S1140 1640, 1480 1700" />
        </g>
      </svg>
      <div className="absolute left-1/2 top-[12%] h-64 w-64 -translate-x-1/2 light-pool rounded-full opacity-40 atmosphere-breathe-slow" />
    </>
  );
}

function ReadingLayers() {
  return (
    <>
      <div className="absolute left-1/2 top-0 h-[32rem] w-[min(70vw,28rem)] -translate-x-1/2 light-pool rounded-full opacity-70 atmosphere-breathe-slow" />
      <svg
        className="absolute inset-0 h-full w-full text-charcoal"
        viewBox="0 0 1440 2000"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.4" opacity="0.05">
          <path d="M120 320 H1320" />
          <path d="M120 520 H1320" />
          <path d="M120 720 H1320" />
          <path d="M120 920 H1320" />
        </g>
      </svg>
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ivory-deep/50 to-transparent" />
    </>
  );
}

function NotebookLayers() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent, transparent 27px, var(--color-rule) 27px, var(--color-rule) 28px)",
          backgroundPosition: "3rem 0",
        }}
      />
      <div className="absolute left-12 top-0 h-full w-px bg-forest/10 sm:left-16" />
      <svg
        className="absolute bottom-[20%] right-[8%] h-32 w-32 text-charcoal animate-field-breath"
        viewBox="0 0 100 100"
        fill="none"
      >
        <ellipse cx="50" cy="50" rx="35" ry="28" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
      </svg>
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
        <g stroke="currentColor" strokeWidth="0.4" opacity="0.07">
          <path d="M180 0 V2400" />
          <path d="M480 0 V2400" />
          <path d="M780 0 V2400" />
          <path d="M1080 0 V2400" />
          <path d="M60 400 H1380" />
          <path d="M60 800 H1380" />
          <path d="M60 1200 H1380" />
          <path d="M60 1600 H1380" />
        </g>
      </svg>
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-void/8 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-void/8 to-transparent" />
    </>
  );
}

function ObservatoryLayers() {
  return (
    <>
      <div className="absolute left-1/2 top-[20%] h-[28rem] w-[28rem] -translate-x-1/2 animate-pulse-breath rounded-full border border-forest/10" />
      <div className="absolute left-1/2 top-[20%] h-[20rem] w-[20rem] -translate-x-1/2 animate-pulse-breath rounded-full border border-forest/8 [animation-delay:1s]" />
      <svg
        className="absolute left-1/2 top-[20%] h-[28rem] w-[28rem] -translate-x-1/2 text-forest"
        viewBox="0 0 200 200"
        fill="none"
      >
        <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
        <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
      </svg>
      <svg
        className="absolute inset-0 h-full w-full text-charcoal animate-drift-slow"
        viewBox="0 0 1440 1600"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.3" opacity="0.04">
          {Array.from({ length: 12 }).map((_, i) => (
            <circle
              key={i}
              cx={120 + (i % 4) * 320}
              cy={200 + Math.floor(i / 4) * 400}
              r={2 + (i % 3)}
              fill="currentColor"
            />
          ))}
        </g>
      </svg>
    </>
  );
}

function ChamberLayers() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-void/12 via-transparent to-void/18" />
      <svg
        className="absolute inset-0 h-full w-full text-charcoal"
        viewBox="0 0 1440 2400"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.35" opacity="0.06">
          <path d="M0 200 H1440" />
          <path d="M0 600 H1440" />
          <path d="M0 1000 H1440" />
          <path d="M720 0 V2400" />
          <path d="M360 0 L360 2400" strokeDasharray="4 12" />
          <path d="M1080 0 L1080 2400" strokeDasharray="4 12" />
        </g>
      </svg>
      <div className="absolute bottom-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-forest/20" />
    </>
  );
}
