import { getEdgesFrom, getEdgesTo, getNode } from "./graph";
import { composeRationale, strengthFromWeight, typeLabelForKind } from "./rationale";
import type {
  NodeRef,
  RelationshipEdge,
  ResolvedNode,
  ThreadConnection,
  ThreadNode,
  ThreadView,
} from "./types";
import { nodeKey, refsEqual } from "./types";

const FOLLOW_MIN = 3;
const FOLLOW_MAX = 6;

/** Kind priority when curating the visible thread — narrative before taxonomy */
const KIND_PRIORITY: Record<string, number> = {
  thread: 10,
  pathway: 9,
  child: 8,
  parent: 7,
  theme: 6,
  echo: 5,
  observation: 4,
  quotation: 3,
  volume: 2,
  chamber: 1,
};

function resolveDescription(node: ResolvedNode): string {
  return node.excerpt ?? node.subtitle ?? "";
}

function buildThreadNode(ref: NodeRef, resolved: ResolvedNode): ThreadNode {
  return {
    ref,
    title: resolved.title,
    type: ref.kind,
    typeLabel: typeLabelForKind(ref.kind),
    description: resolveDescription(resolved),
    relatedConcepts: resolved.themes,
    href: resolved.href,
  };
}

function edgeToConnection(
  edge: RelationshipEdge,
  origin: ResolvedNode,
  peer: ResolvedNode,
  direction: "incoming" | "outgoing",
): ThreadConnection {
  const explicit = Boolean(edge.rationale);
  return {
    node: peer,
    direction,
    kind: edge.kind,
    weight: edge.weight,
    strength: strengthFromWeight(edge.weight),
    rationale: composeRationale(origin, peer, edge, direction),
    quote: edge.quote,
    explicitRationale: explicit,
  };
}

function collectConnections(ref: NodeRef, origin: ResolvedNode): ThreadConnection[] {
  const byPeer = new Map<string, ThreadConnection>();

  function upsert(connection: ThreadConnection) {
    const key = nodeKey(connection.node.ref);
    const existing = byPeer.get(key);
    if (!existing) {
      byPeer.set(key, connection);
      return;
    }
    const score = (c: ThreadConnection) =>
      c.weight + (c.explicitRationale ? 12 : 0) + (KIND_PRIORITY[c.kind] ?? 0);
    if (score(connection) > score(existing)) {
      byPeer.set(key, connection);
    }
  }

  for (const edge of getEdgesFrom(ref)) {
    const peer = getNode(edge.to);
    if (!peer || refsEqual(peer.ref, ref)) continue;
    upsert(edgeToConnection(edge, origin, peer, "outgoing"));
  }

  for (const edge of getEdgesTo(ref)) {
    const peer = getNode(edge.from);
    if (!peer || refsEqual(peer.ref, ref)) continue;
    upsert(edgeToConnection(edge, origin, peer, "incoming"));
  }

  return [...byPeer.values()];
}

function connectionScore(connection: ThreadConnection): number {
  return (
    connection.weight +
    (connection.explicitRationale ? 14 : 0) +
    (KIND_PRIORITY[connection.kind] ?? 0)
  );
}

/**
 * Choose 3–6 connections that read like an investigation, not a recommendation list.
 */
export function selectFollowLinks(connections: ThreadConnection[]): ThreadConnection[] {
  if (connections.length === 0) return [];
  if (connections.length <= FOLLOW_MAX) {
    return [...connections].sort((a, b) => connectionScore(b) - connectionScore(a));
  }

  const sorted = [...connections].sort((a, b) => connectionScore(b) - connectionScore(a));
  const selected: ThreadConnection[] = [];
  const seenKinds = new Set<string>();
  const seenPeerKinds = new Set<string>();

  for (const connection of sorted) {
    if (selected.length >= FOLLOW_MAX) break;
    const peerKind = connection.node.ref.kind;
    const kindSeen = seenKinds.has(connection.kind);
    const peerKindSeen = seenPeerKinds.has(peerKind);

    if (
      selected.length < FOLLOW_MIN ||
      !kindSeen ||
      !peerKindSeen ||
      connection.explicitRationale
    ) {
      selected.push(connection);
      seenKinds.add(connection.kind);
      seenPeerKinds.add(peerKind);
    }
  }

  for (const connection of sorted) {
    if (selected.length >= FOLLOW_MIN) break;
    if (!selected.includes(connection)) selected.push(connection);
  }

  for (const connection of sorted) {
    if (selected.length >= FOLLOW_MAX) break;
    if (!selected.includes(connection)) selected.push(connection);
  }

  return selected
    .sort((a, b) => connectionScore(b) - connectionScore(a))
    .slice(0, FOLLOW_MAX);
}

/**
 * Resolve the full thread view for any node — the single relationship engine entry point.
 */
export function resolveThread(ref: NodeRef): ThreadView | null {
  const resolved = getNode(ref);
  if (!resolved) return null;

  const all = collectConnections(ref, resolved);
  const incoming = all
    .filter((c) => c.direction === "incoming")
    .sort((a, b) => connectionScore(b) - connectionScore(a));
  const outgoing = all
    .filter((c) => c.direction === "outgoing")
    .sort((a, b) => connectionScore(b) - connectionScore(a));

  return {
    node: buildThreadNode(ref, resolved),
    incoming,
    outgoing,
    followLinks: selectFollowLinks(all),
  };
}

export function hasThreadLinks(ref: NodeRef): boolean {
  const view = resolveThread(ref);
  return Boolean(view && view.followLinks.length > 0);
}
