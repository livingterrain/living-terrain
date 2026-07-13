"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useBreakpoint } from "@/lib/atmosphere/use-breakpoint";
import {
  CAMERA_SPRING,
  CAMERA_SPRING_REDUCED,
  PARALLAX,
  VANISHING_ORIGIN,
} from "@/lib/observatory/cinematic/camera";
import {
  compileCoolWashOpacity,
  compileDeskOpacity,
  compileDriftKeyframes,
  compileDustOpacity,
  compileHazeOpacity,
  compileLamplightOpacity,
  compileSceneOpacity,
  compileWaterOpacity,
  CINEMATIC_SCENES,
  JOURNEY_TOTAL_VH,
  SCENE_ORDER,
} from "@/lib/observatory/cinematic/journey";
import {
  compileMobileSceneOpacity,
  getMobileMountedScenes,
  MOBILE_JOURNEY_TOTAL_VH,
  MOBILE_SCENE_PLATE,
  MOBILE_SCENE_POSITION,
} from "@/lib/observatory/cinematic/mobile";
import {
  resolveLayerSrc,
  type CinematicScene,
  type CinematicSceneId,
  type DepthLayerId,
} from "@/lib/observatory/cinematic/frames";
import { ObservatoryCinematicLife } from "./ObservatoryCinematicLife";

type LayerMotion = {
  y?: MotionValue<string>;
  scale?: MotionValue<number>;
  opacity?: MotionValue<number>;
};

const DRIFT_KEYS = compileDriftKeyframes();
const DESK_KEYS = compileDeskOpacity();
const LAMP_KEYS = compileLamplightOpacity();
const HAZE_KEYS = compileHazeOpacity();
const COOL_KEYS = compileCoolWashOpacity();
const WATER_KEYS = compileWaterOpacity();
const DUST_KEYS = compileDustOpacity();

const DESKTOP_SCENE_OPACITY = Object.fromEntries(
  SCENE_ORDER.map((id) => [id, compileSceneOpacity(id)]),
) as Record<CinematicSceneId, { input: number[]; output: number[] }>;

const MOBILE_SCENE_OPACITY = Object.fromEntries(
  SCENE_ORDER.map((id) => [id, compileMobileSceneOpacity(id)]),
) as Record<CinematicSceneId, { input: number[]; output: number[] }>;

/**
 * Five-beat cinematic journey.
 * Desktop: layered 2.5D stack (unchanged).
 * Mobile: lean single-plate window — mount ≤2 scenes, no heavy compositing.
 */
export function ObservatoryCinematicViewport() {
  const { isMobile } = useBreakpoint();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Avoid SSR desktop stack flashing onto phones (would decode all PNG layers).
  if (!hydrated) {
    return (
      <div
        className="obs-cine-journey"
        style={{ height: "100dvh" }}
        aria-hidden
      >
        <div className="obs-cine-viewport">
          <div className="obs-cine-stage" />
        </div>
      </div>
    );
  }

  if (isMobile) {
    return <MobileCinematicJourney />;
  }
  return <DesktopCinematicJourney />;
}

