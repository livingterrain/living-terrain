"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import {
  useCallback,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { useBreakpoint } from "@/lib/atmosphere/use-breakpoint";

interface ObservatoryDeskSceneProps {
  children: ReactNode;
  /** Ref to the scroll journey container (for nested scroll if needed) */
  journeyRef?: RefObject<HTMLDivElement | null>;
}

/**
 * Concept 3 — The Observer's Desk.
 * A painted environment with a scroll-driven camera dolly: the visitor rises
 * from the desk and walks the nave toward the light. Not CSS geometry — art.
 */
export function ObservatoryDeskScene({
  children,
  journeyRef: externalRef,
}: ObservatoryDeskSceneProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const journeyRef = externalRef ?? internalRef;
  const reduced = useReducedMotion() ?? false;
  const { isMobile } = useBreakpoint();

  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ["start start", "end end"],
  });

  /* Walk toward the window: scale + vertical drift anchored at the vanishing point */
  const scale = useTransform(
    scrollYProgress,
    [0, 0.55, 1],
    isMobile ? [1, 1.18, 1.34] : [1, 1.14, 1.26],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["0%", "-20%"] : ["0%", "-15%"],
  );

  /* Atmosphere brightens as you approach the dome */
  const haze = useTransform(scrollYProgress, [0, 0.7, 1], [0.42, 0.22, 0.08]);

  /* Pointer parallax — subtle shift, never game-like */
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 42, damping: 22 });
  const springY = useSpring(pointerY, { stiffness: 42, damping: 22 });
  const parallaxX = useTransform(springX, [-1, 1], isMobile ? [0, 0] : [14, -14]);
  const parallaxY = useTransform(springY, [-1, 1], isMobile ? [0, 0] : [6, -6]);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduced || isMobile) return;
      const rect = e.currentTarget.getBoundingClientRect();
      pointerX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
      pointerY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    },
    [isMobile, pointerX, pointerY, reduced],
  );

  const onPointerLeave = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  const heroSrc = isMobile
    ? "/observatory/desk-hero-mobile.png"
    : "/observatory/desk-hero-desktop.png";

  const vanishingOrigin = isMobile ? "50% 38%" : "50% 42%";

  return (
    <div ref={journeyRef} className="obs-desk-journey">
      <div
        className="obs-desk-scene__sticky"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <motion.div
          className="obs-desk-scene__world"
          style={
            reduced
              ? undefined
              : {
                  scale,
                  y,
                  x: parallaxX,
                  transformOrigin: vanishingOrigin,
                }
          }
        >
          <Image
            src={heroSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className="obs-desk-scene__plate object-cover"
            draggable={false}
          />
        </motion.div>

        {/* Living atmosphere — dust, vignette, lamp warmth */}
        <div className="obs-desk-scene__lamplight" aria-hidden />
        <motion.div
          className="obs-desk-scene__haze"
          style={reduced ? undefined : { opacity: haze }}
          aria-hidden
        />
        <div className="obs-desk-scene__vignette" aria-hidden />
        <motion.div
          className="obs-desk-scene__dust"
          style={reduced ? undefined : { x: parallaxX, y: parallaxY }}
          aria-hidden
        />
      </div>

      <div className="obs-desk-stations">{children}</div>
    </div>
  );
}
