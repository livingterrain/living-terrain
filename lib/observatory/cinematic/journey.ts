import { CINEMATIC_SCENES, type CinematicSceneId } from "./scenes";

/** Shared transition rhythm — calm motion, compressed timeline */
export const TRANSITION_TIMING = {
  thresholdPauseUntil: 0.02,
  movementStart: 0.03,
  overlapStart: 0.05,
  overlapEnd: 0.62,
  arrivalHoldUntil: 0.82,
} as const;

export type HoldSegment = {
  kind: "hold";
  scene: CinematicSceneId;
  /** Scroll distance in viewport heights */
  vh: number;
};

export type TransitionSegment = {
  kind: "transition";
  from: CinematicSceneId;
  to: CinematicSceneId;
  vh: number;
};

export type JourneySegment = HoldSegment | TransitionSegment;

/**
 * Five-beat journey — meaningful but not exhausting.
 * Sanctuary and Arrival receive the longest holds.
 */
export const CINEMATIC_JOURNEY: JourneySegment[] = [
  { kind: "hold", scene: "01-threshold", vh: 0.12 },
  { kind: "transition", from: "01-threshold", to: "02-first-reveal", vh: 1.0 },
  { kind: "hold", scene: "02-first-reveal", vh: 0.15 },
  { kind: "transition", from: "02-first-reveal", to: "03-observatory", vh: 0.95 },
  { kind: "hold", scene: "03-observatory", vh: 0.45 },
  { kind: "transition", from: "03-observatory", to: "04-sanctuary", vh: 0.95 },
  { kind: "hold", scene: "04-sanctuary", vh: 0.85 },
  { kind: "transition", from: "04-sanctuary", to: "05-arrival", vh: 0.85 },
  { kind: "hold", scene: "05-arrival", vh: 0.7 },
];

export const JOURNEY_TOTAL_VH = CINEMATIC_JOURNEY.reduce((sum, s) => sum + s.vh, 0);

const SCENE_ORDER: CinematicSceneId[] = [
  "01-threshold",
  "02-first-reveal",
  "03-observatory",
  "04-sanctuary",
  "05-arrival",
];

type SegmentSpan = {
  segment: JourneySegment;
  start: number;
  end: number;
};

function buildSpans(): SegmentSpan[] {
  let cursor = 0;
  return CINEMATIC_JOURNEY.map((segment) => {
    const start = cursor / JOURNEY_TOTAL_VH;
    cursor += segment.vh;
    const end = cursor / JOURNEY_TOTAL_VH;
    return { segment, start, end };
  });
}

const SPANS = buildSpans();

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function localT(global: number, start: number, end: number, local: number) {
  return lerp(start, end, local);
}

/** Opacity keyframes for each scene across the full journey (0–1 scroll). */
export function compileSceneOpacity(
  sceneId: CinematicSceneId,
): { input: number[]; output: number[] } {
  const input: number[] = [0];
  const output: number[] = [sceneId === "01-threshold" ? 1 : 0];

  for (const { segment, start, end } of SPANS) {
    if (segment.kind === "hold") {
      if (segment.scene === sceneId) {
        pushKey(input, output, start, 1);
        pushKey(input, output, end, 1);
      }
      continue;
    }

    const {
      thresholdPauseUntil,
      movementStart,
      overlapStart,
      overlapEnd,
      arrivalHoldUntil,
    } = TRANSITION_TIMING;

    if (segment.from === sceneId) {
      pushKey(input, output, start, 1);
      pushKey(input, output, localT(globalAt(start, end, thresholdPauseUntil), start, end, thresholdPauseUntil), 1);
      pushKey(input, output, localT(globalAt(start, end, overlapStart), start, end, overlapStart), 0.96);
      pushKey(input, output, localT(globalAt(start, end, overlapEnd), start, end, overlapEnd), 0);
      pushKey(input, output, end, 0);
    } else if (segment.to === sceneId) {
      pushKey(input, output, start, 0);
      pushKey(input, output, localT(globalAt(start, end, overlapStart), start, end, overlapStart), 0);
      pushKey(input, output, localT(globalAt(start, end, overlapEnd), start, end, overlapEnd), 1);
      pushKey(input, output, localT(globalAt(start, end, arrivalHoldUntil), start, end, arrivalHoldUntil), 1);
      pushKey(input, output, end, 1);
    }
  }

  pushKey(input, output, 1, output[output.length - 1] ?? 0);
  return dedupeKeyframes(input, output);
}

