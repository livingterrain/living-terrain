/**
 * Relationship-line safety for the Evolutionary Spiral composite figure.
 * Lines must come only from authored relationship records.
 * Run: npx tsx scripts/test-evolutionary-spiral.ts
 */

import assert from "node:assert/strict";
import {
  authoredTrajectories,
  defaultTrajectoryId,
  getTrajectory,
  occurrencesForRelationship,
  relationshipsForTrajectory,
  SPIRAL_SEQUENCE,
  SPIRAL_TRAJECTORY_RELATIONSHIPS,
  type SpiralLensId,
} from "../lib/evolutionary-spiral";
import { arcEndpointsForTrajectory } from "../components/evolutionary-spiral/spiral-arc-endpoints";

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

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nEvolutionary Spiral relationship lines: all checks passed");
