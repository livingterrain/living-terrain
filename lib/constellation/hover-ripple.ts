import type { GraphEdge } from "@/lib/concepts/graph";

/** BFS hop distance from origin along edges (for ripple propagation) */
export function edgeHopDistances(
  originId: string,
  edges: GraphEdge[],
): Map<string, number> {
  const edgeDist = new Map<string, number>();
  const queue: Array<{ id: string; hop: number }> = [{ id: originId, hop: 0 }];
  const visited = new Set<string>([originId]);

  while (queue.length > 0) {
    const { id, hop } = queue.shift()!;
    for (const edge of edges) {
      let neighbor: string | null = null;
      if (edge.from === id) neighbor = edge.to;
      else if (edge.to === id) neighbor = edge.from;
      if (!neighbor) continue;

      const key = edgeKey(edge);
      if (!edgeDist.has(key)) edgeDist.set(key, hop);

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ id: neighbor, hop: hop + 1 });
      }
    }
  }

  return edgeDist;
}

export function edgeKey(edge: GraphEdge): string {
  return `${edge.from}-${edge.to}`;
}

/** Soft ripple boost for an edge at elapsed seconds since hover began */
export function rippleBoost(
  hop: number | undefined,
  elapsedSec: number,
): number {
  if (hop === undefined) return 0;
  const waveFront = elapsedSec * 2.4;
  const dist = Math.abs(waveFront - hop);
  if (dist > 1.3) return 0;
  const peak = 0.38 * (1 - dist / 1.3);
  const fade = Math.exp(-elapsedSec * 0.65);
  return peak * fade;
}
