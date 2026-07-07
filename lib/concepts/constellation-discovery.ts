import type { GraphEdge, GraphNode } from "./graph";

/** First six concepts revealed after onboarding */
export const INITIAL_CONCEPT_IDS = [
  "th-reality",
  "th-relationship",
  "th-meaning",
  "th-identity",
  "th-time",
  "th-language",
] as const;

export const DEFERRED_CONCEPT_IDS = [
  "th-consciousness",
  "th-freedom",
  "th-embodiment",
  "th-information",
] as const;

export const PATH_CHOICES = [
  { id: "th-reality", slug: "reality", title: "Reality" },
  { id: "th-relationship", slug: "relationship", title: "Relationship" },
  { id: "th-meaning", slug: "meaning", title: "Meaning" },
  { id: "th-identity", slug: "identity", title: "Identity" },
  { id: "th-time", slug: "time", title: "Time" },
  { id: "th-language", slug: "language", title: "Language" },
] as const;

export const NODE_WHISPERS: Record<string, string> = {
  p1: "Begin where the inquiry began.",
  "th-reality": "The world changes. Something remains.",
  "th-relationship": "Nothing exists alone.",
  "th-meaning": "Meaning exists between things.",
  "th-identity": "Identity is stabilized memory.",
  "th-language": "Words reveal and conceal.",
  "th-time": "Change makes continuity visible.",
  "th-consciousness": "Awareness is the medium of all else.",
  "th-freedom": "Constraint and choice shape a life.",
  "th-embodiment": "The body participates in the real.",
  "th-information": "Signal travels; meaning must be made.",
};

/**
 * Discovery depth (after cinematic reveal):
 * 0 — chamber only
 * 1 — primary constellation (chamber + all major concepts)
 * 2 — essays and volumes
 * 3 — questions and field notes
 * 4 — full constellation
 */
export function computeDiscoveryDepth(
  awake: boolean,
  exploredCount: number,
  zoom: number,
): number {
  if (!awake) return 0;
  if (exploredCount >= 3 || zoom > 0.55) return 4;
  if (exploredCount >= 2) return 3;
  if (exploredCount >= 1) return 2;
  return 1;
}

export function getVisibleNodeIds(
  nodes: GraphNode[],
  depth: number,
  awake: boolean,
  revealProgress = 0,
): Set<string> {
  const ids = new Set<string>();

  for (const n of nodes) {
    if (n.kind === "chamber") ids.add(n.id);
  }

  if (revealProgress > 0 || awake) {
    for (const n of nodes) {
      if (n.kind === "concept") ids.add(n.id);
    }
  }

  if (!awake && revealProgress <= 0) return ids;

  if (depth >= 2) {
    for (const n of nodes) {
      if (n.level <= 3) ids.add(n.id);
    }
  }
  if (depth >= 3) {
    for (const n of nodes) {
      if (n.level === 4) ids.add(n.id);
    }
  }
  if (depth >= 4) {
    for (const n of nodes) ids.add(n.id);
  }
  return ids;
}

export function filterGraphForDiscovery(
  nodes: GraphNode[],
  edges: GraphEdge[],
  depth: number,
  awake: boolean,
  revealProgress = 0,
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const visibleIds = getVisibleNodeIds(nodes, depth, awake, revealProgress);
  return {
    nodes: nodes.filter((n) => visibleIds.has(n.id)),
    edges: edges.filter((e) => visibleIds.has(e.from) && visibleIds.has(e.to)),
  };
}

export function whisperForNode(node: GraphNode): string | undefined {
  return NODE_WHISPERS[node.id] ?? node.sublabel;
}

/** Chamber + all major concept nodes on the primary ring */
export function getPrimaryConstellationNodes(nodes: GraphNode[]): GraphNode[] {
  return nodes.filter((n) => n.kind === "chamber" || n.kind === "concept");
}

export function getPrimaryConstellationIds(nodes: GraphNode[]): Set<string> {
  return new Set(getPrimaryConstellationNodes(nodes).map((n) => n.id));
}

/** Bonded neighbors for map reveal — nearer / larger bodies first */
export function getConstellationNeighbors(
  nodeId: string,
  edges: GraphEdge[],
  nodeMap: Map<string, GraphNode>,
  max = 4,
): GraphNode[] {
  const peerIds = new Set<string>();
  for (const edge of edges) {
    if (edge.from === nodeId) peerIds.add(edge.to);
    if (edge.to === nodeId) peerIds.add(edge.from);
  }

  return [...peerIds]
    .map((id) => nodeMap.get(id))
    .filter((n): n is GraphNode => !!n)
    .sort((a, b) => a.level - b.level || a.label.localeCompare(b.label))
    .slice(0, max);
}
