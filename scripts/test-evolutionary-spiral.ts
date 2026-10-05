/**
 * Relationship-line safety for the Evolutionary Spiral composite figure.
 * Lines must come only from authored relationship records.
 * Run: npx tsx scripts/test-evolutionary-spiral.ts
 */

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  anchorStepIds,
  authoredTrajectories,
  conceptMatches,
  defaultTrajectoryId,
  edgeAssertsEvidence,
  EMERGENCE_AGAIN_APPROVED_RELATIONSHIP_IDS,
  epistemicLabel,
  findEdge,
  fitTopologyLayout,
  getSpiralLens,
  getSpiralStage,
  incomingEdges,
  isCitableSource,
  isDrawableRelationship,
  isComparisonBreak,
  isComparisonFinding,
  comparisonFindingKind,
  COMPARISON_BREAK_STATUSES,
  DRAWABLE_RELATIONSHIP_STATUSES,
  JESUS_RELATIONSHIPS,
  METAMORPHOSIS_RELATIONSHIPS,
  ZODIAC_RELATIONSHIPS,
  SPIRAL_RELATIONSHIP_STATUS,
  LODGEPOLE_FIRE_TRAJECTORY,
  LODGEPOLE_RELATIONSHIPS,
  getTrajectory,
  occurrencesForRelationship,
  orderedEdges,
  outgoingEdges,
  relationshipsForStep,
  relationshipsForTrajectory,
  resolveRelationshipConcept,
  resolveSpan,
  returningEdgeIds,
  sinkStepIds,
  SPIRAL_LENSES,
  SPIRAL_EPISTEMIC_CATEGORIES,
  SPIRAL_COPY,
  SPIRAL_EPISTEMIC_LEGEND,
  SPIRAL_EXAMPLES,
  SPIRAL_NAME_COLLISION_ACKNOWLEDGEMENTS,
  SPIRAL_SCALE_IDS,
  SPIRAL_SEQUENCE,
  SPIRAL_TRAJECTORY_OUTCOMES,
  SPIRAL_TRAJECTORY_RELATIONSHIPS,
  TRAJECTORY_TAKEAWAYS,
  topologyLayout,
  topologySource,
  trajectoryEdges,
  trajectoryFigureKind,
  validateSpiralComparisons,
  validateTrajectorySources,
  validateTrajectoryTopology,
  type SpiralComparisonIssueCode,
  type SpiralEpistemicKind,
  type SpiralLensId,
  type SpiralScaleId,
  type SpiralSourceRef,
  type SpiralTrajectory,
  type SpiralTrajectoryEdge,
  type SpiralTrajectoryOutcome,
  type SpiralTrajectoryRelationship,
} from "../lib/evolutionary-spiral";
import {
  arcEndpointsForTrajectory,
  arcEndpointsFromRelationships,
} from "../components/evolutionary-spiral/spiral-arc-endpoints";
import { SpiralTrajectoryFigure } from "../components/evolutionary-spiral/SpiralTrajectoryFigure";
import { SpiralLocalCard } from "../components/evolutionary-spiral/SpiralLocalCard";
import { SpiralAcrossScaffold } from "../components/evolutionary-spiral/SpiralAcrossScaffold";

// Components compile with the classic JSX runtime here.
(globalThis as { React?: typeof React }).React = React;

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

/** Trajectories authored before explicit topology: read in step order. */
function legacyTrajectories() {
  return authoredTrajectories().filter((t) => t.id !== LODGEPOLE_FIRE_TRAJECTORY.id);
}

