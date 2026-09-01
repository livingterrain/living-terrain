/**
 * Rough bench sketch — boundary flip.
 * Not a polished diagram. Margin note quality.
 */
export function EdgeFlipSketch({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 280 120"
      role="img"
      aria-label="Rough sketch: protective boundary flipping into a trap"
    >
      <rect width="280" height="120" fill="transparent" />
      <text
        x="12"
        y="22"
        fill="currentColor"
        opacity="0.45"
        fontFamily="ui-monospace, monospace"
        fontSize="10"
      >
        edge flip — same wall
      </text>
      {/* left: protect */}
      <line
        x1="40"
        y1="40"
        x2="40"
        y2="100"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <path
        d="M 48 55 Q 70 70 48 85"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />
      <text
        x="78"
        y="72"
        fill="currentColor"
        opacity="0.55"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
      >
        protects
      </text>
      {/* arrow */}
      <path
        d="M 130 70 L 160 70"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1"
        markerEnd="url(#obs-arrow)"
      />
      <defs>
        <marker
          id="obs-arrow"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6" fill="currentColor" opacity="0.4" />
        </marker>
      </defs>
      {/* right: traps */}
      <line
        x1="190"
        y1="40"
        x2="190"
        y2="100"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <path
        d="M 182 55 Q 160 70 182 85"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />
      <text
        x="200"
        y="72"
        fill="currentColor"
        opacity="0.55"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
      >
        blocks repair
      </text>
      <text
        x="12"
        y="114"
        fill="currentColor"
        opacity="0.35"
        fontFamily="ui-monospace, monospace"
        fontSize="8"
      >
        structure unchanged · role inverted · still no early marker
      </text>
    </svg>
  );
}
