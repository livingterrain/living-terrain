import type { SpiralTrajectory, SpiralTrajectoryEdge, SpiralTrajectoryStep } from "./types";
import { sinkStepIds, topologySource, trajectoryEdges } from "./topology";

/**
 * Deterministic layered layout for trajectories with explicit transitions.
 *
 * Reads only steps and authored transitions — never relationships, Spiral
 * geometry, or step labels. Every routed edge is an authored transition; no
 * edge is derived from array order or position. Rows show sequence, not
 * duration: equal spacing never stands for equal time.
 */

export type SpiralTrajectoryFigureKind = "wheel" | "path" | "topology";

/** Explicit transitions always win; ordered trajectories keep their legacy figures. */
export function trajectoryFigureKind(
  trajectory: SpiralTrajectory,
): SpiralTrajectoryFigureKind {
  if (topologySource(trajectory) === "explicit") return "topology";
  return trajectory.shape === "cyclical" ? "wheel" : "path";
}

export type TopologyDensity = {
  /** Horizontal distance between neighbouring step lanes. */
  lane: number;
  /** Vertical distance between rows. Sequence only — not proportional time. */
  row: number;
  /** Widest a label may run beside its dot. */
  label: number;
};

export const TRAJECTORY_TOPOLOGY = {
  regular: { lane: 132, row: 60, label: 176 },
  compact: { lane: 66, row: 60, label: 98 },
  padX: 12,
  padY: 14,
  nodeR: 3,
  /** Minimum lane separation, in lanes, by what sits beside what. */
  sepStep: 1,
  sepRoute: 0.4,
  sepMixed: 0.75,
} as const;

type Point = { x: number; y: number };

export type TopologyNode = {
  step: SpiralTrajectoryStep;
  layer: number;
  x: number;
  y: number;
  /** No outgoing transition: authored evidence stops here. */
  sink: boolean;
  /** The side of its row with more free room. */
  labelSide: "left" | "right";
  /** Room on that side before the next thing in the row, capped at the density's label width. */
  labelRoom: number;
};

export type TopologyRoute = {
  edge: SpiralTrajectoryEdge;
  /** Closes a cycle: drawn back up against the flow of rows. */
  returns: boolean;
  self: boolean;
  points: readonly Point[];
  d: string;
  /** Midpoint of the drawn path, for pointer targets and anchors. */
  mid: Point;
};

export type TopologyLayout = {
  width: number;
  height: number;
  /** Room labels need beyond the plotted width, on each side. */
  gutter: { left: number; right: number };
  density: TopologyDensity;
  layers: number;
  /** In reading order: row by row, left to right. */
  nodes: readonly TopologyNode[];
  /** Exactly the authored transitions, in authored order. */
  routes: readonly TopologyRoute[];
};

/** Breadth-first depth from the steps nothing leads into (or the first step). */
function depths(
  ids: readonly string[],
  edges: readonly SpiralTrajectoryEdge[],
): Map<string, number> {
  const depth = new Map<string, number>();
  const hasIncoming = new Set(edges.filter((e) => e.from !== e.to).map((e) => e.to));
  const seeds = ids.filter((id) => !hasIncoming.has(id));
  const queue: string[] = [];
  const visit = (start: readonly string[]) => {
    for (const id of start) {
      if (depth.has(id)) continue;
      depth.set(id, 0);
      queue.push(id);
    }
    while (queue.length) {
      const id = queue.shift()!;
      for (const e of edges) {
        if (e.from !== id || depth.has(e.to)) continue;
        depth.set(e.to, depth.get(id)! + 1);
        queue.push(e.to);
      }
    }
  };
  visit(seeds.length ? seeds : ids.slice(0, 1));
  for (const id of ids) if (!depth.has(id)) visit([id]);
  return depth;
}

function reaches(edges: readonly SpiralTrajectoryEdge[], from: string, to: string): boolean {
  const seen = new Set<string>([from]);
  const stack = [from];
  while (stack.length) {
    const id = stack.pop()!;
    if (id === to) return true;
    for (const e of edges) {
      if (e.from === id && !seen.has(e.to)) {
        seen.add(e.to);
        stack.push(e.to);
      }
    }
  }
  return false;
}