check("lines equal authored drawable relationship occurrences, per trajectory", () => {
  for (const t of authoredTrajectories()) {
    const expected = relationshipsForTrajectory(t.id).filter(isDrawableRelationship).reduce(
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
  for (const lensId of ["systems", "psychology", "across"] as const) {
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
  for (const lensId of ["systems", "psychology"] as const) {
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

/* ------------------------------------------------------------------ */
/* Phase 2B — trajectory topology (neutral fixtures; no real content) */
/* ------------------------------------------------------------------ */

const step = (id: string) => ({ id, label: `Step ${id.toUpperCase()}` });
const edge = (from: string, to: string, extra: Partial<SpiralTrajectoryEdge> = {}) => ({
  id: `${from}-${to}`,
  from,
  to,
  ...extra,
});

/** a → b; b → c | d | e; c → f; d → g; e ends. Array order is deliberately misleading. */
const BRANCHING: SpiralTrajectory = {
  ...FIXTURE,
  id: "branching-fixture",
  shape: "branching",
  steps: ["a", "b", "c", "d", "e", "f", "g"].map(step),
  transitions: [
    edge("a", "b"),
    edge("b", "c", { outcome: "recovery" }),
    edge("b", "d", { outcome: "regime-shift", conditions: "Neutral fixture condition." }),
    edge("b", "e", { outcome: "collapse" }),
    edge("c", "f", { outcome: "reorganization" }),
    edge("d", "g", { outcome: "failure" }),
  ],
};

/** a → b → c → b, with an exit c → d. */
const LOOP: SpiralTrajectory = {
  ...FIXTURE,
  id: "loop-fixture",
  shape: "recurrent",
  steps: ["a", "b", "c", "d"].map(step),
  transitions: [edge("a", "b"), edge("b", "c"), edge("c", "b"), edge("c", "d")],
};

function topo(t: SpiralTrajectory): SpiralComparisonIssueCode[] {
  return validateTrajectoryTopology(t).map((i) => i.code);
}

check("2B.K current trajectories validate their topology", () => {
  for (const t of authoredTrajectories()) assert.deepEqual(topo(t), [], t.id);
});

check("2B.K legacy trajectories keep ordered topology", () => {
  assert.deepEqual(
    legacyTrajectories().map((t) => t.id).sort(),
    ["jesus-narrative", "metamorphosis", "zodiac-cycle"],
  );
  for (const t of legacyTrajectories()) {
    assert.equal(topologySource(t), "ordered", t.id);
    assert.deepEqual(
      trajectoryEdges(t).map((e) => [e.from, e.to]),
      t.steps.slice(1).map((s, i) => [t.steps[i]!.id, s.id]),
      t.id,
    );
  }
});

check("2B.L current relationship anchors resolve exactly as before", () => {
  const covered = (id: string) => {
    const r = SPIRAL_TRAJECTORY_RELATIONSHIPS.find((x) => x.id === id)!;
    const t = authoredTrajectories().find((x) => x.id === r.trajectoryId)!;
    return anchorStepIds(t, r.anchor);
  };
  assert.deepEqual(covered("jesus-res-transformation-death-resurrection"), [
    "death",
    "burial-silence",
    "resurrection",
  ]);
  assert.deepEqual(covered("meta-res-transformation-reorganization"), [
    "metamorphic-transition",
    "tissue-destruction",
    "tissue-remodeling",
  ]);
  assert.deepEqual(covered("zod-res-transformation-pisces-aries"), ["pisces", "aries-again"]);
});

check("2B rendered lenses hold only topology their figure draws", () => {
  // Wheel and path figures read steps in order; explicit transitions need
  // the topology figure, which draws exactly the authored edges.
  for (const t of authoredTrajectories()) {
    if (trajectoryFigureKind(t) === "topology") {
      assert.equal(topologySource(t), "explicit", t.id);
      assert.deepEqual(
        topologyLayout(t).routes.map((r) => r.edge.id),
        trajectoryEdges(t).map((e) => e.id),
        t.id,
      );
      continue;
    }
    assert.ok(["cyclical", "directional", "process"].includes(t.shape), t.id);
    assert.deepEqual(
      trajectoryEdges(t).map((e) => `${e.from}>${e.to}`),
      orderedEdges(t).map((e) => `${e.from}>${e.to}`),
      t.id,
    );
  }
});

check("2B.A every explicit transition must reference real steps", () => {
  assert.deepEqual(topo(BRANCHING), []);
  assert.deepEqual(
    topo({ ...BRANCHING, transitions: [...BRANCHING.transitions!, edge("g", "nowhere")] }),
    ["unknown-transition-step"],
  );
});

check("2B.B duplicate transition ids fail; duplicate from → to fails", () => {
  assert.deepEqual(
    topo({ ...BRANCHING, transitions: [...BRANCHING.transitions!, { ...edge("e", "g"), id: "a-b" }] }),
    ["duplicate-transition-id"],
  );
  assert.deepEqual(
    topo({ ...BRANCHING, transitions: [...BRANCHING.transitions!, { ...edge("a", "b"), id: "again" }] }),
    ["duplicate-transition"],
  );
});

check("2B.C branching or recurrent trajectory without explicit transitions fails", () => {
  assert.deepEqual(topo({ ...BRANCHING, transitions: undefined }), ["missing-explicit-transitions"]);
  assert.deepEqual(topo({ ...LOOP, transitions: undefined }), ["missing-explicit-transitions"]);
});

check("2B a linear shape cannot hide a branch", () => {
  assert.deepEqual(topo({ ...BRANCHING, shape: "directional" }), [
    "divergence-requires-branching-shape",
  ]);
});

check("2B every step of an explicit topology is connected", () => {
  assert.deepEqual(
    topo({ ...BRANCHING, steps: [...BRANCHING.steps, step("h")] }),
    ["unconnected-step"],
  );
});

check("2B.D explicit transitions are authoritative — no adjacency edges invented", () => {
  assert.ok(findEdge(BRANCHING, "b", "d"));
  for (const [from, to] of [["c", "d"], ["d", "e"], ["e", "f"], ["f", "g"]] as const) {
    assert.equal(findEdge(BRANCHING, from, to), undefined, `${from} → ${to}`);
    assert.deepEqual(
      codes([rel({ trajectoryId: BRANCHING.id, anchor: { kind: "transition", from, to } })], [BRANCHING]),
      ["unknown-transition"],
    );
  }
  assert.equal(trajectoryEdges(BRANCHING).length, 6);
});

check("2B a branch may end — sinks are derived, not flagged", () => {
  assert.deepEqual(sinkStepIds(BRANCHING), ["e", "f", "g"]);
  assert.deepEqual(
    outgoingEdges(BRANCHING, "b").map((e) => e.to),
    ["c", "d", "e"],
  );
});

/** a → b → c → b, with no way out. */
const CLOSED_LOOP: SpiralTrajectory = {
  ...LOOP,
  id: "closed-loop-fixture",
  steps: ["a", "b", "c"].map(step),
  transitions: [edge("a", "b"), edge("b", "c"), edge("c", "b")],
};

check("2B.E cycles are valid", () => {
  assert.deepEqual(topo(LOOP), []);
  assert.deepEqual(topo(CLOSED_LOOP), []);
  assert.deepEqual(sinkStepIds(CLOSED_LOOP), []);
  assert.deepEqual(topo({ ...CLOSED_LOOP, shape: "cyclical" }), []);
  assert.deepEqual(topo({ ...CLOSED_LOOP, transitions: [...CLOSED_LOOP.transitions!, edge("c", "c")] }), []);
});

check("2B.F malformed cycles fail only on bad references", () => {
  const malformed = {
    ...CLOSED_LOOP,
    transitions: [edge("a", "b"), edge("b", "c"), edge("c", "missing")],
  };
  assert.deepEqual(topo(malformed), ["unknown-transition-step"]);
});

check("2B.G ambiguous branch spans fail", () => {
  const span = (via?: string[]) =>
    codes([rel({ trajectoryId: BRANCHING.id, anchor: { kind: "span", from: "a", to: "f", via } })], [BRANCHING]);
  assert.deepEqual(span(), ["ambiguous-span"]);
  assert.deepEqual(span(["b"]), ["invalid-span-path"]);
  assert.deepEqual(span(["b", "d"]), ["invalid-span-path"]);
  assert.deepEqual(span(["b", "missing"]), ["invalid-span-path"]);
});

check("2B.H explicitly authored branch path validates and resolves exactly", () => {
  const r = rel({ trajectoryId: BRANCHING.id, anchor: { kind: "span", from: "a", to: "f", via: ["b", "c"] } });
  assert.deepEqual(codes([r], [BRANCHING]), []);
  assert.deepEqual(anchorStepIds(BRANCHING, r.anchor), ["a", "b", "c", "f"]);
  const direct = rel({ trajectoryId: BRANCHING.id, anchor: { kind: "span", from: "b", to: "e" } });
  assert.deepEqual(codes([direct], [BRANCHING]), []);
  assert.deepEqual(anchorStepIds(BRANCHING, direct.anchor), ["b", "e"]);
});

check("2B a span may follow a loop", () => {
  const r = rel({ trajectoryId: LOOP.id, anchor: { kind: "span", from: "a", to: "d", via: ["b", "c", "b", "c"] } });
  assert.deepEqual(codes([r], [LOOP]), []);
});

check("2B ordered spans: in order without via; reversed fails", () => {
  assert.deepEqual(codes([rel({ anchor: { kind: "span", from: "a", to: "c" } })]), []);
  assert.deepEqual(codes([rel({ anchor: { kind: "span", from: "c", to: "a" } })]), ["invalid-span-path"]);
  assert.deepEqual(codes([rel({ anchor: { kind: "span", from: "a", to: "c", via: ["b"] } })]), []);
  assert.deepEqual(codes([rel({ anchor: { kind: "span", from: "a", to: "c", via: ["c"] } })]), ["invalid-span-path"]);
});

check("2B.I outcomes are domain vocabulary and create no relationship", () => {
  const names = new Set<string>([
    ...SPIRAL_SEQUENCE.map((s) => s.stageId),
    ...SPIRAL_SEQUENCE.map((s) => (s.labelOverride ?? "").toLowerCase()),
    "organization", "disruption", "renewal", "transformation",
  ]);
  for (const o of SPIRAL_TRAJECTORY_OUTCOMES) assert.ok(!names.has(o), o);
  assert.equal(arcEndpointsFromRelationships([]).length, 0);
  // A record on a "failure" edge is drawn only by its own status and operations.
  const r = rel({ trajectoryId: BRANCHING.id, anchor: { kind: "transition", from: "d", to: "g" } });
  assert.deepEqual(arcEndpointsFromRelationships([r]).map((e) => e.occurrenceId), [TRANSFORMATION]);
  assert.equal(r.status, "candidate");
});

check("2B.J zero comparison records give zero arcs, whatever the topology", () => {
  for (const t of [BRANCHING, LOOP, FIXTURE]) {
    const records = SPIRAL_TRAJECTORY_RELATIONSHIPS.filter((r) => r.trajectoryId === t.id);
    assert.equal(records.length, 0, t.id);
    assert.equal(arcEndpointsFromRelationships(records).length, 0, t.id);
  }
});

check("2B a trajectory loop is not Emergence Again", () => {
  const r = rel({ trajectoryId: LOOP.id, anchor: { kind: "transition", from: "c", to: "b" } });
  assert.deepEqual(codes([r], [LOOP]), []);
  assert.deepEqual(arcEndpointsFromRelationships([r]).map((e) => e.occurrenceId), [TRANSFORMATION]);
});

check("2B comparison break on a collapse edge: valid record, no arc", () => {
  const r = rel({
    trajectoryId: BRANCHING.id,
    anchor: { kind: "transition", from: "b", to: "e" },
    status: "comparison-break",
  });
  assert.deepEqual(codes([r], [BRANCHING]), []);
  assert.equal(arcEndpointsFromRelationships([r]).length, 0);
});

check("2B trajectory-owned research resolves exactly once, never by guess", () => {
  const concept = { id: "fixture-concept", title: "Fixture concept", summary: "Neutral." };
  const owning: SpiralTrajectory = { ...FIXTURE, concepts: [concept] };
  const r = rel({ conceptId: "fixture-concept" });
  assert.deepEqual(codes([r], [owning]), []);
  assert.equal(resolveRelationshipConcept(r, owning)?.scope, "trajectory");
  assert.deepEqual(codes([rel({ conceptId: "nowhere" })], [owning]), ["unknown-concept"]);
  // Stage-local research for the trajectory's lens still resolves.
  const staged = rel({ conceptId: "bio-metamorphosis" });
  assert.deepEqual(codes([staged]), []);
  assert.equal(resolveRelationshipConcept(staged, FIXTURE)?.scope, "stage");
  // The same id in two scopes is refused, not chosen.
  const shadowing: SpiralTrajectory = {
    ...FIXTURE,
    concepts: [{ ...concept, id: "bio-metamorphosis" }],
  };
  assert.deepEqual(codes([staged], [shadowing]), ["ambiguous-concept"]);
  assert.equal(resolveRelationshipConcept(staged, shadowing), undefined);
  assert.deepEqual(
    topo({ ...FIXTURE, concepts: [concept, concept] }),
    ["duplicate-trajectory-concept"],
  );
});

check("2B current relationship concepts resolve: legacy to stage research, Ecology to its trajectory", () => {
  for (const r of SPIRAL_TRAJECTORY_RELATIONSHIPS.filter((x) => x.conceptId)) {
    const t = authoredTrajectories().find((x) => x.id === r.trajectoryId)!;
    const scope = r.trajectoryId === LODGEPOLE_FIRE_TRAJECTORY.id ? "trajectory" : "stage";
    assert.equal(resolveRelationshipConcept(r, t)?.scope, scope, r.id);
  }
});

check("2B scale is a controlled, flat vocabulary", () => {
  assert.deepEqual(codes([rel({ scale: { id: "organism", note: "Neutral." } })]), []);
  assert.deepEqual(
    codes([rel({ scale: { id: "cosmos" as SpiralScaleId } })]),
    ["unknown-scale"],
  );
  for (const id of SPIRAL_SCALE_IDS) {
    assert.ok(!SPIRAL_SEQUENCE.some((s) => (s.stageId as string) === id), id);
  }
  // Only Ecology records carry scale; Zodiac, Jesus and Biology are not backfilled.
  for (const r of SPIRAL_TRAJECTORY_RELATIONSHIPS) {
    assert.equal(r.scale !== undefined, r.trajectoryId === LODGEPOLE_FIRE_TRAJECTORY.id, r.id);
  }
});

check("2B topology module reads no relationships, operations, or geometry", () => {
  const source = readFileSync(path.resolve(__dirname, "../lib/evolutionary-spiral/topology.ts"), "utf8");
  const specs = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]);
  assert.deepEqual(specs, ["./types"]);
});

/* ------------------------------------------------------------------ */
/* Phase 2C.1 — trajectory provenance (synthetic sources only)        */
/* ------------------------------------------------------------------ */

const SOURCE: SpiralSourceRef = {
  id: "fixture-source",
  title: "Fixture title",
  authors: "Fixture A",
  year: 2000,
  doi: "10.0000/fixture",
};
const MODEL_SOURCE: SpiralSourceRef = {
  id: "fixture-model",
  title: "Fixture model",
  authors: "Fixture B",
  year: 2001,
};

/** `base` with edge b → d replaced; its sources are only those given. */
function withEdge(
  replacement: Partial<SpiralTrajectoryEdge>,
  base: SpiralTrajectory = BRANCHING,
): SpiralTrajectory {
  return {
    ...base,
    transitions: base.transitions!.map((e) =>
      e.id === "b-d" ? { ...e, sources: undefined, ...replacement } : e,
    ),
  };
}

/** Empirical standard with every other edge already sourced. */
const EMPIRICAL: SpiralTrajectory = {
  ...BRANCHING,
  id: "empirical-fixture",
  evidenceStandard: "empirical",
  transitions: BRANCHING.transitions!.map((e) => ({ ...e, sources: [SOURCE] })),
};

function sourceCodes(t: SpiralTrajectory): SpiralComparisonIssueCode[] {
  return validateTrajectorySources(t).map((i) => i.code);
}

check("2C.1.A model-projection is a valid epistemic kind with its own definition", () => {
  const kind: SpiralEpistemicKind = "model-projection";
  const cats = SPIRAL_EPISTEMIC_CATEGORIES.filter((c) => c.id === kind);
  assert.equal(cats.length, 1);
  assert.equal(epistemicLabel(kind), "Model projection");
  assert.match(cats[0]!.definition, /model/i);
  const ids = SPIRAL_EPISTEMIC_CATEGORIES.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
});

check("2C.1.B model-projection stays distinct from hypothesis and observation", () => {
  const def = (id: SpiralEpistemicKind) =>
    SPIRAL_EPISTEMIC_CATEGORIES.find((c) => c.id === id)!.definition;
  const others = ["hypothesis", "empirical-observation", "empirical-mechanism", "systems-principle"] as const;
  for (const id of others) {
    assert.notEqual(def("model-projection"), def(id), id);
    assert.notEqual(epistemicLabel("model-projection"), epistemicLabel(id), id);
  }
  // A projection edge is not satisfied the way a hypothesis edge is.
  assert.deepEqual(sourceCodes(withEdge({ epistemicKinds: ["hypothesis"] })), []);
  assert.deepEqual(sourceCodes(withEdge({ epistemicKinds: ["model-projection"] })), [
    "unsourced-model-projection",
  ]);
});

check("2C.1 visitor legend is unchanged; model-projection is not yet shown", () => {
  assert.ok(!SPIRAL_EPISTEMIC_LEGEND.some((c) => c.id === "model-projection"));
  assert.deepEqual(
    SPIRAL_EPISTEMIC_LEGEND.map((c) => c.id),
    SPIRAL_EPISTEMIC_CATEGORIES.map((c) => c.id).filter((id) => id !== "model-projection"),
  );
});

check("2C.1.C an edge may carry sources", () => {
  const t = withEdge({ sources: [SOURCE, MODEL_SOURCE] });
  assert.deepEqual(sourceCodes(t), []);
  assert.deepEqual(codes([], [t]), []);
  assert.deepEqual(findEdge(t, "b", "d")?.sources?.map((s) => s.id), ["fixture-source", "fixture-model"]);
});

check("2C.1.D duplicate source ids on one edge fail", () => {
  assert.deepEqual(sourceCodes(withEdge({ sources: [SOURCE, SOURCE] })), ["duplicate-edge-source"]);
  assert.deepEqual(codes([], [withEdge({ sources: [SOURCE, SOURCE] })]), ["duplicate-edge-source"]);
});

check("2C.1 the same source may support several edges, but must not change identity", () => {
  const shared: SpiralTrajectory = {
    ...BRANCHING,
    transitions: BRANCHING.transitions!.map((e) => ({ ...e, sources: [SOURCE] })),
  };
  assert.deepEqual(sourceCodes(shared), []);
  const perEdgeClaim = withEdge({ sources: [{ ...SOURCE, supports: "Edge-specific claim." }] }, shared);
  assert.deepEqual(sourceCodes(perEdgeClaim), []);
  const drifted = withEdge({ sources: [{ ...SOURCE, year: 2009 }] }, shared);
  assert.deepEqual(sourceCodes(drifted), ["conflicting-source-metadata"]);
});

check("2C.1 malformed sources fail; omitted bibliographic fields stay valid", () => {
  assert.deepEqual(sourceCodes(withEdge({ sources: [{ ...SOURCE, id: " " }] })), ["invalid-edge-source"]);
  assert.deepEqual(
    sourceCodes(withEdge({ sources: [{ ...SOURCE, doi: "https://doi.org/10.0000/fixture" }] })),
    ["invalid-edge-source"],
  );
  assert.deepEqual(sourceCodes(withEdge({ sources: [{ id: "bare-slot" }] })), []);
});

check("2C.1 validation never fills or alters source metadata", () => {
  const sparse: SpiralSourceRef = Object.freeze({ id: "sparse" });
  const t = withEdge({ sources: Object.freeze([sparse]) }, EMPIRICAL);
  const before = JSON.stringify(t);
  validateSpiralComparisons([], [t]);
  assert.equal(JSON.stringify(t), before);
  assert.deepEqual(Object.keys(sparse), ["id"]);
});

check("2C.1.E edge sources create zero arcs and no relationships", () => {
  const sourced = EMPIRICAL;
  assert.deepEqual(codes([], [sourced]), []);
  const records = SPIRAL_TRAJECTORY_RELATIONSHIPS.filter((r) => r.trajectoryId === sourced.id);
  assert.equal(records.length, 0);
  assert.equal(arcEndpointsFromRelationships(records).length, 0);
  assert.equal(arcEndpointsForTrajectory(sourced.id).length, 0);
});

check("2C.1.F model-projection edge cannot pass without a citable source", () => {
  const projected = { epistemicKinds: ["model-projection"] as SpiralEpistemicKind[] };
  for (const base of [BRANCHING, EMPIRICAL]) {
    assert.deepEqual(sourceCodes(withEdge(projected, base)), ["unsourced-model-projection"]);
    assert.deepEqual(
      sourceCodes(withEdge({ ...projected, sources: [{ ...MODEL_SOURCE, placeholder: true }] }, base)),
      ["unsourced-model-projection"],
    );
    assert.deepEqual(
      sourceCodes(withEdge({ ...projected, sources: [{ id: "fixture-model", title: "Fixture model" }] }, base)),
      ["unsourced-model-projection"],
    );
    assert.deepEqual(sourceCodes(withEdge({ ...projected, sources: [MODEL_SOURCE] }, base)), []);
  }
});

check("2C.1.G empirical edge claims cannot ship source-free under the empirical standard", () => {
  const unsourced = (extra: Partial<SpiralTrajectoryEdge>) =>
    sourceCodes(withEdge({ outcome: undefined, conditions: undefined, ...extra }, EMPIRICAL));
  assert.deepEqual(unsourced({ epistemicKinds: ["empirical-observation"] }), ["unsourced-evidence-edge"]);
  assert.deepEqual(unsourced({ epistemicKinds: ["empirical-mechanism"] }), ["unsourced-evidence-edge"]);
  assert.deepEqual(unsourced({ conditions: "Neutral fixture condition." }), ["unsourced-evidence-edge"]);
  assert.deepEqual(unsourced({ outcome: "failure" }), ["unsourced-evidence-edge"]);
  assert.deepEqual(
    unsourced({ epistemicKinds: ["empirical-observation"], sources: [SOURCE] }),
    [],
  );
  // A bare from → to asserts nothing and needs no source.
  assert.deepEqual(unsourced({}), []);
  assert.ok(!edgeAssertsEvidence(edge("a", "b")));
  // Without the standard, the same claims carry no requirement.
  assert.deepEqual(
    sourceCodes(withEdge({ epistemicKinds: ["empirical-observation"], conditions: "Neutral." })),
    [],
  );
});

check("2C.1 a source counts as support only when a reader could find it", () => {
  assert.ok(isCitableSource(SOURCE));
  assert.ok(isCitableSource(MODEL_SOURCE));
  assert.ok(!isCitableSource({ ...SOURCE, placeholder: true }));
  assert.ok(!isCitableSource({ id: "x", title: "Only a title" }));
  assert.ok(!isCitableSource({ id: "x", authors: "A", year: 2000 }));
  assert.ok(isCitableSource({ id: "x", authors: "A", year: 2000, url: "https://example.org" }));
});

check("2C.1.H existing Jesus, Zodiac and Metamorphosis data validate unchanged", () => {
  const ids = authoredTrajectories().map((t) => t.id).sort();
  assert.deepEqual(ids, ["jesus-narrative", "lodgepole-fire-regeneration", "metamorphosis", "zodiac-cycle"]);
  for (const t of legacyTrajectories()) {
    assert.deepEqual(validateTrajectorySources(t), [], t.id);
    assert.equal(t.evidenceStandard, undefined, t.id);
    assert.equal(t.transitions, undefined, t.id);
    assert.ok(!JSON.stringify(t).includes("model-projection"), t.id);
  }
  assert.ok(!JSON.stringify(SPIRAL_TRAJECTORY_RELATIONSHIPS).includes("model-projection"));
});

check("2C.1.I arc counts: Zodiac 4, Jesus 1, Biology 1, Ecology 1, all others 0", () => {
  const expected: Record<string, number> = {
    "symbolic-zodiac": 4,
    "biblical-textual": 1,
    "living-systems": 1,
    ecology: 1,
  };
  for (const lensId of ["systems", "living-systems", "psychology", "ecology", "biblical-textual", "symbolic-zodiac", "across"] as const) {
    assert.equal(arcEndpointsForTrajectory(trajectoryFor(lensId)?.id).length, expected[lensId] ?? 0, lensId);
  }
});

check("2C.1.J Emergence Again receives no relationship or arc", () => {
  for (const r of SPIRAL_TRAJECTORY_RELATIONSHIPS) {
    assert.ok(!occurrencesForRelationship(r).some((s) => s.occurrenceId === EMERGENCE_AGAIN), r.id);
  }
  for (const t of authoredTrajectories()) {
    assert.ok(!arcEndpointsForTrajectory(t.id).some((e) => e.occurrenceId === EMERGENCE_AGAIN), t.id);
  }
});

check("2C.1.K both Phase 2A approval lists remain empty", () => {
  assert.equal(EMERGENCE_AGAIN_APPROVED_RELATIONSHIP_IDS.length, 0);
  assert.equal(SPIRAL_NAME_COLLISION_ACKNOWLEDGEMENTS.length, 0);
});

check("2C.1.L provenance module reads no canonical data, relationships, or geometry", () => {
  const source = readFileSync(path.resolve(__dirname, "../lib/evolutionary-spiral/comparisons/sources.ts"), "utf8");
  const specs = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]);
  assert.deepEqual(specs, ["../types", "./validate"]);
});

/* ------------------------------------------------------------------ */
/* Phase 2D — Greater Yellowstone lodgepole trajectory                 */
/* ------------------------------------------------------------------ */

const LP = LODGEPOLE_FIRE_TRAJECTORY;
const LP_STEPS = [
  "mature-stand",
  "crown-fire",
  "burned-stand",
  "establishment",
  "dense-cohort",
  "sparse-cohort",
  "minimal-recruitment",
  "young-stand",
  "sparse-woodland",
  "reburn",
];
const LP_EDGES: [string, string, SpiralTrajectoryOutcome | undefined][] = [
  ["mature-stand", "crown-fire", undefined],
  ["crown-fire", "burned-stand", undefined],
  ["burned-stand", "establishment", "continues"],
  ["establishment", "dense-cohort", undefined],
  ["establishment", "sparse-cohort", undefined],
  ["establishment", "minimal-recruitment", "failure"],
  ["dense-cohort", "young-stand", "continues"],
  ["sparse-cohort", "young-stand", undefined],
  ["sparse-cohort", "sparse-woodland", "reorganization"],
  ["young-stand", "mature-stand", "recovery"],
  ["young-stand", "reburn", undefined],
  ["reburn", "sparse-cohort", undefined],
  ["reburn", "minimal-recruitment", "failure"],
];

check("2D lodgepole validates with the build-gate validator, alongside the other live data", () => {
  assert.ok(authoredTrajectories().some((t) => t.id === LP.id));
  assert.deepEqual(
    validateSpiralComparisons(SPIRAL_TRAJECTORY_RELATIONSHIPS, authoredTrajectories()),
    [],
  );
});

check("2D.A lodgepole trajectory validates: topology, sources, names", () => {
  assert.deepEqual(validateTrajectoryTopology(LP), []);
  assert.deepEqual(validateTrajectorySources(LP), []);
  assert.deepEqual(validateSpiralComparisons([], [LP]), []);
});

check("2D.B/C empirical standard, branching shape, ecology lens", () => {
  assert.equal(LP.evidenceStandard, "empirical");
  assert.equal(LP.shape, "branching");
  assert.equal(LP.lensId, "ecology");
});

check("2D.D explicit topology is used", () => {
  assert.equal(topologySource(LP), "explicit");
});

check("2D.E expected steps exist, in authored order", () => {
  assert.deepEqual(LP.steps.map((s) => s.id), LP_STEPS);
});

check("2D.F expected edges and outcomes exist — and nothing else", () => {
  assert.deepEqual(
    trajectoryEdges(LP).map((e) => [e.from, e.to, e.outcome]),
    LP_EDGES,
  );
});

check("2D.G no adjacency edges are invented from step order", () => {
  const authored = new Set(LP_EDGES.map(([f, t]) => `${f}>${t}`));
  for (const e of orderedEdges(LP)) {
    if (authored.has(`${e.from}>${e.to}`)) continue;
    assert.equal(findEdge(LP, e.from, e.to), undefined, `${e.from} → ${e.to}`);
  }
  assert.equal(trajectoryEdges(LP).length, LP_EDGES.length);
});

check("2D.H both loops are representable as authored paths", () => {
  const span = (from: string, to: string, via: string[]) =>
    resolveSpan(LP, { kind: "span", from, to, via });
  assert.ok(span("mature-stand", "mature-stand", ["crown-fire", "burned-stand", "establishment", "dense-cohort", "young-stand"]).ok);
  assert.ok(span("young-stand", "young-stand", ["reburn", "sparse-cohort"]).ok);
});

check("2D.I/J minimal recruitment and sparse woodland are the only sinks", () => {
  assert.deepEqual(sinkStepIds(LP), ["minimal-recruitment", "sparse-woodland"]);
});

check("2D.K a sink is where evidence stops, not a terminal ecological state", () => {
  const issue = LP.researchIssues?.find((i) => i.id === "lp-unknown-futures");
  assert.ok(issue);
  assert.match(issue.body ?? "", /observed future remains uncertain/);
  assert.match(issue.body ?? "", /not a terminal ecological state/);
  assert.match(LP.framing ?? "", /not terminal ecological states/);
  for (const sink of sinkStepIds(LP)) {
    const step = LP.steps.find((s) => s.id === sink)!;
    assert.deepEqual(Object.keys(step).sort(), ["id", "label"], sink);
  }
  // "failure" is scoped to an observational window wherever it is used.
  for (const e of trajectoryEdges(LP).filter((x) => x.outcome === "failure")) {
    assert.match(e.conditions ?? "", /within the observed window/, e.id);
  }
});

check("2D.L every claim-bearing edge cites a citable source", () => {
  for (const e of trajectoryEdges(LP)) {
    assert.ok(edgeAssertsEvidence(e), e.id);
    assert.ok((e.sources ?? []).some(isCitableSource), e.id);
    for (const s of e.sources ?? []) assert.ok(s.supports?.trim(), `${e.id}/${s.id}`);
  }
});

check("2D.L sources are only the verified dossier set, with stable identity", () => {
  const ids = new Set(LP.sources!.map((s) => s.id));
  assert.equal(ids.size, LP.sources!.length);
  const cited = [
    ...trajectoryEdges(LP).flatMap((e) => e.sources ?? []),
    ...(LP.concepts ?? []).flatMap((c) => c.sources ?? []),
  ];
  for (const s of cited) {
    const base = LP.sources!.find((x) => x.id === s.id);
    assert.ok(base, s.id);
    const { supports: _ignored, ...identity } = s;
    assert.deepEqual(identity, base, s.id);
  }
  const kashian = LP.sources!.find((s) => s.id === "kashian-2005")!;
  assert.equal(kashian.doi, undefined);
  assert.equal(kashian.url, "https://www.jstor.org/stable/3450659");
  for (const forbidden of ["donato", "davis", "walker"]) {
    assert.ok(![...ids].some((id) => id.includes(forbidden)), forbidden);
  }
});

check("2D.M model projections are research, never observed topology", () => {
  for (const e of trajectoryEdges(LP)) {
    assert.ok(!e.epistemicKinds?.includes("model-projection"), e.id);
    for (const s of e.sources ?? []) {
      assert.ok(!["hansen-2018", "turner-2022", "westerling-2011"].includes(s.id), `${e.id}/${s.id}`);
    }
  }
  const projections = LP.concepts?.find((c) => c.id === "lp-projections");
  assert.ok(projections?.epistemicKinds?.includes("model-projection"));
  for (const id of ["hansen-2018", "turner-2022", "westerling-2011"]) {
    assert.ok(projections!.sources!.some((s) => s.id === id && isCitableSource(s)), id);
  }
});

check("2D.N no nonforest or regime-shift branch exists", () => {
  for (const e of trajectoryEdges(LP)) {
    assert.ok(!["regime-shift", "collapse"].includes(e.outcome ?? ""), e.id);
  }
  for (const s of LP.steps) {
    assert.ok(!/nonforest|non-forest|grass|steppe|shrub|regime/i.test(s.label), s.id);
  }
});

check("2D.O no Douglas-fir step or claim is merged in", () => {
  assert.ok(!/douglas/i.test(JSON.stringify(LP)));
});

check("2D.P/Q (2N) exactly the three authored Spiral records, one arc", () => {
  assert.equal(relationshipsForTrajectory(LP.id).length, 3);
  assert.deepEqual(
    SPIRAL_TRAJECTORY_RELATIONSHIPS.filter((r) => r.trajectoryId === LP.id),
    [...LODGEPOLE_RELATIONSHIPS],
  );
  assert.equal(arcEndpointsForTrajectory(LP.id).length, 1);
});

check("2D.R no operation-name collision acknowledgement is needed", () => {
  const names = new Set(SPIRAL_SEQUENCE.flatMap((s) => [s.stageId, (s.labelOverride ?? "").toLowerCase()]));
  for (const s of LP.steps) assert.ok(!names.has(s.label.trim().toLowerCase()), s.id);
  assert.ok(!validateSpiralComparisons([], [LP]).some((i) => i.code === "unacknowledged-name-collision"));
  assert.equal(SPIRAL_NAME_COLLISION_ACKNOWLEDGEMENTS.length, 0);
});

check("2D.S Emergence Again remains untouched", () => {
  assert.equal(EMERGENCE_AGAIN_APPROVED_RELATIONSHIP_IDS.length, 0);
  assert.ok(!arcEndpointsForTrajectory(LP.id).some((e) => e.occurrenceId === EMERGENCE_AGAIN));
});

check("2E live in Ecology only; Systems and Psychology stay uncharted", () => {
  assert.equal(getTrajectory("ecology", LP.id), LP);
  assert.equal(defaultTrajectoryId("ecology"), LP.id);
  assert.deepEqual(getSpiralLens("ecology")?.trajectories.map((t) => t.id), [LP.id]);
  for (const lensId of ["systems", "psychology"] as const) {
    assert.equal(getSpiralLens(lensId)?.trajectories.length, 0, lensId);
    assert.equal(defaultTrajectoryId(lensId), null, lensId);
  }
  for (const lens of SPIRAL_LENSES) {
    assert.ok(!("heldTrajectories" in lens), lens.id);
    if (lens.id !== "ecology") assert.ok(!lens.trajectories.some((t) => t.id === LP.id), lens.id);
  }
});

check("2D.T existing trajectories and relationships are byte-identical", () => {
  const hash = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
  const expected: Record<string, string> = {
    metamorphosis: "c059fe5f37ce91b2b301b677aeb7b43ece0ee527650bb937b15d2223bd36909a",
    "jesus-narrative": "6b230ed587183d774a65c42a6c42557fa19c8d62692c77fc991d0a72f86c86a3",
    "zodiac-cycle": "a7ef82d16d2f701d9f4751894ce30092e6f162bb989a827b17647a464e024c9d",
  };
  assert.deepEqual(
    Object.fromEntries(legacyTrajectories().map((t) => [t.id, hash(t)])),
    expected,
  );
  assert.equal(
    hash(SPIRAL_TRAJECTORY_RELATIONSHIPS.filter((r) => r.trajectoryId !== LP.id)),
    // Phase 2N: Capricorn → Aquarius candidate → ambiguous is the only change.
    "f69796d7fdf1e809c0dcd5898ba65722fa892b0d05ae940bbada51bb0510b054",
  );
});

check("2D snapshot: arc counts with the lodgepole trajectory live", () => {
  const expected: Record<string, number> = {
    "symbolic-zodiac": 4,
    "biblical-textual": 1,
    "living-systems": 1,
    ecology: 1,
  };
  for (const lensId of ["systems", "living-systems", "psychology", "ecology", "biblical-textual", "symbolic-zodiac", "across"] as const) {
    assert.equal(arcEndpointsForTrajectory(trajectoryFor(lensId)?.id).length, expected[lensId] ?? 0, lensId);
  }
});

/* ------------------------------------------------------------------ */
/* Phase 2E — topology-aware trajectory figure                         */
/* ------------------------------------------------------------------ */

const noop = () => {};

function renderFigure(
  t: SpiralTrajectory,
  extra: Partial<React.ComponentProps<typeof SpiralTrajectoryFigure>> = {},
): string {
  return renderToStaticMarkup(
    React.createElement(SpiralTrajectoryFigure, {
      trajectory: t,
      relationships: relationshipsForTrajectory(t.id),
      activeIds: new Set<string>(),
      selectedStepId: null,
      onSelectStep: noop,
      onSelectRelationship: noop,
      ...extra,
    }),
  );
}

function renderCard(focus: React.ComponentProps<typeof SpiralLocalCard>["focus"]): string {
  return renderToStaticMarkup(
    React.createElement(SpiralLocalCard, {
      focus,
      lens: getSpiralLens("ecology"),
      trajectory: LP,
      intersection: undefined,
      onSelectOccurrence: noop,
      onSelectRelationship: noop,
      onSelectStep: noop,
      onSelectEdge: noop,
      relationshipCount: 0,
      onClose: noop,
      exploreOpen: true,
      onExploreToggle: noop,
      investigateOpen: true,
      onInvestigateToggle: noop,
      conceptId: null,
      onConceptChange: noop,
      onOpenConcept: noop,
      cardId: "card",
      exploreId: "explore",
      investigateId: "investigate",
    }),
  );
}

/** Drawn edges: [id, from, to] from the figure's markup. */
function drawnEdges(html: string): [string, string, string][] {
  return [
    ...html.matchAll(
      /<path[^>]*class="spiral-topology__edge(?: [^"]*)?"[^>]*data-edge-id="([^"]+)" data-from="([^"]+)" data-to="([^"]+)"/g,
    ),
  ].map((m) => [m[1]!, m[2]!, m[3]!]);
}

function stepButton(html: string, stepId: string): string {
  const m = html.match(new RegExp(`<button[^>]*data-step-id="${stepId}"[^>]*>`));
  assert.ok(m, stepId);
  return m[0];
}

/**
 * Converges (b, c → d), loops on itself (d → d), returns (e → b), and
 * stops in two places (f, g). Array order is deliberately misleading.
 */
const TANGLED: SpiralTrajectory = {
  ...FIXTURE,
  id: "tangled-fixture",
  shape: "branching",
  steps: ["g", "e", "a", "f", "d", "c", "b"].map(step),
  transitions: [
    edge("a", "b"),
    edge("a", "c"),
    edge("b", "d"),
    edge("c", "d"),
    edge("d", "d"),
    edge("d", "e"),
    edge("e", "b", { outcome: "recovery" }),
    edge("e", "f"),
    edge("c", "g", { outcome: "failure", conditions: "Neutral, within the observed window." }),
  ],
};

check("2E.1 the topology figure draws exactly the authored edges, in authored order", () => {
  for (const t of [LP, BRANCHING, LOOP, TANGLED]) {
    assert.deepEqual(
      drawnEdges(renderFigure(t)),
      trajectoryEdges(t).map((e) => [e.id, e.from, e.to]),
      t.id,
    );
  }
});

check("2E.2 no edge is derived from array order or position", () => {
  for (const t of [LP, BRANCHING, TANGLED]) {
    const authored = new Set(trajectoryEdges(t).map((e) => `${e.from}>${e.to}`));
    const drawn = new Set(drawnEdges(renderFigure(t)).map(([, f, to]) => `${f}>${to}`));
    for (const e of orderedEdges(t)) {
      if (!authored.has(`${e.from}>${e.to}`)) assert.ok(!drawn.has(`${e.from}>${e.to}`), `${t.id}: ${e.from} → ${e.to}`);
    }
    // Reordering steps changes no edge.
    const reversed = { ...t, steps: [...t.steps].reverse() };
    assert.deepEqual(
      topologyLayout(reversed).routes.map((r) => [r.edge.from, r.edge.to]),
      topologyLayout(t).routes.map((r) => [r.edge.from, r.edge.to]),
      t.id,
    );
  }
});

check("2E.3 all thirteen lodgepole edges are drawn, at every width", () => {
  assert.equal(drawnEdges(renderFigure(LP)).length, 13);
  for (const width of [Infinity, 1280, 516, 447, 343, 300]) {
    const layout = fitTopologyLayout(LP, width);
    assert.equal(layout.routes.length, 13, String(width));
    assert.equal(layout.nodes.length, LP.steps.length, String(width));
    for (const r of layout.routes) assert.ok(!/NaN|Infinity/.test(r.d), `${width}: ${r.edge.id}`);
  }
  // The narrow phone column (390 px less padding) still fits, labels included.
  const phone = fitTopologyLayout(LP, 343);
  assert.ok(phone.width + phone.gutter.left + phone.gutter.right <= 343);
});

check("2E.4 both lodgepole loops are drawn, closing against the flow", () => {
  assert.deepEqual([...returningEdgeIds(LP)].sort(), ["reburn-to-sparse", "young-to-mature"]);
  const html = renderFigure(LP);
  for (const id of ["young-to-mature", "reburn-to-sparse"]) {
    assert.match(html, new RegExp(`class="spiral-topology__edge spiral-topology__edge--return[^"]*"[^>]*data-edge-id="${id}"`), id);
  }
  const layout = topologyLayout(LP);
  const nodeAt = new Map(layout.nodes.map((n) => [n.step.id, n]));
  for (const r of layout.routes) {
    const from = nodeAt.get(r.edge.from)!;
    const to = nodeAt.get(r.edge.to)!;
    assert.equal(r.returns, to.layer <= from.layer, r.edge.id);
  }
  // Self-loops and returns in a general fixture.
  const tangled = topologyLayout(TANGLED);
  assert.deepEqual(
    tangled.routes.filter((r) => r.returns).map((r) => r.edge.id),
    ["d-d", "e-b"],
  );
  assert.ok(tangled.routes.find((r) => r.edge.id === "d-d")!.self);
});

check("2E.5 both sinks are drawn as open futures, sharing the last row", () => {
  const layout = topologyLayout(LP);
  const sinks = layout.nodes.filter((n) => n.sink).map((n) => n.step.id).sort();
  assert.deepEqual(sinks, ["minimal-recruitment", "sparse-woodland"]);
  const last = layout.layers - 1;
  for (const n of layout.nodes) assert.equal(n.layer === last, n.sink, n.step.id);
  const html = renderFigure(LP);
  for (const id of sinks) assert.match(stepButton(html, id), /spiral-topology__step--open/, id);
  const tangled = topologyLayout(TANGLED);
  assert.deepEqual(tangled.nodes.filter((n) => n.sink).map((n) => n.step.id).sort(), ["f", "g"]);
});

check("2E.6 sinks carry no terminal semantics", () => {
  const html = renderFigure(LP);
  for (const id of sinkStepIds(LP)) {
    const button = stepButton(html, id);
    assert.match(button, /observed future remains uncertain/, id);
    assert.ok(!/\b(end|ends|ended|terminal|dead|final)\b/i.test(button), id);
    const card = renderCard({ kind: "step", stepId: id });
    assert.match(card, /The observed future remains uncertain\./, id);
    assert.ok(!/\b(terminal|dead end|final state)\b/i.test(card), id);
  }
  assert.match(html, /Paths show sequence, not proportional time\./);
  assert.match(html, /the observed future remains uncertain/);
  assert.ok(!/[✕✗×✖⊗]/.test(html));
  const css = readFileSync(path.resolve(__dirname, "../components/evolutionary-spiral/evolutionary-spiral.css"), "utf8");
  const topologyCss = css.slice(css.indexOf(".spiral-topology"), css.indexOf("/*", css.lastIndexOf(".spiral-topology")));
  assert.ok(topologyCss.length > 0);
  assert.ok(!/\bred\b|crimson|#f00|danger|error/i.test(topologyCss));
});

check("2E.7 model projections never become an edge, a dash, or the general legend", () => {
  const withProjection: SpiralTrajectory = {
    ...LP,
    concepts: [...(LP.concepts ?? []), { id: "extra", title: "Extra", epistemicKinds: ["model-projection"] } as never],
  };
  assert.deepEqual(
    topologyLayout(withProjection).routes.map((r) => r.edge.id),
    topologyLayout(LP).routes.map((r) => r.edge.id),
  );
  const html = renderFigure(LP);
  assert.ok(!/projection/i.test(html));
  assert.ok(!/<path[^>]*class="spiral-topology__edge[^>]*stroke-dasharray/.test(html));
  const css = readFileSync(path.resolve(__dirname, "../components/evolutionary-spiral/evolutionary-spiral.css"), "utf8");
  for (const [, rule] of css.matchAll(/\.spiral-topology__edge[^{]*\{([^}]*)\}/g)) {
    assert.ok(!/dasharray/.test(rule!), rule);
  }
  assert.ok(!SPIRAL_EPISTEMIC_LEGEND.some((c) => c.id === "model-projection"));
});

check("2E.8 (2H) Ecology anchors appear only where records are authored", () => {
  assert.equal(trajectoryFor("ecology")?.id, LP.id);
  const html = renderFigure(LP);
  const anchors = [...html.matchAll(/data-rel-anchor="([^"]+)"/g)].map((m) => m[1]).sort();
  assert.deepEqual(anchors, [...LODGEPOLE_RELATIONSHIPS.map((r) => r.id)].sort());
});

check("2E.9 a comparison break on the trajectory never becomes an arc", () => {
  const breakRel = rel({
    trajectoryId: LP.id,
    anchor: { kind: "transition", from: "young-stand", to: "mature-stand" },
    status: "comparison-break",
  });
  assert.equal(arcEndpointsFromRelationships([breakRel]).length, 0);
  assert.ok(LP.concepts?.some((c) => c.comparisonBreaks));
  const breaks = relationshipsForTrajectory(LP.id).filter((r) => r.status === "comparison-break");
  assert.equal(arcEndpointsFromRelationships(breaks).length, 0);
});

check("2E.10 legacy trajectories render through their existing figures, unchanged", () => {
  // Hashes of the pre-2E figure's markup for the same props.
  const expected: Record<string, [string, string]> = {
    metamorphosis: ["path", "0854de1a3370eb772e8a913bbd2650770b2a304f8e7dab837d5b348fd24835e6"],
    "jesus-narrative": ["path", "69aa818b74d43c51e0fbfab24018bf4b59d8856ab13c9e78571eaa1022edea65"],
    // Phase 2N: only the Capricorn → Aquarius arc class changes (candidate → ambiguous).
    "zodiac-cycle": ["wheel", "d7e220e91b92fa98b2cba48bbf6a10d44589c5e13630820f78b3c20f8eee59a4"],
  };
  const hash = (v: string) => createHash("sha256").update(v).digest("hex");
  for (const t of legacyTrajectories()) {
    const [kind, digest] = expected[t.id]!;
    assert.equal(trajectoryFigureKind(t), kind, t.id);
    const html = renderFigure(t);
    assert.ok(!html.includes("spiral-topology"), t.id);
    assert.equal(hash(html), digest, t.id);
  }
  assert.equal(trajectoryFigureKind(LP), "topology");
});

check("2E.11 the topology layout reads only steps and authored transitions", () => {
  const source = readFileSync(path.resolve(__dirname, "../lib/evolutionary-spiral/topology-layout.ts"), "utf8");
  const specs = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]);
  assert.deepEqual(specs, ["./types", "./topology"]);
  // Labels, relationships, and Spiral geometry change nothing.
  const relabelled = { ...LP, steps: LP.steps.map((s) => ({ ...s, label: "Transformation" })) };
  const strip = (l: ReturnType<typeof topologyLayout>) =>
    JSON.stringify({ n: l.nodes.map((n) => [n.step.id, n.x, n.y, n.layer]), r: l.routes.map((r) => r.d) });
  assert.equal(strip(topologyLayout(relabelled)), strip(topologyLayout(LP)));
});

check("2E.12 no Spiral operation is inferred from an outcome", () => {
  const operationNames = [...new Set(SPIRAL_SEQUENCE.map((s) => s.stageId))].map(
    (id) => id[0]!.toUpperCase() + id.slice(1),
  );
  const figure = renderFigure(LP);
  for (const outcome of SPIRAL_TRAJECTORY_OUTCOMES) assert.ok(!figure.includes(outcome), outcome);
  // Only edges an authored record is anchored to name an operation.
  const anchoredEdges: Record<string, string> = {
    "young-to-reburn": "Disruption",
    "young-to-mature": "Renewal",
  };
  for (const e of trajectoryEdges(LP)) {
    const card = renderCard({ kind: "transition", edge: e });
    const named = anchoredEdges[e.id];
    for (const name of operationNames) {
      assert.equal(new RegExp(`\\b${name}\\b`).test(card), name === named, `${e.id}: ${name}`);
    }
    assert.equal(card.includes("spiral-card__anchor-op"), Boolean(named), e.id);
    assert.ok(!card.includes(", defined:"), e.id);
    if (e.outcome === "failure") assert.match(card, /failure within the observed window/, e.id);
  }
});

check("2E.13 Zodiac 4, Jesus 1, Biology 1, Ecology 1 arcs; Systems, Psychology 0", () => {
  const expected: Record<string, number> = {
    "symbolic-zodiac": 4,
    "biblical-textual": 1,
    "living-systems": 1,
    ecology: 1,
  };
  for (const lens of SPIRAL_LENSES) {
    assert.equal(arcEndpointsForTrajectory(trajectoryFor(lens.id)?.id).length, expected[lens.id] ?? 0, lens.id);
  }
});

check("2E.14 Emergence Again receives nothing", () => {
  assert.equal(EMERGENCE_AGAIN_APPROVED_RELATIONSHIP_IDS.length, 0);
  for (const t of authoredTrajectories()) {
    assert.equal(arcEndpointsForTrajectory(t.id).filter((e) => e.occurrenceId === EMERGENCE_AGAIN).length, 0, t.id);
  }
});

check("2E.15 Spiral data stays apart from canonical data", () => {
  const dir = path.resolve(__dirname, "../lib/evolutionary-spiral");
  for (const file of ["topology-layout.ts", "topology.ts", "lenses.ts"]) {
    const source = readFileSync(path.join(dir, file), "utf8");
    assert.ok(!/canonical/.test(source), file);
  }
});

check("2E.16 accessibility: named, pressable steps; decorative drawing", () => {
  const html = renderFigure(LP, { selectedStepId: "establishment", onSelectEdge: noop });
  assert.match(html, /<ol class="spiral-topology__steps" aria-label="Lodgepole pine regeneration after stand-replacing fire — steps">/);
  assert.match(html, /<svg[^>]*aria-hidden="true"/);
  for (const s of LP.steps) {
    const button = stepButton(html, s.id);
    assert.match(button, /type="button"/, s.id);
    assert.match(button, new RegExp(`aria-pressed="${s.id === "establishment"}"`), s.id);
    const label = button.match(/aria-label="([^"]+)"/)?.[1] ?? "";
    assert.ok(label.startsWith(s.label), s.id);
    const into = incomingEdges(LP, s.id);
    if (into.length === 0) assert.match(label, /Where this trajectory begins/, s.id);
    for (const e of outgoingEdges(LP, s.id)) {
      const to = LP.steps.find((x) => x.id === e.to)!.label;
      assert.ok(label.includes(to), `${s.id} → ${e.to}`);
    }
  }
  // Pointer targets for edges sit inside the hidden drawing; keyboard reaches
  // transitions through the local card's lists instead.
  assert.ok(!/<path[^>]*tabindex/i.test(html));
  const card = renderCard({ kind: "step", stepId: "establishment" });
  assert.match(card, /Arrives from/);
  assert.match(card, /Leads to/);
  assert.equal((card.match(/<button/g) ?? []).length >= 4, true);
});

check("2E.17 a trajectory goes live only where its figure can draw it", () => {
  for (const lens of SPIRAL_LENSES) {
    for (const t of lens.trajectories) {
      const kind = trajectoryFigureKind(t);
      if (topologySource(t) === "explicit") {
        assert.equal(kind, "topology", t.id);
        assert.equal(topologyLayout(t).routes.length, trajectoryEdges(t).length, t.id);
      } else {
        assert.notEqual(kind, "topology", t.id);
      }
    }
  }
});

check("2E zero-relationship copy never claims no relationship exists", () => {
  const dir = path.resolve(__dirname, "../components/evolutionary-spiral");
  const context = readFileSync(path.join(dir, "SpiralLensContext.tsx"), "utf8").replace(/\s+/g, " ");
  assert.ok(context.includes("This trajectory has been charted independently. No Spiral relationships have been authored yet."));
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".tsx"))) {
    assert.ok(!/No relationship exists/i.test(readFileSync(path.join(dir, file), "utf8")), file);
  }
});

