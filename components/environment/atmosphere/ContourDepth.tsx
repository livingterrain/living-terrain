import { motion, type MotionValue } from "framer-motion";

interface ContourDepthProps {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}

/** Topographic contours — emerge as you descend */
export function ContourDepth({ opacity, y }: ContourDepthProps) {
  return (
    <motion.div style={{ y, opacity }} className="absolute inset-0">
      <svg
        className="absolute inset-0 h-full w-full text-charcoal animate-contour-breathe"
        viewBox="0 0 1440 4000"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="currentColor" strokeWidth="0.4">
          <path d="M-40 300 C280 260, 480 340, 720 280 S1160 240, 1480 300" opacity="0.06" />
          <path d="M-40 500 C300 460, 500 540, 720 480 S1160 440, 1480 500" opacity="0.055" />
          <path d="M-40 700 C260 660, 460 740, 680 680 S1120 640, 1480 700" opacity="0.05" />
          <path d="M-40 950 C280 910, 480 990, 720 930 S1160 890, 1480 950" opacity="0.045" />
          <path d="M-40 1200 C300 1160, 500 1240, 720 1180 S1160 1140, 1480 1200" opacity="0.04" />
          <path d="M-40 1500 C260 1460, 460 1540, 680 1480 S1120 1440, 1480 1500" opacity="0.038" />
          <path d="M-40 1800 C280 1760, 480 1840, 720 1780 S1160 1740, 1480 1800" opacity="0.035" />
          <path d="M-40 2100 C300 2060, 500 2140, 720 2080 S1160 2040, 1480 2100" opacity="0.032" />
          <path d="M-40 2400 C260 2360, 460 2440, 680 2380 S1120 2340, 1480 2400" opacity="0.03" />
          <path d="M-40 2700 C280 2660, 480 2740, 720 2680 S1160 2640, 1480 2700" opacity="0.028" />
          <path d="M-40 3000 C300 2960, 500 3040, 720 2980 S1160 2940, 1480 3000" opacity="0.025" />
        </g>
        <g stroke="currentColor" strokeWidth="0.35" className="text-forest">
          <ellipse cx="360" cy="1600" rx="180" ry="120" opacity="0.03" />
          <ellipse cx="1080" cy="2200" rx="200" ry="140" opacity="0.025" />
        </g>
      </svg>
    </motion.div>
  );
}
