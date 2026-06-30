import { getAtlas } from "@/lib/atlas";
import type {
  RealmNetworkEdge,
  RealmNetworkNode,
  RealmSlug,
  RealmThread,
  RealmTopic,
} from "./types";

interface LayoutInput {
  slug: RealmSlug;
  themeId: string;
  themeTitle: string;
  topics: RealmTopic[];
  threads: RealmThread[];
}

type HubItem = {
  id: string;
  label: string;
  whisper?: string;
  href?: string;
  kind: "topic" | "content";
};

function hubItems(topics: RealmTopic[], threads: RealmThread[]): HubItem[] {
  return [
    ...topics.map((t) => ({
      id: t.id,
      label: t.label,
      whisper: t.whisper,
      href: t.href,
      kind: "topic" as const,
    })),
    ...threads.map((t) => ({
      id: t.id,
      label: t.title,
      whisper: t.subtitle,
      href: t.href,
      kind: "content" as const,
    })),
  ];
}

function centerNode(
  themeId: string,
  themeTitle: string,
  x: number,
  y: number,
): RealmNetworkNode {
  return {
    id: themeId,
    label: themeTitle,
    kind: "center",
    x,
    y,
    connectedIds: [],
  };
}

function addAtlasEdges(
  items: HubItem[],
  edges: RealmNetworkEdge[],
  threads: RealmThread[],
): void {
  const atlas = getAtlas();
  for (const thread of threads) {
    for (const otherId of atlas.getConnectedIds(thread.id)) {
      if (!items.some((it) => it.id === otherId) || otherId === thread.id) continue;
      const key = [thread.id, otherId].sort().join("--");
      if (!edges.some((e) => [e.from, e.to].sort().join("--") === key)) {
        edges.push({ from: thread.id, to: otherId });
      }
    }
  }
}

function hash01(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return (Math.abs(h) % 1000) / 1000;
}

/** Relationship — radial web where every node influences every other */
function layoutRelationship(input: LayoutInput) {
  const items = hubItems(input.topics, input.threads);
  const nodes: RealmNetworkNode[] = [
    centerNode(input.themeId, input.themeTitle, 0.5, 0.5),
  ];
  const edges: RealmNetworkEdge[] = [];
  const count = Math.max(items.length, 1);

  items.forEach((item, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const radius = item.kind === "content" ? 0.38 : 0.28;
    nodes.push({
      id: item.id,
      label: item.label,
      whisper: item.whisper,
      href: item.href,
      x: 0.5 + Math.cos(angle) * radius,
      y: 0.5 + Math.sin(angle) * radius,
      kind: item.kind,
      connectedIds: [input.themeId],
      ring: item.kind === "topic" ? 1 : 2,
    });
    edges.push({ from: input.themeId, to: item.id });
  });

  // Full mesh — relational influence between all nodes
  const ids = nodes.map((n) => n.id);
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      edges.push({ from: ids[i], to: ids[j] });
    }
  }

  addAtlasEdges(items, edges, input.threads);
  return { nodes, edges };
}

/** Identity — concentric layers around a stable center */
function layoutIdentity(input: LayoutInput) {
  const items = hubItems(input.topics, input.threads);
  const nodes: RealmNetworkNode[] = [
    centerNode(input.themeId, input.themeTitle, 0.5, 0.5),
  ];
  const edges: RealmNetworkEdge[] = [];
  const topics = items.filter((i) => i.kind === "topic");
  const content = items.filter((i) => i.kind === "content");

  topics.forEach((item, i) => {
    const angle = (i / Math.max(topics.length, 1)) * Math.PI * 2 - Math.PI / 2;
    const r = 0.2;
    nodes.push({
      id: item.id,
      label: item.label,
      whisper: item.whisper,
      href: item.href,
      x: 0.5 + Math.cos(angle) * r,
      y: 0.5 + Math.sin(angle) * r,
      kind: "topic",
      connectedIds: [input.themeId],
      ring: 1,
    });
    edges.push({ from: input.themeId, to: item.id });
  });

  content.forEach((item, i) => {
    const angle = (i / Math.max(content.length, 1)) * Math.PI * 2;
    const r = 0.34;
    nodes.push({
      id: item.id,
      label: item.label,
      whisper: item.whisper,
      href: item.href,
      x: 0.5 + Math.cos(angle) * r,
      y: 0.5 + Math.sin(angle) * r,
      kind: "content",
      connectedIds: [input.themeId],
      ring: 2,
    });
    edges.push({ from: input.themeId, to: item.id });
    const parent = topics[i % Math.max(topics.length, 1)];
    if (parent) edges.push({ from: parent.id, to: item.id });
  });

  addAtlasEdges(items, edges, input.threads);
  return { nodes, edges };
}