/* ------------------------------------------------------------------ */
/* Phase 2H — the first Ecology × Spiral comparisons                   */
/* ------------------------------------------------------------------ */

const LP_RELS = relationshipsForTrajectory(LP.id);
const lpRel = (id: string) => {
  const r = LP_RELS.find((x) => x.id === id);
  assert.ok(r, id);
  return r;
};
/** Withdrawn in Phase 2N: no current authored Transformation finding on this trajectory. */
const LP_TRANSFORMATION = "lp-cand-transformation-reburn-restructuring";
const LP_DISRUPTION = "lp-cand-disruption-short-interval-reburn";
const LP_FIRE_BREAK = "lp-break-disruption-historical-fire";
const LP_RENEWAL_BREAK = "lp-break-renewal-long-interval-return";

/** The relationship overlay's path, and the authored route it should sit on. */
function overlayOn(relId: string, edgeId: string) {
  const html = renderFigure(LP);
  const overlay = html.match(
    new RegExp(`<path d="([^"]+)" class="spiral-topology__rel[^"]*" data-rel-anchor="${relId}"`),
  )?.[1];
  const route = fitTopologyLayout(LP, Infinity).routes.find((r) => r.edge.id === edgeId)?.d;
  return { overlay, route };
}

check("2H.1 Ecology has exactly three records", () => {
  assert.equal(LP_RELS.length, 3);
  assert.deepEqual(
    LP_RELS.map((r) => r.id).sort(),
    [LP_DISRUPTION, LP_FIRE_BREAK, LP_RENEWAL_BREAK].sort(),
  );
});

