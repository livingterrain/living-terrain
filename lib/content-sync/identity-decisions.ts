/**
 * Human editorial decisions about whether an Atlas essay record and a
 * publication-registry record are the same work. Recording a decision does not
 * merge, alias, or re-route anything; acting on it is a separate reviewed step.
 */

export type IdentityDecisionKind = "same-work" | "distinct-work";

export interface PendingIdentityReview {
  atlasEssayId: string;
  registryEssayId: string;
  evidenceFor: string[];
  evidenceAgainst: string[];
}

export interface IdentityDecision {
  atlasEssayId: string;
  registryEssayId: string;
  decision: IdentityDecisionKind;
  decidedBy: string;
  decidedAt: string;
  note?: string;
}

export interface IdentityDecisionRegistry {
  version: 1;
  pending: PendingIdentityReview[];
  decisions: IdentityDecision[];
}

export function validateIdentityDecisions(
  file: IdentityDecisionRegistry,
  atlasEssayIds: ReadonlySet<string>,
  registryEssayIds: ReadonlySet<string>,
): string[] {
  const errors: string[] = [];
  if (file.version !== 1) errors.push("identity decisions version must be 1");
  const seen = new Set<string>();
  const entries = [
    ...file.pending.map((item) => ({ ...item, where: "pending" })),
    ...file.decisions.map((item) => ({ ...item, where: "decisions" })),
  ];
  for (const entry of entries) {
    const pair = `${entry.atlasEssayId}↔${entry.registryEssayId}`;
    if (!atlasEssayIds.has(entry.atlasEssayId)) errors.push(`${pair}: ${entry.atlasEssayId} is not an Atlas essay record`);
    if (!registryEssayIds.has(entry.registryEssayId)) errors.push(`${pair}: ${entry.registryEssayId} is not a publication-registry record`);
    if (seen.has(pair)) errors.push(`${pair}: listed more than once across pending and decisions`);
    seen.add(pair);
  }
  for (const decision of file.decisions) {
    const pair = `${decision.atlasEssayId}↔${decision.registryEssayId}`;
    if (decision.decision !== "same-work" && decision.decision !== "distinct-work") errors.push(`${pair}: decision must be same-work or distinct-work`);
    if (!decision.decidedBy?.trim()) errors.push(`${pair}: decidedBy is required`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(decision.decidedAt ?? "")) errors.push(`${pair}: decidedAt must be YYYY-MM-DD`);
  }
  return errors;
}