/** Meaning — scattered constellation with latent connections */
function layoutMeaning(input: LayoutInput) {
  const items = hubItems(input.topics, input.threads);
  const nodes: RealmNetworkNode[] = [
    centerNode(input.themeId, input.themeTitle, 0.5, 0.48),
  ];
  const edges: RealmNetworkEdge[] = [];

  items.forEach((item, i) => {
    const hx = hash01(item.id + "x");
    const hy = hash01(item.id + "y");
    const x = 0.14 + hx * 0.72;
    const y = 0.12 + hy * 0.76;
    nodes.push({
      id: item.id,
      label: item.label,
      whisper: item.whisper,
      href: item.href,
      x,
      y,
      kind: item.kind,
      connectedIds: [input.themeId],
      ring: item.kind === "topic" ? 1 : 2,
    });
    // Latent edges — not all visible until hover
    if (i % 3 === 0) edges.push({ from: input.themeId, to: item.id });
  });

  for (let i = 0; i < items.length; i++) {
    const a = items[i];
    const b = items[(i + 2) % items.length];
    if (a && b) edges.push({ from: a.id, to: b.id });
  }

  addAtlasEdges(items, edges, input.threads);
  return { nodes, edges };
}

/** Reality — nested systems: topics contain content clusters */
function layoutReality(input: LayoutInput) {
  const items = hubItems(input.topics, input.threads);
  const nodes: RealmNetworkNode[] = [
    centerNode(input.themeId, input.themeTitle, 0.5, 0.5),
  ];
  const edges: RealmNetworkEdge[] = [];
  const topics = input.topics;
  const threads = input.threads;

  topics.forEach((topic, i) => {
    const angle = (i / Math.max(topics.length, 1)) * Math.PI * 2 - Math.PI / 2;
    const tx = 0.5 + Math.cos(angle) * 0.26;
    const ty = 0.5 + Math.sin(angle) * 0.26;
    nodes.push({
      id: topic.id,
      label: topic.label,
      whisper: topic.whisper,
      href: topic.href,
      x: tx,
      y: ty,
      kind: "topic",
      connectedIds: [input.themeId],
      ring: 1,
      layer: 1,
    });
    edges.push({ from: input.themeId, to: topic.id });

    const cluster = threads.filter((_, j) => j % topics.length === i).slice(0, 2);
    cluster.forEach((thread, j) => {
      const innerAngle = angle + (j === 0 ? -0.35 : 0.35);
      const r = 0.12;
      nodes.push({
        id: thread.id,
        label: thread.title,
        whisper: thread.subtitle,
        href: thread.href,
        x: tx + Math.cos(innerAngle) * r,
        y: ty + Math.sin(innerAngle) * r,
        kind: "content",
        connectedIds: [topic.id],
        ring: 2,
        layer: 2,
      });
      edges.push({ from: topic.id, to: thread.id });
    });
  });

  const placed = new Set(nodes.map((n) => n.id));
  threads
    .filter((t) => !placed.has(t.id))
    .forEach((thread, i) => {
      const angle = (i / Math.max(threads.length, 1)) * Math.PI * 2;
      nodes.push({
        id: thread.id,
        label: thread.title,
        whisper: thread.subtitle,
        href: thread.href,
        x: 0.5 + Math.cos(angle) * 0.42,
        y: 0.5 + Math.sin(angle) * 0.42,
        kind: "content",
        connectedIds: [input.themeId],
        ring: 2,
        layer: 2,
      });
      edges.push({ from: input.themeId, to: thread.id });
    });

  addAtlasEdges(items, edges, input.threads);
  return { nodes, edges };
}