check("2H.2 Ecology draws one ordinary arc, from the Disruption candidate", () => {
  const ends = arcEndpointsForTrajectory(LP.id);
  assert.equal(ends.length, 1);
  assert.deepEqual(ends.map((e) => e.relationshipId), [LP_DISRUPTION]);
});

check("2H.3 Ecology has two comparison breaks", () => {
  const breaks = LP_RELS.filter((r) => r.status === "comparison-break").map((r) => r.id).sort();
  assert.deepEqual(breaks, [LP_FIRE_BREAK, LP_RENEWAL_BREAK].sort());
  assert.deepEqual(
    LP_RELS.filter((r) => r.status === "candidate").map((r) => r.id),
    [LP_DISRUPTION],
  );
});

check("2H.4 breaks produce zero arcs, alone or among the rest", () => {
  for (const id of [LP_FIRE_BREAK, LP_RENEWAL_BREAK]) {
    assert.equal(arcEndpointsFromRelationships([lpRel(id)]).length, 0, id);
    assert.ok(!arcEndpointsForTrajectory(LP.id).some((e) => e.relationshipId === id), id);
  }
});

check("2H.5 no Ecology record targets Transformation", () => {
  assert.ok(!LP_RELS.some((r) => r.id === LP_TRANSFORMATION));
  for (const r of LP_RELS) {
    assert.ok(!r.operations.some((ref) => ref.stageId === "transformation"), r.id);
    assert.ok(!occurrencesForRelationship(r).some((s) => s.occurrenceId === TRANSFORMATION), r.id);
  }
});

