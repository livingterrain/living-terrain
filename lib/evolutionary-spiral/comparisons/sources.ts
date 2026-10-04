import type {
  SpiralEpistemicKind,
  SpiralSourceRef,
  SpiralTrajectory,
  SpiralTrajectoryEdge,
} from "../types";
import type { SpiralComparisonIssue } from "./validate";

/**
 * Edge-level provenance. Validation checks only what was authored: it never
 * fills, resolves, or repairs source metadata. Bibliographic fields stay
 * optional — an incomplete source is valid data, but it does not count as
 * support for an evidentiary claim.
 */

/** Kinds that claim something about the world rather than about a text or symbol. */
const EVIDENTIAL_KINDS: ReadonlySet<SpiralEpistemicKind> = new Set([
  "empirical",
  "empirical-mechanism",
  "empirical-observation",
  "model-projection",
]);

const BARE_DOI = /^10\.\d{4,9}\/\S+$/;

/** Bibliographic identity — `supports` is claim-specific and may differ per edge. */
const IDENTITY_FIELDS = [
  "title",
  "authors",
  "year",
  "publication",
  "url",
  "doi",
  "placeholder",
] as const satisfies readonly (keyof SpiralSourceRef)[];

const filled = (v: unknown) => v !== undefined && String(v).trim() !== "";

/** A source a reader could find: not a placeholder; authors, year, and a title, DOI, or URL. */
export function isCitableSource(source: SpiralSourceRef): boolean {
  return (
    !source.placeholder &&
    filled(source.authors) &&
    filled(source.year) &&
    (filled(source.title) || filled(source.doi) || filled(source.url))
  );
}

/** Whether an edge asserts more than topology. A bare from → to asserts nothing. */
export function edgeAssertsEvidence(edge: SpiralTrajectoryEdge): boolean {
  return (
    edge.outcome !== undefined ||
    filled(edge.conditions) ||
    (edge.epistemicKinds ?? []).some((k) => EVIDENTIAL_KINDS.has(k))
  );
}

function identity(source: SpiralSourceRef): string {
  return JSON.stringify(IDENTITY_FIELDS.map((f) => source[f] ?? null));
}

export function validateTrajectorySources(
  trajectory: SpiralTrajectory,
): SpiralComparisonIssue[] {
  const issues: SpiralComparisonIssue[] = [];
  const t = trajectory.id;
  const seen = new Map<string, string>();
  const conflicted = new Set<string>();

  const register = (source: SpiralSourceRef) => {
    const prior = seen.get(source.id);
    if (prior === undefined) seen.set(source.id, identity(source));
    else if (prior !== identity(source) && !conflicted.has(source.id)) {
      conflicted.add(source.id);
      issues.push({
        code: "conflicting-source-metadata",
        trajectoryId: t,
        message: `${t}: source "${source.id}" is cited with different bibliographic details.`,
      });
    }
  };

  for (const source of trajectory.sources ?? []) register(source);

  for (const edge of trajectory.transitions ?? []) {
    const sources = edge.sources ?? [];
    const ids = new Set<string>();
    for (const source of sources) {
      if (!filled(source.id)) {
        issues.push({
          code: "invalid-edge-source",
          trajectoryId: t,
          edgeId: edge.id,
          message: `${t}/${edge.id}: a source has no id.`,
        });
        continue;
      }
      if (source.doi !== undefined && !BARE_DOI.test(source.doi)) {
        issues.push({
          code: "invalid-edge-source",
          trajectoryId: t,
          edgeId: edge.id,
          message: `${t}/${edge.id}: source "${source.id}" DOI "${source.doi}" is not a bare DOI (10.xxxx/…).`,
        });
      }
      if (ids.has(source.id)) {
        issues.push({
          code: "duplicate-edge-source",
          trajectoryId: t,
          edgeId: edge.id,
          message: `${t}/${edge.id}: source "${source.id}" is cited more than once.`,
        });
      }
      ids.add(source.id);
      register(source);
    }

    const supported = sources.some(isCitableSource);
    if (edge.epistemicKinds?.includes("model-projection") && !supported) {
      issues.push({
        code: "unsourced-model-projection",
        trajectoryId: t,
        edgeId: edge.id,
        message: `${t}/${edge.id}: a model projection must cite the model it comes from.`,
      });
    } else if (
      trajectory.evidenceStandard === "empirical" &&
      edgeAssertsEvidence(edge) &&
      !supported
    ) {
      issues.push({
        code: "unsourced-evidence-edge",
        trajectoryId: t,
        edgeId: edge.id,
        message: `${t}/${edge.id}: asserts an outcome, conditions, or evidence but cites no citable source.`,
      });
    }
  }

  return issues;
}
