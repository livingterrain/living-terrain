/**
 * Atlas-only territory field marks — faint structural grammar in one void.
 * Not icons, cards, or separate backgrounds.
 */

import type { RootTerritoryId } from "@/lib/atlas/architecture";

type Props = {
  territoryId: RootTerritoryId;
};

/** Stroke shared by all fields — bone on void, never saturated */
const stroke = "color-mix(in srgb, #ebe6dc 55%, transparent)";

export function TerritoryField({ territoryId }: Props) {
  return (
    <svg
      className="atlas-territory__field"
      style={{ pointerEvents: "none" }}
      viewBox="0 0 320 120"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {territoryId === "r1-living-systems" && <LivingSystemsMark />}
      {territoryId === "r2-reality-structure" && <RealityStructureMark />}
      {territoryId === "r3-participation" && <ParticipationMark />}
      {territoryId === "r4-meaning-orientation" && <MeaningOrientationMark />}
      {territoryId === "r5-time-emergence" && <TimeEmergenceMark />}
    </svg>
  );
}

/** Organic / root / cellular branching */
function LivingSystemsMark() {
  return (
    <g
      fill="none"
      stroke={stroke}
      strokeWidth="0.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M28 108 C 40 88, 46 70, 52 48 C 56 34, 62 22, 74 14" />
      <path d="M52 48 C 64 52, 78 46, 96 38" />
      <path d="M52 48 C 48 60, 58 74, 70 86" />
      <path d="M96 38 C 108 28, 124 30, 138 42" />
      <path d="M96 38 C 110 48, 118 62, 116 78" />
      <path d="M138 42 C 152 36, 168 40, 178 54" />
      <path d="M70 86 C 82 94, 98 92, 112 84" />
      <path d="M178 54 C 190 66, 186 84, 172 96" />
      <path d="M116 78 C 128 88, 146 90, 160 82" />
      <circle cx="74" cy="14" r="1.1" fill={stroke} stroke="none" />
      <circle cx="138" cy="42" r="0.9" fill={stroke} stroke="none" />
      <circle cx="112" cy="84" r="0.85" fill={stroke} stroke="none" />
      <circle cx="172" cy="96" r="0.8" fill={stroke} stroke="none" />
      {/* faint secondary branch cluster */}
      <path d="M210 100 C 222 82, 236 70, 254 58" opacity="0.55" />
      <path d="M236 70 C 248 66, 262 72, 274 84" opacity="0.45" />
      <path d="M254 58 C 266 48, 280 46, 292 52" opacity="0.4" />
    </g>
  );
}

/** Underlying geometry / horizon / structural lines */
function RealityStructureMark() {
  return (
    <g fill="none" stroke={stroke} strokeWidth="0.55" strokeLinecap="round">
      <line x1="12" y1="78" x2="308" y2="78" opacity="0.7" />
      <line x1="12" y1="78" x2="88" y2="18" opacity="0.35" />
      <line x1="308" y1="78" x2="232" y2="18" opacity="0.35" />
      <line x1="88" y1="18" x2="232" y2="18" opacity="0.3" />
      <line x1="160" y1="18" x2="160" y2="110" opacity="0.25" />
      <line x1="48" y1="48" x2="272" y2="48" opacity="0.22" />
      <line x1="72" y1="110" x2="248" y2="110" opacity="0.2" />
      <path d="M40 78 L 100 40 L 160 78 L 220 40 L 280 78" opacity="0.28" />
      <circle cx="160" cy="78" r="1.2" fill={stroke} stroke="none" opacity="0.6" />
      <circle cx="100" cy="40" r="0.9" fill={stroke} stroke="none" opacity="0.45" />
      <circle cx="220" cy="40" r="0.9" fill={stroke} stroke="none" opacity="0.45" />
    </g>
  );
}

