import { getAtlas } from "@/lib/atlas";
import { getThemeById } from "@/lib/content";
import type { RealmThread, RealmTopic, ThemeHub } from "./types";

export type ProgressiveTier =
  | "center"
  | "primary"
  | "relationship"
  | "essay"
  | "question";

export interface ProgressiveNode {
  id: string;
  label: string;
  whisper?: string;
  href?: string;
  tier: ProgressiveTier;
  parentId?: string;
  primaryId?: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
}

export interface ProgressiveEdge {
  from: string;
  to: string;
  tier: "spoke" | "branch";
}

export interface ProgressiveEcosystem {
  nodes: ProgressiveNode[];
  edges: ProgressiveEdge[];
  center: ProgressiveNode;
  primaries: ProgressiveNode[];
  relationshipsByPrimary: Map<string, ProgressiveNode[]>;
  essaysByRelationship: Map<string, ProgressiveNode[]>;
  questionsByEssay: Map<string, ProgressiveNode[]>;
}

export interface DisclosureState {
  primaryId: string | null;
  relationshipId: string | null;
  essayId: string | null;
}

const ORBIT_RADIUS = 0.24;
const LAYER_RADIUS = {
  relationship: 0.11,
  essay: 0.085,
  question: 0.065,
} as const;

const CAP = {
  primary: 5,
  relationship: 3,
  essay: 2,
  question: 2,
} as const;

const RADIUS: Record<ProgressiveTier, number> = {
  center: 0.038,
  primary: 0.024,
  relationship: 0.017,
  essay: 0.014,
  question: 0.012,
};

interface ContentRef {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  kind: RealmThread["kind"] | "peer" | "subconcept";
}

function haystack(ref: ContentRef): string {
  return `${ref.id} ${ref.title} ${ref.subtitle ?? ""}`.toLowerCase();
}

function scoreKeywords(text: string, keys: string[]): number {
  const hay = text.toLowerCase();
  return keys.reduce((n, k) => n + (hay.includes(k.toLowerCase()) ? 1 : 0), 0);
}

function assignPrimary(ref: ContentRef, topics: RealmTopic[]): string {
  let best = topics[0]?.id ?? "primary";
  let bestScore = -1;

  for (const topic of topics) {
    const keys = [
      topic.id,
      ...topic.label.split(/\s+/),
      ...(topic.whisper?.split(/\s+/) ?? []),
    ];
    const score = scoreKeywords(haystack(ref), keys);
    if (score > bestScore) {
      bestScore = score;
      best = topic.id;
    }
  }

  if (bestScore === 0) {
    const idx = ref.id.charCodeAt(0) % topics.length;
    best = topics[idx]?.id ?? best;
  }

  return best;
}

function branchTargets(
  parent: { x: number; y: number; angle: number },
  count: number,
  radius: number,
): Array<{ x: number; y: number }> {
  const spread = Math.min(0.9, 0.3 * Math.max(count - 1, 1));
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0 : (i / (count - 1) - 0.5) * spread;
    const a = parent.angle + t;
    return {
      x: parent.x + Math.cos(a) * radius,
      y: parent.y + Math.sin(a) * radius,
    };
  });
}

function spawnNearParent(
  parent: ProgressiveNode,
  target: { x: number; y: number },
  blend = 0.35,
): { x: number; y: number } {
  return {
    x: parent.x + (target.x - parent.x) * blend,
    y: parent.y + (target.y - parent.y) * blend,
  };
}

function makeNode(
  partial: Omit<ProgressiveNode, "radius"> & { tier: ProgressiveTier },
): ProgressiveNode {
  return { ...partial, radius: RADIUS[partial.tier] };
}

