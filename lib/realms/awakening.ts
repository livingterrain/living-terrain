import type { RealmNetworkEdge, RealmNetworkNode } from "./types";

/** Graph distance from the realm center — for staggered awakening */
export function networkDistancesFromCenter(
  network: RealmNetworkNode[],
  edges: RealmNetworkEdge[],
): Map<string, number> {
  const center = network.find((n) => n.kind === "center");
  if (!center) return new Map(network.map((n) => [n.id, 0]));

  const dist = new Map<string, number>([[center.id, 0]]);
  const queue = [center.id];

  while (queue.length > 0) {
    const id = queue.shift()!;
    const hop = dist.get(id) ?? 0;
    for (const e of edges) {
      let next: string | null = null;
      if (e.from === id) next = e.to;
      else if (e.to === id) next = e.from;
      if (!next || dist.has(next)) continue;
      dist.set(next, hop + 1);
      queue.push(next);
    }
  }

  for (const n of network) {
    if (!dist.has(n.id)) dist.set(n.id, 4);
  }
  return dist;
}
