import type { ProgressiveNode, ProgressiveTier } from "./progressive-ecosystem";

interface SimNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  radius: number;
  pinned: boolean;
  spring: number;
}

function springForTier(tier: ProgressiveTier): number {
  switch (tier) {
    case "center":
      return 0;
    case "primary":
      return 0.028;
    case "relationship":
      return 0.024;
    default:
      return 0.02;
  }
}

export function initSimulation(nodes: ProgressiveNode[]): Map<string, SimNode> {
  const map = new Map<string, SimNode>();
  for (const n of nodes) {
    map.set(n.id, {
      id: n.id,
      x: n.x,
      y: n.y,
      vx: 0,
      vy: 0,
      targetX: n.targetX,
      targetY: n.targetY,
      radius: n.radius,
      pinned: n.tier === "center",
      spring: springForTier(n.tier),
    });
  }
  return map;
}

export function syncSimulation(
  sim: Map<string, SimNode>,
  nodes: ProgressiveNode[],
): void {
  for (const n of nodes) {
    const s = sim.get(n.id);
    if (!s) {
      sim.set(n.id, {
        id: n.id,
        x: n.x,
        y: n.y,
        vx: 0,
        vy: 0,
        targetX: n.targetX,
        targetY: n.targetY,
        radius: n.radius,
        pinned: n.tier === "center",
        spring: springForTier(n.tier),
      });
      continue;
    }
    s.targetX = n.targetX;
    s.targetY = n.targetY;
    s.radius = n.radius;
    s.pinned = n.tier === "center";
    s.spring = springForTier(n.tier);
  }
  for (const id of [...sim.keys()]) {
    if (!nodes.some((n) => n.id === id)) sim.delete(id);
  }
}

/** One force step — gentle equilibrium, no collisions */
export function stepSimulation(
  sim: Map<string, SimNode>,
  minSeparation = 0.055,
): void {
  const list = [...sim.values()];

  for (const node of list) {
    if (node.pinned) {
      node.x = node.targetX;
      node.y = node.targetY;
      node.vx = 0;
      node.vy = 0;
      continue;
    }

    node.vx += (node.targetX - node.x) * node.spring;
    node.vy += (node.targetY - node.y) * node.spring;
  }

  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i];
      const b = list[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 0.0001;
      const minDist = a.radius + b.radius + minSeparation;
      if (dist < minDist) {
        const push = (minDist - dist) * 0.045;
        const nx = dx / dist;
        const ny = dy / dist;
        if (!a.pinned) {
          a.vx -= nx * push;
          a.vy -= ny * push;
        }
        if (!b.pinned) {
          b.vx += nx * push;
          b.vy += ny * push;
        }
      }
    }
  }

  for (const node of list) {
    if (node.pinned) continue;
    node.vx += (Math.random() - 0.5) * 0.00006;
    node.vy += (Math.random() - 0.5) * 0.00006;
    node.vx *= 0.9;
    node.vy *= 0.9;
    node.x += node.vx;
    node.y += node.vy;
  }
}

export function readPositions(
  sim: Map<string, SimNode>,
): Map<string, { x: number; y: number }> {
  const out = new Map<string, { x: number; y: number }>();
  for (const [id, s] of sim) out.set(id, { x: s.x, y: s.y });
  return out;
}