function collectRelationshipPool(hub: ThemeHub): ContentRef[] {
  const pool: ContentRef[] = [];
  const seen = new Set<string>();

  for (const sc of hub.subConcepts) {
    if (seen.has(sc.id)) continue;
    seen.add(sc.id);
    pool.push({
      id: sc.id,
      title: sc.title,
      subtitle: sc.description,
      href: `/themes/${sc.slug}`,
      kind: "subconcept",
    });
  }

  for (const thread of hub.threads) {
    if (thread.kind !== "concept" || seen.has(thread.id)) continue;
    seen.add(thread.id);
    pool.push({
      id: thread.id,
      title: thread.title,
      subtitle: thread.subtitle,
      href: thread.href,
      kind: "concept",
    });
  }

  for (const peerId of hub.peerIds) {
    const theme = getThemeById(peerId);
    if (!theme || seen.has(theme.id)) continue;
    seen.add(theme.id);
    pool.push({
      id: theme.id,
      title: theme.title,
      subtitle: theme.description,
      href: `/themes/${theme.slug}`,
      kind: "peer",
    });
  }

  for (const thread of hub.threads) {
    if (
      thread.kind === "quotation" ||
      thread.kind === "field-note" ||
      thread.kind === "book"
    ) {
      if (seen.has(thread.id)) continue;
      seen.add(thread.id);
      pool.push({
        id: thread.id,
        title: thread.title,
        subtitle: thread.subtitle,
        href: thread.href,
        kind: thread.kind,
      });
    }
  }

  return pool;
}

function collectEssayPool(hub: ThemeHub): ContentRef[] {
  return hub.threads
    .filter((t) => t.kind === "essay" || t.kind === "book" || t.kind === "field-note")
    .map((t) => ({
      id: t.id,
      title: t.title,
      subtitle: t.subtitle,
      href: t.href,
      kind: t.kind,
    }));
}

function collectQuestionPool(hub: ThemeHub): ContentRef[] {
  return hub.threads
    .filter((t) => t.kind === "question")
    .map((t) => ({
      id: t.id,
      title: t.title,
      subtitle: t.subtitle,
      href: t.href,
      kind: t.kind as "question",
    }));
}

function assignToParent<T extends ContentRef>(
  items: T[],
  parent: ProgressiveNode,
  cap: number,
  atlasBoost?: (item: T) => number,
): T[] {
  const ranked = [...items].sort((a, b) => {
    const scoreA =
      scoreKeywords(haystack(a), [parent.label, parent.id]) + (atlasBoost?.(a) ?? 0);
    const scoreB =
      scoreKeywords(haystack(b), [parent.label, parent.id]) + (atlasBoost?.(b) ?? 0);
    return scoreB - scoreA;
  });
  return ranked.slice(0, cap);
}

