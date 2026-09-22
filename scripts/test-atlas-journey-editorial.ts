/**
 * Editorial validation for Atlas journey evidence diversification (A+D).
 * Run: npx tsx scripts/test-atlas-journey-editorial.ts
 */

import assert from "node:assert/strict";
import {
  evidenceReadingLabel,
  getQuestion,
  resolveEvidenceEssayId,
  resolveEvidenceRole,
  type AtlasV1ConceptId,
  type AtlasV1QuestionId,
} from "../lib/atlas-v1/content";
import { isAuthoredJourneyTrail } from "../lib/atlas-v1/journey-return";

let failed = 0;

function check(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok  ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL ${name}`);
    console.error(err);
  }
}

function pathOf(questionId: AtlasV1QuestionId): AtlasV1ConceptId[] {
  const q = getQuestion(questionId);
  const seen = new Set<AtlasV1ConceptId>();
  const path: AtlasV1ConceptId[] = [];
  let cur: AtlasV1ConceptId | undefined = q.startConceptId;
  while (cur && !seen.has(cur)) {
    seen.add(cur);
    path.push(cur);
    const next: AtlasV1ConceptId | undefined = q.relations[cur]?.[0]?.to;
    cur = next;
  }
  return path;
}

function evidenceAlongPath(questionId: AtlasV1QuestionId) {
  const q = getQuestion(questionId);
  return pathOf(questionId).map((conceptId) => ({
    conceptId,
    evidenceId: resolveEvidenceEssayId(q, conceptId),
    role: resolveEvidenceRole(q, conceptId),
    outgoingWhy: q.relations[conceptId]?.[0]?.why ?? null,
  }));
}

check("no repeated evidence within revised journeys", () => {
  for (const id of [
    "technology-change",
    "relationships-difficult",
    "inhabit-time",
  ] as const) {
    const q = getQuestion(id);
    const ids = pathOf(q.id)
      .map((c) => resolveEvidenceEssayId(q, c))
      .filter((eid): eid is NonNullable<typeof eid> => Boolean(eid));
    assert.equal(
      ids.length,
      new Set(ids).size,
      `${q.id} repeats evidence: ${ids.join(", ")}`,
    );
  }
});

check("technology-change: sequence, bonds, diversified evidence", () => {
  const q = getQuestion("technology-change");
  assert.equal(q.text, "Why does technology change us?");
  assert.deepEqual(pathOf("technology-change"), [
    "technology",
    "relationship",
    "time",
  ]);
  assert.equal(
    q.coreReframe,
    "Little by little the question shifts from “Who am I becoming?” to “Who do they want me to be?”",
  );
  assert.equal(q.closingQuestion, "Who am I becoming when no one is watching?");

  const stops = evidenceAlongPath("technology-change");
  assert.deepEqual(
    stops.map((s) => s.evidenceId),
    ["cost-of-image", "before-tragedy", "make-a-loop"],
  );
  assert.equal(
    stops[0].outgoingWhy,
    "Technology changes what receives attention. Over time, what receives attention can begin to shape how we relate to ourselves and each other.",
  );
  assert.equal(
    stops[1].outgoingWhy,
    "An image must stay coherent for an audience. A person must be allowed to change when no one is watching.",
  );
  assert.equal(q.unfinishedHint.why, stops[0].outgoingWhy);
  assert.ok(stops.every((s) => s.role === "evidence"));
});

check("relationships-difficult: evidence + further-reading at reality", () => {
  const q = getQuestion("relationships-difficult");
  assert.equal(q.text, "Why are relationships so difficult?");
  assert.deepEqual(pathOf("relationships-difficult"), [
    "relationship",
    "constraint",
    "reality",
  ]);
  assert.equal(
    q.coreReframe,
    "When relationship becomes disconnected from reality, it becomes control.",
  );

  const stops = evidenceAlongPath("relationships-difficult");
  assert.deepEqual(
    stops.map((s) => s.evidenceId),
    ["before-tragedy", "constraint-freedom", "structure-beneath"],
  );
  assert.equal(stops[0].role, "evidence");
  assert.equal(stops[1].role, "evidence");
  assert.equal(stops[2].role, "further-reading");
  assert.equal(
    evidenceReadingLabel(stops[2].role),
    "A wider reading",
  );
  assert.equal(
    stops[0].outgoingWhy,
    "Connection without limits does not stay connection. It drifts into enabling, performance, or control.",
  );
  assert.equal(
    stops[1].outgoingWhy,
    "The right constraints are not the enemy of love. They are what keep love in contact with what is true.",
  );
  assert.equal(q.unfinishedHint.why, stops[0].outgoingWhy);
});

check("inhabit-time: sequence, bonds, diversified evidence", () => {
  const q = getQuestion("inhabit-time");
  assert.equal(q.text, "How do we inhabit time?");
  assert.deepEqual(pathOf("inhabit-time"), [
    "time",
    "meaning",
    "participation",
  ]);
  assert.equal(
    q.coreReframe,
    "I came back to the same questions. But I wasn’t the same person asking them.",
  );

  const stops = evidenceAlongPath("inhabit-time");
  assert.deepEqual(
    stops.map((s) => s.evidenceId),
    ["make-a-loop", "looking-up", "never-restriction"],
  );
  assert.equal(
    stops[0].outgoingWhy,
    "A loop is not an answer. It is the chance to ask the same question with a steadier orientation.",
  );
  assert.equal(
    stops[1].outgoingWhy,
    "Orientation is not something you finish thinking. It is something you re-enter with your life.",
  );
  assert.equal(q.unfinishedHint.why, stops[0].outgoingWhy);
});

check("authored paths still validate for revised journeys", () => {
  assert.equal(
    isAuthoredJourneyTrail(
      "technology-change",
      ["technology", "relationship", "time"],
      "time",
    ),
    true,
  );
  assert.equal(
    isAuthoredJourneyTrail(
      "relationships-difficult",
      ["relationship", "constraint", "reality"],
      "reality",
    ),
    true,
  );
  assert.equal(
    isAuthoredJourneyTrail(
      "inhabit-time",
      ["time", "meaning", "participation"],
      "participation",
    ),
    true,
  );
});

check("symbols-stop-helping: Meaning territory journey", () => {
  const q = getQuestion("symbols-stop-helping");
  assert.equal(q.text, "When do our symbols stop helping us live?");
  assert.deepEqual(pathOf("symbols-stop-helping"), [
    "meaning",
    "constraint",
    "participation",
  ]);
  assert.equal(
    q.coreReframe,
    "Symbols help us share a world — and can quietly replace contact with it.",
  );
  assert.equal(
    q.closingQuestion,
    "Where am I still living inside a name instead of a life?",
  );
  const stops = evidenceAlongPath("symbols-stop-helping");
  assert.deepEqual(
    stops.map((s) => s.evidenceId),
    ["looking-up", "constraint-freedom", "never-restriction"],
  );
  assert.equal(
    stops[0].outgoingWhy,
    "We need distinctions to make sense of the world. But the categories that help us understand something can also become the boundaries of what we're willing to see.",
  );
  assert.equal(
    stops[1].outgoingWhy,
    "A map can help us find our way. But eventually, we have to leave the map and enter the territory.",
  );
  assert.equal(q.unfinishedHint.why, stops[0].outgoingWhy);
  const ids = stops
    .map((s) => s.evidenceId)
    .filter((id): id is NonNullable<typeof id> => Boolean(id));
  assert.equal(ids.length, new Set(ids).size);
  assert.equal(
    isAuthoredJourneyTrail(
      "symbols-stop-helping",
      ["meaning", "constraint", "participation"],
      "participation",
    ),
    true,
  );
});

check("default evidence label unchanged", () => {
  assert.equal(evidenceReadingLabel("evidence"), "This lives in the writing");
});

if (failed > 0) {
  console.error(`\n${failed} failure(s)`);
  process.exit(1);
}
console.log("\nAll atlas journey editorial tests passed.");
