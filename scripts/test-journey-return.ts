/**
 * Journey-return snapshot validation (unit, no browser).
 * Run: npx tsx scripts/test-journey-return.ts
 */

import assert from "node:assert/strict";
import { ATLAS_V1_SOURCE } from "../lib/atlas-v1/content";
import {
  JOURNEY_RETURN_HREF,
  JOURNEY_RETURN_TTL_MS,
  JOURNEY_RETURN_VERSION,
  isAuthoredJourneyTrail,
  isEvidenceEssayRoute,
  returnForSnapshot,
  sanitizeJourneyState,
  validateJourneyReturnSnapshot,
} from "../lib/atlas-v1/journey-return";

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

const validJourney = {
  questionId: "technology-change",
  currentConceptId: "relationship",
  trail: ["technology", "relationship"],
  essaysOpened: [],
  activeEssayId: null,
  noticedWhy: "Little by little the question shifts.",
};

check("authored trail: valid path", () => {
  assert.equal(
    isAuthoredJourneyTrail(
      "technology-change",
      ["technology", "relationship"],
      "relationship",
    ),
    true,
  );
});

check("authored trail: rejects shuffled known concepts", () => {
  assert.equal(
    isAuthoredJourneyTrail(
      "technology-change",
      ["relationship", "technology"],
      "technology",
    ),
    false,
  );
});

check("authored trail: rejects unrelated known concepts", () => {
  assert.equal(
    isAuthoredJourneyTrail(
      "technology-change",
      ["technology", "body"],
      "body",
    ),
    false,
  );
});

check("authored trail: rejects skip ahead", () => {
  assert.equal(
    isAuthoredJourneyTrail(
      "technology-change",
      ["technology", "time"],
      "time",
    ),
    false,
  );
});

check("sanitizeJourneyState: accepts authored stop", () => {
  const j = sanitizeJourneyState(validJourney);
  assert.ok(j);
  assert.equal(j!.currentConceptId, "relationship");
  assert.equal(j!.activeEssayId, null);
});

check("sanitizeJourneyState: rejects bad trail order", () => {
  assert.equal(
    sanitizeJourneyState({
      ...validJourney,
      trail: ["relationship", "technology"],
      currentConceptId: "technology",
    }),
    null,
  );
});

check("sanitizeJourneyState: keeps valid essaysOpened; clears activeEssayId", () => {
  const j = sanitizeJourneyState({
    ...validJourney,
    essaysOpened: ["cost-of-image", "feel-it-in-body"],
    activeEssayId: "cost-of-image",
  });
  assert.ok(j);
  assert.deepEqual(j!.essaysOpened, ["cost-of-image", "feel-it-in-body"]);
  assert.equal(j!.activeEssayId, null);
});

check("sanitizeJourneyState: drops stale essaysOpened without rejecting journey", () => {
  const j = sanitizeJourneyState({
    ...validJourney,
    essaysOpened: ["cost-of-image", "retired-essay-id", "feel-it-in-body"],
    activeEssayId: "retired-essay-id",
  });
  assert.ok(j);
  assert.deepEqual(j!.essaysOpened, ["cost-of-image", "feel-it-in-body"]);
  assert.equal(j!.activeEssayId, null);
});

check("sanitizeJourneyState: all-stale essaysOpened becomes empty list", () => {
  const j = sanitizeJourneyState({
    ...validJourney,
    essaysOpened: ["gone-a", "gone-b"],
  });
  assert.ok(j);
  assert.deepEqual(j!.essaysOpened, []);
  assert.equal(j!.activeEssayId, null);
});

check("sanitizeJourneyState: rejects non-string essaysOpened entries", () => {
  assert.equal(
    sanitizeJourneyState({
      ...validJourney,
      essaysOpened: ["cost-of-image", 12],
    }),
    null,
  );
});

check("validateJourneyReturnSnapshot: happy path", () => {
  const snap = validateJourneyReturnSnapshot({
    v: JOURNEY_RETURN_VERSION,
    savedAt: Date.now(),
    threadId: "relationship",
    journey: validJourney,
    relationsVisible: true,
  });
  assert.ok(snap);
  assert.equal(snap!.threadId, "relationship");
});

check("validateJourneyReturnSnapshot: stale essaysOpened still validates", () => {
  const snap = validateJourneyReturnSnapshot({
    v: JOURNEY_RETURN_VERSION,
    savedAt: Date.now(),
    threadId: "relationship",
    journey: {
      ...validJourney,
      essaysOpened: ["cost-of-image", "not-in-corpus"],
      activeEssayId: "cost-of-image",
    },
    relationsVisible: true,
  });
  assert.ok(snap);
  assert.deepEqual(snap!.journey.essaysOpened, ["cost-of-image"]);
  assert.equal(snap!.journey.activeEssayId, null);
});

check("validateJourneyReturnSnapshot: expired", () => {
  assert.equal(
    validateJourneyReturnSnapshot({
      v: JOURNEY_RETURN_VERSION,
      savedAt: Date.now() - JOURNEY_RETURN_TTL_MS - 1,
      threadId: "relationship",
      journey: validJourney,
      relationsVisible: true,
    }),
    null,
  );
});

