/** The navigable universe — world coordinates span this square */
export const UNIVERSE_SIZE = 10000;
export const UNIVERSE_CENTER = UNIVERSE_SIZE / 2;

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const INITIAL_VIEW: ViewBox = {
  x: UNIVERSE_CENTER - 1900,
  y: UNIVERSE_CENTER - 1900,
  w: 3800,
  h: 3800,
};

/** Tight framing on the central chamber — cinematic intro start */
export const CHAMBER_INTRO_VIEW: ViewBox = {
  x: UNIVERSE_CENTER - 520,
  y: UNIVERSE_CENTER - 520,
  w: 1040,
  h: 1040,
};

export const MIN_VIEW_WIDTH = 180;
export const MAX_VIEW_WIDTH = UNIVERSE_SIZE;

export function clampViewBox(vb: ViewBox): ViewBox {
  const w = Math.min(MAX_VIEW_WIDTH, Math.max(MIN_VIEW_WIDTH, vb.w));
  const h = w * (vb.h / vb.w);
  let x = vb.x;
  let y = vb.y;

  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x + w > UNIVERSE_SIZE) x = UNIVERSE_SIZE - w;
  if (y + h > UNIVERSE_SIZE) y = UNIVERSE_SIZE - h;

  return { x, y, w, h };
}

export function zoomAtPoint(
  vb: ViewBox,
  factor: number,
  cursorX: number,
  cursorY: number,
  containerW: number,
  containerH: number,
): ViewBox {
  const wx = vb.x + (cursorX / containerW) * vb.w;
  const wy = vb.y + (cursorY / containerH) * vb.h;
  const newW = vb.w / factor;
  const newH = vb.h / factor;

  return clampViewBox({
    x: wx - (cursorX / containerW) * newW,
    y: wy - (cursorY / containerH) * newH,
    w: newW,
    h: newH,
  });
}

export function panViewBox(
  vb: ViewBox,
  dxScreen: number,
  dyScreen: number,
  containerW: number,
  containerH: number,
): ViewBox {
  const dx = (dxScreen / containerW) * vb.w;
  const dy = (dyScreen / containerH) * vb.h;
  return clampViewBox({
    x: vb.x - dx,
    y: vb.y - dy,
    w: vb.w,
    h: vb.h,
  });
}

export function viewBoxForNode(
  nodeX: number,
  nodeY: number,
  targetWidth = 900,
): ViewBox {
  return clampViewBox({
    x: nodeX - targetWidth / 2,
    y: nodeY - targetWidth / 2,
    w: targetWidth,
    h: targetWidth,
  });
}

export function screenToWorld(
  sx: number,
  sy: number,
  vb: ViewBox,
  containerW: number,
  containerH: number,
): { x: number; y: number } {
  return {
    x: vb.x + (sx / containerW) * vb.w,
    y: vb.y + (sy / containerH) * vb.h,
  };
}

export function zoomLevel(vb: ViewBox): number {
  return MAX_VIEW_WIDTH / vb.w;
}

export function isUniverseView(vb: ViewBox): boolean {
  return vb.w > 7000;
}

export function lerpViewBox(from: ViewBox, to: ViewBox, t: number): ViewBox {
  const ease = 1 - Math.pow(1 - t, 3);
  return mixViewBox(from, to, ease);
}

/** Linear interpolation — for externally eased cinematic progress */
export function mixViewBox(from: ViewBox, to: ViewBox, t: number): ViewBox {
  const clamped = Math.max(0, Math.min(1, t));
  return clampViewBox({
    x: from.x + (to.x - from.x) * clamped,
    y: from.y + (to.y - from.y) * clamped,
    w: from.w + (to.w - from.w) * clamped,
    h: from.h + (to.h - from.h) * clamped,
  });
}

/** World-space margin around a node for labels and halos */
export function nodeFrameMargin(node: {
  kind: string;
  level: number;
  label: string;
}): number {
  if (node.kind === "chamber") return 420;
  if (node.kind === "concept") return 340;
  if (node.level <= 2) return 280;
  return 180;
}

/**
 * Fit a set of graph nodes within the viewport with generous margins.
 * Expands bounds to match container aspect ratio so nothing clips.
 */
export function viewBoxForNodes(
  nodes: { x: number; y: number; kind: string; level: number; label: string }[],
  containerW: number,
  containerH: number,
  padding = 1.24,
): ViewBox {
  if (nodes.length === 0) return INITIAL_VIEW;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const node of nodes) {
    const m = nodeFrameMargin(node);
    minX = Math.min(minX, node.x - m);
    maxX = Math.max(maxX, node.x + m);
    minY = Math.min(minY, node.y - m);
    maxY = Math.max(maxY, node.y + m);
  }

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  let w = (maxX - minX) * padding;
  let h = (maxY - minY) * padding;

  const aspect =
    containerW > 0 && containerH > 0 ? containerW / containerH : 1;
  if (w / h < aspect) w = h * aspect;
  else h = w / aspect;

  return clampViewBox({ x: cx - w / 2, y: cy - h / 2, w, h });
}

export function cinematicEase(t: number): number {
  return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3.4);
}

export function viewBoxContainsNode(
  vb: ViewBox,
  x: number,
  y: number,
  margin = 0,
): boolean {
  return (
    x >= vb.x - margin &&
    x <= vb.x + vb.w + margin &&
    y >= vb.y - margin &&
    y <= vb.y + vb.h + margin
  );
}
