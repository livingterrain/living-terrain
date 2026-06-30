import { motion, type MotionValue } from "framer-motion";

interface InterferencePatternProps {
  y: MotionValue<number>;
  opacity: MotionValue<number>;
}

/** Distant geometric interference — observatory glass */
export function InterferencePattern({ y, opacity }: InterferencePatternProps) {
  return (
    <motion.div
      style={{ y, opacity }}
      className="absolute inset-0 animate-interference-drift"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full text-charcoal"
        viewBox="0 0 1440 3200"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="0.25" opacity="0.025">
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 140}
              x2="1440"
              y2={i * 140 + 40}
            />
          ))}
          {Array.from({ length: 18 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 90}
              y1="0"
              x2={i * 90 - 30}
              y2="3200"
            />
          ))}
        </g>
        <circle
          cx="720"
          cy="1200"
          r="400"
          stroke="currentColor"
          strokeWidth="0.3"
          opacity="0.02"
          fill="none"
        />
        <circle
          cx="720"
          cy="1200"
          r="280"
          stroke="currentColor"
          strokeWidth="0.25"
          opacity="0.018"
          fill="none"
        />
      </svg>
    </motion.div>
  );
}
