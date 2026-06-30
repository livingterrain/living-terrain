import { getAtlas, atlasTypeToContentKind } from "../atlas";
import { registerVisitorObservations } from "../observatory/atlas-bridge";
import type { AtlasConnection, AtlasEntry } from "../atlas/types";
import type { ContentKind } from "../content/types";
import type {
  EdgeKind,
  EdgeSource,
  NodeRef,
  RelationshipEdge,
  ResolvedNode,
} from "./types";
import { nodeKey, refsEqual } from "./types";

interface GraphIndex {
  nodes: Map<string, ResolvedNode>;
  edges: RelationshipEdge[];
  edgesByFrom: Map<string, RelationshipEdge[]>;
  edgesByTo: Map<string, RelationshipEdge[]>;
}

let graphCache: GraphIndex | null = null;

export function getRelationshipGraph(): GraphIndex {
  if (!graphCache) graphCache = buildGraph();
  return graphCache;
}

export function invalidateRelationshipGraph(): void {
  graphCache = null;
}

function atlasRef(entry: AtlasEntry): NodeRef {
  return {
    kind: atlasTypeToContentKind(entry.type),
    id: entry.id,
  };
}

function connectionToEdgeKind(kind: AtlasConnection["kind"]): EdgeKind {
  if (kind === "parent-concept") return "parent";
  return kind as EdgeKind;
}

function resolveEntry(entry: AtlasEntry): ResolvedNode {
  const themes = entry.themes
    .map((id) => getAtlas().getById(id)?.title)
    .filter((t): t is string => Boolean(t));

  const base = {
    ref: atlasRef(entry),
    title: entry.title,
    href: entry.route,
    themes,
  };

  switch (entry.type) {
    case "essay": {
      const meta = entry.meta as { subtitle?: string; excerpt: string; topics: string[] };
      return {
        ...base,
        subtitle: meta.subtitle,
        excerpt: meta.excerpt,
        themes: [...new Set([...themes, ...meta.topics])],
      };
    }
    case "question": {
      const meta = entry.meta as { subtitle?: string };
      return {
        ...base,
        subtitle: meta.subtitle,
        excerpt: entry.description,
      };
    }
    case "book": {
      const meta = entry.meta as { subtitle?: string };
      return {
        ...base,
        subtitle: meta.subtitle,
        excerpt: entry.description,
      };
    }
    case "field-note": {
      const meta = entry.meta as { body: string; location?: string; displayTitle?: string };
      return {
        ...base,
        title: meta.displayTitle ?? entry.title,
        subtitle: meta.location,
        excerpt: meta.body.slice(0, 120),
      };
    }
    case "major-concept":
    case "concept":
      return {
        ...base,
        subtitle: entry.description,
        themes: [entry.title],
      };
    case "quotation": {
      const meta = entry.meta as { text: string; attribution?: string };
      return {
        ...base,
        title: meta.text.slice(0, 80) + (meta.text.length > 80 ? "…" : ""),
        subtitle: meta.attribution,
        excerpt: meta.text,
      };
    }
    case "observation": {
      const meta = entry.meta as { body: string };
      return {
        ...base,
        excerpt: meta.body.slice(0, 120),
      };
    }
    case "chamber": {
      const meta = entry.meta as { subtitle?: string };
      return {
        ...base,
        subtitle: meta.subtitle,
        excerpt: entry.description,
        themes: getAtlas()
          .getMajorConcepts()
          .slice(0, 5)
          .map((c) => c.title),
      };
    }
    default:
      return { ...base, excerpt: entry.description };
  }
}

