import {
  getNode,
  getEdgesFrom,
  getEdgesTo,
  getPeerRefs,
} from "./graph";
import type {
  EdgeKind,
  NodeRef,
  RelationshipBundle,
  RelationshipEdge,
  RelationshipGroup,
  ResolvedNode,
} from "./types";
import { nodeKey, refsEqual } from "./types";
import {
  phraseForGroup,
  headingForOrigin,
  groupId,
} from "./phrases";

/** Edge kinds grouped for outgoing relations from origin */
const OUTGOING_KINDS: EdgeKind[] = [
  "parent",
  "child",
  "pathway",
  "thread",
  "echo",
  "volume",
  "observation",
  "quotation",
  "theme",
  "chamber",
];

/** When viewing a node, incoming edges map to these display kinds */
const INCOMING_KIND_MAP: Partial<Record<EdgeKind, EdgeKind>> = {
  parent: "child",
  child: "parent",
  pathway: "pathway",
  thread: "thread",
  echo: "echo",
  volume: "volume",
  observation: "observation",
  quotation: "quotation",
  theme: "theme",
  chamber: "chamber",
};

/**
 * Resolve all relationships for a content node.
 * Combines explicit, inferred, and inverse edges into organic groups.
 */
export function resolveRelationships(ref: NodeRef): RelationshipBundle {
  const origin = getNode(ref);
  if (!origin) {
    return {
      origin: {
        ref,
        title: "Unknown",
        href: "/",
        themes: [],
      },
      heading: headingForOrigin(ref.kind),
      groups: [],
      peerRefs: [ref],
    };
  }

  const collected = new Map<string, { kind: EdgeKind; node: ResolvedNode; weight: number }>();

  function collect(edge: RelationshipEdge, target: ResolvedNode, displayKind: EdgeKind) {
    if (refsEqual(target.ref, ref)) return;
    const key = nodeKey(target.ref);
    const existing = collected.get(key);
    if (!existing || edge.weight > existing.weight) {
      collected.set(key, { kind: displayKind, node: target, weight: edge.weight });
    }
  }

  for (const edge of getEdgesFrom(ref)) {
    const target = getNode(edge.to);
    if (target) collect(edge, target, edge.kind);
  }

  for (const edge of getEdgesTo(ref)) {
    const target = getNode(edge.from);
    if (!target) continue;
    const displayKind = INCOMING_KIND_MAP[edge.kind] ?? edge.kind;
    collect(edge, target, displayKind);
  }

  const byKind = new Map<EdgeKind, ResolvedNode[]>();

  for (const { kind, node, weight } of collected.values()) {
    if (!byKind.has(kind)) byKind.set(kind, []);
    byKind.get(kind)!.push(node);
    void weight;
  }

  const groups: RelationshipGroup[] = [];
  let groupIndex = 0;

  for (const kind of OUTGOING_KINDS) {
    const nodes = byKind.get(kind);
    if (!nodes?.length) continue;
    nodes.sort((a, b) => a.title.localeCompare(b.title));
    groups.push({
      id: groupId(kind, groupIndex++),
      kind,
      phrase: phraseForGroup(kind),
      nodes,
    });
  }

  return {
    origin,
    heading: headingForOrigin(ref.kind),
    groups,
    peerRefs: getPeerRefs(ref),
  };
}

export function resolveRelationshipsForEssay(essayId: string): RelationshipBundle {
  return resolveRelationships({ kind: "essay", id: essayId });
}

export function resolveRelationshipsForQuestion(questionId: string): RelationshipBundle {
  return resolveRelationships({ kind: "question", id: questionId });
}

export function resolveRelationshipsForBook(bookId: string): RelationshipBundle {
  return resolveRelationships({ kind: "book", id: bookId });
}

export function resolveRelationshipsForFieldNote(noteId: string): RelationshipBundle {
  return resolveRelationships({ kind: "field-note", id: noteId });
}

export function resolveRelationshipsForProject(projectId: string): RelationshipBundle {
  return resolveRelationships({ kind: "project", id: projectId });
}

export function resolveRelationshipsForQuotation(quotationId: string): RelationshipBundle {
  return resolveRelationships({ kind: "quotation", id: quotationId });
}

export function resolveRelationshipsForTheme(themeId: string): RelationshipBundle {
  return resolveRelationships({ kind: "theme", id: themeId });
}
