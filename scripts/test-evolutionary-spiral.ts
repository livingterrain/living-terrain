/**
 * Relationship-line safety for the Evolutionary Spiral composite figure.
 * Lines must come only from authored relationship records.
 * Run: npx tsx scripts/test-evolutionary-spiral.ts
 */

import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import {
  authoredTrajectories,
  defaultTrajectoryId,
  EMERGENCE_AGAIN_APPROVED_RELATIONSHIP_IDS,
  getTrajectory,
  occurrencesForRelationship,
  relationshipsForTrajectory,
  SPIRAL_NAME_COLLISION_ACKNOWLEDGEMENTS,
  SPIRAL_SEQUENCE,
  SPIRAL_TRAJECTORY_RELATIONSHIPS,
  validateSpiralComparisons,
  type SpiralComparisonIssueCode,
  type SpiralLensId,
  type SpiralTrajectory,
  type SpiralTrajectoryRelationship,
} from "../lib/evolutionary-spiral";
import {
  arcEndpointsForTrajectory,
  arcEndpointsFromRelationships,
} from "../components/evolutionary-spiral/spiral-arc-endpoints";

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

const EMERGENCE_AGAIN = "emergence@1";
const TRANSFORMATION = "transformation@0";

function trajectoryFor(lensId: SpiralLensId) {
  return getTrajectory(lensId, defaultTrajectoryId(lensId));
}

check("lines equal authored relationship occurrences, per trajectory", () => {
  for (const t of authoredTrajectories()) {
    const expected = relationshipsForTrajectory(t.id).reduce(
      (n, r) => n + occurrencesForRelationship(r).length,
      0,
    );
    assert.equal(arcEndpointsForTrajectory(t.id).length, expected, t.id);
  }
});

check("every line names an authored relationship record", () => {
  const authored = new Set(SPIRAL_TRAJECTORY_RELATIONSHIPS.map((r) => r.id));
  for (const t of authoredTrajectories()) {
    for (const end of arcEndpointsForTrajectory(t.id)) {
      assert.ok(authored.has(end.relationshipId), end.relationshipId);
      assert.ok(
        SPIRAL_SEQUENCE.some((s) => s.occurrenceId === end.occurrenceId),
        end.occurrenceId,
      );
    }
  }
});

check("Zodiac: four lines, all to Transformation", () => {
  const ends = arcEndpointsForTrajectory(trajectoryFor("symbolic-zodiac")?.id);
  assert.equal(ends.length, 4);
  assert.ok(ends.every((e) => e.occurrenceId === TRANSFORMATION));
});

check("Jesus: one line, to Transformation", () => {
  const ends = arcEndpointsForTrajectory(trajectoryFor("biblical-textual")?.id);
  assert.equal(ends.length, 1);
  assert.equal(ends[0]!.occurrenceId, TRANSFORMATION);
});

check("Biology: one line, to Transformation", () => {
  const ends = arcEndpointsForTrajectory(trajectoryFor("living-systems")?.id);
  assert.equal(ends.length, 1);
  assert.equal(ends[0]!.occurrenceId, TRANSFORMATION);
});

check("Emergence Again receives no line from Zodiac (Pisces → Aries again stays a Transformation passage)", () => {
  const ends = arcEndpointsForTrajectory(trajectoryFor("symbolic-zodiac")?.id);
  assert.ok(!ends.some((e) => e.occurrenceId === EMERGENCE_AGAIN));
});

check("Emergence Again receives no line from Jesus (New Creation does not return)", () => {
  const ends = arcEndpointsForTrajectory(trajectoryFor("biblical-textual")?.id);
  assert.ok(!ends.some((e) => e.occurrenceId === EMERGENCE_AGAIN));
});

check("no authored relationship connects Jesus and Zodiac", () => {
  const jesus = trajectoryFor("biblical-textual")?.id;
  const zodiac = trajectoryFor("symbolic-zodiac")?.id;
  for (const r of SPIRAL_TRAJECTORY_RELATIONSHIPS) {
    assert.ok(!(r.trajectoryId === jesus && JSON.stringify(r).includes(String(zodiac))));
    assert.ok(!(r.trajectoryId === zodiac && JSON.stringify(r).includes(String(jesus))));
  }
});

check("unfinished lenses and Across draw no lines", () => {
  for (const lensId of ["systems", "psychology", "ecology", "across"] as const) {
    assert.equal(arcEndpointsForTrajectory(trajectoryFor(lensId)?.id).length, 0, lensId);
  }
});

check("no lens selected draws no lines", () => {
  assert.equal(arcEndpointsForTrajectory(null).length, 0);
});