function registerDerivedNodes(
  entry: AtlasEntry,
  nodes: Map<string, ResolvedNode>,
  edges: RelationshipEdge[],
): void {
  if (entry.type === "book") {
    const meta = entry.meta as {
      chapters: Array<{
        id: string;
        slug: string;
        title: string;
        order: number;
        excerpt: string;
      }>;
    };
    const bookRef = atlasRef(entry);

    for (const chapter of meta.chapters) {
      const chapterRef: NodeRef = { kind: "book-chapter", id: `${entry.id}:${chapter.id}` };
      nodes.set(nodeKey(chapterRef), {
        ref: chapterRef,
        title: chapter.title,
        subtitle: `Chapter ${chapter.order}`,
        excerpt: chapter.excerpt,
        href: `${entry.route}#${chapter.slug}`,
        themes: entry.themes
          .map((id) => getAtlas().getById(id)?.title)
          .filter((t): t is string => Boolean(t)),
      });

      edges.push({
        from: bookRef,
        to: chapterRef,
        kind: "child",
        source: "inferred",
        weight: 8,
        rationale: `opens into this chapter of the volume.`,
      });
      edges.push({
        from: chapterRef,
        to: bookRef,
        kind: "parent",
        source: "inferred",
        weight: 8,
        rationale: `belongs to ${entry.title}.`,
      });

      for (const themeId of entry.themes) {
        const themeEntry = getAtlas().getById(themeId);
        if (!themeEntry) continue;
        const themeRef = atlasRef(themeEntry);
        edges.push({
          from: chapterRef,
          to: themeRef,
          kind: "theme",
          source: "inferred",
          weight: 5,
        });
      }
    }
  }

  if (entry.type === "chamber") {
    const meta = entry.meta as {
      timeline: Array<{
        id: string;
        date: string;
        title: string;
        description: string;
      }>;
    };
    const chamberRef = atlasRef(entry);

    for (const event of meta.timeline) {
      const eventRef: NodeRef = { kind: "timeline-event", id: `${entry.id}:${event.id}` };
      nodes.set(nodeKey(eventRef), {
        ref: eventRef,
        title: event.title,
        subtitle: event.date,
        excerpt: event.description,
        href: `${entry.route}#timeline-${event.id}`,
        themes: getAtlas()
          .getMajorConcepts()
          .slice(0, 4)
          .map((c) => c.title),
      });

      edges.push({
        from: chamberRef,
        to: eventRef,
        kind: "child",
        source: "inferred",
        weight: 6,
        rationale: `marks a moment in the life of this inquiry.`,
      });
      edges.push({
        from: eventRef,
        to: chamberRef,
        kind: "parent",
        source: "inferred",
        weight: 6,
        rationale: `belongs to the chamber where the inquiry began.`,
      });
    }
  }
}

function buildGraph(): GraphIndex {
  const atlas = getAtlas();
  const nodes = new Map<string, ResolvedNode>();
  const edges: RelationshipEdge[] = [];

  for (const entry of atlas.entries) {
    if (entry.status !== "published") continue;
    nodes.set(nodeKey(atlasRef(entry)), resolveEntry(entry));
    registerDerivedNodes(entry, nodes, edges);
  }

  for (const connection of atlas.connections) {
    const fromEntry = atlas.getById(connection.from);
    const toEntry = atlas.getById(connection.to);
    if (!fromEntry || !toEntry) continue;
    if (fromEntry.status !== "published" || toEntry.status !== "published") {
      continue;
    }

    const from = atlasRef(fromEntry);
    const to = atlasRef(toEntry);
    if (refsEqual(from, to)) continue;

    edges.push({
      from,
      to,
      kind: connectionToEdgeKind(connection.kind),
      source: connection.source as EdgeSource,
      weight: connection.weight ?? 5,
      rationale: connection.rationale,
      quote: connection.quote,
    });
  }

  registerVisitorObservations(nodes, edges);

  const edgesByFrom = new Map<string, RelationshipEdge[]>();
  const edgesByTo = new Map<string, RelationshipEdge[]>();

  for (const edge of edges) {
    const fk = nodeKey(edge.from);
    const tk = nodeKey(edge.to);
    if (!edgesByFrom.has(fk)) edgesByFrom.set(fk, []);
    if (!edgesByTo.has(tk)) edgesByTo.set(tk, []);
    edgesByFrom.get(fk)!.push(edge);
    edgesByTo.get(tk)!.push(edge);
  }

  return { nodes, edges, edgesByFrom, edgesByTo };
}

export function getNode(ref: NodeRef): ResolvedNode | undefined {
  return getRelationshipGraph().nodes.get(nodeKey(ref));
}

export function getEdgesFrom(ref: NodeRef): RelationshipEdge[] {
  return getRelationshipGraph().edgesByFrom.get(nodeKey(ref)) ?? [];
}

export function getEdgesTo(ref: NodeRef): RelationshipEdge[] {
  return getRelationshipGraph().edgesByTo.get(nodeKey(ref)) ?? [];
}

export function getPeerRefs(ref: NodeRef): NodeRef[] {
  const peers = new Set<string>();
  peers.add(nodeKey(ref));
  for (const e of getEdgesFrom(ref)) peers.add(nodeKey(e.to));
  for (const e of getEdgesTo(ref)) peers.add(nodeKey(e.from));
  return [...peers]
    .map((k) => getRelationshipGraph().nodes.get(k)?.ref)
    .filter((r): r is NodeRef => r !== undefined);
}

/** Map legacy ContentKind to atlas-backed node registration */
export function contentKindForAtlas(type: string): ContentKind | undefined {
  const map: Record<string, ContentKind> = {
    "major-concept": "theme",
    concept: "theme",
    chamber: "project",
  };
  return (map[type] ?? type) as ContentKind | undefined;
}
