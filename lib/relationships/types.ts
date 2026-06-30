/**
 * Living Terrain — relationship engine types.
 * Every node in the intellectual graph; every edge is a thread between ideas.
 */

import type { ContentKind, ContentRef } from "../content/types";

export type NodeKind = ContentKind;
export type NodeRef = ContentRef;

/** How two nodes relate — drives organic phrasing in the UI */
export type EdgeKind =
  | "parent"
  | "child"
  | "pathway"
  | "thread"
  | "echo"
  | "volume"
  | "observation"
  | "quotation"
  | "theme"
  | "chamber";

export type EdgeSource = "explicit" | "inferred" | "inverse";

export interface RelationshipEdge {
  from: NodeRef;
  to: NodeRef;
  kind: EdgeKind;
  weight: number;
  source: EdgeSource;
  rationale?: string;
  quote?: string;
}

/** Human-readable strength derived from edge weight (1–10) */
export type RelationshipStrength = "whisper" | "thread" | "woven" | "root";

export interface ThreadConnection {
  node: ResolvedNode;
  direction: "incoming" | "outgoing";
  kind: EdgeKind;
  weight: number;
  strength: RelationshipStrength;
  rationale: string;
  quote?: string;
  explicitRationale: boolean;
}

export interface ThreadNode {
  ref: NodeRef;
  title: string;
  type: NodeKind;
  typeLabel: string;
  description: string;
  relatedConcepts: string[];
  href: string;
}

export interface ThreadView {
  node: ThreadNode;
  incoming: ThreadConnection[];
  outgoing: ThreadConnection[];
  /** Curated 3–6 links for the Follow the Thread section */
  followLinks: ThreadConnection[];
}

export interface ResolvedNode {
  ref: NodeRef;
  title: string;
  subtitle?: string;
  excerpt?: string;
  href: string;
  external?: boolean;
  themes: string[];
}

export interface RelationshipGroup {
  id: string;
  kind: EdgeKind;
  phrase: string;
  nodes: ResolvedNode[];
}

export interface RelationshipBundle {
  origin: ResolvedNode;
  heading: string;
  groups: RelationshipGroup[];
  peerRefs: NodeRef[];
}

export function nodeKey(ref: NodeRef): string {
  return `${ref.kind}:${ref.id}`;
}

export function parseNodeKey(key: string): NodeRef | null {
  const idx = key.indexOf(":");
  if (idx === -1) return null;
  return {
    kind: key.slice(0, idx) as NodeKind,
    id: key.slice(idx + 1),
  };
}

export function refsEqual(a: NodeRef, b: NodeRef): boolean {
  return a.kind === b.kind && a.id === b.id;
}