/** Time — vertical spine with branching memories */
function layoutTime(input: LayoutInput) {
  const items = hubItems(input.topics, input.threads);
  const nodes: RealmNetworkNode[] = [
    centerNode(input.themeId, input.themeTitle, 0.5, 0.06),
  ];
  const edges: RealmNetworkEdge[] = [];
  const topics = items.filter((i) => i.kind === "topic");
  const content = items.filter((i) => i.kind === "content");

  topics.forEach((item, i) => {
    const y = 0.14 + (i / Math.max(topics.length, 1)) * 0.72;
    const x = i % 2 === 0 ? 0.38 : 0.62;
    nodes.push({
      id: item.id,
      label: item.label,
      whisper: item.whisper,
      href: item.href,
      x,
      y,
      kind: "topic",
      connectedIds: [input.themeId],
      branch: i % 2 === 0 ? "left" : "right",
      ring: i + 1,
    });
    edges.push({ from: input.themeId, to: item.id });
    edges.push({ from: input.themeId, to: item.id }); // spine link visual
  });

  content.forEach((item, i) => {
    const parent = topics[i % Math.max(topics.length, 1)];
    const py = parent ? nodes.find((n) => n.id === parent.id)?.y ?? 0.5 : 0.5;
    const side = i % 2 === 0 ? "left" : "right";
    const x = side === "left" ? 0.18 + hash01(item.id) * 0.12 : 0.7 + hash01(item.id) * 0.12;
    nodes.push({
      id: item.id,
      label: item.label,
      whisper: item.whisper,
      href: item.href,
      x,
      y: py + 0.06 + hash01(item.id + "y") * 0.08,
      kind: "content",
      connectedIds: parent ? [parent.id] : [input.themeId],
      branch: side,
      ring: (topics.length || 0) + i + 1,
    });
    if (parent) edges.push({ from: parent.id, to: item.id });
    else edges.push({ from: input.themeId, to: item.id });
  });

  addAtlasEdges(items, edges, input.threads);
  return { nodes, edges };
}

/** Language — branching rivers flowing downward */
function layoutLanguage(input: LayoutInput) {
  const items = hubItems(input.topics, input.threads);
  const nodes: RealmNetworkNode[] = [
    centerNode(input.themeId, input.themeTitle, 0.5, 0.08),
  ];
  const edges: RealmNetworkEdge[] = [];
  const topics = items.filter((i) => i.kind === "topic");
  const content = items.filter((i) => i.kind === "content");

  const forkYs = [0.28, 0.48, 0.68, 0.86];
  topics.forEach((item, i) => {
    const fork = forkYs[i % forkYs.length];
    const side = i % 2 === 0 ? "left" : "right";
    const x = side === "left" ? 0.28 - i * 0.04 : 0.72 + i * 0.04;
    nodes.push({
      id: item.id,
      label: item.label,
      whisper: item.whisper,
      href: item.href,
      x: Math.max(0.12, Math.min(0.88, x)),
      y: fork,
      kind: "topic",
      connectedIds: [input.themeId],
      branch: side,
      ring: i + 1,
    });
    edges.push({ from: input.themeId, to: item.id });
  });

  content.forEach((item, i) => {
    const parentIdx = i % Math.max(topics.length, 1);
    const parent = topics[parentIdx];
    const side = parentIdx % 2 === 0 ? "left" : "right";
    const px = parent ? nodes.find((n) => n.id === parent.id)?.x ?? 0.5 : 0.5;
    const py = parent ? nodes.find((n) => n.id === parent.id)?.y ?? 0.5 : 0.5;
    nodes.push({
      id: item.id,
      label: item.label,
      whisper: item.whisper,
      href: item.href,
      x: side === "left" ? px - 0.1 : px + 0.1,
      y: Math.min(0.92, py + 0.14 + hash01(item.id) * 0.06),
      kind: "content",
      connectedIds: parent ? [parent.id] : [input.themeId],
      branch: side,
      ring: topics.length + i + 1,
    });
    if (parent) edges.push({ from: parent.id, to: item.id });
  });

  addAtlasEdges(items, edges, input.threads);
  return { nodes, edges };
}

/** Embodiment — organic upward growth from a root */
function layoutEmbodiment(input: LayoutInput) {
  const items = hubItems(input.topics, input.threads);
  const nodes: RealmNetworkNode[] = [
    centerNode(input.themeId, input.themeTitle, 0.5, 0.9),
  ];
  const edges: RealmNetworkEdge[] = [];
  const topics = items.filter((i) => i.kind === "topic");
  const content = items.filter((i) => i.kind === "content");

  topics.forEach((item, i) => {
    const spread = (i - (topics.length - 1) / 2) * 0.14;
    const y = 0.72 - i * 0.1;
    nodes.push({
      id: item.id,
      label: item.label,
      whisper: item.whisper,
      href: item.href,
      x: 0.5 + spread,
      y,
      kind: "topic",
      connectedIds: [input.themeId],
      ring: 1,
      layer: 1,
    });
    edges.push({ from: input.themeId, to: item.id });
  });

  content.forEach((item, i) => {
    const parent = topics[i % Math.max(topics.length, 1)];
    const px = parent ? nodes.find((n) => n.id === parent.id)?.x ?? 0.5 : 0.5;
    const py = parent ? nodes.find((n) => n.id === parent.id)?.y ?? 0.7 : 0.7;
    const twig = (hash01(item.id) - 0.5) * 0.2;
    nodes.push({
      id: item.id,
      label: item.label,
      whisper: item.whisper,
      href: item.href,
      x: px + twig,
      y: py - 0.08 - hash01(item.id + "u") * 0.12,
      kind: "content",
      connectedIds: parent ? [parent.id] : [input.themeId],
      ring: 2,
      layer: 2,
    });
    if (parent) edges.push({ from: parent.id, to: item.id });
  });

  addAtlasEdges(items, edges, input.threads);
  return { nodes, edges };
}

