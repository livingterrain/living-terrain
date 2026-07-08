/**
 * Observational specimen line-art — nature only as evidence.
 * Each drawing reads like a page torn from a working field journal:
 * botanical study, star chart, geological section, pressed leaf.
 * Stroke inherits `currentColor` so the ink can be tuned per surface.
 */

interface SpecimenProps {
  className?: string;
}

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function BotanicalSpecimen({ className }: SpecimenProps) {
  return (
    <svg
      viewBox="0 0 80 110"
      className={className}
      aria-hidden
      role="presentation"
    >
      <g {...base} strokeWidth={1.1}>
        {/* main stem */}
        <path d="M40 104 C 40 84 38 64 40 44 C 41 32 43 22 42 12" />
        {/* leaves along the stem */}
        <path d="M40 88 C 28 84 20 74 18 62 C 30 64 38 74 40 88 Z" />
        <path d="M40 72 C 52 68 60 58 62 46 C 50 48 42 58 40 72 Z" />
        <path d="M40 58 C 30 55 24 47 23 38 C 32 40 38 48 40 58 Z" />
        {/* leaf veins */}
        <path d="M40 88 C 33 82 27 74 22 66" strokeWidth={0.6} />
        <path d="M40 72 C 47 66 53 59 58 51" strokeWidth={0.6} />
        {/* flower head */}
        <circle cx="42" cy="12" r="4.4" />
        <path d="M42 7.6 C 46 3 51 3 53 6 C 51 9 46 9 42 7.6 Z" />
        <path d="M42 7.6 C 38 3 33 3 31 6 C 33 9 38 9 42 7.6 Z" />
        <path d="M46 12 C 52 11 56 14 56 18 C 51 18 48 15 46 12 Z" />
        {/* root hint */}
        <path d="M40 104 C 36 107 32 107 30 106" strokeWidth={0.7} />
        <path d="M40 104 C 44 107 48 107 51 106" strokeWidth={0.7} />
      </g>
    </svg>
  );
}

export function AstronomicalChart({ className }: SpecimenProps) {
  return (
    <svg
      viewBox="0 0 110 110"
      className={className}
      aria-hidden
      role="presentation"
    >
      <g {...base} strokeWidth={0.9}>
        <circle cx="55" cy="55" r="46" />
        <circle cx="55" cy="55" r="30" strokeWidth={0.6} />
        {/* graticule */}
        <path d="M9 55 H101" strokeWidth={0.5} />
        <path d="M55 9 V101" strokeWidth={0.5} />
        <path d="M22 22 C 45 40 65 70 88 88" strokeWidth={0.5} />
        {/* plotted stars */}
        <circle cx="42" cy="38" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="70" cy="46" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="60" cy="72" r="1.8" fill="currentColor" stroke="none" />
        <circle cx="38" cy="66" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="78" cy="66" r="1.3" fill="currentColor" stroke="none" />
        {/* traced constellation */}
        <path d="M42 38 L 70 46 L 78 66 L 60 72 L 38 66 Z" strokeWidth={0.55} />
      </g>
    </svg>
  );
}

export function GeologicalSection({ className }: SpecimenProps) {
  return (
    <svg
      viewBox="0 0 120 90"
      className={className}
      aria-hidden
      role="presentation"
    >
      <g {...base} strokeWidth={0.9}>
        {/* strata */}
        <path d="M6 22 C 34 14 74 30 114 20" />
        <path d="M6 40 C 34 33 74 48 114 38" />
        <path d="M6 58 C 34 52 74 66 114 56" />
        <path d="M6 74 C 34 70 74 82 114 74" />
        {/* fault line */}
        <path d="M70 12 L 60 82" strokeWidth={0.6} strokeDasharray="2 3" />
        {/* hatching in one layer */}
        <path d="M18 41 L 22 49" strokeWidth={0.45} />
        <path d="M30 40 L 34 48" strokeWidth={0.45} />
        <path d="M42 41 L 46 49" strokeWidth={0.45} />
        <path d="M54 42 L 58 50" strokeWidth={0.45} />
      </g>
    </svg>
  );
}

export function PressedLeaf({ className }: SpecimenProps) {
  return (
    <svg
      viewBox="0 0 70 100"
      className={className}
      aria-hidden
      role="presentation"
    >
      <g {...base} strokeWidth={1}>
        <path d="M35 96 C 35 70 35 40 35 8 C 20 24 12 46 16 66 C 18 78 26 90 35 96 Z" />
        <path d="M35 96 C 50 90 58 78 60 66 C 62 46 52 24 35 8" />
        <path d="M35 90 L 35 14" strokeWidth={0.6} />
        <path d="M35 78 C 28 74 24 68 22 62" strokeWidth={0.45} />
        <path d="M35 78 C 42 74 46 68 48 62" strokeWidth={0.45} />
        <path d="M35 62 C 29 58 26 53 25 48" strokeWidth={0.45} />
        <path d="M35 62 C 41 58 44 53 45 48" strokeWidth={0.45} />
        <path d="M35 46 C 31 43 29 39 28 35" strokeWidth={0.45} />
        <path d="M35 46 C 39 43 41 39 42 35" strokeWidth={0.45} />
      </g>
    </svg>
  );
}
