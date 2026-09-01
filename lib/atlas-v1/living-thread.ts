/**
 * Atlas Living Thread — session path of intentional attention.
 *
 * sessionStorage only. No accounts, cookies, or server writes.
 * Does not invent canonical relations.
 */

import {
  getConcept,
  getEssay,
  type AtlasV1ConceptId,
  type AtlasV1EssayId,
  type AtlasV1QuestionId,
} from "@/lib/atlas-v1/content";
import { VOID_QUESTIONS } from "@/lib/atlas-v1/questions";
import {
  getRootTerritory,
  type RootTerritoryId,
} from "@/lib/atlas/architecture";

export const LIVING_THREAD_KEY = "lt-atlas-living-thread";
export const LIVING_THREAD_EVENT = "living-terrain:atlas-thread";

export type ThreadPointKind =
  | "territory"
  | "question"
  | "concept"
  | "evidence"
  | "source";

export type ThreadPoint = {
  kind: ThreadPointKind;
  id: string;
  /** Snapshot for source works (and any id without a local atlas label) */
  label?: string;
  at: number;
};

export type ThreadRelationEdge = {
  from: string;
  to: string;
  type: string;
};

export type LivingThreadState = {
  points: ThreadPoint[];
};

function emptyState(): LivingThreadState {
  return { points: [] };
}

export function loadLivingThread(): LivingThreadState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = sessionStorage.getItem(LIVING_THREAD_KEY);
    if (!raw) return emptyState();
    const data = JSON.parse(raw) as LivingThreadState;
    if (!Array.isArray(data.points)) return emptyState();
    return {
      points: data.points.filter(
        (p) =>
          p &&
          typeof p.id === "string" &&
          typeof p.kind === "string" &&
          typeof p.at === "number",
      ),
    };
  } catch {
    return emptyState();
  }
}

function saveLivingThread(state: LivingThreadState): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(LIVING_THREAD_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(LIVING_THREAD_EVENT));
  } catch {
    /* storage unavailable */
  }
}

/**
 * Append an intentional enter. Consecutive duplicate (same kind+id) is ignored
 * so React re-entries do not inflate the path; non-consecutive revisits remain.
 */
export function appendThreadPoint(
  point: Omit<ThreadPoint, "at"> & { at?: number },
): LivingThreadState {
  const state = loadLivingThread();
  const last = state.points[state.points.length - 1];
  if (last && last.kind === point.kind && last.id === point.id) {
    return state;
  }
  const next: LivingThreadState = {
    points: [
      ...state.points,
      {
        kind: point.kind,
        id: point.id,
        label: point.label,
        at: point.at ?? Date.now(),
      },
    ],
  };
  saveLivingThread(next);
  return next;
}

export function clearLivingThread(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(LIVING_THREAD_KEY);
    window.dispatchEvent(new CustomEvent(LIVING_THREAD_EVENT));
  } catch {
    /* ignore */
  }
}

export function labelForThreadPoint(point: ThreadPoint): string {
  if (point.label?.trim()) return point.label.trim();
  switch (point.kind) {
    case "territory":
      try {
        return getRootTerritory(point.id as RootTerritoryId).label;
      } catch {
        return point.id;
      }
    case "question": {
      const q = VOID_QUESTIONS.find(
        (item) => item.id === (point.id as AtlasV1QuestionId),
      );
      return q?.text ?? point.id;
    }
    case "concept":
      try {
        return getConcept(point.id as AtlasV1ConceptId).name;
      } catch {
        return point.id;
      }
    case "evidence":
      try {
        return getEssay(point.id as AtlasV1EssayId).title;
      } catch {
        return point.id;
      }
    case "source":
      return point.id;
    default:
      return point.id;
  }
}

/**
 * Canonical edges among visited ids only — never invents links.
 * Sequential path edges are separate (see pathSegments).
 */
export function canonicalEdgesAmong(
  points: readonly ThreadPoint[],
  trusted: readonly ThreadRelationEdge[],
): ThreadRelationEdge[] {
  const visited = new Set(points.map((p) => p.id));
  const seen = new Set<string>();
  const out: ThreadRelationEdge[] = [];
  for (const edge of trusted) {
    if (!visited.has(edge.from) || !visited.has(edge.to)) continue;
    if (edge.from === edge.to) continue;
    // undirected dedupe for overlay (relation may appear once either direction)
    const undirected = [edge.from, edge.to].sort().join("↔") + `:${edge.type}`;
    if (seen.has(undirected)) continue;
    seen.add(undirected);
    out.push(edge);
  }
  return out;
}

/** Thin navigation-order segments (consecutive path only). */
export function pathSegments(
  points: readonly ThreadPoint[],
): Array<{ from: string; to: string }> {
  const segments: Array<{ from: string; to: string }> = [];
  for (let i = 0; i < points.length - 1; i++) {
    segments.push({ from: points[i].id, to: points[i + 1].id });
  }
  return segments;
}