check("validateJourneyReturnSnapshot: bad version", () => {
  assert.equal(
    validateJourneyReturnSnapshot({
      v: 99,
      savedAt: Date.now(),
      threadId: "relationship",
      journey: validJourney,
      relationsVisible: true,
    }),
    null,
  );
});

check("validateJourneyReturnSnapshot: malformed / missing fields", () => {
  assert.equal(validateJourneyReturnSnapshot(null), null);
  assert.equal(validateJourneyReturnSnapshot({}), null);
  assert.equal(
    validateJourneyReturnSnapshot({
      v: JOURNEY_RETURN_VERSION,
      savedAt: Date.now(),
      threadId: "relationship",
      journey: validJourney,
      relationsVisible: false,
    }),
    null,
  );
  assert.equal(
    validateJourneyReturnSnapshot({
      v: JOURNEY_RETURN_VERSION,
      savedAt: Date.now(),
      threadId: "not-a-thread",
      journey: validJourney,
      relationsVisible: true,
    }),
    null,
  );
});

check("validateJourneyReturnSnapshot: unknown question", () => {
  assert.equal(
    validateJourneyReturnSnapshot({
      v: JOURNEY_RETURN_VERSION,
      savedAt: Date.now(),
      threadId: "relationship",
      journey: { ...validJourney, questionId: "nope" },
      relationsVisible: true,
    }),
    null,
  );
});

const evidenceSnapshot = {
  v: JOURNEY_RETURN_VERSION,
  savedAt: Date.now(),
  evidenceRoute: "/essays/there-is-a-cost-to-becoming-an-image",
  journey: {
    ...validJourney,
    currentConceptId: "technology",
    trail: ["technology"],
    essaysOpened: ["cost-of-image"],
    activeEssayId: "cost-of-image",
  },
  relationsVisible: true,
};

check("evidence origin: known evidence essay route validates at the stop", () => {
  const snap = validateJourneyReturnSnapshot(evidenceSnapshot);
  assert.ok(snap);
  assert.equal(snap!.evidenceRoute, "/essays/there-is-a-cost-to-becoming-an-image");
  assert.equal(snap!.threadId, undefined);
  assert.equal(snap!.journey.questionId, "technology-change");
  assert.equal(snap!.journey.currentConceptId, "technology");
  assert.equal(snap!.journey.activeEssayId, null);
});

check("evidence origin: non-evidence routes rejected", () => {
  for (const evidenceRoute of [
    "/essays/not-an-evidence-essay",
    "/atlas/the-second-birth",
    "https://example.com/essays/there-is-a-cost-to-becoming-an-image",
  ]) {
    assert.equal(validateJourneyReturnSnapshot({ ...evidenceSnapshot, evidenceRoute }), null);
  }
});

check("origin: exactly one of threadId / evidenceRoute", () => {
  assert.equal(
    validateJourneyReturnSnapshot({ ...evidenceSnapshot, threadId: "relationship" }),
    null,
  );
  const { evidenceRoute: _omit, ...neither } = evidenceSnapshot;
  assert.equal(validateJourneyReturnSnapshot(neither), null);
});

check("every Atlas evidence essay route is accepted", () => {
  for (const source of Object.values(ATLAS_V1_SOURCE)) {
    assert.equal(isEvidenceEssayRoute(source.href), source.kind === "essay");
  }
});

check("return scoping: essay record shows return only for its own evidence exit", () => {
  const snap = validateJourneyReturnSnapshot(evidenceSnapshot);
  assert.ok(returnForSnapshot(snap, { evidenceRoute: "/essays/there-is-a-cost-to-becoming-an-image" }));
  assert.equal(
    returnForSnapshot(snap, { evidenceRoute: "/essays/what-happens-before-the-tragedy" }),
    null,
  );
  assert.equal(
    returnForSnapshot(snap, { evidenceRoute: "/essays/some-unrelated-essay" }),
    null,
  );
});

check("return scoping: Thread-whisper snapshot never appears on essay records", () => {
  const snap = validateJourneyReturnSnapshot({
    v: JOURNEY_RETURN_VERSION,
    savedAt: Date.now(),
    threadId: "relationship",
    journey: validJourney,
    relationsVisible: true,
  });
  assert.ok(snap);
  assert.equal(
    returnForSnapshot(snap, { evidenceRoute: "/essays/there-is-a-cost-to-becoming-an-image" }),
    null,
  );
});

check("return scoping: Thread pages keep accepting any valid snapshot", () => {
  const evidence = validateJourneyReturnSnapshot(evidenceSnapshot);
  const thread = validateJourneyReturnSnapshot({
    v: JOURNEY_RETURN_VERSION,
    savedAt: Date.now(),
    threadId: "relationship",
    journey: validJourney,
    relationsVisible: true,
  });
  assert.deepEqual(returnForSnapshot(thread), {
    href: JOURNEY_RETURN_HREF,
    label: "Return to the Atlas",
  });
  assert.ok(returnForSnapshot(evidence));
  assert.equal(returnForSnapshot(null), null);
});

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log("\nall passed");