/* ------------------------------------------------------------------ */
/* Phase 2A — safety hardening (synthetic fixtures; no real data)     */
/* ------------------------------------------------------------------ */

const FIXTURE: SpiralTrajectory = {
  id: "fixture",
  lensId: "living-systems",
  title: "Fixture",
  inPhrase: "the fixture",
  description: "Synthetic trajectory for validation tests.",
  shape: "directional",
  steps: [
    { id: "a", label: "First" },
    { id: "b", label: "Second" },
    { id: "c", label: "Third" },
  ],
};

function rel(
  overrides: Partial<SpiralTrajectoryRelationship>,
): SpiralTrajectoryRelationship {
  return {
    id: "fixture-rel",
    trajectoryId: FIXTURE.id,
    anchor: { kind: "step", stepId: "a" },
    operations: [{ stageId: "transformation" }],
    status: "candidate",
    ...overrides,
  };
}

function codes(
  relationships: SpiralTrajectoryRelationship[],
  trajectories: SpiralTrajectory[] = [FIXTURE],
): SpiralComparisonIssueCode[] {
  return validateSpiralComparisons(relationships, trajectories).map((i) => i.code);
}

check("current authored data passes validation with no issues", () => {
  assert.deepEqual(
    validateSpiralComparisons(SPIRAL_TRAJECTORY_RELATIONSHIPS, authoredTrajectories()),
    [],
  );
});

check("approval lists start empty", () => {
  assert.equal(EMERGENCE_AGAIN_APPROVED_RELATIONSHIP_IDS.length, 0);
  assert.equal(SPIRAL_NAME_COLLISION_ACKNOWLEDGEMENTS.length, 0);
});

check("A. multi-occurrence stage without occurrenceId fails, and is never expanded", () => {
  const r = rel({ operations: [{ stageId: "emergence" }] });
  assert.deepEqual(codes([r]), ["ambiguous-occurrence"]);
  assert.equal(occurrencesForRelationship(r).length, 0);
  assert.equal(arcEndpointsFromRelationships([r]).length, 0);
});

check("B. explicit first Emergence is representable and leaves Emergence Again untouched", () => {
  const r = rel({ operations: [{ stageId: "emergence", occurrenceId: "emergence@0" }] });
  assert.deepEqual(codes([r]), []);
  const ends = arcEndpointsFromRelationships([r]);
  assert.deepEqual(ends.map((e) => e.occurrenceId), ["emergence@0"]);
});

check("C. relationship to Emergence Again fails while the approval list is empty", () => {
  const r = rel({ operations: [{ stageId: "emergence", occurrenceId: EMERGENCE_AGAIN }] });
  assert.deepEqual(codes([r]), ["emergence-again-not-approved"]);
  assert.equal(arcEndpointsFromRelationships([r]).length, 0);
  // The mechanism honours an explicit approval passed in (the real list stays empty).
  assert.deepEqual(
    validateSpiralComparisons([r], [FIXTURE], { approvedEmergenceAgain: [r.id] }),
    [],
  );
});

check("occurrence that does not belong to the named stage fails", () => {
  const r = rel({ operations: [{ stageId: "transformation", occurrenceId: "emergence@0" }] });
  assert.deepEqual(codes([r]), ["unknown-occurrence"]);
});

check("D. comparison break returns no line but remains a record", () => {
  const r = rel({ status: "comparison-break" });
  assert.deepEqual(codes([r]), []);
  assert.equal(arcEndpointsFromRelationships([r]).length, 0);
  assert.equal(occurrencesForRelationship(r).length, 1);
});

check("E. zero relationships give zero lines", () => {
  assert.equal(arcEndpointsFromRelationships([]).length, 0);
});

check("F. Zodiac = 4", () => {
  assert.equal(arcEndpointsForTrajectory(trajectoryFor("symbolic-zodiac")?.id).length, 4);
});

check("G. Jesus = 1", () => {
  assert.equal(arcEndpointsForTrajectory(trajectoryFor("biblical-textual")?.id).length, 1);
});

check("H. Biology = 1", () => {
  assert.equal(arcEndpointsForTrajectory(trajectoryFor("living-systems")?.id).length, 1);
});

check("I. unfinished lenses = 0", () => {
  for (const lensId of ["systems", "psychology", "ecology"] as const) {
    assert.equal(arcEndpointsForTrajectory(trajectoryFor(lensId)?.id).length, 0, lensId);
  }
});