check("2H.6 nothing is anchored on reburn → sparse or the naturally sparse branch", () => {
  assert.equal(findEdge(LP, "reburn", "sparse-cohort")?.id, "reburn-to-sparse");
  // No record is anchored on the reburn → sparse transition, the 1988 sparse branch, the sparse step, or the whole graph.
  for (const other of LP_RELS) {
    assert.notEqual(other.anchor.kind, "span", other.id);
    if (other.anchor.kind === "step") {
      assert.ok(!["sparse-cohort", "sparse-woodland", "establishment"].includes(other.anchor.stepId), other.id);
    } else {
      assert.ok(!(other.anchor.from === "establishment" && other.anchor.to === "sparse-cohort"), other.id);
      assert.ok(!(other.anchor.from === "sparse-cohort"), other.id);
      assert.ok(!(other.anchor.from === "reburn" && other.anchor.to === "sparse-cohort"), other.id);
    }
  }
  assert.equal(overlayOn(LP_TRANSFORMATION, "reburn-to-sparse").overlay, undefined);
  assert.ok(!/data-rel-anchor="[^"]*reburn-restructuring/.test(renderFigure(LP)));
});

check("2H.7 the Disruption candidate targets Disruption only", () => {
  const r = lpRel(LP_DISRUPTION);
  assert.deepEqual(r.operations, [{ stageId: "disruption" }]);
  const stops = occurrencesForRelationship(r);
  assert.equal(stops.length, 1);
  assert.equal(stops[0]!.stageId, "disruption");
});

check("2H.8 the Disruption anchor is young stand → reburn, not fire in general", () => {
  const r = lpRel(LP_DISRUPTION);
  assert.deepEqual(r.anchor, { kind: "transition", from: "young-stand", to: "reburn" });
  assert.ok(!anchorStepIds(LP, r.anchor).some((id) => ["crown-fire", "burned-stand", "mature-stand"].includes(id)));
  const drawnFromFire = arcEndpointsForTrajectory(LP.id).filter((e) => {
    const rel = lpRel(e.relationshipId);
    return anchorStepIds(LP, rel.anchor).some((id) => id === "crown-fire" || id === "burned-stand");
  });
  assert.equal(drawnFromFire.length, 0);
  const { overlay, route } = overlayOn(LP_DISRUPTION, "young-to-reburn");
  assert.ok(overlay && route);
  assert.equal(overlay, route);
});

