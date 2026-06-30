import { getAtlas } from "../atlas";
import { isMajorConcept } from "../concepts/major-concepts";
import {
  getEdgesFrom,
  getEdgesTo,
  getNode,
  getRelationshipGraph,
} from "./graph";
import type { EdgeKind, NodeRef, RelationshipEdge, ResolvedNode } from "./types";
import { nodeKey, refsEqual } from "./types";

const CHAMBER_REF: NodeRef = { kind: "project", id: "p1" };

/**
 * Narrative spine — how major ideas tend to unfold toward the central chamber.
 * Used when composing a contemplative thread, not as rigid taxonomy.
 */
const ARCHITECTURE_SPINE = [
  "th-freedom",
  "th-relationship",
  "th-identity",
  "th-embodiment",
  "th-meaning",
  "th-reality",
  "th-consciousness",
  "th-language",
  "th-information",
  "th-time",
] as const;

const EDGE_PRIORITY: Record<EdgeKind, number> = {
  theme: 10,
  parent: 9,
  child: 8,
  chamber: 9,
  thread: 7,
  pathway: 6,
  volume: 5,
  echo: 4,
  observation: 4,
  quotation: 3,
};

export interface ThreadStep {
  node: ResolvedNode;
  /** Id used in the terrain constellation graph */
  graphId: string;
}

export interface ThreadSegment {
  from: ThreadStep;
  to: ThreadStep;
  kind: EdgeKind | "inferred";
  inGraph: boolean;
}

export interface ThreadPathResult {
  steps: ThreadStep[];
  segments: ThreadSegment[];
}

function toStep(node: ResolvedNode): ThreadStep {
  return { node, graphId: node.ref.id };
}

function dedupeSteps(steps: ResolvedNode[]): ResolvedNode[] {
  const seen = new Set<string>();
  const out: ResolvedNode[] = [];
  for (const node of steps) {
    const key = nodeKey(node.ref);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(node);
  }
  return out;
}

function findGraphEdge(a: NodeRef, b: NodeRef): RelationshipEdge | null {
  const { edges } = getRelationshipGraph();
  for (const edge of edges) {
    if (
      (refsEqual(edge.from, a) && refsEqual(edge.to, b)) ||
      (refsEqual(edge.from, b) && refsEqual(edge.to, a))
    ) {
      return edge;
    }
  }
  return null;
}

function resolveEntryConcept(
  originRef: NodeRef,
  origin: ResolvedNode,
): string | null {
  if (originRef.kind === "theme" && isMajorConcept(originRef.id)) {
    return originRef.id;
  }

  const atlasEntry = getAtlas().getById(originRef.id);
  const titleLower = origin.title.toLowerCase();

  if (titleLower.includes("freedom")) return "th-freedom";
  if (titleLower.includes("relationship")) return "th-relationship";
  if (titleLower.includes("identity")) return "th-identity";
  if (titleLower.includes("meaning")) return "th-meaning";
  if (titleLower.includes("embodiment")) return "th-embodiment";

  const candidates: Array<{ id: string; score: number }> = [];

  function scoreEdge(edge: RelationshipEdge, targetId: string) {
    const priority = EDGE_PRIORITY[edge.kind] ?? 1;
    const majorBonus = isMajorConcept(targetId) ? 4 : 0;
    const weightBonus = edge.weight * 0.15;
    candidates.push({ id: targetId, score: priority + majorBonus + weightBonus });
  }

  for (const edge of getEdgesFrom(originRef)) {
    if (edge.to.kind === "theme") scoreEdge(edge, edge.to.id);
    if (edge.to.kind === "project") continue;
  }
  for (const edge of getEdgesTo(originRef)) {
    if (edge.from.kind === "theme") scoreEdge(edge, edge.from.id);
  }

  if (atlasEntry?.parentConcepts?.length) {
    for (const id of atlasEntry.parentConcepts) {
      candidates.push({ id, score: 6 });
    }
  }

  for (const themeId of atlasEntry?.themes ?? []) {
    const mapped = isMajorConcept(themeId) ? themeId : null;
    if (mapped) candidates.push({ id: mapped, score: 5 });
  }

  for (const topic of origin.themes) {
    const topicMap: Record<string, string> = {
      Freedom: "th-freedom",
      Relationship: "th-relationship",
      Identity: "th-identity",
      Meaning: "th-meaning",
      Embodiment: "th-embodiment",
      Consciousness: "th-consciousness",
      Language: "th-language",
      Time: "th-time",
      Structure: "th-reality",
      Philosophy: "th-reality",
    };
    const mapped = topicMap[topic];
    if (mapped) candidates.push({ id: mapped, score: 4.5 });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.id ?? null;
}

function spineTailFrom(entryId: string): string[] {
  const idx = ARCHITECTURE_SPINE.indexOf(
    entryId as (typeof ARCHITECTURE_SPINE)[number],
  );
  if (idx === -1) return [];

  const tail: string[] = [];
  const preferred = [
    "th-relationship",
    "th-identity",
    "th-embodiment",
    "th-meaning",
  ] as const;

  for (const id of preferred) {
    const spineIndex = ARCHITECTURE_SPINE.indexOf(id);
    if (spineIndex > idx) tail.push(id);
  }
  return tail;
}

/**
 * Compose a contemplative thread from any node toward the central chamber.
 */
export function computeThreadPath(originRef: NodeRef): ThreadPathResult {
  const origin = getNode(originRef);
  const chamber = getNode(CHAMBER_REF);

  if (!origin) {
    return { steps: [], segments: [] };
  }

  if (refsEqual(originRef, CHAMBER_REF) && chamber) {
    const outward = ARCHITECTURE_SPINE.slice(0, 5)
      .map((id) => getNode({ kind: "theme", id }))
      .filter((n): n is ResolvedNode => Boolean(n));
    const chain = dedupeSteps([chamber, ...outward]);
    const steps = chain.map(toStep);
    const segments: ThreadSegment[] = [];
    for (let i = 0; i < steps.length - 1; i++) {
      const from = steps[i];
      const to = steps[i + 1];
      const edge = findGraphEdge(from.node.ref, to.node.ref);
      segments.push({
        from,
        to,
        kind: edge?.kind ?? "inferred",
        inGraph: Boolean(edge),
      });
    }
    return { steps, segments };
  }

  const chain: ResolvedNode[] = [origin];

  if (!refsEqual(originRef, CHAMBER_REF)) {
    const entryId = resolveEntryConcept(originRef, origin);
    if (entryId && entryId !== originRef.id) {
      const entry = getNode({ kind: "theme", id: entryId });
      if (entry) chain.push(entry);

      for (const id of spineTailFrom(entryId)) {
        const concept = getNode({ kind: "theme", id });
        if (concept) chain.push(concept);
      }
    }
  }

  if (chamber && !refsEqual(chain[chain.length - 1]?.ref, CHAMBER_REF)) {
    chain.push(chamber);
  }

  const steps = dedupeSteps(chain).map(toStep);
  const segments: ThreadSegment[] = [];

  for (let i = 0; i < steps.length - 1; i++) {
    const from = steps[i];
    const to = steps[i + 1];
    const edge = findGraphEdge(from.node.ref, to.node.ref);
    segments.push({
      from,
      to,
      kind: edge?.kind ?? "inferred",
      inGraph: Boolean(edge),
    });
  }

  return { steps, segments };
}

export function hasThreadPath(originRef: NodeRef): boolean {
  return computeThreadPath(originRef).steps.length >= 2;
}