function DesktopCinematicJourney() {
  const journeyRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const origin = VANISHING_ORIGIN.desktop;

  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(
    scrollYProgress,
    reduced ? CAMERA_SPRING_REDUCED : CAMERA_SPRING,
  );

  const drift = useTransform(progress, DRIFT_KEYS.input, DRIFT_KEYS.output);

  const backY = useTransform(
    drift,
    (v) => `${-0.75 * v * PARALLAX.back}%`,
  );
  const midY = useTransform(drift, (v) => `${-0.95 * v * PARALLAX.mid}%`);
  const foreY = useTransform(drift, (v) => `${-1.1 * v * PARALLAX.fore}%`);

  const backScale = useTransform(drift, (v) => (reduced ? 1 : 1 + 0.006 * v));
  const midScale = useTransform(drift, (v) => (reduced ? 1 : 1 + 0.008 * v));

  const deskOpacity = useTransform(progress, DESK_KEYS.input, DESK_KEYS.output);
  const lamplightOpacity = useTransform(
    progress,
    LAMP_KEYS.input,
    LAMP_KEYS.output,
  );
  const hazeOpacity = useTransform(progress, HAZE_KEYS.input, HAZE_KEYS.output);
  const coolWash = useTransform(progress, COOL_KEYS.input, COOL_KEYS.output);
  const waterOpacity = useTransform(
    progress,
    WATER_KEYS.input,
    WATER_KEYS.output,
  );
  const dustOpacity = useTransform(progress, DUST_KEYS.input, DUST_KEYS.output);

  const opacity01 = useTransform(
    progress,
    DESKTOP_SCENE_OPACITY["01-threshold"].input,
    DESKTOP_SCENE_OPACITY["01-threshold"].output,
  );
  const opacity02 = useTransform(
    progress,
    DESKTOP_SCENE_OPACITY["02-first-reveal"].input,
    DESKTOP_SCENE_OPACITY["02-first-reveal"].output,
  );
  const opacity03 = useTransform(
    progress,
    DESKTOP_SCENE_OPACITY["03-observatory"].input,
    DESKTOP_SCENE_OPACITY["03-observatory"].output,
  );
  const opacity04 = useTransform(
    progress,
    DESKTOP_SCENE_OPACITY["04-sanctuary"].input,
    DESKTOP_SCENE_OPACITY["04-sanctuary"].output,
  );
  const opacity05 = useTransform(
    progress,
    DESKTOP_SCENE_OPACITY["05-arrival"].input,
    DESKTOP_SCENE_OPACITY["05-arrival"].output,
  );

  const sceneOpacity: Record<CinematicSceneId, MotionValue<number>> = {
    "01-threshold": opacity01,
    "02-first-reveal": opacity02,
    "03-observatory": opacity03,
    "04-sanctuary": opacity04,
    "05-arrival": opacity05,
  };

  const sharedDepth: Record<"back" | "mid-nave", LayerMotion> = {
    back: { y: backY, scale: backScale },
    "mid-nave": { y: midY, scale: midScale },
  };

  const layerMotionFor = (
    sceneId: CinematicSceneId,
  ): Record<DepthLayerId, LayerMotion | undefined> => {
    const fore: LayerMotion = { y: foreY };
    const base: Record<DepthLayerId, LayerMotion | undefined> = {
      back: sharedDepth.back,
      "mid-nave": sharedDepth["mid-nave"],
      "fore-left": fore,
      "fore-right": fore,
      "fore-floor": fore,
      "fore-desk": fore,
    };

    if (sceneId === "01-threshold") {
      return {
        ...base,
        "fore-desk": { y: foreY, opacity: deskOpacity },
        "fore-floor": undefined,
      };
    }

    return {
      ...base,
      "fore-desk": undefined,
    };
  };

  return (
    <div
      ref={journeyRef}
      className="obs-cine-journey"
      style={{ height: `${JOURNEY_TOTAL_VH * 100}vh` }}
    >
      <div className="obs-cine-viewport">
        <div className="obs-cine-stage">
          {[...SCENE_ORDER].reverse().map((sceneId) => (
            <motion.div
              key={sceneId}
              className="obs-cine-world"
              data-scene={sceneId}
              style={{
                opacity: sceneOpacity[sceneId],
                transformOrigin: origin,
              }}
            >
              <SceneStack
                scene={CINEMATIC_SCENES[sceneId]}
                variant="desktop"
                transformOrigin={origin}
                layerMotion={layerMotionFor(sceneId)}
                objectPositionFor={() =>
                  CINEMATIC_SCENES[sceneId].objectPosition.desktop
                }
                reduced={reduced}
              />
            </motion.div>
          ))}

          <ObservatoryCinematicLife
            isMobile={false}
            waterOpacity={waterOpacity}
            dustOpacity={dustOpacity}
          />

          <motion.div
            className="obs-cine-lamplight"
            style={reduced ? undefined : { opacity: lamplightOpacity }}
            aria-hidden
          />
          <motion.div
            className="obs-cine-haze"
            style={reduced ? undefined : { opacity: hazeOpacity }}
            aria-hidden
          />
          <motion.div
            className="obs-cine-cool-wash"
            style={reduced ? undefined : { opacity: coolWash }}
            aria-hidden
          />
          <div className="obs-cine-vignette" aria-hidden />
        </div>

        <p className="obs-cine-whisper">You are still walking…</p>
      </div>
    </div>
  );
}

/**
 * Mobile: one JPEG plate per beat, ≤2 scenes mounted, raw scroll (no spring),
 * opacity-only transitions — no parallax, particles, or blend stacks.
 */