/**
 * Edges that close a cycle against breadth-first depth. Removing them leaves
 * an acyclic graph: every kept edge either deepens or lies on no cycle.
 */
export function returningEdgeIds(trajectory: SpiralTrajectory): Set<string> {
  const ids = trajectory.steps.map((s) => s.id);
  const edges = trajectoryEdges(trajectory);
  const depth = depths(ids, edges);
  return new Set(
    edges
      .filter(
        (e) =>
          e.from === e.to ||
          (depth.get(e.to)! <= depth.get(e.from)! && reaches(edges, e.to, e.from)),
      )
      .map((e) => e.id),
  );
}

/** Pool-adjacent-violators: least squares positions keeping order and separation. */
function place(desired: readonly number[], seps: readonly number[]): number[] {
  const offset = [0];
  for (let i = 1; i < desired.length; i++) offset.push(offset[i - 1]! + seps[i - 1]!);
  const blocks: { sum: number; n: number }[] = [];
  for (let i = 0; i < desired.length; i++) {
    blocks.push({ sum: desired[i]! - offset[i]!, n: 1 });
    while (blocks.length > 1) {
      const b = blocks[blocks.length - 1]!;
      const a = blocks[blocks.length - 2]!;
      if (a.sum / a.n <= b.sum / b.n) break;
      blocks.splice(-2, 2, { sum: a.sum + b.sum, n: a.n + b.n });
    }
  }
  const out: number[] = [];
  for (const b of blocks) for (let k = 0; k < b.n; k++) out.push(b.sum / b.n + offset[out.length]!);
  return out;
}

type Vertex = { key: string; layer: number; step?: SpiralTrajectoryStep; x: number };

const fmt = (n: number) => Math.round(n * 10) / 10;

function smoothPath(points: readonly Point[], returns: boolean, r: number): string {
  const p = points.map((pt) => ({ ...pt }));
  const n = p.length;
  // Leave and arrive at the dot's rim rather than its centre.
  const trim = (a: Point, toward: Point, by: number) => {
    const dx = toward.x - a.x;
    const dy = toward.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: a.x + (dx / len) * by, y: a.y + (dy / len) * by };
  };
  const parts: string[] = [];
  for (let i = 0; i < n - 1; i++) {
    const a = p[i]!;
    const b = p[i + 1]!;
    const dy = b.y - a.y;
    let c1: Point;
    let c2: Point;
    if (returns && i === 0) {
      c1 = { x: a.x + (b.x - a.x) * 0.9, y: a.y };
      c2 = { x: b.x, y: a.y + dy * 0.45 };
    } else if (returns && i === n - 2) {
      c1 = { x: a.x, y: a.y + dy * 0.55 };
      c2 = { x: b.x + (a.x - b.x) * 0.9, y: b.y };
    } else {
      c1 = { x: a.x, y: a.y + dy * 0.5 };
      c2 = { x: b.x, y: b.y - dy * 0.5 };
    }
    const start = i === 0 ? trim(a, c1, r + 2) : a;
    const end = i === n - 2 ? trim(b, c2, r + 3.5) : b;
    if (i === 0) parts.push(`M ${fmt(start.x)} ${fmt(start.y)}`);
    parts.push(
      `C ${fmt(c1.x)} ${fmt(c1.y)} ${fmt(c2.x)} ${fmt(c2.y)} ${fmt(end.x)} ${fmt(end.y)}`,
    );
  }
  return parts.join(" ");
}

/** A return between neighbouring rows, or within one: bow out to one side. */
function bowPath(a: Point, b: Point, side: 1 | -1, r: number, lane: number): string {
  const reach = lane * 0.42 * side;
  const c1 = { x: a.x + reach, y: a.y };
  const c2 = { x: b.x + reach, y: b.y };
  const s = { x: a.x + (r + 2) * side, y: a.y };
  const e = { x: b.x + (r + 3.5) * side, y: b.y };
  return `M ${fmt(s.x)} ${fmt(s.y)} C ${fmt(c1.x)} ${fmt(c1.y)} ${fmt(c2.x)} ${fmt(c2.y)} ${fmt(e.x)} ${fmt(e.y)}`;
}

