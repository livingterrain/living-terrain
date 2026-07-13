import type { CinematicSceneId, DepthLayerId } from "./scenes";
import type { JourneySegment } from "./journey";
import { CINEMATIC_JOURNEY } from "./journey";

/** Shorter mobile journey — same rhythm, less scroll distance */
const MOBILE_VH_SCALE = 0.68;

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

/** Per-beat mobile crop — keeps tree, rose window, water, lantern in frame */
export const MOBILE_SCENE_POSITION: Record<CinematicSceneId, string> = {
  "01-threshold": "50% 36%",
  "02-first-reveal": "50% 38%",
  "03-observatory": "50% 40%",
  "04-sanctuary": "50% 34%",
  "05-arrival": "50% 36%",
};

/** Foreground layers need a lower anchor on portrait canvases */
export const MOBILE_LAYER_POSITION: Partial<
  Record<CinematicSceneId, Partial<Record<DepthLayerId, string>>>
> = {
  "01-threshold": {
    "fore-desk": "50% 88%",
    "fore-left": "20% 42%",
    "fore-right": "80% 42%",
  },
  "02-first-reveal": {
    "fore-floor": "50% 90%",
    "fore-left": "18% 40%",
    "fore-right": "82% 40%",
  },
  "03-observatory": {
    "fore-floor": "50% 92%",
    "fore-left": "15% 45%",
    "fore-right": "85% 45%",
  },
  "04-sanctuary": {
    "fore-floor": "50% 90%",
    "fore-left": "18% 38%",
    "fore-right": "82% 38%",
  },
  "05-arrival": {
    "fore-floor": "50% 88%",
    "fore-left": "16% 40%",
    "fore-right": "84% 40%",
  },
};

export const MOBILE_PARALLAX_DEPTH = 0.62;

export const MOBILE_DRIFT_SCALE = 0.75;
