/**
 * Atlas Map prototype — research-instrument graph.
 * Edges carry meaning (verbs); layout is cluster-derived, not hand-placed.
 */

export type AtlasMapNodeKind =
  | "book"
  | "concept"
  | "essay"
  | "question"
  | "placeholder";

export type AtlasMapNode = {
  id: string;
  title: string;
  description: string;
  kind: AtlasMapNodeKind;
  group: string;
  href?: string;
};

/** Relationship with an explicit verb — the point of the Atlas. */
export type AtlasMapEdge = {
  id: string;
  from: string;
  to: string;
  /** How `from` relates to `to` */
  relation: string;
};

export type AtlasMapPoint = AtlasMapNode & {
  x: number;
  y: number;
  r: number;
};

const KIND_RADIUS: Record<AtlasMapNodeKind, number> = {
  book: 12,
  concept: 8.5,
  essay: 5.5,
  question: 5,
  placeholder: 4.5,
};

/** Tight proof of concept — ~18 interconnected ideas */
export const ATLAS_MAP_NODES: ReadonlyArray<AtlasMapNode> = [
  {
    id: "first-principles",
    title: "First Principles",
    description: "What holds before interpretation begins.",
    kind: "concept",
    group: "core",
    href: "/themes/reality",
  },
  {
    id: "systems",
    title: "Systems",
    description: "Signal, loops, and how wholes behave.",
    kind: "concept",
    group: "systems",
    href: "/themes/information",
  },
  {
    id: "feedback",
    title: "Feedback",
    description: "The conversation between action and consequence.",
    kind: "concept",
    group: "systems",
    href: "/atlas/feedback-is-god",
  },
  {
    id: "adaptation",
    title: "Adaptation",
    description: "How a system reorganizes around what it has survived.",
    kind: "concept",
    group: "biology",
  },
  {
    id: "biology",
    title: "Biology",
    description: "The body as participant in transformation.",
    kind: "concept",
    group: "biology",
    href: "/themes/embodiment",
  },
  {
    id: "identity",
    title: "Identity",
    description: "The self as ongoing inquiry.",
    kind: "concept",
    group: "biology",
    href: "/themes/identity",
  },
  {
    id: "language",
    title: "Language",
    description: "What words can carry — and what they cannot.",
    kind: "concept",
    group: "mind",
    href: "/themes/language",
  },
  {
    id: "relationships",
    title: "Relationships",
    description: "Nothing exists alone.",
    kind: "concept",
    group: "social",
    href: "/themes/relationship",
  },
  {
    id: "civilization",
    title: "Civilization",
    description: "Infrastructures that quietly shape a life.",
    kind: "concept",
    group: "social",
    href: "/themes/freedom",
  },
  {
    id: "consciousness",
    title: "Consciousness",
    description: "The texture of awareness itself.",
    kind: "concept",
    group: "mind",
    href: "/themes/consciousness",
  },
  {
    id: "book-biology",
    title: "The Biology of Becoming",
    description:
      "How the nervous system rewrites identity, perception, and reality.",
    kind: "book",
    group: "biology",
    href: "/atlas/the-biology-of-becoming",
  },
  {
    id: "book-second-birth",
    title: "The Second Birth",
    description: "Physiological reconstruction after collapse.",
    kind: "book",
    group: "biology",
    href: "/atlas/the-second-birth",
  },
  {
    id: "book-feedback",
    title: "Feedback Is God",
    description: "Intelligence as relationship — signal and repair.",
    kind: "book",
    group: "systems",
    href: "/atlas/feedback-is-god",
  },
  {
    id: "book-structure",
    title: "The Structure Beneath Reality",
    description: "An inquiry into what holds the world together.",
    kind: "book",
    group: "core",
    href: "/atlas/the-structure-beneath-reality",
  },
  {
    id: "essay-body",
    title: "If You Feel It in Your Body…",
    description: "Somatic knowing as primary evidence.",
    kind: "essay",
    group: "biology",
    href: "/essays/if-you-feel-it-in-your-body-start-here",
  },
  {
    id: "essay-constraint",
    title: "Constraint Is Not the Opposite of Freedom",
    description: "Freedom takes form through limits that make life possible.",
    kind: "essay",
    group: "core",
    href: "/essays/constraint-is-not-the-opposite-of-freedom",
  },
  {
    id: "q-perception",
    title: "What lies beneath perception?",
    description: "Structures we inherit before we notice them.",
    kind: "question",
    group: "mind",
    href: "/questions/what-lies-beneath-perception",
  },
  {
    id: "q-language",
    title: "Can language hold the unsayable?",
    description: "Silence, metaphor, and the edge of expression.",
    kind: "question",
    group: "mind",
    href: "/questions/can-language-hold-the-unsayable",
  },
];