function MobileCinematicJourney() {
  const journeyRef = useRef<HTMLDivElement>(null);
  const origin = VANISHING_ORIGIN.mobile;

  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ["start start", "end end"],
  });

  // Raw scroll — spring overshoot was compounding transition glitches on touch
  const progress = scrollYProgress;

  const [mounted, setMounted] = useState<CinematicSceneId[]>(() =>
    getMobileMountedScenes(0),
  );

  useMotionValueEvent(progress, "change", (value) => {
    const next = getMobileMountedScenes(value);
    setMounted((prev) => {
      if (
        prev.length === next.length &&
        prev.every((id, i) => id === next[i])
      ) {
        return prev;
      }
      return next;
    });
  });

  const opacity01 = useTransform(
    progress,
    MOBILE_SCENE_OPACITY["01-threshold"].input,
    MOBILE_SCENE_OPACITY["01-threshold"].output,
  );
  const opacity02 = useTransform(
    progress,
    MOBILE_SCENE_OPACITY["02-first-reveal"].input,
    MOBILE_SCENE_OPACITY["02-first-reveal"].output,
  );
  const opacity03 = useTransform(
    progress,
    MOBILE_SCENE_OPACITY["03-observatory"].input,
    MOBILE_SCENE_OPACITY["03-observatory"].output,
  );
  const opacity04 = useTransform(
    progress,
    MOBILE_SCENE_OPACITY["04-sanctuary"].input,
    MOBILE_SCENE_OPACITY["04-sanctuary"].output,
  );
  const opacity05 = useTransform(
    progress,
    MOBILE_SCENE_OPACITY["05-arrival"].input,
    MOBILE_SCENE_OPACITY["05-arrival"].output,
  );

  const sceneOpacity: Record<CinematicSceneId, MotionValue<number>> = {
    "01-threshold": opacity01,
    "02-first-reveal": opacity02,
    "03-observatory": opacity03,
    "04-sanctuary": opacity04,
    "05-arrival": opacity05,
  };

  return (
    <div
      ref={journeyRef}
      className="obs-cine-journey"
      data-mobile="true"
      style={{ height: `${MOBILE_JOURNEY_TOTAL_VH * 100}dvh` }}
    >
      <div className="obs-cine-viewport">
        <div className="obs-cine-stage">
          {[...mounted].reverse().map((sceneId) => (
            <motion.div
              key={sceneId}
              className="obs-cine-world obs-cine-world--plate"
              data-scene={sceneId}
              style={{
                opacity: sceneOpacity[sceneId],
                transformOrigin: origin,
              }}
            >
              <div className="obs-cine-plane obs-cine-plane--plate">
                <Image
                  src={MOBILE_SCENE_PLATE[sceneId]}
                  alt=""
                  fill
                  priority={sceneId === "01-threshold"}
                  loading={
                    sceneId === "01-threshold" || sceneId === "02-first-reveal"
                      ? "eager"
                      : "lazy"
                  }
                  sizes="(max-width: 430px) 100vw, 430px"
                  quality={72}
                  className="obs-cine-plane__image"
                  style={{
                    objectPosition: MOBILE_SCENE_POSITION[sceneId],
                  }}
                  draggable={false}
                />
              </div>
            </motion.div>
          ))}

          <div className="obs-cine-vignette" aria-hidden />
        </div>

        <p className="obs-cine-whisper">You are still walking…</p>
      </div>
    </div>
  );
}

function SceneStack({
  scene,
  variant,
  transformOrigin,
  layerMotion,
  objectPositionFor,
  reduced,
}: {
  scene: CinematicScene;
  variant: "desktop" | "mobile";
  transformOrigin: string;
  layerMotion: Record<DepthLayerId, LayerMotion | undefined>;
  objectPositionFor: (layerId: DepthLayerId) => string;
  reduced: boolean;
}) {
  return (
    <>
      {scene.layers.map((layer) => {
        const planeMotion = layerMotion[layer.id];
        if (!planeMotion) return null;

        return (
          <motion.div
            key={`${scene.id}-${layer.id}`}
            className="obs-cine-plane"
            data-layer={layer.id}
            data-scene={scene.id}
            style={{
              zIndex: layer.depth,
              transformOrigin,
              ...(reduced
                ? {}
                : {
                    y: planeMotion.y,
                    scale: planeMotion.scale,
                    opacity: planeMotion.opacity,
                  }),
            }}
          >
            <Image
              src={resolveLayerSrc(layer.src, variant)}
              alt=""
              fill
              priority={scene.id === "01-threshold" && layer.depth <= 2}
              sizes="100vw"
              className="obs-cine-plane__image"
              style={{ objectPosition: objectPositionFor(layer.id) }}
              draggable={false}
            />
          </motion.div>
        );
      })}
    </>
  );
}
