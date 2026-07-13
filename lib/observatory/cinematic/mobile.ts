import type { CinematicSceneId } from "./scenes";
import type { JourneySegment } from "./journey";
import { CINEMATIC_JOURNEY, SCENE_ORDER } from "./journey";

/** Shorter mobile journey — same rhythm, less scroll distance */
const MOBILE_VH_SCALE = 0.62;

export const MOBILE_CINEMATIC_JOURNEY: JourneySegment[] = CINEMATIC_JOURNEY.map(
  (segment) => ({
    ...segment,
    vh: Math.round(segment.vh * MOBILE_VH_SCALE * 100) / 100,
  }),
);

export const MOBILE_JOURNEY_TOTAL_VH = MOBILE_CINEMATIC_JOURNEY.reduce(
  (sum, s) => sum + s.vh,
  0,
);

/** Faster handoff on mobile — shorter dual-scene compositing window */
export const MOBILE_TRANSITION_TIMING = {
  thresholdPauseUntil: 0.02,
  movementStart: 0.04,
  overlapStart: 0.08,
  overlapEnd: 0.48,
  arrivalHoldUntil: 0.72,
} as const;

/** One compressed JPEG plate per beat — replaces 5-layer PNG stacks on mobile */
export const MOBILE_SCENE_PLATE: Record<CinematicSceneId, string> = {
  "01-threshold": "/observatory/cinematic/plates/mobile/01-threshold.jpg",
  "02-first-reveal":
    "/observatory/cinematic/plates/mobile/02-first-reveal.jpg",
  "03-observatory": "/observatory/cinematic/plates/mobile/03-observatory.jpg",
  "04-sanctuary": "/observatory/cinematic/plates/mobile/04-sanctuary.jpg",
  "05-arrival": "/observatory/cinematic/plates/mobile/05-arrival.jpg",
};

export const MOBILE_SCENE_POSITION: Record<CinematicSceneId, string> = {
  "01-threshold": "50% 36%",
  "02-first-reveal": "50% 38%",
  "03-observatory": "50% 42%",
  "04-sanctuary": "50% 34%",
  "05-arrival": "50% 36%",
};

type Span = { start: number; end: number; segment: JourneySegment };

function buildSpans(journey: JourneySegment[]): Span[] {
  const total = journey.reduce((sum, s) => sum + s.vh, 0);
  let cursor = 0;
  return journey.map((segment) => {
    const start = cursor / total;
    cursor += segment.vh;
    return { segment, start, end: cursor / total };
  });
}

const MOBILE_SPANS = buildSpans(MOBILE_CINEMATIC_JOURNEY);

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function pushKey(
  input: number[],
  output: number[],
  key: number,
  value: number,
) {
  input.push(Math.max(0, Math.min(1, key)));
  output.push(Math.max(0, Math.min(1, value)));
}

function dedupeKeyframes(
  input: number[],
  output: number[],
): { input: number[]; output: number[] } {
  const pairs = input
    .map((k, i) => ({ k, v: output[i] }))
    .sort((a, b) => a.k - b.k);
  const outK: number[] = [];
  const outV: number[] = [];
  for (const { k, v } of pairs) {
    const last = outK[outK.length - 1];
    if (last !== undefined && Math.abs(last - k) < 0.0001) {
      outV[outV.length - 1] = v;
    } else {
      outK.push(k);
      outV.push(v);
    }
  }
  return { input: outK, output: outV };
}

/** Scene opacity curves tuned for shortened mobile overlap */
export function compileMobileSceneOpacity(
  sceneId: CinematicSceneId,
): { input: number[]; output: number[] } {
  const { overlapStart, overlapEnd, arrivalHoldUntil, thresholdPauseUntil } =
    MOBILE_TRANSITION_TIMING;
  const input: number[] = [0];
  const output: number[] = [sceneId === "01-threshold" ? 1 : 0];

  for (const { segment, start, end } of MOBILE_SPANS) {
    if (segment.kind === "hold") {
      if (segment.scene === sceneId) {
        pushKey(input, output, start, 1);
        pushKey(input, output, end, 1);
      }
      continue;
    }

    const at = (local: number) => lerp(start, end, local);

    if (segment.from === sceneId) {
      pushKey(input, output, start, 1);
      pushKey(input, output, at(thresholdPauseUntil), 1);
      pushKey(input, output, at(overlapStart), 0.92);
      pushKey(input, output, at(overlapEnd), 0);
      pushKey(input, output, end, 0);
    } else if (segment.to === sceneId) {
      pushKey(input, output, start, 0);
      pushKey(input, output, at(overlapStart), 0);
      pushKey(input, output, at(overlapEnd), 1);
      pushKey(input, output, at(arrivalHoldUntil), 1);
      pushKey(input, output, end, 1);
    }
  }

  pushKey(input, output, 1, output[output.length - 1] ?? 0);
  return dedupeKeyframes(input, output);
}

/**
 * At most two scenes mounted: outgoing + incoming (or current + next preload).
 * Previous scenes are fully unmounted after they leave the window.
 */
export function getMobileMountedScenes(
  progress: number,
): CinematicSceneId[] {
  const mounted = new Set<CinematicSceneId>();

  for (let i = 0; i < MOBILE_SPANS.length; i++) {
    const { segment, start, end } = MOBILE_SPANS[i];
    const inSegment = progress >= start - 0.01 && progress <= end + 0.01;
    if (!inSegment) continue;

    if (segment.kind === "hold") {
      mounted.add(segment.scene);
      const next = MOBILE_SPANS[i + 1];
      // Preload only the next scene during the final third of a hold
      if (next && progress >= lerp(start, end, 0.66)) {
        if (next.segment.kind === "transition") {
          mounted.add(next.segment.to);
        } else {
          mounted.add(next.segment.scene);
        }
      }
    } else {
      mounted.add(segment.from);
      mounted.add(segment.to);
    }
  }

  // Always keep first plate available at boot
  if (progress < 0.02) {
    mounted.add("01-threshold");
    mounted.add("02-first-reveal");
  }

  // Preserve journey order for stable z stacking
  return SCENE_ORDER.filter((id) => mounted.has(id));
}

export function sceneIndex(id: CinematicSceneId): number {
  return SCENE_ORDER.indexOf(id);
}
