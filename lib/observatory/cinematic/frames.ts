/**
 * Cinematic beat metadata — storyboard frames are art direction references only.
 * Runtime uses layered 2.5D scenes in scenes.ts.
 */

export {
  CINEMATIC_SCENES,
  resolveLayerSrc,
  type CinematicScene,
  type CinematicSceneId,
  type DepthLayer,
  type DepthLayerId,
} from "./scenes";

export { CINEMATIC_SLICE_1 } from "./slice";

export {
  CINEMATIC_JOURNEY,
  JOURNEY_TOTAL_VH,
  SCENE_ORDER,
  TRANSITION_TIMING,
} from "./journey";

export {
  CAMERA_SPRING,
  CAMERA_SPRING_REDUCED,
  PARALLAX,
  VANISHING_ORIGIN,
} from "./camera";
