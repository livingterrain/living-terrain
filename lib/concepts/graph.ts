import {
  getAllEssays,
  getAllQuestions,
  getAllFieldNotes,
  getAllBooks,
  getFlagshipProject,
} from "@/lib/content";
import { getPeerRefs } from "@/lib/relationships";
import { getCatalogQuotations } from "@/lib/relationships/catalog";
import {
  getMajorConceptThemes,
  resolveMajorConcept,
} from "./major-concepts";
import { getBundledObservations } from "../observatory/observations-bundle";
import { displayTitle } from "../observatory/display";
import { UNIVERSE_CENTER } from "./universe-viewport";

export type GraphNodeKind =
  | "chamber"
  | "concept"
  | "essay"
  | "book"
  | "question"
  | "field-note"
  | "quotation"
  | "observation";

export type GraphLevel = 1 | 2 | 3 | 4;

export type EdgeTier = "primary" | "secondary" | "emerging";

export type NodeShape =
  | "sun"
  | "hexagon"
  | "circle"
  | "book"
  | "diamond"
  | "triangle"
  | "square";

/** Minimum zoom before this node kind appears */
export const NODE_LOD: Record<GraphNodeKind, number> = {
  chamber: 0,
  concept: 0,
  essay: 0.32,
  book: 0.38,
  question: 0.52,
  "field-note": 0.58,
  quotation: 0.62,
  observation: 0.65,
};

export const NODE_LEVEL: Record<GraphNodeKind, GraphLevel> = {
  chamber: 1, // Origin
  concept: 2, // Major constellation
  essay: 3, // Supporting idea
  book: 3, // Supporting idea
  question: 4, // Observation
  "field-note": 4, // Observation
  quotation: 4, // Observation
  observation: 4, // Observatory signal
};

export const NODE_SHAPE: Record<GraphNodeKind, NodeShape> = {
  chamber: "sun",
  concept: "hexagon",
  essay: "circle",
  book: "book",
  question: "diamond",
  "field-note": "triangle",
  quotation: "square",
  observation: "circle",
};

/** Base size multiplier by celestial tier — dramatic spread for at-a-glance hierarchy */
export const LEVEL_SIZE: Record<GraphLevel, number> = {
  1: 6.2,
  2: 3.45,
  3: 0.78,
  4: 0.2,
};

export interface GraphNode {
  id: string;
  kind: GraphNodeKind;
  level: GraphLevel;
  shape: NodeShape;
  label: string;
  sublabel?: string;
  href: string;
  x: number;
  y: number;
  size: number;
  peerIds: string[];
  lod: number;
  /** Primary concept this node orbits (if any) */
  conceptId?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  tier: EdgeTier;
}

export interface TerrainGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const TIER_RANK: Record<EdgeTier, number> = {
  primary: 3,
  secondary: 2,
  emerging: 1,
};

const CONCEPT_RADIUS = 780;
const ESSAY_ORBIT = 340;
const OUTER_ORBIT = 520;

function conceptAnchor(
  conceptPositions: Map<string, { x: number; y: number; angle: number }>,
  conceptId: string,
  cx: number,
  cy: number,
): { x: number; y: number; angle: number } {
  return (
    conceptPositions.get(conceptId) ?? {
      x: cx + Math.cos(0) * CONCEPT_RADIUS,
      y: cy + Math.sin(0) * CONCEPT_RADIUS,
      angle: 0,
    }
  );
}