/** Relational intersections / nodes */
function ParticipationMark() {
  return (
    <g fill="none" stroke={stroke} strokeWidth="0.55" strokeLinecap="round">
      <line x1="48" y1="36" x2="140" y2="58" />
      <line x1="140" y1="58" x2="220" y2="32" />
      <line x1="140" y1="58" x2="168" y2="96" />
      <line x1="220" y1="32" x2="278" y2="70" />
      <line x1="168" y1="96" x2="248" y2="88" />
      <line x1="48" y1="36" x2="96" y2="92" opacity="0.45" />
      <line x1="96" y1="92" x2="168" y2="96" opacity="0.45" />
      <line x1="220" y1="32" x2="168" y2="96" opacity="0.35" />
      <line x1="278" y1="70" x2="248" y2="88" opacity="0.4" />
      <circle cx="48" cy="36" r="1.6" fill={stroke} stroke="none" />
      <circle cx="140" cy="58" r="2" fill={stroke} stroke="none" />
      <circle cx="220" cy="32" r="1.5" fill={stroke} stroke="none" />
      <circle cx="168" cy="96" r="1.7" fill={stroke} stroke="none" />
      <circle cx="278" cy="70" r="1.3" fill={stroke} stroke="none" />
      <circle cx="96" cy="92" r="1.2" fill={stroke} stroke="none" opacity="0.7" />
      <circle cx="248" cy="88" r="1.2" fill={stroke} stroke="none" opacity="0.7" />
    </g>
  );
}

/** Radial / orienting / celestial geometry */
function MeaningOrientationMark() {
  return (
    <g fill="none" stroke={stroke} strokeWidth="0.5" strokeLinecap="round">
      <circle cx="160" cy="60" r="14" opacity="0.35" />
      <circle cx="160" cy="60" r="32" opacity="0.28" />
      <circle cx="160" cy="60" r="52" opacity="0.2" />
      <line x1="160" y1="8" x2="160" y2="112" opacity="0.3" />
      <line x1="96" y1="60" x2="224" y2="60" opacity="0.3" />
      <line x1="118" y1="22" x2="202" y2="98" opacity="0.22" />
      <line x1="202" y1="22" x2="118" y2="98" opacity="0.22" />
      <path
        d="M160 60 L 198 28"
        opacity="0.4"
      />
      <path
        d="M160 60 L 128 92"
        opacity="0.28"
      />
      <circle cx="160" cy="60" r="1.4" fill={stroke} stroke="none" opacity="0.7" />
      <circle cx="198" cy="28" r="1" fill={stroke} stroke="none" opacity="0.55" />
      <circle cx="214" cy="60" r="0.85" fill={stroke} stroke="none" opacity="0.4" />
      <circle cx="160" cy="14" r="0.85" fill={stroke} stroke="none" opacity="0.4" />
    </g>
  );
}

/** Layers / rings / traces / waves */
function TimeEmergenceMark() {
  return (
    <g fill="none" stroke={stroke} strokeWidth="0.5" strokeLinecap="round">
      <ellipse cx="160" cy="64" rx="28" ry="16" opacity="0.35" />
      <ellipse cx="160" cy="64" rx="52" ry="30" opacity="0.28" />
      <ellipse cx="160" cy="64" rx="78" ry="44" opacity="0.2" />
      <ellipse cx="160" cy="64" rx="108" ry="56" opacity="0.14" />
      <path
        d="M40 88 C 80 72, 120 96, 160 80 C 200 64, 240 88, 280 74"
        opacity="0.32"
      />
      <path
        d="M36 56 C 76 40, 116 64, 160 48 C 204 32, 244 56, 284 42"
        opacity="0.22"
      />
      <path
        d="M52 104 C 96 92, 128 108, 160 98 C 192 88, 228 102, 268 94"
        opacity="0.18"
      />
      <circle cx="160" cy="64" r="1.1" fill={stroke} stroke="none" opacity="0.55" />
    </g>
  );
}