check("2H.9 the historical-fire break targets Disruption at landscape scale", () => {
  const r = lpRel(LP_FIRE_BREAK);
  assert.equal(r.status, "comparison-break");
  assert.deepEqual(r.operations, [{ stageId: "disruption" }]);
  assert.deepEqual(r.anchor, { kind: "step", stepId: "crown-fire" });
  assert.equal(r.scale?.id, "landscape");
  assert.match(
    r.note ?? "",
    /At landscape\/regime scale, historical-interval stand-replacing fire does not satisfy the Disruption comparison merely by being destructive at smaller scales\./,
  );
  assert.ok(!/fire is not Disruption/i.test(JSON.stringify(r)));
});

check("2H.10 the Renewal break targets Renewal at ecological-community scale", () => {
  const r = lpRel(LP_RENEWAL_BREAK);
  assert.equal(r.status, "comparison-break");
  assert.deepEqual(r.operations, [{ stageId: "renewal" }]);
  assert.deepEqual(r.anchor, { kind: "transition", from: "young-stand", to: "mature-stand" });
  assert.equal(r.scale?.id, "ecological-community");
  assert.ok(!/improve/i.test(r.note ?? ""));
});

check("2H.11 every Ecology record carries a valid scale; nothing else is backfilled", () => {
  for (const r of LP_RELS) {
    assert.ok(r.scale && (SPIRAL_SCALE_IDS as readonly string[]).includes(r.scale.id), r.id);
  }
  assert.ok(SPIRAL_TRAJECTORY_RELATIONSHIPS.filter((r) => r.trajectoryId !== LP.id).every((r) => !r.scale));
});

check("2H.12 every relationship concept resolves exactly once", () => {
  for (const r of SPIRAL_TRAJECTORY_RELATIONSHIPS) {
    if (!r.conceptId) continue;
    const t = authoredTrajectories().find((x) => x.id === r.trajectoryId)!;
    assert.equal(conceptMatches(r, t).length, 1, r.id);
  }
  for (const r of LP_RELS) {
    assert.ok(r.conceptId, r.id);
    assert.equal(resolveRelationshipConcept(r, LP)?.scope, "trajectory", r.id);
  }
  const ids = (LP.concepts ?? []).map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
});

check("2H.13 no Ecology relationship targets Emergence or Emergence Again", () => {
  for (const r of LP_RELS) {
    assert.ok(!r.operations.some((ref) => ref.stageId === "emergence"), r.id);
    assert.ok(!occurrencesForRelationship(r).some((s) => s.stageId === "emergence"), r.id);
  }
});

check("2H.14 Emergence Again is zero globally", () => {
  assert.equal(EMERGENCE_AGAIN_APPROVED_RELATIONSHIP_IDS.length, 0);
  for (const r of SPIRAL_TRAJECTORY_RELATIONSHIPS) {
    assert.ok(!occurrencesForRelationship(r).some((s) => s.occurrenceId === EMERGENCE_AGAIN), r.id);
  }
  assert.ok(!arcEndpointsFromRelationships(SPIRAL_TRAJECTORY_RELATIONSHIPS).some((e) => e.occurrenceId === EMERGENCE_AGAIN));
});

check("2H.15 no relationship is inferred from outcome labels", () => {
  for (const e of trajectoryEdges(LP)) {
    if (!e.outcome) continue;
    const onEdge = LP_RELS.filter(
      (r) => r.anchor.kind === "transition" && r.anchor.from === e.from && r.anchor.to === e.to,
    );
    // Recovery carries only a break; failure, reorganization and continuation carry nothing.
    if (e.id === "young-to-mature") assert.deepEqual(onEdge.map((r) => r.id), [LP_RENEWAL_BREAK]);
    else assert.equal(onEdge.length, 0, e.id);
  }
  assert.equal(relationshipsForStep(LP, "minimal-recruitment").length, 0);
  assert.equal(relationshipsForStep(LP, "sparse-woodland").length, 0);
});

check("2H.16 no relationship is inferred from topology", () => {
  // Reordering steps or relabelling them changes no relationship and no arc.
  const ends = arcEndpointsForTrajectory(LP.id);
  assert.deepEqual(arcEndpointsFromRelationships(LP_RELS), ends);
  const relabelled = { ...LP, steps: [...LP.steps].reverse().map((s) => ({ ...s, label: "Transformation" })) };
  assert.deepEqual(validateSpiralComparisons(LP_RELS, [relabelled]).filter((i) => i.code !== "unacknowledged-name-collision"), []);
  assert.deepEqual(relationshipsForTrajectory(relabelled.id), LP_RELS);
  // Returns, sinks and branch points do not create records.
  const anchoredSteps = new Set(LP_RELS.flatMap((r) => anchorStepIds(LP, r.anchor)));
  for (const sink of sinkStepIds(LP)) assert.ok(!anchoredSteps.has(sink), sink);
  assert.ok(!anchoredSteps.has("establishment"));
});

check("2H.17 no model-projection edge or concept becomes a relationship", () => {
  for (const r of LP_RELS) {
    assert.ok(!r.epistemicKinds?.includes("model-projection"), r.id);
    assert.notEqual(r.conceptId, "lp-projections", r.id);
  }
  for (const e of trajectoryEdges(LP)) assert.ok(!e.epistemicKinds?.includes("model-projection"), e.id);
});

check("2H.18–20 Zodiac 4, Jesus 1, Biology 1 arcs", () => {
  assert.equal(arcEndpointsForTrajectory(trajectoryFor("symbolic-zodiac")?.id).length, 4);
  assert.equal(arcEndpointsForTrajectory(trajectoryFor("biblical-textual")?.id).length, 1);
  assert.equal(arcEndpointsForTrajectory(trajectoryFor("living-systems")?.id).length, 1);
});

check("2H.21 break suppression holds globally", () => {
  for (const r of SPIRAL_TRAJECTORY_RELATIONSHIPS.filter((x) => !isDrawableRelationship(x))) {
    assert.equal(arcEndpointsFromRelationships([r]).length, 0, r.id);
  }
  const drawable = new Set(SPIRAL_TRAJECTORY_RELATIONSHIPS.filter(isDrawableRelationship).map((r) => r.id));
  for (const t of authoredTrajectories()) {
    for (const e of arcEndpointsForTrajectory(t.id)) assert.ok(drawable.has(e.relationshipId), e.relationshipId);
  }
});

check("2H.22 comparison records stay apart from canonical data", () => {
  const source = readFileSync(
    path.resolve(__dirname, "../lib/evolutionary-spiral/comparisons/lodgepole.ts"),
    "utf8",
  );
  const specs = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]);
  assert.deepEqual(specs, ["../types"]);
  assert.ok(!/canonical/.test(source));
});

check("2H LOCAL: candidate and break disclosure, scale before Explore", () => {
  for (const r of LP_RELS) {
    const card = renderCard({ kind: "relationship", relationship: r });
    const beforeExplore = card.slice(0, card.indexOf("spiral-op__explore"));
    assert.ok(beforeExplore.includes(r.note!.slice(0, 40)), r.id);
    assert.match(beforeExplore, /Scale: <\/span>/, r.id);
    if (r.status === "comparison-break") {
      assert.match(beforeExplore, /Comparison breaks at/, r.id);
      assert.ok(!beforeExplore.includes("↔"), r.id);
      assert.ok(!beforeExplore.includes("spiral-card__question"), r.id);
    } else {
      assert.match(beforeExplore, /Researched relationship with/, r.id);
    }
    // Investigate opens the record's own research.
    const concept = LP.concepts!.find((c) => c.id === r.conceptId)!;
    assert.ok(card.includes(concept.title), r.id);
  }
});

check("2H LOCAL: breaks are found from their step and their transition", () => {
  const fire = renderCard({ kind: "step", stepId: "crown-fire" });
  assert.match(fire, /comparison breaks at Disruption/);
  const ret = renderCard({ kind: "transition", edge: findEdge(LP, "young-stand", "mature-stand")! });
  assert.match(ret, /comparison breaks at Renewal/);
  const reburn = renderCard({ kind: "transition", edge: findEdge(LP, "young-stand", "reburn")! });
  assert.match(reburn, /↔ Disruption/);
});

check("2H figure: breaks are muted marks, never gold lines", () => {
  const html = renderFigure(LP);
  assert.match(html, new RegExp(`class="spiral-topology__rel spiral-rel--comparison-break[^"]*" data-rel-anchor="${LP_RENEWAL_BREAK}"`));
  assert.match(html, new RegExp(`class="spiral-wheel__ring spiral-topology__ring spiral-rel--comparison-break" data-rel-anchor="${LP_FIRE_BREAK}"`));
  const css = readFileSync(path.resolve(__dirname, "../components/evolutionary-spiral/evolutionary-spiral.css"), "utf8");
  assert.match(css, /\.spiral-topology__rel\.spiral-rel--comparison-break,\s*\.spiral-topology__ring\.spiral-rel--comparison-break\s*\{[^}]*stroke: var\(--color-charcoal-muted\)/);
  assert.match(stepButton(html, "crown-fire"), /Part of 1 comparison break at Disruption\./);
});

/* ------------------------------------------------------------------ */
/* Phase 2I — consolidation and canon alignment                        */
/* ------------------------------------------------------------------ */

check("2I.1–4 Ecology: 3 records, 1 arc, 2 breaks, breaks draw nothing", () => {
  assert.equal(LP_RELS.length, 3);
  assert.equal(arcEndpointsForTrajectory(LP.id).length, 1);
  const breaks = LP_RELS.filter((r) => !isDrawableRelationship(r));
  assert.equal(breaks.length, 2);
  assert.equal(arcEndpointsFromRelationships(breaks).length, 0);
});

check("2I.5 Emergence Again remains zero globally", () => {
  assert.equal(EMERGENCE_AGAIN_APPROVED_RELATIONSHIP_IDS.length, 0);
  assert.ok(!arcEndpointsFromRelationships(SPIRAL_TRAJECTORY_RELATIONSHIPS).some((e) => e.occurrenceId === EMERGENCE_AGAIN));
});

check("2I.6 a Renewal record needs no Transformation record", () => {
  for (const status of ["candidate", "comparison-break"] as const) {
    const renewal = rel({ operations: [{ stageId: "renewal" }], status });
    assert.deepEqual(codes([renewal]), [], status);
  }
  const alone = lpRel(LP_RENEWAL_BREAK);
  assert.deepEqual(validateSpiralComparisons([alone], [LP]), []);
  const drawable = rel({ operations: [{ stageId: "renewal" }] });
  assert.deepEqual(arcEndpointsFromRelationships([drawable]).map((e) => e.occurrenceId), ["renewal@0"]);
});

check("2I.7 no relationship is inferred from another", () => {
  const all = arcEndpointsFromRelationships(SPIRAL_TRAJECTORY_RELATIONSHIPS);
  for (const r of SPIRAL_TRAJECTORY_RELATIONSHIPS) {
    const without = SPIRAL_TRAJECTORY_RELATIONSHIPS.filter((x) => x.id !== r.id);
    assert.deepEqual(
      arcEndpointsFromRelationships(without),
      all.filter((e) => e.relationshipId !== r.id),
      r.id,
    );
    assert.deepEqual(validateSpiralComparisons([r], authoredTrajectories()), [], r.id);
  }
});

check("2I.8 no relationship is inferred from stage order", () => {
  const key = (ends: ReturnType<typeof arcEndpointsFromRelationships>) =>
    ends.map((e) => `${e.relationshipId}>${e.occurrenceId}`).sort();
  const reversed = [...SPIRAL_TRAJECTORY_RELATIONSHIPS].reverse();
  assert.deepEqual(key(arcEndpointsFromRelationships(reversed)), key(arcEndpointsFromRelationships(SPIRAL_TRAJECTORY_RELATIONSHIPS)));
  // Each record names its own operations; none expands to neighbours in the sequence.
  for (const r of SPIRAL_TRAJECTORY_RELATIONSHIPS) {
    assert.equal(occurrencesForRelationship(r).length, r.operations.length, r.id);
  }
});

check("2I.9 every Ecology scale remains valid", () => {
  for (const r of LP_RELS) assert.ok((SPIRAL_SCALE_IDS as readonly string[]).includes(r.scale!.id), r.id);
});

check("2I.10 Across counts breaks separately and never as operations met", () => {
  const html = renderToStaticMarkup(
    React.createElement(SpiralAcrossScaffold, {
      onSelectLens: noop,
      showInvestigate: false,
      researchOpen: false,
      onResearchToggle: noop,
      researchId: "r",
    }),
  );
  const item = html.match(/data-trajectory="lodgepole-fire-regeneration"[\s\S]*?<\/li>/)?.[0] ?? "";
  assert.match(item, /1 researched relationship with Disruption\. 2 comparison breaks\./);
  assert.match(item, /↔ Disruption · 2 breaks/);
  assert.ok(!/Renewal|Transformation/.test(item));
  assert.match(html, /Where do these trajectories meet the Spiral\?/);
});

