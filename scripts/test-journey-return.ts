/**
 * Journey-return snapshot validation (unit, no browser).
 * Run: npx tsx scripts/test-journey-return.ts
 */

import assert from "node:assert/strict";
import {
  JOURNEY_RETURN_TTL_MS,
  JOURNEY_RETURN_VERSION,
  isAuthoredJourneyTrail,
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

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log("\nall passed");
