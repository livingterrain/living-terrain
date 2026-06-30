import { getEdgesFrom, getEdgesTo, getNode } from "@/lib/relationships/graph";
import type { EdgeKind, NodeRef } from "@/lib/relationships/types";
import { nodeKey, refsEqual } from "@/lib/relationships/types";

export interface DiscoveryCue {
  phrase: string;
  /** Constellation focus target — a connected idea, not always the current page */
  focusId: string;
  whisper?: string;
  kind: EdgeKind;
}

const KIND_PRIORITY: EdgeKind[] = [
  "echo",
  "thread",
  "pathway",
  "theme",
  "child",
  "observation",
  "quotation",
  "parent",
  "volume",
  "chamber",
];

const PHRASES: Partial<Record<EdgeKind, string[]>> = {
  echo: ["This idea echoes elsewhere.", "An echo returns from the map."],
  thread: ["Continue the thread.", "The thread still runs."],
  pathway: ["A neighboring path opens.", "Continue the thread."],
  theme: ["This idea echoes elsewhere.", "Unexpected connection."],
  child: ["Something opens from here.", "Unexpected connection."],
  observation: ["A field note carries this forward.", "Unexpected connection."],
  quotation: ["A voice returns from elsewhere.", "This idea echoes elsewhere."],
};

const FALLBACK = [
  "Unexpected connection.",
  "Something nearby resonates.",
  "A quiet link waits on the map.",
];

function seedFromRef(ref: NodeRef): number {
  return nodeKey(ref).split("").reduce((n, c) => n + c.charCodeAt(0), 0);
}

function phraseFor(kind: EdgeKind, seed: number): string {
  const pool = PHRASES[kind] ?? FALLBACK;
  return pool[seed % pool.length];
}

/** Choose one connected idea worth discovering — curiosity, not catalog */
export function pickDiscoveryCue(ref: NodeRef): DiscoveryCue | null {
  const candidates: Array<{
    kind: EdgeKind;
    id: string;
    title: string;
    weight: number;
  }> = [];

  for (const edge of [...getEdgesFrom(ref), ...getEdgesTo(ref)]) {
    const peer = refsEqual(edge.from, ref) ? edge.to : edge.from;
    if (refsEqual(peer, ref)) continue;
    const node = getNode(peer);
    if (!node) continue;

    const dup = candidates.find((c) => c.id === peer.id);
    if (dup) {
      dup.weight = Math.max(dup.weight, edge.weight ?? 3);
      continue;
    }

    candidates.push({
      kind: edge.kind,
      id: peer.id,
      title: node.title,
      weight: edge.weight ?? 3,
    });
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    const ra = KIND_PRIORITY.indexOf(a.kind);
    const rb = KIND_PRIORITY.indexOf(b.kind);
    const rankA = ra === -1 ? 99 : ra;
    const rankB = rb === -1 ? 99 : rb;
    if (rankA !== rankB) return rankA - rankB;
    return b.weight - a.weight;
  });

  const best = candidates[0];
  const seed = seedFromRef(ref);

  return {
    phrase: phraseFor(best.kind, seed),
    focusId: best.id,
    whisper: best.title,
    kind: best.kind,
  };
}

export function discoverySessionKey(ref: NodeRef): string {
  return `lt-discovery-${nodeKey(ref)}`;
}

export function hasSeenDiscovery(ref: NodeRef): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(discoverySessionKey(ref)) === "1";
  } catch {
    return false;
  }
}

export function markDiscoverySeen(ref: NodeRef): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(discoverySessionKey(ref), "1");
  } catch {
    /* ignore */
  }
}