const CANON = readFileSync(path.resolve(__dirname, "../docs/evolutionary-spiral-phase-0.md"), "utf8");

check("2I.11 canon no longer calls the reference sequence a developmental sequence", () => {
  assert.ok(!/developmental sequence/i.test(CANON));
  assert.ok(!/follows a recurring developmental/i.test(CANON));
});

check("2I.12 canon distinguishes the grammar from the reference trajectory", () => {
  const section = CANON.slice(CANON.indexOf("## 7."), CANON.indexOf("## 8."));
  assert.match(section, /operations form the grammar/i);
  assert.match(section, /one reference trajectory through that grammar/i);
  assert.match(section, /repeat, skip, overlap, branch, converge, loop, stall, or remain open/);
  assert.match(section, /relative to a stated system and scale/);
  const copy = readFileSync(path.resolve(__dirname, "../lib/evolutionary-spiral/copy.ts"), "utf8");
  assert.match(copy, /reference trajectory through that grammar/);
});

check("2I.16–20 arc counts by lens", () => {
  const expected: Record<string, number> = {
    "symbolic-zodiac": 4,
    "biblical-textual": 1,
    "living-systems": 1,
    ecology: 1,
  };
  for (const lensId of ["systems", "psychology", "living-systems", "ecology", "biblical-textual", "symbolic-zodiac", "across"] as const) {
    assert.equal(arcEndpointsForTrajectory(trajectoryFor(lensId)?.id).length, expected[lensId] ?? 0, lensId);
  }
});

/* ------------------------------------------------------------------ */
/* Phase 2K — fail-closed drawing and comparison-finding canon         */
/* ------------------------------------------------------------------ */

/** A status no production type knows — built only here, never in the union. */
function unclassified(status: string): SpiralTrajectoryRelationship {
  return { ...rel({}), id: `unclassified-${status}`, status } as unknown as SpiralTrajectoryRelationship;
}

check("2K.1 every approved drawable status draws its authored arc", () => {
  for (const status of DRAWABLE_RELATIONSHIP_STATUSES) {
    const r = rel({ status });
    assert.ok(isDrawableRelationship(r), status);
    assert.equal(comparisonFindingKind(r), "relationship", status);
    assert.equal(arcEndpointsFromRelationships([r]).length, 1, status);
  }
});

check("2K.2 comparison-break never draws and is the only break status", () => {
  assert.deepEqual([...COMPARISON_BREAK_STATUSES], ["comparison-break"]);
  const r = rel({ status: "comparison-break" });
  assert.ok(isComparisonBreak(r));
  assert.ok(!isDrawableRelationship(r));
  assert.equal(arcEndpointsFromRelationships([r]).length, 0);
});

check("2K.3 drawable membership is an explicit list; every status classified exactly once", () => {
  assert.deepEqual(
    [...DRAWABLE_RELATIONSHIP_STATUSES].sort(),
    ["ambiguous", "candidate", "context", "strong-empirical", "structural", "symbolic-analogy", "textual-theological"],
  );
  const drawable = new Set<string>(DRAWABLE_RELATIONSHIP_STATUSES);
  const breaks = new Set<string>(COMPARISON_BREAK_STATUSES);
  for (const status of Object.keys(SPIRAL_RELATIONSHIP_STATUS)) {
    assert.equal(Number(drawable.has(status)) + Number(breaks.has(status)), 1, status);
  }
  // `ambiguous` is a drawing relationship, not an unresolved inquiry.
  const pisces = ZODIAC_RELATIONSHIPS.find((r) => r.id === "zod-res-transformation-pisces-aries");
  assert.equal(pisces?.status, "ambiguous");
  assert.ok(pisces && isDrawableRelationship(pisces));
  assert.equal(arcEndpointsFromRelationships([pisces]).length, 1);
});

check("2K.4 a status not explicitly approved fails closed", () => {
  for (const status of ["researched-negative", "unresolved", "bounded-negative", ""]) {
    const r = unclassified(status);
    assert.equal(comparisonFindingKind(r), undefined, status);
    assert.ok(!isDrawableRelationship(r), status);
    assert.ok(!isComparisonBreak(r), status);
    assert.ok(!isComparisonFinding(r), status);
    assert.equal(arcEndpointsFromRelationships([r]).length, 0, status);
    assert.equal(arcEndpointsFromRelationships([rel({}), r]).length, 1, status);
  }
});

const SPIRAL_SOURCE_DIRS = [
  path.resolve(__dirname, "../components/evolutionary-spiral"),
  path.resolve(__dirname, "../lib/evolutionary-spiral"),
  path.resolve(__dirname, "../lib/evolutionary-spiral/comparisons"),
];

function spiralSources(): { file: string; source: string }[] {
  return SPIRAL_SOURCE_DIRS.flatMap((dir) =>
    readdirSync(dir)
      .filter((f) => /\.tsx?$/.test(f))
      .map((f) => ({ file: path.join(dir, f), source: readFileSync(path.join(dir, f), "utf8") })),
  );
}

check("2K.5–6 arcs, counts, and break marks go through the shared rule only", () => {
  const statuses = Object.keys(SPIRAL_RELATIONSHIP_STATUS).join("|");
  const compare = new RegExp(`status\\s*[!=]==?\\s*["'](${statuses})["']`);
  for (const { file, source } of spiralSources()) {
    assert.ok(!compare.test(source), `${path.basename(file)} compares a relationship status directly`);
    assert.ok(!/isDrawableCorrespondence/.test(source), path.basename(file));
  }
  const arcs = readFileSync(path.resolve(__dirname, "../components/evolutionary-spiral/spiral-arc-endpoints.ts"), "utf8");
  assert.match(arcs, /relationships\.filter\(isDrawableRelationship\)/);
  for (const file of ["SpiralLensContext.tsx", "SpiralTrajectoryFigure.tsx", "SpiralAcrossScaffold.tsx", "SpiralHelixExperience.tsx"]) {
    const source = readFileSync(path.resolve(__dirname, "../components/evolutionary-spiral", file), "utf8");
    assert.match(source, /isDrawableRelationship/, file);
    assert.match(source, /isComparisonBreak/, file);
  }
  const card = readFileSync(path.resolve(__dirname, "../components/evolutionary-spiral/SpiralLocalCard.tsx"), "utf8");
  assert.match(card, /isComparisonBreak/);
});

