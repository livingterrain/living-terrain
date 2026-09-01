import { listCanonicalObjects } from "./objects";
import {
  listCanonicalRelationRecords,
  listReviewRelationRecords,
} from "./relations";
import {
  CANONICAL_PROVENANCE,
  CANONICAL_RELATION_TYPES,
  TRUSTED_PROVENANCE,
  type CanonicalRelation,
  type CanonicalValidationIssue,
} from "./types";

const TRUSTED = new Set<string>(TRUSTED_PROVENANCE);
const PROVENANCE = new Set<string>(CANONICAL_PROVENANCE);
const RELATION_TYPES = new Set<string>(CANONICAL_RELATION_TYPES);

/**
 * Historical citations that may target superseded b2.
 * Any other canonical relation to b2 is treated as an edition error.
 */
const ALLOWED_B2_RELATION_IDS = new Set([
  "b8→b2:SUPERSEDES",
  "b2→p2:HAS_CHAMBER",
  "biology-of-becoming→b2:SOURCED_FROM",
]);

export function validateCanonicalFoundation(): CanonicalValidationIssue[] {
  const issues: CanonicalValidationIssue[] = [];
  const objects = listCanonicalObjects();
  const byId = new Map<string, (typeof objects)[number]>();

  for (const object of objects) {
    if (byId.has(object.id)) {
      issues.push({
        level: "error",
        code: "duplicate-id",
        message: `Duplicate canonical id: ${object.id}`,
      });
    } else {
      byId.set(object.id, object);
    }
  }

  const b8 = byId.get("b8");
  const b2 = byId.get("b2");
  if (!b8 || b8.visibility !== "public" || b8.supersedesId !== "b2") {
    issues.push({
      level: "error",
      code: "biology-current",
      message: "b8 must be the public Biology edition and must supersede b2.",
    });
  }
  if (!b2 || b2.visibility !== "superseded") {
    issues.push({
      level: "error",
      code: "biology-historical",
      message: "b2 must remain registered as superseded / historical.",
    });
  }

  const relationIds = new Set<string>();

  function checkRelation(
    relation: CanonicalRelation,
    bucket: "canonical" | "review",
  ) {
    if (relationIds.has(relation.id)) {
      issues.push({
        level: "error",
        code: "duplicate-relation",
        message: `Duplicate relation id: ${relation.id}`,
      });
    }
    relationIds.add(relation.id);

    if (!PROVENANCE.has(relation.provenance)) {
      issues.push({
        level: "error",
        code: "invalid-provenance",
        message: `${relation.id}: invalid provenance ${relation.provenance}`,
      });
    }
    if (!RELATION_TYPES.has(relation.type)) {
      issues.push({
        level: "error",
        code: "invalid-type",
        message: `${relation.id}: invalid relation type ${relation.type}`,
      });
    }
    if (!byId.has(relation.from)) {
      issues.push({
        level: "error",
        code: "missing-from",
        message: `${relation.id}: missing source id ${relation.from}`,
      });
    }
    if (!byId.has(relation.to)) {
      issues.push({
        level: "error",
        code: "missing-to",
        message: `${relation.id}: missing target id ${relation.to}`,
      });
    }

    if (bucket === "canonical" && !TRUSTED.has(relation.provenance)) {
      issues.push({
        level: "error",
        code: "noncanonical-in-canonical",
        message: `${relation.id}: ${relation.provenance} cannot enter canonical relations.`,
      });
    }
    if (bucket === "review" && TRUSTED.has(relation.provenance)) {
      issues.push({
        level: "warning",
        code: "trusted-in-review",
        message: `${relation.id}: trusted provenance belongs in canonical relations, not the review queue.`,
      });
    }

    const targetsB2 = relation.to === "b2" || relation.from === "b2";
    if (
      bucket === "canonical" &&
      targetsB2 &&
      !ALLOWED_B2_RELATION_IDS.has(relation.id)
    ) {
      issues.push({
        level: "error",
        code: "superseded-target",
        message: `${relation.id}: targets superseded b2; use b8 for the current public edition unless this is a listed historical citation.`,
      });
    }
  }

  for (const relation of listCanonicalRelationRecords()) {
    checkRelation(relation, "canonical");
  }
  for (const relation of listReviewRelationRecords()) {
    checkRelation(relation, "review");
  }

  for (const object of objects) {
    if (object.type === "EVIDENCE" && !object.sourceObjectId) {
      issues.push({
        level: "error",
        code: "evidence-unresolved",
        message: `Evidence ${object.id} does not resolve to a real essay or book.`,
      });
    }
  }

  return issues;
}

export function assertCanonicalFoundation(): void {
  const errors = validateCanonicalFoundation().filter((issue) => issue.level === "error");
  if (errors.length === 0) return;
  const detail = errors.map((issue) => `- ${issue.code}: ${issue.message}`).join("\n");
  throw new Error(`Canonical foundation invalid:\n${detail}`);
}