function selfPath(a: Point, side: 1 | -1, r: number): string {
  const w = 22 * side;
  return `M ${fmt(a.x + r * side)} ${fmt(a.y - 2)} C ${fmt(a.x + w)} ${fmt(a.y - 16)} ${fmt(
    a.x + w,
  )} ${fmt(a.y + 16)} ${fmt(a.x + (r + 2.5) * side)} ${fmt(a.y + 3)}`;
}

function crossings(layers: readonly Vertex[][], links: readonly [string, string][]): number {
  const pos = new Map<string, number>();
  for (const row of layers) row.forEach((v, i) => pos.set(v.key, i));
  const layerOf = new Map<string, number>();
  for (const row of layers) for (const v of row) layerOf.set(v.key, v.layer);
  let count = 0;
  for (let i = 0; i < links.length; i++) {
    for (let j = i + 1; j < links.length; j++) {
      const [a1, b1] = links[i]!;
      const [a2, b2] = links[j]!;
      if (layerOf.get(a1) !== layerOf.get(a2)) continue;
      const d1 = pos.get(a1)! - pos.get(a2)!;
      const d2 = pos.get(b1)! - pos.get(b2)!;
      if (d1 * d2 < 0) count++;
    }
  }
  return count;
}

export function topologyLayout(
  trajectory: SpiralTrajectory,
  density: TopologyDensity = TRAJECTORY_TOPOLOGY.regular,
): TopologyLayout {
  const T = TRAJECTORY_TOPOLOGY;
  const steps = trajectory.steps;
  const ids = steps.map((s) => s.id);
  const edges = trajectoryEdges(trajectory);
  const returning = returningEdgeIds(trajectory);
  const sinks = new Set(sinkStepIds(trajectory));

  // Longest-path layering over the acyclic part.
  const forward = edges.filter((e) => !returning.has(e.id));
  const layer = new Map<string, number>(ids.map((id) => [id, 0]));
  for (let pass = 0; pass < ids.length; pass++) {
    let changed = false;
    for (const e of forward) {
      const next = layer.get(e.from)! + 1;
      if (next > layer.get(e.to)!) {
        layer.set(e.to, next);
        changed = true;
      }
    }
    if (!changed) break;
  }
  // Open futures share the last row: where every line of evidence stops.
  const deepest = Math.max(0, ...layer.values());
  const hasIncoming = new Set(edges.map((e) => e.to));
  for (const id of sinks) if (hasIncoming.has(id)) layer.set(id, deepest);
  const layerCount = deepest + 1;

  // Vertices: steps plus one routing point per row a long edge passes through.
  const vertices = new Map<string, Vertex>();
  steps.forEach((step) =>
    vertices.set(step.id, { key: step.id, layer: layer.get(step.id)!, step, x: 0 }),
  );
  const chains = new Map<string, string[]>();
  const links: [string, string][] = [];
  for (const e of edges) {
    if (e.from === e.to) {
      chains.set(e.id, [e.from]);
      continue;
    }
    const a = layer.get(e.from)!;
    const b = layer.get(e.to)!;
    const chain = [e.from];
    const step = b > a ? 1 : -1;
    for (let l = a + step; l !== b && Math.abs(b - a) > 1; l += step) {
      const key = `${e.id}@${l}`;
      vertices.set(key, { key, layer: l, x: 0 });
      chain.push(key);
    }
    chain.push(e.to);
    chains.set(e.id, chain);
    for (let i = 1; i < chain.length; i++) {
      const u = vertices.get(chain[i - 1]!)!;
      const v = vertices.get(chain[i]!)!;
      if (u.layer === v.layer) continue;
      links.push(u.layer < v.layer ? [u.key, v.key] : [v.key, u.key]);
    }
  }

  // Rows, first in authored order, then by barycentre sweeps; keep the best.
  let rows: Vertex[][] = Array.from({ length: layerCount }, () => []);
  for (const v of vertices.values()) rows[v.layer]!.push(v);
  const neighbours = (key: string, dir: -1 | 1) =>
    links.filter(([u, v]) => (dir === -1 ? v === key : u === key)).map(([u, v]) => (dir === -1 ? u : v));
  let best = rows.map((r) => [...r]);
  let bestCross = crossings(best, links);
  for (let iter = 0; iter < 12; iter++) {
    const down = iter % 2 === 0;
    const order = down ? rows.keys() : [...rows.keys()].reverse();
    for (const l of order) {
      const adjacent = rows[l + (down ? -1 : 1)];
      if (!adjacent) continue;
      const pos = new Map(adjacent.map((v, i) => [v.key, i]));
      const current = new Map(rows[l]!.map((v, i) => [v.key, i]));
      const bary = (v: Vertex) => {
        const ns = neighbours(v.key, down ? -1 : 1).filter((k) => pos.has(k));
        return ns.length
          ? ns.reduce((s, k) => s + pos.get(k)!, 0) / ns.length
          : current.get(v.key)!;
      };
      rows[l] = [...rows[l]!].sort(
        (a, b) => bary(a) - bary(b) || current.get(a.key)! - current.get(b.key)!,
      );
    }
    const c = crossings(rows, links);
    if (c < bestCross) {
      bestCross = c;
      best = rows.map((r) => [...r]);
    }
  }
  rows = best;

  // Lanes: pull each vertex toward its neighbours, keeping order and spacing.
  const sep = (a: Vertex, b: Vertex) =>
    a.step && b.step ? T.sepStep : a.step || b.step ? T.sepMixed : T.sepRoute;
  for (const row of rows) {
    let x = 0;
    row.forEach((v, i) => {
      if (i > 0) x += sep(row[i - 1]!, v);
      v.x = x;
    });
    const shift = x / 2;
    for (const v of row) v.x -= shift;
  }
  const all = (key: string) => [...neighbours(key, -1), ...neighbours(key, 1)];
  for (let iter = 0; iter < 40; iter++) {
    const order = iter % 2 === 0 ? rows : [...rows].reverse();
    for (const row of order) {
      const desired = row.map((v) => {
        const ns = all(v.key);
        return ns.length
          ? ns.reduce((s, k) => s + vertices.get(k)!.x, 0) / ns.length
          : v.x;
      });
      const seps = row.slice(1).map((v, i) => sep(row[i]!, v));
      place(desired, seps).forEach((x, i) => (row[i]!.x = x));
    }
  }
  const minX = Math.min(...[...vertices.values()].map((v) => v.x));
  const maxX = Math.max(...[...vertices.values()].map((v) => v.x));
  const centre = (minX + maxX) / 2;
  /** Which way a sideways return bows from `from`: toward `to`, else outward. */
  const sideToward = (from: Vertex, to: Vertex): 1 | -1 =>
    to.x !== from.x ? (to.x > from.x ? 1 : -1) : from.x >= centre ? 1 : -1;

  const point = (v: Vertex): Point => ({
    x: T.padX + (v.x - minX) * density.lane,
    y: T.padY + v.layer * density.row,
  });
  const width = T.padX * 2 + (maxX - minX) * density.lane;
  const height = T.padY * 2 + (layerCount - 1) * density.row;

  // Within a row a label can meet only the row's other vertices. Steps bound
  // its room; passing routes may run beneath it (labels carry a halo), so
  // they only break ties.
  const gap = 10;
  const gutter = { left: 0, right: 0 };
  // A return leaves and arrives sideways; its label goes on the other side.
  const blocked = new Map<string, Set<-1 | 1>>();
  const block = (id: string, side: 1 | -1) => {
    const set = blocked.get(id) ?? new Set<-1 | 1>();
    set.add(side);
    blocked.set(id, set);
  };
  for (const e of edges) {
    if (!returning.has(e.id) || e.from === e.to) continue;
    const chain = chains.get(e.id)!.map((k) => vertices.get(k)!);
    const first = chain[0]!;
    const last = chain[chain.length - 1]!;
    const out = sideToward(first, chain[1]!);
    block(e.from, out);
    // A bow arrives on the side it left by; a routed return, from its last routing point.
    block(e.to, chain.length === 2 ? out : sideToward(last, chain[chain.length - 2]!));
  }
  const nodes: TopologyNode[] = rows.flatMap((row) =>
    row
      .filter((v) => v.step)
      .map((v) => {
        const others = row.filter((o) => o !== v);
        const room = (dir: -1 | 1) => {
          const steps = others.filter((o) => o.step && (o.x - v.x) * dir > 0);
          const nearest = Math.min(...steps.map((o) => Math.abs(o.x - v.x)));
          return Math.min(density.label, nearest * density.lane - gap * 3);
        };
        const crossed = (dir: -1 | 1, span: number) =>
          others.filter(
            (o) => !o.step && (o.x - v.x) * dir > 0 && Math.abs(o.x - v.x) * density.lane < span,
          ).length;
        const roomLeft = room(-1);
        const roomRight = room(1);
        const full = density.label;
        const sides = blocked.get(v.key);
        const leftBlocked = sides?.has(-1) && !sides.has(1);
        const rightBlocked = sides?.has(1) && !sides.has(-1);
        const side: "left" | "right" =
          rightBlocked && roomLeft >= full / 2
            ? "left"
            : leftBlocked && roomRight >= full / 2
              ? "right"
              : roomLeft >= full && roomRight >= full
            ? crossed(-1, full) < crossed(1, full) ||
              (crossed(-1, full) === crossed(1, full) && v.x < centre)
              ? "left"
              : "right"
            : roomLeft > roomRight
              ? "left"
              : "right";
        const labelRoom = side === "left" ? roomLeft : roomRight;
        const pt = point(v);
        if (side === "left") gutter.left = Math.max(gutter.left, labelRoom + gap - pt.x);
        else gutter.right = Math.max(gutter.right, pt.x + gap + labelRoom - width);
        return {
          step: v.step!,
          layer: v.layer,
          x: pt.x,
          y: pt.y,
          sink: sinks.has(v.step!.id),
          labelSide: side,
          labelRoom,
        };
      }),
  );

  const routes: TopologyRoute[] = edges.map((edge) => {
    const chain = chains.get(edge.id)!.map((k) => vertices.get(k)!);
    const pts = chain.map(point);
    const isReturn = returning.has(edge.id);
    const self = edge.from === edge.to;
    const fromV = chain[0]!;
    const side = self ? (fromV.x >= centre ? 1 : -1) : sideToward(fromV, chain[1]!);
    let d: string;
    if (self) d = selfPath(pts[0]!, side, T.nodeR);
    else if (isReturn && pts.length === 2)
      d = bowPath(pts[0]!, pts[1]!, side, T.nodeR, density.lane);
    else d = smoothPath(pts, isReturn, T.nodeR);
    const mid =
      pts.length > 2
        ? pts[Math.floor(pts.length / 2)]!
        : self
          ? { x: pts[0]!.x + 16 * side, y: pts[0]!.y }
          : {
              x: (pts[0]!.x + pts[pts.length - 1]!.x) / 2,
              y: (pts[0]!.y + pts[pts.length - 1]!.y) / 2,
            };
    return { edge, returns: isReturn, self, points: pts, d, mid };
  });

  return {
    width,
    height,
    gutter: { left: Math.ceil(gutter.left), right: Math.ceil(gutter.right) },
    density,
    layers: layerCount,
    nodes,
    routes,
  };
}

/** Widest layout, labels included, that fits the available width. */
export function fitTopologyLayout(
  trajectory: SpiralTrajectory,
  available: number,
): TopologyLayout {
  const { regular, compact } = TRAJECTORY_TOPOLOGY;
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  // Narrow the lanes first; shorten labels only once lanes are compact.
  const candidates: TopologyDensity[] = [];
  for (let i = 0; i <= 6; i++) {
    candidates.push({ lane: lerp(regular.lane, compact.lane, i / 6), row: regular.row, label: regular.label });
  }
  for (let i = 1; i <= 6; i++) {
    candidates.push({ lane: compact.lane, row: compact.row, label: lerp(regular.label, compact.label, i / 6) });
  }
  let last = topologyLayout(trajectory, candidates[0]);
  for (const density of candidates) {
    last = topologyLayout(trajectory, density);
    if (last.width + last.gutter.left + last.gutter.right <= available) return last;
  }
  return last;
}
