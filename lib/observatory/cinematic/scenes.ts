/** 2.5D depth scenes — storyboard frames are art direction; these layers are runtime. */

export type DepthLayerId =
  | "back"
  | "mid-nave"
  | "fore-left"
  | "fore-right"
  | "fore-desk"
  | "fore-floor";

export interface DepthLayer {
  id: DepthLayerId;
  src: string;
  /** Stacking order — higher sits nearer the visitor */
  depth: number;
}

export interface CinematicScene {
  id: string;
  title: string;
  /** Locked storyboard reference — not used at runtime */
  artDirection: string;
  objectPosition: { desktop: string; mobile: string };
  layers: DepthLayer[];
}

const THRESHOLD_LAYERS: DepthLayer[] = [
  { id: "back", src: "/observatory/layers/{variant}/back.png", depth: 1 },
  { id: "mid-nave", src: "/observatory/layers/{variant}/mid-nave.png", depth: 2 },
  { id: "fore-left", src: "/observatory/layers/{variant}/fore-left.png", depth: 3 },
  { id: "fore-right", src: "/observatory/layers/{variant}/fore-right.png", depth: 3 },
  { id: "fore-desk", src: "/observatory/layers/{variant}/fore-desk.png", depth: 4 },
];

const FIRST_REVEAL_LAYERS: DepthLayer[] = [
  {
    id: "back",
    src: "/observatory/cinematic/layers/beat-02/{variant}/back.png",
    depth: 1,
  },
  {
    id: "mid-nave",
    src: "/observatory/cinematic/layers/beat-02/{variant}/mid-nave.png",
    depth: 2,
  },
  {
    id: "fore-left",
    src: "/observatory/cinematic/layers/beat-02/{variant}/fore-left.png",
    depth: 3,
  },
  {
    id: "fore-right",
    src: "/observatory/cinematic/layers/beat-02/{variant}/fore-right.png",
    depth: 3,
  },
  {
    id: "fore-floor",
    src: "/observatory/cinematic/layers/beat-02/{variant}/fore-floor.png",
    depth: 4,
  },
];

function beatLayers(beat: string): DepthLayer[] {
  const base = `/observatory/cinematic/layers/beat-${beat}/{variant}`;
  return [
    { id: "back", src: `${base}/back.png`, depth: 1 },
    { id: "mid-nave", src: `${base}/mid-nave.png`, depth: 2 },
    { id: "fore-left", src: `${base}/fore-left.png`, depth: 3 },
    { id: "fore-right", src: `${base}/fore-right.png`, depth: 3 },
    { id: "fore-floor", src: `${base}/fore-floor.png`, depth: 4 },
  ];
}

export const CINEMATIC_SCENES = {
  "01-threshold": {
    id: "01-threshold",
    title: "Threshold",
    artDirection: "/observatory/institute/art-direction/01-threshold.png",
    objectPosition: { desktop: "center 46%", mobile: "center 38%" },
    layers: THRESHOLD_LAYERS,
  },
  "02-first-reveal": {
    id: "02-first-reveal",
    title: "First Reveal",
    artDirection: "/observatory/institute/art-direction/02-first-reveal.png",
    objectPosition: { desktop: "center 46%", mobile: "center 38%" },
    layers: FIRST_REVEAL_LAYERS,
  },
  "03-observatory": {
    id: "03-observatory",
    title: "Observatory",
    artDirection: "/observatory/institute/art-direction/03-observatory.png",
    objectPosition: { desktop: "center 46%", mobile: "center 38%" },
    layers: beatLayers("03"),
  },
  "04-sanctuary": {
    id: "04-sanctuary",
    title: "Sanctuary",
    artDirection: "/observatory/institute/art-direction/04-sanctuary.png",
    objectPosition: { desktop: "center 46%", mobile: "center 38%" },
    layers: beatLayers("04"),
  },
  "05-arrival": {
    id: "05-arrival",
    title: "Arrival",
    artDirection: "/observatory/institute/art-direction/05-arrival.png",
    objectPosition: { desktop: "center 46%", mobile: "center 38%" },
    layers: beatLayers("05"),
  },
} as const satisfies Record<string, CinematicScene>;

export type CinematicSceneId = keyof typeof CINEMATIC_SCENES;

export function resolveLayerSrc(
  template: string,
  variant: "desktop" | "mobile",
): string {
  return template.replace("{variant}", variant);
}
