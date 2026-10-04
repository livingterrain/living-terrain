/**
 * Relationship-line safety for the Evolutionary Spiral composite figure.
 * Lines must come only from authored relationship records.
 * Run: npx tsx scripts/test-evolutionary-spiral.ts
 */

import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import {
  anchorStepIds,
  authoredTrajectories,
  defaultTrajectoryId,
  edgeAssertsEvidence,
  EMERGENCE_AGAIN_APPROVED_RELATIONSHIP_IDS,
  epistemicLabel,
  findEdge,
  isCitableSource,
  getTrajectory,
  occurrencesForRelationship,
  orderedEdges,
  outgoingEdges,
  relationshipsForTrajectory,
  resolveRelationshipConcept,
  sinkStepIds,
  SPIRAL_EPISTEMIC_CATEGORIES,
  SPIRAL_EPISTEMIC_LEGEND,
  SPIRAL_NAME_COLLISION_ACKNOWLEDGEMENTS,
  SPIRAL_SCALE_IDS,
  SPIRAL_SEQUENCE,
  SPIRAL_TRAJECTORY_OUTCOMES,
  SPIRAL_TRAJECTORY_RELATIONSHIPS,
  topologySource,
  trajectoryEdges,
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

check("2B.K current trajectories keep ordered topology (no explicit transitions yet)", () => {
  for (const t of authoredTrajectories()) {
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

check("2B rendered lenses hold only topology the current figure draws", () => {
  // The figure reads steps in order. A branching, recurrent, or re-ordered
  // trajectory needs a topology-aware figure before it can join a lens.
  for (const t of authoredTrajectories()) {
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

check("2B current relationship concepts resolve to stage research", () => {
  for (const r of SPIRAL_TRAJECTORY_RELATIONSHIPS.filter((x) => x.conceptId)) {
    const t = authoredTrajectories().find((x) => x.id === r.trajectoryId)!;
    assert.equal(resolveRelationshipConcept(r, t)?.scope, "stage", r.id);
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
  assert.ok(SPIRAL_TRAJECTORY_RELATIONSHIPS.every((r) => r.scale === undefined));
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
  assert.deepEqual(ids, ["jesus-narrative", "metamorphosis", "zodiac-cycle"].sort());
  for (const t of authoredTrajectories()) {
    assert.deepEqual(validateTrajectorySources(t), [], t.id);
    assert.equal(t.evidenceStandard, undefined, t.id);
    assert.equal(t.transitions, undefined, t.id);
    assert.ok(!JSON.stringify(t).includes("model-projection"), t.id);
  }
  assert.ok(!JSON.stringify(SPIRAL_TRAJECTORY_RELATIONSHIPS).includes("model-projection"));
});

check("2C.1.I arc counts: Zodiac 4, Jesus 1, Biology 1, all others 0", () => {
  const expected: Record<string, number> = {
    "symbolic-zodiac": 4,
    "biblical-textual": 1,
    "living-systems": 1,
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

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nEvolutionary Spiral relationship lines: all checks passed");