export const ATLAS_MAP_EDGES: ReadonlyArray<AtlasMapEdge> = [
  { id: "r1", from: "feedback", to: "adaptation", relation: "shapes" },
  { id: "r2", from: "adaptation", to: "biology", relation: "influences" },
  { id: "r3", from: "biology", to: "book-biology", relation: "charts" },
  { id: "r4", from: "biology", to: "book-second-birth", relation: "continues in" },
  { id: "r5", from: "adaptation", to: "book-second-birth", relation: "grounds" },
  { id: "r6", from: "feedback", to: "book-feedback", relation: "charts" },
  { id: "r7", from: "language", to: "identity", relation: "constructs" },
  { id: "r8", from: "identity", to: "relationships", relation: "affects" },
  { id: "r9", from: "civilization", to: "systems", relation: "emerges from" },
  { id: "r10", from: "systems", to: "feedback", relation: "depends on" },
  { id: "r11", from: "first-principles", to: "book-structure", relation: "charts" },
  { id: "r12", from: "first-principles", to: "systems", relation: "informs" },
  { id: "r13", from: "biology", to: "essay-body", relation: "opens into" },
  { id: "r14", from: "first-principles", to: "essay-constraint", relation: "echoes in" },
  { id: "r15", from: "consciousness", to: "language", relation: "speaks through" },
  { id: "r16", from: "language", to: "q-language", relation: "asks" },
  { id: "r17", from: "consciousness", to: "q-perception", relation: "asks" },
  { id: "r18", from: "identity", to: "biology", relation: "resides in" },
  { id: "r19", from: "relationships", to: "feedback", relation: "requires" },
  { id: "r20", from: "book-biology", to: "essay-body", relation: "points to" },
];

function hash01(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

/** Drafting-table anchors — clusters on a plane, not a sky */
const GROUP_ANCHORS: Record<string, { x: number; y: number; spread: number }> =
  {
    core: { x: -40, y: -90, spread: 95 },
    systems: { x: -200, y: 30, spread: 100 },
    biology: { x: 170, y: 50, spread: 115 },
    mind: { x: 40, y: -200, spread: 95 },
    social: { x: -160, y: 180, spread: 100 },
  };

export function layoutAtlasMap(
  nodes: ReadonlyArray<AtlasMapNode> = ATLAS_MAP_NODES,
): AtlasMapPoint[] {
  const byGroup = new Map<string, AtlasMapNode[]>();
  for (const node of nodes) {
    const list = byGroup.get(node.group) ?? [];
    list.push(node);
    byGroup.set(node.group, list);
  }

  const points: AtlasMapPoint[] = [];

  for (const [group, members] of byGroup) {
    const anchor = GROUP_ANCHORS[group] ?? { x: 0, y: 0, spread: 100 };
    const n = members.length;

    members.forEach((node, i) => {
      const angle =
        (i / Math.max(n, 1)) * Math.PI * 2 + hash01(`${node.id}:a`) * 0.55;
      const radius = anchor.spread * (0.3 + hash01(`${node.id}:r`) * 0.7);
      const jitterX = (hash01(`${node.id}:x`) - 0.5) * 28;
      const jitterY = (hash01(`${node.id}:y`) - 0.5) * 28;

      points.push({
        ...node,
        x: anchor.x + Math.cos(angle) * radius + jitterX,
        y: anchor.y + Math.sin(angle) * radius + jitterY,
        r: KIND_RADIUS[node.kind],
      });
    });
  }

  return points;
}

export function getAtlasMapGraph() {
  const nodes = layoutAtlasMap();
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const edges = ATLAS_MAP_EDGES.filter(
    (e) => byId.has(e.from) && byId.has(e.to),
  );
  return { nodes, edges, byId };
}

/** Editorial index — major concepts only */
export function getMajorConcepts(): ReadonlyArray<AtlasMapNode> {
  return ATLAS_MAP_NODES.filter((n) => n.kind === "concept");
}

export type FocusedAtlasGraph = {
  center: AtlasMapNode;
  nodes: AtlasMapPoint[];
  edges: AtlasMapEdge[];
  byId: Map<string, AtlasMapPoint>;
};

/**
 * One-hop neighborhood around a concept — progressive discovery.
 * Center sits at origin; neighbors radiate by kind weight.
 */
export function getFocusedGraph(centerId: string): FocusedAtlasGraph | null {
  const center = ATLAS_MAP_NODES.find((n) => n.id === centerId);
  if (!center) return null;

  const neighborIds = new Set<string>();
  const edges: AtlasMapEdge[] = [];

  for (const edge of ATLAS_MAP_EDGES) {
    if (edge.from === centerId || edge.to === centerId) {
      edges.push(edge);
      neighborIds.add(edge.from === centerId ? edge.to : edge.from);
    }
  }

  // Include edges between neighbors (second-order clarity, still small)
  for (const edge of ATLAS_MAP_EDGES) {
    if (
      neighborIds.has(edge.from) &&
      neighborIds.has(edge.to) &&
      !edges.some((e) => e.id === edge.id)
    ) {
      edges.push(edge);
    }
  }

  const neighbors = ATLAS_MAP_NODES.filter((n) => neighborIds.has(n.id));
  const points: AtlasMapPoint[] = [
    {
      ...center,
      x: 0,
      y: 0,
      r: KIND_RADIUS[center.kind] * 1.25,
    },
  ];

  const n = neighbors.length;
  neighbors.forEach((node, i) => {
    const angle =
      -Math.PI / 2 + (i / Math.max(n, 1)) * Math.PI * 2 + hash01(node.id) * 0.2;
    const ring =
      node.kind === "book" ? 145 : node.kind === "concept" ? 120 : 100;
    points.push({
      ...node,
      x: Math.cos(angle) * ring,
      y: Math.sin(angle) * ring,
      r: KIND_RADIUS[node.kind],
    });
  });

  const byId = new Map(points.map((p) => [p.id, p]));
  return { center, nodes: points, edges, byId };
}

export function countRelations(nodeId: string): number {
  return ATLAS_MAP_EDGES.filter((e) => e.from === nodeId || e.to === nodeId)
    .length;
}