function globalAt(start: number, end: number, local: number) {
  return lerp(start, end, local);
}

function pushKey(
  input: number[],
  output: number[],
  key: number,
  value: number,
) {
  const k = Math.max(0, Math.min(1, key));
  const v = Math.max(0, Math.min(1, value));
  input.push(k);
  output.push(v);
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

/** Drift intensity 0–1 across the journey — active only during transitions. */
export function compileDriftKeyframes(): { input: number[]; output: number[] } {
  const input: number[] = [0];
  const output: number[] = [0];

  for (const { segment, start, end } of SPANS) {
    if (segment.kind !== "transition") {
      pushKey(input, output, start, 0);
      pushKey(input, output, end, 0);
      continue;
    }

    const { movementStart, overlapEnd, arrivalHoldUntil } = TRANSITION_TIMING;
    pushKey(input, output, start, 0);
    pushKey(input, output, globalAt(start, end, movementStart), 0);
    pushKey(input, output, globalAt(start, end, overlapEnd), 1);
    pushKey(input, output, globalAt(start, end, arrivalHoldUntil), 1);
    pushKey(input, output, end, 0);
  }

  pushKey(input, output, 1, 0);
  return dedupeKeyframes(input, output);
}

/** First transition only — desk fades during threshold exit */
export function compileDeskOpacity(): { input: number[]; output: number[] } {
  const first = SPANS.find(
    (s) =>
      s.segment.kind === "transition" &&
      s.segment.from === "01-threshold",
  );
  if (!first || first.segment.kind !== "transition") {
    return { input: [0, 1], output: [1, 1] };
  }

  const { start, end } = first;
  const { movementStart, overlapEnd } = TRANSITION_TIMING;
  return dedupeKeyframes(
    [
      0,
      globalAt(start, end, movementStart),
      globalAt(start, end, overlapEnd * 0.7),
      globalAt(start, end, overlapEnd),
      1,
    ],
    [1, 1, 0.5, 0, 0],
  );
}

/** Lamplight only during threshold → first reveal */
export function compileLamplightOpacity(): { input: number[]; output: number[] } {
  const first = SPANS.find(
    (s) =>
      s.segment.kind === "transition" &&
      s.segment.from === "01-threshold",
  );
  if (!first || first.segment.kind !== "transition") {
    return { input: [0, 1], output: [0, 0] };
  }

  const { start, end } = first;
  const { overlapStart, overlapEnd } = TRANSITION_TIMING;
  return dedupeKeyframes(
    [0, start, globalAt(start, end, overlapStart), globalAt(start, end, overlapEnd), 1],
    [0.7, 0.7, 0.45, 0, 0],
  );
}

export function compileHazeOpacity(): { input: number[]; output: number[] } {
  return dedupeKeyframes(
    [0, 0.35, 0.7, 1],
    [0.42, 0.22, 0.12, 0.08],
  );
}

export function compileCoolWashOpacity(): { input: number[]; output: number[] } {
  const input: number[] = [0];
  const output: number[] = [0];

  for (const { segment, start, end } of SPANS) {
    if (segment.kind !== "transition") continue;
    const { overlapStart, overlapEnd } = TRANSITION_TIMING;
    pushKey(input, output, globalAt(start, end, overlapStart), 0);
    pushKey(input, output, globalAt(start, end, overlapEnd), 0.32);
    pushKey(input, output, end, 0.28);
  }

  pushKey(input, output, 1, 0.1);
  return dedupeKeyframes(input, output);
}

export function compileWaterOpacity(): { input: number[]; output: number[] } {
  return dedupeKeyframes(
    [0, 0.25, 0.55, 0.75, 1],
    [0, 0.25, 0.45, 0.55, 0.5],
  );
}

export function compileDustOpacity(): { input: number[]; output: number[] } {
  return dedupeKeyframes(
    [0, 0.4, 0.7, 1],
    [0.48, 0.32, 0.22, 0.18],
  );
}

export { CINEMATIC_SCENES, SCENE_ORDER };