export function buildTerrainGraph(): TerrainGraph {
  const questions = getAllQuestions();
  const essays = getAllEssays();
  const notes = getAllFieldNotes();
  const books = getAllBooks();
  const project = getFlagshipProject();
  const publishedQuotes = getCatalogQuotations().filter(
    (q) => q.status === "published",
  );
  const majorConcepts = getMajorConceptThemes();

  const nodes: GraphNode[] = [];
  const edgeMap = new Map<string, GraphEdge>();

  const addEdge = (from: string, to: string, tier: EdgeTier) => {
    if (from === to) return;
    const key = [from, to].sort().join("--");
    const existing = edgeMap.get(key);
    if (!existing || TIER_RANK[tier] > TIER_RANK[existing.tier]) {
      edgeMap.set(key, { from, to, tier });
    }
  };

  const cx = UNIVERSE_CENTER;
  const cy = UNIVERSE_CENTER;

  const conceptPositions = new Map<string, { x: number; y: number; angle: number }>();

  // ── Level 1: Central chamber ──
  nodes.push({
    id: project.id,
    kind: "chamber",
    level: 1,
    shape: "sun",
    label: project.title,
    sublabel: "Begin here",
    href: "/structure-beneath-reality",
    x: cx,
    y: cy,
    size: LEVEL_SIZE[1],
    peerIds: [],
    lod: NODE_LOD.chamber,
  });

  // ── Level 2: Major concepts ──
  majorConcepts.forEach((concept, i) => {
    const angle = (i / majorConcepts.length) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * CONCEPT_RADIUS;
    const y = cy + Math.sin(angle) * CONCEPT_RADIUS;
    conceptPositions.set(concept.id, { x, y, angle });

    nodes.push({
      id: concept.id,
      kind: "concept",
      level: 2,
      shape: "hexagon",
      label: concept.title,
      sublabel: concept.description,
      href: `/themes/${concept.slug}`,
      x,
      y,
      size: LEVEL_SIZE[2],
      peerIds: [],
      lod: NODE_LOD.concept,
      conceptId: concept.id,
    });
    addEdge(project.id, concept.id, "primary");
  });

  // ── Level 3: Essays orbit concepts ──
  const essaysByConcept = new Map<string, typeof essays>();
  for (const essay of essays) {
    const conceptId = resolveMajorConcept(essay.themeIds, essay.topics);
    const list = essaysByConcept.get(conceptId) ?? [];
    list.push(essay);
    essaysByConcept.set(conceptId, list);
  }

  for (const [conceptId, group] of essaysByConcept) {
    const anchor =
      conceptPositions.get(conceptId) ??
      conceptPositions.get(majorConcepts[0]?.id ?? "") ??
      conceptAnchor(conceptPositions, conceptId, cx, cy);
    group.forEach((e, i) => {
      const spread = Math.min(1.1, 0.35 + group.length * 0.12);
      const offset =
        group.length > 1 ? ((i / (group.length - 1)) - 0.5) * spread : 0;
      const orbitAngle = anchor.angle + offset;
      const orbitDist = ESSAY_ORBIT + (i % 2) * 90;
      const x = anchor.x + Math.cos(orbitAngle) * orbitDist;
      const y = anchor.y + Math.sin(orbitAngle) * orbitDist;

      nodes.push({
        id: e.id,
        kind: "essay",
        level: 3,
        shape: "circle",
        label: e.title,
        sublabel: e.topics[0],
        href: `/essays/${e.slug}`,
        x,
        y,
        size: LEVEL_SIZE[3],
        peerIds: [],
        lod: NODE_LOD.essay,
        conceptId,
      });
      addEdge(conceptId, e.id, "primary");
      if (e.projectIds?.includes(project.id)) {
        addEdge(project.id, e.id, "secondary");
      }
      e.relatedEssayIds?.forEach((relId) =>
        addEdge(e.id, relId, "secondary"),
      );
    });
  }

  // ── Level 3: Books — anchored to chamber + primary concept ──
  books.forEach((b, i) => {
    const conceptId = resolveMajorConcept(b.themeIds, [b.title]);
    const anchor = conceptAnchor(conceptPositions, conceptId, cx, cy);
    const angle = anchor.angle + (i % 2 === 0 ? -0.25 : 0.25);
    const x = cx + Math.cos(angle) * (CONCEPT_RADIUS * 0.55);
    const y = cy + Math.sin(angle) * (CONCEPT_RADIUS * 0.55);

    nodes.push({
      id: b.id,
      kind: "book",
      level: 3,
      shape: "book",
      label: b.title,
      sublabel: "Volume",
      href: `/library/${b.slug}`,
      x,
      y,
      size: LEVEL_SIZE[3] * 1.05,
      peerIds: [],
      lod: NODE_LOD.book,
      conceptId,
    });
    addEdge(project.id, b.id, "primary");
    addEdge(conceptId, b.id, "secondary");
  });

  // ── Level 4: Questions — smallest diamonds, outer orbit ──
  questions.forEach((q, i) => {
    const conceptId = resolveMajorConcept(q.themeIds, undefined);
    const anchor = conceptAnchor(conceptPositions, conceptId, cx, cy);
    const angle = anchor.angle + ((i % 3) - 1) * 0.18;
    const x = anchor.x + Math.cos(angle) * OUTER_ORBIT;
    const y = anchor.y + Math.sin(angle) * OUTER_ORBIT;

    nodes.push({
      id: q.id,
      kind: "question",
      level: 4,
      shape: "diamond",
      label: q.title,
      sublabel: q.subtitle,
      href: `/questions/${q.slug}`,
      x,
      y,
      size: LEVEL_SIZE[4],
      peerIds: [],
      lod: NODE_LOD.question,
      conceptId,
    });
    addEdge(conceptId, q.id, "secondary");
    addEdge(project.id, q.id, "emerging");
  });

  // ── Level 4: Field notes ──
  notes.forEach((fn, i) => {
    const conceptId = resolveMajorConcept(fn.themeIds, undefined);
    const anchor = conceptAnchor(conceptPositions, conceptId, cx, cy);
    const angle = anchor.angle + 0.35 + (i % 4) * 0.14;
    const x = anchor.x + Math.cos(angle) * (OUTER_ORBIT + 80);
    const y = anchor.y + Math.sin(angle) * (OUTER_ORBIT + 80);

    nodes.push({
      id: fn.id,
      kind: "field-note",
      level: 4,
      shape: "triangle",
      label: fn.title ?? "Field observation",
      sublabel: fn.location,
      href: `/field-notes/${fn.slug}`,
      x,
      y,
      size: LEVEL_SIZE[4] * 0.9,
      peerIds: [],
      lod: NODE_LOD["field-note"],
      conceptId,
    });
    addEdge(conceptId, fn.id, "emerging");
    fn.questionIds.forEach((qId) => addEdge(fn.id, qId, "emerging"));
  });

  // ── Level 4: Quotations ──
  publishedQuotes.forEach((qt, i) => {
    const conceptId = resolveMajorConcept(qt.themeIds, undefined);
    const anchor = conceptAnchor(conceptPositions, conceptId, cx, cy);
    const angle = anchor.angle - 0.4 - i * 0.12;
    const x = anchor.x + Math.cos(angle) * (OUTER_ORBIT + 40);
    const y = anchor.y + Math.sin(angle) * (OUTER_ORBIT + 40);

    nodes.push({
      id: qt.id,
      kind: "quotation",
      level: 4,
      shape: "square",
      label: qt.text.slice(0, 40) + (qt.text.length > 40 ? "…" : ""),
      sublabel: qt.attribution,
      href: `/quotations/${qt.slug}`,
      x,
      y,
      size: LEVEL_SIZE[4] * 0.75,
      peerIds: [],
      lod: NODE_LOD.quotation,
      conceptId,
    });
    addEdge(conceptId, qt.id, "emerging");
    qt.relatedEssayIds?.forEach((eId) => addEdge(qt.id, eId, "emerging"));
  });

  // ── Level 4: Visitor observations from the Observatory ──
  const visitorObservations = getBundledObservations();
  visitorObservations.forEach((vo, i) => {
    const conceptId = resolveMajorConcept(vo.themeIds, undefined);
    const anchor = conceptAnchor(conceptPositions, conceptId, cx, cy);
    const angle = anchor.angle + 0.55 + (i % 5) * 0.11;
    const x = anchor.x + Math.cos(angle) * (OUTER_ORBIT + 120);
    const y = anchor.y + Math.sin(angle) * (OUTER_ORBIT + 120);

    nodes.push({
      id: vo.id,
      kind: "observation",
      level: 4,
      shape: "circle",
      label: displayTitle(vo),
      sublabel: vo.terrainLocation ?? "Observatory",
      href: `/observatory/observations/${vo.slug}`,
      x,
      y,
      size: LEVEL_SIZE[4] * 0.7,
      peerIds: [],
      lod: NODE_LOD.observation,
      conceptId,
    });
    addEdge(conceptId, vo.id, "emerging");
    addEdge(project.id, vo.id, "emerging");
  });

  // Peer refs from relationship engine
  for (const n of nodes) {
    const refKind =
      n.kind === "chamber"
        ? ("project" as const)
        : n.kind === "concept"
          ? ("theme" as const)
          : n.kind === "quotation" || n.kind === "observation"
            ? n.kind
            : n.kind;
    n.peerIds = getPeerRefs({ kind: refKind, id: n.id }).map((p) => p.id);
  }

  return {
    nodes,
    edges: [...edgeMap.values()],
  };
}

/** Nodes visible at current zoom and viewport */
export function getVisibleGraph(
  graph: TerrainGraph,
  zoom: number,
  viewBox: { x: number; y: number; w: number; h: number },
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const margin = viewBox.w * 0.15;
  const visibleIds = new Set<string>();

  const nodes = graph.nodes.filter((n) => {
    if (zoom < n.lod) return false;
    const inView =
      n.x >= viewBox.x - margin &&
      n.x <= viewBox.x + viewBox.w + margin &&
      n.y >= viewBox.y - margin &&
      n.y <= viewBox.y + viewBox.h + margin;
    if (inView) visibleIds.add(n.id);
    return inView;
  });

  const edges = graph.edges.filter(
    (e) => visibleIds.has(e.from) && visibleIds.has(e.to),
  );

  return { nodes, edges };
}
