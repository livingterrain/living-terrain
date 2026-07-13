/** Scroll-driven camera tuning for the cinematic 2.5D journey. */

export const VANISHING_ORIGIN = {
  desktop: "50% 42%",
  mobile: "50% 38%",
} as const;

/** Heavy steadicam — smooth, never snappy */
export const CAMERA_SPRING = {
  stiffness: 32,
  damping: 34,
  mass: 1.15,
} as const;

export const CAMERA_SPRING_REDUCED = {
  stiffness: 400,
  damping: 42,
  mass: 0.5,
} as const;

/**
 * Subtle depth separation — foreground only slightly ahead of mid.
 * Back and mid stay nearly locked for vanishing-point stability.
 */
export const PARALLAX = {
  back: 0.88,
  mid: 1,
  fore: 1.07,
} as const;