check("J. no current line or relationship targets Emergence Again", () => {
  for (const t of authoredTrajectories()) {
    assert.ok(!arcEndpointsForTrajectory(t.id).some((e) => e.occurrenceId === EMERGENCE_AGAIN), t.id);
  }
  for (const r of SPIRAL_TRAJECTORY_RELATIONSHIPS) {
    assert.ok(!occurrencesForRelationship(r).some((s) => s.occurrenceId === EMERGENCE_AGAIN), r.id);
  }
});

check("K. invalid step anchor fails", () => {
  assert.deepEqual(codes([rel({ anchor: { kind: "step", stepId: "missing" } })]), ["unknown-step"]);
});

check("L. invalid transition anchor fails", () => {
  assert.deepEqual(codes([rel({ anchor: { kind: "transition", from: "a", to: "b" } })]), []);
  assert.deepEqual(
    codes([rel({ anchor: { kind: "transition", from: "a", to: "c" } })]),
    ["unknown-transition"],
  );
  assert.deepEqual(
    codes([rel({ anchor: { kind: "transition", from: "a", to: "missing" } })]),
    ["unknown-transition"],
  );
});

check("M. invalid span endpoint fails", () => {
  assert.deepEqual(codes([rel({ anchor: { kind: "span", from: "a", to: "c" } })]), []);
  assert.deepEqual(
    codes([rel({ anchor: { kind: "span", from: "a", to: "missing" } })]),
    ["unknown-span-endpoint"],
  );
});

check("unknown trajectory fails", () => {
  assert.deepEqual(codes([rel({ trajectoryId: "nowhere" })]), ["unknown-trajectory"]);
});

check("N. names, order and position never create lines", () => {
  // Steps named after Spiral operations, in Spiral order, at matching positions.
  const mirror: SpiralTrajectory = {
    ...FIXTURE,
    id: "mirror",
    steps: SPIRAL_SEQUENCE.map((s) => ({ id: s.occurrenceId, label: s.labelOverride ?? s.stageId })),
  };
  assert.equal(
    arcEndpointsFromRelationships(SPIRAL_TRAJECTORY_RELATIONSHIPS.filter((r) => r.trajectoryId === mirror.id)).length,
    0,
  );
  // A record anchored on a step named "Emergence" reaches only what it names.
  const r = rel({
    trajectoryId: mirror.id,
    anchor: { kind: "step", stepId: "emergence@0" },
    operations: [{ stageId: "transformation" }],
  });
  assert.deepEqual(arcEndpointsFromRelationships([r]).map((e) => e.occurrenceId), [TRANSFORMATION]);
});

check("N. line and relationship modules do not import geometry", () => {
  const root = path.resolve(__dirname, "..");
  const comparisonsDir = path.join(root, "lib/evolutionary-spiral/comparisons");
  const files = [
    path.join(root, "components/evolutionary-spiral/spiral-arc-endpoints.ts"),
    ...readdirSync(comparisonsDir)
      .filter((f) => f.endsWith(".ts"))
      .map((f) => path.join(comparisonsDir, f)),
  ];
  const forbidden = [
    /geometry/,
    /^@\/lib\/evolutionary-spiral$/,
    /^\.\.?$/,
    /^\.\.\/index$/,
    /^\.\.\/lenses$/,
    /^\.\.\/trajectories/,
  ];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    for (const [, spec] of source.matchAll(/from\s+["']([^"']+)["']/g)) {
      for (const pattern of forbidden) {
        assert.ok(!pattern.test(spec!), `${path.relative(root, file)} imports "${spec}"`);
      }
    }
  }
});

check("O. exact operation-name collision requires acknowledgement, not rejection by default", () => {
  const colliding: SpiralTrajectory = {
    ...FIXTURE,
    id: "colliding",
    steps: [...FIXTURE.steps, { id: "renewal-effect", label: "Renewal" }],
  };
  const issues = validateSpiralComparisons([], [colliding]);
  assert.deepEqual(issues.map((i) => i.code), ["unacknowledged-name-collision"]);
  assert.equal(issues[0]!.stepId, "renewal-effect");
  assert.deepEqual(
    validateSpiralComparisons([], [colliding], {
      nameCollisionAcknowledgements: [
        { trajectoryId: "colliding", stepId: "renewal-effect", reason: "Fear-extinction renewal effect is not Spiral Renewal." },
      ],
    }),
    [],
  );
  // Near-matches are not collisions.
  const near: SpiralTrajectory = {
    ...FIXTURE,
    id: "near",
    steps: [{ id: "x", label: "Renewal effect" }, { id: "y", label: "Adult emergence" }],
  };
  assert.deepEqual(validateSpiralComparisons([], [near]), []);
});

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nEvolutionary Spiral relationship lines: all checks passed");