check("2K.6 break counts are never derived as total minus drawable", () => {
  for (const { file, source } of spiralSources()) {
    assert.ok(!/\.length\s*-\s*drawn/.test(source), path.basename(file));
    assert.ok(!/!isDrawable\w*\(/.test(source), path.basename(file));
  }
});

check("2K.7 Across names operations met from relationships only; breaks counted apart", () => {
  const html = renderToStaticMarkup(
    React.createElement(SpiralAcrossScaffold, {
      onSelectLens: noop,
      showInvestigate: true,
      researchOpen: true,
      onResearchToggle: noop,
      researchId: "r",
    }),
  );
  const item = html.match(/data-trajectory="lodgepole-fire-regeneration"[\s\S]*?<\/li>/)?.[0] ?? "";
  assert.match(item, /↔ Disruption · 2 breaks/);
  for (const op of ["Emergence", "Embodiment", "Differentiation", "Organization", "Transformation", "Integration", "Renewal"]) {
    assert.ok(!item.includes(op), op);
  }
  assert.ok(!/unresolved|bounded negative|investigated absence|unresearched/i.test(item));
});

check("2K.8–13 counts preserved: arcs by lens, Ecology breaks, Emergence Again", () => {
  const expected: Record<string, number> = { "symbolic-zodiac": 4, "biblical-textual": 1, "living-systems": 1, ecology: 1 };
  for (const lensId of ["systems", "psychology", "living-systems", "ecology", "biblical-textual", "symbolic-zodiac", "across"] as const) {
    assert.equal(arcEndpointsForTrajectory(trajectoryFor(lensId)?.id).length, expected[lensId] ?? 0, lensId);
  }
  assert.equal(LP_RELS.filter(isComparisonBreak).length, 2);
  assert.equal(LP_RELS.filter(isDrawableRelationship).length, 1);
  assert.equal(EMERGENCE_AGAIN_APPROVED_RELATIONSHIP_IDS.length, 0);
  assert.ok(!arcEndpointsFromRelationships(SPIRAL_TRAJECTORY_RELATIONSHIPS).some((e) => e.occurrenceId === EMERGENCE_AGAIN));
});

check("2K silence: no record gives no arc, no break mark, and no negative", () => {
  assert.equal(arcEndpointsFromRelationships([]).length, 0);
  const html = renderFigure(LP, { relationships: [] });
  assert.ok(!/spiral-rel--/.test(html));
  assert.ok(!/spiral-topology__ring/.test(html));
  assert.ok(!/comparison break/i.test(html));
  for (const r of LP_RELS) {
    const card = renderCard({ kind: "relationship", relationship: r });
    assert.ok(!/bounded negative|researched absence|investigated absence|does not occur/i.test(card), r.id);
  }
});

check("2K silence: records exist only as authored, never generated", () => {
  const authored = [
    ...ZODIAC_RELATIONSHIPS,
    ...JESUS_RELATIONSHIPS,
    ...METAMORPHOSIS_RELATIONSHIPS,
    ...LODGEPOLE_RELATIONSHIPS,
  ];
  assert.deepEqual(SPIRAL_TRAJECTORY_RELATIONSHIPS.map((r) => r.id), authored.map((r) => r.id));
  assert.equal(SPIRAL_TRAJECTORY_RELATIONSHIPS.length, 9);
  for (const t of authoredTrajectories()) {
    assert.deepEqual(
      relationshipsForTrajectory(t.id).map((r) => r.id),
      authored.filter((r) => r.trajectoryId === t.id).map((r) => r.id),
      t.id,
    );
  }
});

check("2K silence: outcomes and topology never produce a relationship", () => {
  const recovery = trajectoryEdges(LP).filter((e) => e.outcome === "recovery");
  assert.ok(recovery.length > 0);
  for (const edge of trajectoryEdges(LP).filter((e) => e.outcome)) {
    const anchored = LODGEPOLE_RELATIONSHIPS.filter(
      (r) => r.anchor.kind === "transition" && r.anchor.from === edge.from && r.anchor.to === edge.to,
    );
    const arcs = arcEndpointsFromRelationships(anchored);
    assert.equal(arcs.length, anchored.filter(isDrawableRelationship).length, edge.id);
  }
  // A recovery outcome is not Renewal: its only record is the authored break.
  for (const edge of recovery) {
    const anchored = LODGEPOLE_RELATIONSHIPS.filter(
      (r) => r.anchor.kind === "transition" && r.anchor.from === edge.from && r.anchor.to === edge.to,
    );
    assert.ok(anchored.every(isComparisonBreak), edge.id);
    assert.equal(arcEndpointsFromRelationships(anchored).length, 0, edge.id);
  }
  const arcs = readFileSync(path.resolve(__dirname, "../components/evolutionary-spiral/spiral-arc-endpoints.ts"), "utf8");
  assert.ok(!/topology|outcome|steps|transitions/.test(arcs.replace(/\/\*[\s\S]*?\*\//g, "")));
});

check("2K canon: comparison findings and silence", () => {
  const start = CANON.indexOf("## 11A.");
  assert.ok(start > 0);
  const section = CANON.slice(start, CANON.indexOf("## 12."));
  assert.match(section, /Silence is not a claim/i);
  assert.match(section, /\*\*Relationship\*\*[^\n]*affirmative/i);
  assert.match(section, /\*\*Comparison break\*\*[^\n]*resemblance[^\n]*(fails|misleads)/i);
  assert.match(section, /\*\*Bounded negative\*\*[^\n]*Not implemented/i);
  assert.match(section, /Unresolved is not `ambiguous`/);
  assert.match(section, /not epistemic categories/i);
  assert.match(section, /Comparison records are not canonical relationships/);
  assert.match(section, /One finding per inquiry/i);
  assert.match(section, /not a measure of research completeness/i);
});

/* ------------------------------------------------------------------ */
/* Phase 2N — Emergence and Transformation refinement                  */
/* ------------------------------------------------------------------ */

const ZODIAC = trajectoryFor("symbolic-zodiac")!;
const CAPRICORN = "zod-res-transformation-capricorn-aquarius";
const TRANSFORMATION_RECORDS = [
  "zod-res-transformation-libra-scorpio",
  "zod-res-transformation-scorpio-sagittarius",
  CAPRICORN,
  "zod-res-transformation-pisces-aries",
  "jesus-res-transformation-death-resurrection",
  "meta-res-transformation-reorganization",
];

check("2N.1 Transformation is defined by altered processes, not pressure", () => {
  const t = getSpiralStage("transformation")!;
  for (const text of [t.definition, t.microcopy, t.whisper]) assert.ok(!/under pressure/i.test(text), text);
  assert.match(t.definition, /^The processes by which a system generates or maintains its organization are themselves altered/);
  assert.match(t.definition, /not only their products, rate, setting, or appearance, and not merely their ordinary operation/);
  assert.match(t.definition, /may follow Disruption or arise without it/);
  assert.equal(t.microcopy, "The ways it stays organized change.");
  assert.equal(t.whisper, "More than its form changes: the very ways the system keeps itself organized are altered.");
  assert.match(getSpiralStage("disruption")!.definition, /cannot assimilate unchanged/);
});

check("2N.2 visitor copy: Transformation need not begin with Disruption", () => {
  assert.match(SPIRAL_COPY.referenceTrajectoryNote, /Disruption need not lead to Transformation, and Transformation need not begin with Disruption\./);
  assert.match(SPIRAL_COPY.referenceTrajectoryNote, /Neither leads necessarily to Integration or Renewal\./);
});

check("2N.3 Emergence uses a stated scale and the repertoire reference rule", () => {
  const e = getSpiralStage("emergence")!;
  assert.match(e.definition, /^Relations among a system's components begin to sustain a capacity the system did not have at that scale/);
  assert.match(e.definition, /any lineage or program that reliably reproduces it/);
  assert.match(e.definition, /holds rather than flickers/);
  assert.ok(!/discernible/i.test(e.definition));
  assert.equal(e.microcopy, "Something new becomes possible.");
  assert.equal(e.whisper, "Relations among parts begin to hold a capacity not already available in the system's repertoire.");
  // Emergence again keeps its own wording.
  const again = SPIRAL_SEQUENCE.find((s) => s.occurrenceId === EMERGENCE_AGAIN)!;
  assert.equal(again.microcopyOverride, "Something becomes possible under changed conditions.");
});

check("2N.4 canon reads Emergence without metaphysical irreducibility", () => {
  const section = CANON.slice(CANON.indexOf("### 1. Emergence"), CANON.indexOf("### 2. Embodiment"));
  assert.match(section, /Novelty is always judged against a stated reference/);
  assert.match(section, /lineage, developmental program, or institutional template/);
  assert.match(section, /maturation or recurrence, not Emergence/);
  assert.match(section, /Weak emergence qualifies/);
  assert.match(section, /No metaphysical irreducibility is claimed/);
  assert.match(section, /may be used only when stated explicitly/);
});

check("2N.5 canon reads Transformation as cause-independent", () => {
  const section = CANON.slice(CANON.indexOf("### 7. Transformation"), CANON.indexOf("### 8. Integration"));
  assert.ok(!/under pressure/i.test(section));
  assert.match(section, /Not every change is Transformation/);
  assert.match(section, /defined by what changes, not by what causes it/);
  assert.match(section, /may set it in motion, may be absorbed without it, and is not required for it/);
  const whispers = CANON.slice(CANON.indexOf("## 8A."), CANON.indexOf("## 8A.") + 2000);
  assert.ok(!/under pressure/i.test(whispers));
});

check("2N.6 canon distinguishes presupposing a state from a prior operation", () => {
  const section = CANON.slice(CANON.indexOf("## 7."), CANON.indexOf("## 8."));
  assert.match(section, /Relationship requires distinct elements, Organization requires relations, and Disruption requires an existing organization/);
  assert.match(section, /Presupposing a state is not presupposing an operation/);
  assert.match(section, /not a sequence any real system must follow/);
  assert.ok(!/later definitions presuppose earlier ones/.test(section));
  assert.match(section, /Emergence → Embodiment → Differentiation → Relationship → Organization\n→ Disruption → Transformation → Integration → Renewal → Emergence again/);
});

check("2N.7 Capricorn → Aquarius is ambiguous, still drawn, anchor unchanged", () => {
  const r = ZODIAC_RELATIONSHIPS.find((x) => x.id === CAPRICORN)!;
  assert.equal(r.status, "ambiguous");
  assert.deepEqual(r.operations, [{ stageId: "transformation" }]);
  assert.deepEqual(r.anchor, { kind: "transition", from: "capricorn", to: "aquarius" });
  assert.equal(comparisonFindingKind(r), "relationship");
  assert.ok(isDrawableRelationship(r));
  assert.ok(arcEndpointsForTrajectory(ZODIAC.id).some((e) => e.relationshipId === CAPRICORN));
  const el = renderFigure(ZODIAC).match(new RegExp(`<[^>]*data-rel-anchor="${CAPRICORN}"[^>]*>`))?.[0] ?? "";
  assert.match(el, /spiral-rel--ambiguous/);
  // No Disruption relationship was created for the region.
  assert.ok(!ZODIAC_RELATIONSHIPS.some((x) => x.operations.some((o) => o.stageId === "disruption")));
});

check("2N.8 the withdrawn lodgepole record is silence: no arc, no break, no negative", () => {
  assert.ok(!SPIRAL_TRAJECTORY_RELATIONSHIPS.some((r) => r.id === LP_TRANSFORMATION));
  assert.ok(!LP_RELS.some((r) => r.operations.some((o) => o.stageId === "transformation")));
  assert.ok(!arcEndpointsForTrajectory(LP.id).some((e) => e.occurrenceId === TRANSFORMATION));
  assert.ok(!LP_RELS.filter(isComparisonBreak).some((r) => r.operations.some((o) => o.stageId === "transformation")));
  const card = renderCard({ kind: "transition", edge: findEdge(LP, "reburn", "sparse-cohort")! });
  assert.ok(!/Transformation|spiral-card__anchor-op|comparison break/i.test(card));
  assert.ok(!/bounded negative|researched absence|investigated absence|does not occur/i.test(card));
  assert.ok(!/spiral-rel--/.test(stepButton(renderFigure(LP), "sparse-cohort")));
});

check("2N.9 lodgepole restructuring research is kept as research, not as a finding", () => {
  const concept = LP.concepts!.find((c) => c.id === "lp-cmp-reburn-restructuring")!;
  assert.ok(concept);
  assert.ok(!SPIRAL_TRAJECTORY_RELATIONSHIPS.some((r) => r.conceptId === concept.id));
  const text = JSON.stringify(concept);
  assert.match(text, /Turner et al\. 2019/);
  assert.match(text, /Braziunas et al\. 2023/);
  assert.match(text, /No current Transformation comparison/);
  assert.match(text, /not a finding that Transformation is absent/);
  assert.ok(!/candidate/i.test(text));
  assert.ok(!/bounded negative|does not occur/i.test(text));
  assert.equal(concept.sources?.length, 4);
});

check("2N.10 lens counts: Zodiac 4, Jesus 1, Biology 1, Ecology 1 + 2 breaks, others 0", () => {
  const expected: Record<string, number> = { "symbolic-zodiac": 4, "biblical-textual": 1, "living-systems": 1, ecology: 1 };
  for (const lensId of ["systems", "psychology", "living-systems", "ecology", "biblical-textual", "symbolic-zodiac", "across"] as const) {
    assert.equal(arcEndpointsForTrajectory(trajectoryFor(lensId)?.id).length, expected[lensId] ?? 0, lensId);
  }
  assert.equal(LP_RELS.filter(isDrawableRelationship).length, 1);
  assert.equal(LP_RELS.filter(isComparisonBreak).length, 2);
  assert.equal(EMERGENCE_AGAIN_APPROVED_RELATIONSHIP_IDS.length, 0);
  assert.ok(!arcEndpointsFromRelationships(SPIRAL_TRAJECTORY_RELATIONSHIPS).some((e) => e.occurrenceId === EMERGENCE_AGAIN));
});

check("2N.11 every finding is classified by the Phase 2K authority", () => {
  for (const r of SPIRAL_TRAJECTORY_RELATIONSHIPS) {
    assert.ok(isComparisonFinding(r), r.id);
    assert.equal(comparisonFindingKind(r), isComparisonBreak(r) ? "comparison-break" : "relationship", r.id);
  }
  assert.deepEqual(validateSpiralComparisons(SPIRAL_TRAJECTORY_RELATIONSHIPS, authoredTrajectories()), []);
});

check("2N.12 the remaining Transformation findings keep their statuses", () => {
  const transformation = SPIRAL_TRAJECTORY_RELATIONSHIPS.filter((r) =>
    r.operations.some((o) => o.stageId === "transformation"),
  );
  assert.deepEqual(transformation.map((r) => r.id), TRANSFORMATION_RECORDS);
  assert.deepEqual(
    Object.fromEntries(transformation.map((r) => [r.id, r.status])),
    {
      "zod-res-transformation-libra-scorpio": "candidate",
      "zod-res-transformation-scorpio-sagittarius": "context",
      [CAPRICORN]: "ambiguous",
      "zod-res-transformation-pisces-aries": "ambiguous",
      "jesus-res-transformation-death-resurrection": "textual-theological",
      "meta-res-transformation-reorganization": "candidate",
    },
  );
});

check("2N.13 seed examples no longer contradict the refined canon", () => {
  const inheritance = SPIRAL_EXAMPLES.find((e) => e.id === "ex-transformation-inheritance-variation")!;
  assert.ok(!/pressure/i.test(inheritance.body));
  assert.match(inheritance.body, /Routine variation changes what is inherited, not how inheritance works/);
  const succession = SPIRAL_EXAMPLES.find((e) => e.id === "ex-renewal-ecological-succession")!;
  assert.match(succession.body, /persistence and recurrence/);
  assert.match(succession.body, /begins only where the community stabilizes with altered capacity/);
  assert.ok(!/altered capacity and history remain/.test(succession.body));
});

check("2N-C.1 takeaways exist only for trajectories with drawable relationships", () => {
  const withLines = authoredTrajectories()
    .filter((t) => relationshipsForTrajectory(t.id).some(isDrawableRelationship))
    .map((t) => t.id)
    .sort();
  assert.deepEqual(Object.keys(TRAJECTORY_TAKEAWAYS).sort(), withLines);
  assert.match(TRAJECTORY_TAKEAWAYS[LP.id]!, /not fire itself/);
  assert.match(TRAJECTORY_TAKEAWAYS.metamorphosis!, /Transformation/);
});

function renderArrival(t: SpiralTrajectory): string {
  const rels = relationshipsForTrajectory(t.id);
  return renderFigure(t, { activeIds: new Set(rels.map((r) => r.id)) });
}

check("2N-C.2 Ecology arrival stages the opening run and its first branching", () => {
  const html = renderArrival(LP);
  assert.match(html, /data-staged=""/);
  const later = (id: string) =>
    new RegExp(`spiral-topology__step--later[^"]*" [^>]*data-step-id="${id}"`).test(html);
  for (const id of [
    "mature-stand",
    "crown-fire",
    "burned-stand",
    "establishment",
    "dense-cohort",
    "sparse-cohort",
    "minimal-recruitment",
  ]) {
    assert.ok(!later(id), id);
  }
  for (const id of ["young-stand", "sparse-woodland", "reburn"]) assert.ok(later(id), id);
  const branch = (html.match(/spiral-topology__edge--branch/g) ?? []).length;
  assert.equal(branch, 3);
});

check("2N-C.3 staging is presentation only: every edge, relationship, and break still renders", () => {
  const html = renderArrival(LP);
  assert.equal((html.match(/data-edge-id=/g) ?? []).length, trajectoryEdges(LP).length);
  assert.equal((html.match(/data-step-id=/g) ?? []).length, LP.steps.length);
  for (const r of LODGEPOLE_RELATIONSHIPS) assert.ok(html.includes(r.id), r.id);
});

check("2N-C.4 staging lifts once the visitor reaches into the figure", () => {
  assert.ok(!/data-staged/.test(renderFigure(LP, { selectedStepId: "establishment" })));
  const one = LODGEPOLE_RELATIONSHIPS[0]!.id;
  assert.ok(!/data-staged/.test(renderFigure(LP, { activeIds: new Set([one]) })));
  for (const t of legacyTrajectories()) assert.ok(!/data-staged/.test(renderArrival(t)), t.id);
});

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nEvolutionary Spiral relationship lines: all checks passed");
