import type { AtlasConnection, AtlasEntry, AtlasStatus } from "../atlas/types";

/**
 * Minimal intake for a Medium essay — stable schema; do not add required fields.
 * Optional `overrides` let you curate inference without changing the workflow.
 */
export interface EssayIntake {
  title: string;
  mediumUrl: string;
  subtitle: string;
  /** ISO date YYYY-MM-DD */
  publishedAt: string;
  /** Path relative to intake file, or absolute path on disk */
  featuredImage?: string | null;
  status?: AtlasStatus;
  /** Signal-style digest vs standard essay — may migrate to field-note later */
  style?: "essay" | "field-digest";
  overrides?: EssayIntakeOverrides;
}

/** Curator overrides — optional; inference fills the rest */
export interface EssayIntakeOverrides {
  slug?: string;
  id?: string;
  description?: string;
  excerpt?: string;
  themes?: string[];
  parentConcepts?: string[];
  topics?: string[];
  questionIds?: string[];
  /** Skip auto chamber / volume links */
  skipChamber?: boolean;
  skipVolume?: boolean;
  /** Extra connection target ids (echo/thread) */
  relatedEssayIds?: string[];
  /** Notes for Cursor or future rationale refinement */
  curatorNotes?: string;
}

export interface TouchPoint {
  id: string;
  title: string;
  kind: string;
  route: string;
  rationale: string;
}

export interface NeighborPreview {
  id: string;
  title: string;
  slug: string;
  sharedThemes: string[];
  connectionKind: "echo" | "parent" | "child";
}

export interface SuggestedThread {
  threadId: string;
  threadTitle: string;
  threadSlug: string;
  premise: string;
  fitScore: number;
  suggestedStep: {
    kind: "essay";
    slug: string;
    title: string;
  };
  rationale: string;
}

export interface EssayImportPlan {
  intake: EssayIntake;
  slug: string;
  id: string;
  entry: AtlasEntry;
  connections: AtlasConnection[];
  chamber: {
    route: string;
    label: string;
    lanternRoute: string;
  };
  constellation: {
    majorConceptId: string;
    majorConceptTitle: string;
    orbitLevel: 3;
    focusUrl: string;
    placementNote: string;
  };
  touches: TouchPoint[];
  neighbors: NeighborPreview[];
  suggestedThreads: SuggestedThread[];
  observatory: {
    category: string;
    majorConceptSlug: string;
    clusterQuestion: string | null;
    signalKind: "essay";
  };
  featuredImage?: {
    sourcePath: string;
    publicPath: string;
  };
  warnings: string[];
}

export interface ApplyResult {
  plan: EssayImportPlan;
  entryFile: string;
  manifestUpdated: boolean;
  imageCopied: boolean;
  intakeArchivedTo?: string;
}