export function buildProgressiveEcosystem(hub: ThemeHub): ProgressiveEcosystem {
  const cx = 0.5;
  const cy = 0.5;
  const topics = hub.topics.slice(0, CAP.primary);
  const count = Math.max(topics.length, 1);

  const center = makeNode({
    id: hub.config.themeId,
    label: hub.theme.title,
    whisper: hub.whisper,
    tier: "center",
    x: cx,
    y: cy,
    targetX: cx,
    targetY: cy,
  });

  const primaries: ProgressiveNode[] = topics.map((topic, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * ORBIT_RADIUS;
    const y = cy + Math.sin(angle) * ORBIT_RADIUS;
    return makeNode({
      id: topic.id,
      label: topic.label,
      whisper: topic.whisper,
      href: topic.href,
      tier: "primary",
      x,
      y,
      targetX: x,
      targetY: y,
    });
  });

  const primaryById = new Map(primaries.map((p) => [p.id, p]));
  const relationshipPool = collectRelationshipPool(hub);
  const essayPool = collectEssayPool(hub);
  const questionPool = collectQuestionPool(hub);
  const atlas = getAtlas();

  const relBuckets = new Map<string, ContentRef[]>();
  for (const t of topics) relBuckets.set(t.id, []);

  for (const ref of relationshipPool) {
    const pid = assignPrimary(ref, topics);
    const list = relBuckets.get(pid) ?? [];
    if (list.length < CAP.relationship) {
      list.push(ref);
      relBuckets.set(pid, list);
    }
  }

  const relationshipsByPrimary = new Map<string, ProgressiveNode[]>();
  const allRelationships: ProgressiveNode[] = [];

  for (const primary of primaries) {
    const refs = relBuckets.get(primary.id) ?? [];
    const angle = Math.atan2(primary.y - cy, primary.x - cx);
    const targets = branchTargets(
      { x: primary.x, y: primary.y, angle },
      refs.length,
      LAYER_RADIUS.relationship,
    );

    const nodes = refs.map((ref, i) => {
      const t = targets[i] ?? { x: primary.x, y: primary.y };
      const spawn = spawnNearParent(primary, t);
      return makeNode({
        id: ref.id,
        label: ref.title,
        whisper: ref.subtitle,
        href: ref.href,
        tier: "relationship",
        parentId: primary.id,
        primaryId: primary.id,
        x: spawn.x,
        y: spawn.y,
        targetX: t.x,
        targetY: t.y,
      });
    });

    relationshipsByPrimary.set(primary.id, nodes);
    allRelationships.push(...nodes);
  }

  const essaysByRelationship = new Map<string, ProgressiveNode[]>();
  const allEssays: ProgressiveNode[] = [];

  for (const rel of allRelationships) {
    const parent = primaryById.get(rel.primaryId ?? "") ?? center;
    const assigned = assignToParent(essayPool, rel, CAP.essay, (item) => {
      const connected = atlas.getConnectedIds(rel.id, undefined, "both");
      return connected.includes(item.id) ? 3 : 0;
    });

    if (assigned.length === 0) {
      const fallback = assignToParent(essayPool, parent, CAP.essay);
      assigned.push(...fallback);
    }

    const angle = Math.atan2(rel.y - parent.y, rel.x - parent.x);
    const targets = branchTargets(
      { x: rel.x, y: rel.y, angle },
      assigned.length,
      LAYER_RADIUS.essay,
    );

    const nodes = assigned.map((ref, i) => {
      const t = targets[i] ?? { x: rel.x, y: rel.y };
      const spawn = spawnNearParent(rel, t, 0.4);
      return makeNode({
        id: `${rel.id}::${ref.id}`,
        label: ref.title,
        whisper: ref.subtitle,
        href: ref.href,
        tier: "essay",
        parentId: rel.id,
        primaryId: rel.primaryId,
        x: spawn.x,
        y: spawn.y,
        targetX: t.x,
        targetY: t.y,
      });
    });

    essaysByRelationship.set(rel.id, nodes);
    allEssays.push(...nodes);
  }

  const questionsByEssay = new Map<string, ProgressiveNode[]>();
  const allQuestions: ProgressiveNode[] = [];

  for (const essay of allEssays) {
    const contentId = essay.id.split("::")[1] ?? essay.id;
    const assigned = assignToParent(questionPool, essay, CAP.question, (item) => {
      const connected = atlas.getConnectedIds(contentId, undefined, "both");
      return connected.includes(item.id) ? 3 : 0;
    });

    const rel = allRelationships.find((r) => r.id === essay.parentId) ?? center;
    const angle = Math.atan2(essay.y - rel.y, essay.x - rel.x);
    const targets = branchTargets(
      { x: essay.x, y: essay.y, angle },
      assigned.length,
      LAYER_RADIUS.question,
    );

    const nodes = assigned.map((ref, i) => {
      const t = targets[i] ?? { x: essay.x, y: essay.y };
      const spawn = spawnNearParent(essay, t, 0.45);
      return makeNode({
        id: `${essay.id}::${ref.id}`,
        label: ref.title,
        whisper: ref.subtitle,
        href: ref.href,
        tier: "question",
        parentId: essay.id,
        primaryId: essay.primaryId,
        x: spawn.x,
        y: spawn.y,
        targetX: t.x,
        targetY: t.y,
      });
    });

    questionsByEssay.set(essay.id, nodes);
    allQuestions.push(...nodes);
  }

  const edges: ProgressiveEdge[] = [
    ...primaries.map((p) => ({
      from: center.id,
      to: p.id,
      tier: "spoke" as const,
    })),
    ...allRelationships.map((r) => ({
      from: r.parentId!,
      to: r.id,
      tier: "branch" as const,
    })),
    ...allEssays.map((e) => ({
      from: e.parentId!,
      to: e.id,
      tier: "branch" as const,
    })),
    ...allQuestions.map((q) => ({
      from: q.parentId!,
      to: q.id,
      tier: "branch" as const,
    })),
  ];

  return {
    nodes: [center, ...primaries, ...allRelationships, ...allEssays, ...allQuestions],
    edges,
    center,
    primaries,
    relationshipsByPrimary,
    essaysByRelationship,
    questionsByEssay,
  };
}