/** Freedom — open horizontal paths; constraint zone uses geometric grid */
function layoutFreedom(input: LayoutInput) {
  const items = hubItems(input.topics, input.threads);
  const nodes: RealmNetworkNode[] = [
    centerNode(input.themeId, input.themeTitle, 0.14, 0.5),
  ];
  const edges: RealmNetworkEdge[] = [];
  const constraintTopics = ["constraint", "structure", "discernment"];
  const topics = items.filter((i) => i.kind === "topic");
  const content = items.filter((i) => i.kind === "content");

  topics.forEach((item, i) => {
    const isConstraint = constraintTopics.some((k) => item.id.includes(k));
    if (isConstraint) {
      const row = Math.floor(i / 2);
      const col = i % 2;
      nodes.push({
        id: item.id,
        label: item.label,
        whisper: item.whisper,
        href: item.href,
        x: 0.22 + col * 0.1,
        y: 0.28 + row * 0.14,
        kind: "topic",
        connectedIds: [input.themeId],
        ring: 1,
        layer: 0,
        branch: "left",
      });
    } else {
      const y = 0.22 + (i / Math.max(topics.length, 1)) * 0.56;
      nodes.push({
        id: item.id,
        label: item.label,
        whisper: item.whisper,
        href: item.href,
        x: 0.42 + (i % 3) * 0.18,
        y,
        kind: "topic",
        connectedIds: [input.themeId],
        ring: 1,
        layer: 1,
        branch: "right",
      });
    }
    edges.push({ from: input.themeId, to: item.id });
  });

  content.forEach((item, i) => {
    const x = 0.58 + (i % 4) * 0.1;
    const y = 0.18 + (i / Math.max(content.length, 1)) * 0.64;
    nodes.push({
      id: item.id,
      label: item.label,
      whisper: item.whisper,
      href: item.href,
      x,
      y,
      kind: "content",
      connectedIds: [input.themeId],
      ring: 2,
      layer: 2,
      branch: "right",
    });
    edges.push({ from: input.themeId, to: item.id });
  });

  addAtlasEdges(items, edges, input.threads);
  return { nodes, edges };
}

/** Consciousness — overlapping spheres of influence */
function layoutConsciousness(input: LayoutInput) {
  const items = hubItems(input.topics, input.threads);
  const spheres = [
    { cx: 0.36, cy: 0.44, r: 0.2 },
    { cx: 0.6, cy: 0.4, r: 0.18 },
    { cx: 0.48, cy: 0.58, r: 0.16 },
  ];
  const nodes: RealmNetworkNode[] = [
    centerNode(input.themeId, input.themeTitle, 0.48, 0.48),
  ];
  const edges: RealmNetworkEdge[] = [];

  items.forEach((item, i) => {
    const sphere = spheres[i % spheres.length];
    const angle = (i / Math.max(items.length, 1)) * Math.PI * 2;
    const r = item.kind === "topic" ? sphere.r * 0.85 : sphere.r * 1.15;
    nodes.push({
      id: item.id,
      label: item.label,
      whisper: item.whisper,
      href: item.href,
      x: sphere.cx + Math.cos(angle) * r,
      y: sphere.cy + Math.sin(angle) * r,
      kind: item.kind,
      connectedIds: [input.themeId],
      ring: (i % 3) + 1,
      layer: i % 3,
    });
    edges.push({ from: input.themeId, to: item.id });
    if (i > 0) {
      const prev = items[i - 1];
      edges.push({ from: prev.id, to: item.id });
    }
  });

  addAtlasEdges(items, edges, input.threads);
  return { nodes, edges };
}

const BUILDERS: Record<
  RealmSlug,
  (input: LayoutInput) => { nodes: RealmNetworkNode[]; edges: RealmNetworkEdge[] }
> = {
  reality: layoutReality,
  relationship: layoutRelationship,
  meaning: layoutMeaning,
  identity: layoutIdentity,
  language: layoutLanguage,
  time: layoutTime,
  embodiment: layoutEmbodiment,
  freedom: layoutFreedom,
  consciousness: layoutConsciousness,
};

export function buildRealmLayout(input: LayoutInput): {
  nodes: RealmNetworkNode[];
  edges: RealmNetworkEdge[];
} {
  return BUILDERS[input.slug](input);
}
