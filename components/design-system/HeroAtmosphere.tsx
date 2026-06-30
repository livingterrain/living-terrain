import { cn } from "@/lib/utils";

/**
 * Layered atmosphere for the hero threshold.
 * Depth through stacking — hidden map, field science, observatory.
 * No bold graphics. Nothing diagonal or decorative.
 */
export function HeroAtmosphere({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {/* Layer 1 — deeper paper plane */}
      <div className="absolute inset-0 bg-ivory-shadow/20" />

      {/* Layer 2 — hidden topographic map (horizontal contours only) */}
      <svg
        className="absolute inset-0 h-full w-full text-charcoal"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.5" opacity="0.09">
          <path d="M-40 520 C200 480, 400 560, 600 500 S1000 460, 1480 520" />
          <path d="M-40 580 C180 540, 380 620, 580 560 S980 520, 1480 580" />
          <path d="M-40 640 C220 600, 420 680, 620 620 S1020 580, 1480 640" />
          <path d="M-40 460 C240 420, 440 500, 640 440 S1040 400, 1480 460" />
          <path d="M-40 700 C160 660, 360 740, 560 680 S960 640, 1480 700" />
        </g>
        <g stroke="currentColor" strokeWidth="0.4" opacity="0.05">
          <path d="M-40 380 C260 340, 460 420, 660 360 S1060 320, 1480 380" />
          <path d="M-40 760 C200 720, 400 800, 600 740 S1000 700, 1480 760" />
        </g>
      </svg>

      {/* Layer 3 — microscopic field (soft rings, observed not illustrated) */}
      <svg
        className="absolute right-[8%] top-[18%] h-48 w-48 text-charcoal sm:right-[14%] sm:top-[22%] sm:h-56 sm:w-56"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="0.4" opacity="0.07" />
        <circle cx="100" cy="100" r="62" stroke="currentColor" strokeWidth="0.4" opacity="0.06" />
        <circle cx="100" cy="100" r="36" stroke="currentColor" strokeWidth="0.4" opacity="0.05" />
        <circle cx="100" cy="100" r="4" fill="currentColor" opacity="0.08" />
        <g stroke="currentColor" strokeWidth="0.3" opacity="0.05">
          <line x1="100" y1="12" x2="100" y2="188" />
          <line x1="12" y1="100" x2="188" y2="100" />
        </g>
        <g fill="currentColor" opacity="0.06">
          <circle cx="72" cy="68" r="1.2" />
          <circle cx="128" cy="74" r="1" />
          <circle cx="85" cy="118" r="1.1" />
          <circle cx="118" cy="128" r="0.9" />
          <circle cx="94" cy="88" r="0.8" />
        </g>
      </svg>

      {/* Layer 4 — botanical venation (field journal specimen) */}
      <svg
        className="absolute -bottom-8 -left-4 h-72 w-72 text-charcoal opacity-60 sm:-left-8 sm:h-96 sm:w-96"
        viewBox="0 0 300 300"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.45" opacity="0.06">
          <path d="M150 280 V80 M150 80 C130 60, 110 40, 90 20" />
          <path d="M150 120 C120 110, 90 100, 60 95" />
          <path d="M150 120 C180 110, 210 100, 240 95" />
          <path d="M150 160 C115 155, 85 150, 55 148" />
          <path d="M150 160 C185 155, 215 150, 245 148" />
          <path d="M150 200 C125 198, 100 196, 75 195" />
          <path d="M150 200 C175 198, 200 196, 225 195" />
        </g>
      </svg>

      {/* Layer 5 — observatory ticks (quiet geometry) */}
      <svg
        className="absolute left-[6%] top-[30%] h-32 w-32 text-forest sm:left-[10%]"
        viewBox="0 0 120 120"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.35" opacity="0.12">
          <circle cx="60" cy="60" r="48" />
          <line x1="60" y1="8" x2="60" y2="20" />
          <line x1="60" y1="100" x2="60" y2="112" />
          <line x1="8" y1="60" x2="20" y2="60" />
          <line x1="100" y1="60" x2="112" y2="60" />
        </g>
      </svg>

      {/* Layer 6 — forest interference (single discovery, very faint) */}
      <svg
        className="absolute bottom-[20%] right-[5%] h-40 w-56 text-forest sm:right-[12%]"
        viewBox="0 0 220 160"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.4" opacity="0.07">
          <ellipse cx="110" cy="80" rx="90" ry="55" />
          <ellipse cx="110" cy="80" rx="60" ry="38" />
        </g>
      </svg>

      {/* Layer 7 — threshold depth (edge quieting via layered paper) */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_30px] shadow-ivory-shadow/25" />

      {/* Layer 8 — light lift behind text column */}
      <div className="absolute inset-y-0 left-1/2 w-full max-w-3xl -translate-x-1/2 bg-ivory/30" />
    </div>
  );
}