export function emptyDisclosure(): DisclosureState {
  return { primaryId: null, relationshipId: null, essayId: null };
}

export function visibleProgressiveNodes(
  eco: ProgressiveEcosystem,
  state: DisclosureState,
): ProgressiveNode[] {
  const visible: ProgressiveNode[] = [eco.center, ...eco.primaries];

  if (!state.primaryId) return visible;

  const relationships = eco.relationshipsByPrimary.get(state.primaryId) ?? [];
  visible.push(...relationships);

  if (!state.relationshipId) return visible;

  const essays = eco.essaysByRelationship.get(state.relationshipId) ?? [];
  visible.push(...essays);

  if (!state.essayId) return visible;

  const questions = eco.questionsByEssay.get(state.essayId) ?? [];
  visible.push(...questions);

  return visible;
}

export function disclosureDepth(state: DisclosureState): number {
  if (state.essayId) return 3;
  if (state.relationshipId) return 2;
  if (state.primaryId) return 1;
  return 0;
}

export function nearbyPrimaryIds(
  eco: ProgressiveEcosystem,
  primaryId: string,
): string[] {
  const idx = eco.primaries.findIndex((p) => p.id === primaryId);
  if (idx < 0) return [];
  const n = eco.primaries.length;
  return [
    eco.primaries[(idx - 1 + n) % n].id,
    eco.primaries[(idx + 1) % n].id,
  ];
}

export function guidanceForDepth(depth: number, hovered: boolean): string {
  if (depth >= 3) {
    return "A question opens at the end of the path — follow it, or let the field settle.";
  }
  if (depth === 2) {
    return "An essay waits inside the connection. Touch it to find what asks back.";
  }
  if (depth === 1) {
    return "Relationships emerge — threads between ideas. Choose one to go deeper.";
  }
  if (hovered) {
    return "Nearby concepts gently illuminate.";
  }
  return "Begin at the center. Touch a concept to sense what connects.";
}

export function frameViewBox(
  nodes: Array<{ x: number; y: number; radius: number }>,
  padding = 0.1,
): { x: number; y: number; w: number; h: number } {
  if (nodes.length === 0) return { x: 0, y: 0, w: 1, h: 1 };

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const n of nodes) {
    const pad = n.radius + padding;
    minX = Math.min(minX, n.x - pad);
    minY = Math.min(minY, n.y - pad);
    maxX = Math.max(maxX, n.x + pad);
    maxY = Math.max(maxY, n.y + pad);
  }

  const w = Math.max(maxX - minX, 0.42);
  const h = Math.max(maxY - minY, 0.42);
  const size = Math.max(w, h);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  return {
    x: cx - size / 2,
    y: cy - size / 2,
    w: size,
    h: size,
  };
}

export function lerpViewBox(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
  t: number,
) {
  const ease = 1 - (1 - t) ** 4;
  return {
    x: a.x + (b.x - a.x) * ease,
    y: a.y + (b.y - a.y) * ease,
    w: a.w + (b.w - a.w) * ease,
    h: a.h + (b.h - a.h) * ease,
  };
}
