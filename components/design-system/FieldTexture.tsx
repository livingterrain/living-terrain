import { cn } from "@/lib/utils";

/**
 * Site-wide field diagram — contour, branching, interference.
 * Visible atmosphere without becoming decoration.
 */
export function FieldTexture({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden circadian-field-layer",
        "animate-field-breath",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        className="absolute h-[150%] w-[150%] -left-[25%] -top-[25%]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none" stroke="currentColor" strokeWidth="0.55" className="text-charcoal">
          <path
            opacity="0.08"
            d="M0 420 C200 380, 400 460, 600 400 S1000 360, 1200 420"
          />
          <path
            opacity="0.07"
            d="M0 480 C180 440, 380 520, 580 460 S980 420, 1200 480"
          />
          <path
            opacity="0.06"
            d="M0 540 C220 500, 420 580, 620 520 S1020 480, 1200 540"
          />
          <path
            opacity="0.05"
            d="M0 600 C160 560, 360 640, 560 580 S960 540, 1200 600"
          />
        </g>

        <g fill="none" stroke="currentColor" strokeWidth="0.5" className="text-forest">
          <ellipse opacity="0.04" cx="880" cy="280" rx="120" ry="80" />
          <ellipse opacity="0.035" cx="880" cy="280" rx="180" ry="120" />
        </g>

        <g fill="none" stroke="currentColor" strokeWidth="0.6" className="text-charcoal">
          <path
            opacity="0.1"
            d="M180 900 V520 M180 520 C180 420, 120 360, 80 300 M180 520 C240 440, 300 400, 360 340 M180 600 C120 560, 60 520, 20 480"
          />
          <path
            opacity="0.08"
            d="M1020 900 V480 M1020 480 C1020 400, 1080 340, 1120 280 M1020 480 C960 420, 900 380, 840 320"
          />
        </g>

        <g stroke="currentColor" strokeWidth="0.45" className="text-rule">
          <line opacity="0.35" x1="108" y1="0" x2="108" y2="900" />
          <line opacity="0.35" x1="1092" y1="0" x2="1092" y2="900" />
        </g>

        <g fill="none" stroke="currentColor" strokeWidth="0.4" className="text-charcoal">
          <line opacity="0.06" x1="0" y1="180" x2="1200" y2="180" />
          <line opacity="0.05" x1="0" y1="720" x2="1200" y2="720" />
        </g>
      </svg>
    </div>
  );
}
