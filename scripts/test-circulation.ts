/**
 * Phase 2 circulation — authored relationships only.
 * Run: npx tsx scripts/test-circulation.ts
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { ATLAS_V1_QUESTIONS, ATLAS_V1_SOURCE } from "../lib/atlas-v1/content";
import { isJourneyOpen } from "../lib/atlas/architecture";
import { BOTH_CONCEPT_IDS, V1_CONCEPT_PLACEMENTS, atlasBridgeForThread } from "../lib/atlas/model";
import { getAtlasCanonicalView } from "../lib/canonical/atlas-view";
import { getAllEssays, getAllProjects, getProjectEssays } from "../lib/content";
import {
  getEssayContext,
  hasEssayContext,
  journeyStops,
} from "../lib/reading/essay-context";
import { THREAD_IDS } from "../lib/threads";

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

const root = path.resolve(__dirname, "..");
const read = (rel: string) => readFileSync(path.join(root, rel), "utf8");

const essays = getAllEssays();
const contexts = new Map(essays.map((essay) => [essay.slug, getEssayContext(essay)]));

const ATLAS_CONNECTED = ["relationship", "feedback", "technology", "constraint", "participation"];
const NOT_ATLAS_CONNECTED = ["boundary", "intelligence", "logos", "consciousness", "translation"];

check("evidence: canonical SOURCED_FROM essay routes match the Atlas source seed", () => {
  const { evidenceSource } = getAtlasCanonicalView();
  for (const [id, source] of Object.entries(ATLAS_V1_SOURCE)) {
    if (source.kind !== "essay") continue;
    assert.equal(evidenceSource[id as keyof typeof evidenceSource]?.route, source.href, id);
  }
});

check("evidence: exactly the essays authored at open-journey stops", () => {
  const { evidenceSource } = getAtlasCanonicalView();
  const expected = new Set<string>();
  for (const question of ATLAS_V1_QUESTIONS) {
    if (!isJourneyOpen(question.id)) continue;
    for (const stop of journeyStops(question)) {
      const id = question.evidence[stop];
      const ref = id ? evidenceSource[id] : undefined;
      if (ref?.type === "ESSAY") expected.add(ref.route);
    }
  }
  const actual = new Set(
    essays
      .filter((e) => contexts.get(e.slug)!.atlasEvidence.length > 0)
      .map((e) => `/essays/${e.slug}`),
  );
  assert.deepEqual([...actual].sort(), [...expected].sort());
  assert.equal(actual.size, 8);
});

check("evidence: closed journeys (before-collapse) never surface", () => {
  for (const context of contexts.values()) {
    for (const evidence of context.atlasEvidence) {
      assert.equal(isJourneyOpen(evidence.questionId), true, evidence.questionId);
      assert.notEqual(evidence.questionId, "before-collapse");
    }
  }
});

check("evidence: each line names a real stop on that journey", () => {
  const tragedy = contexts.get("what-happens-before-the-tragedy")!;
  assert.deepEqual(
    tragedy.atlasEvidence.map((e) => [e.questionId, e.stops]),
    [
      ["technology-change", ["Relationship"]],
      ["relationships-difficult", ["Relationship"]],
    ],
  );
  const loop = contexts.get("you-have-to-go-far-enough-to-make-a-loop")!;
  assert.deepEqual(
    loop.atlasEvidence.map((e) => e.questionId).sort(),
    ["inhabit-time", "technology-change"],
  );
});

check("chambers: symmetric with chamber pages (explicit links only)", () => {
  const fromChambers = new Map<string, string[]>();
  for (const project of getAllProjects()) {
    for (const essay of getProjectEssays(project)) {
      fromChambers.set(essay.slug, [...(fromChambers.get(essay.slug) ?? []), project.slug]);
    }
  }
  for (const essay of essays) {
    const chambers = contexts.get(essay.slug)!.chambers.map((c) => c.slug).sort();
    assert.deepEqual(chambers, (fromChambers.get(essay.slug) ?? []).sort(), essay.slug);
  }
  assert.equal(
    essays.filter((e) => contexts.get(e.slug)!.chambers.length > 0).length,
    5,
  );
});

check("threads: mirror essay-threads.json assignments exactly", () => {
  for (const essay of essays) {
    assert.deepEqual(
      contexts.get(essay.slug)!.threads.map((t) => t.id),
      essay.threadIds ?? [],
      essay.slug,
    );
  }
});

check("no authored relationship → no section", () => {
  const empty = essays.filter((e) => !hasEssayContext(contexts.get(e.slug)!));
  for (const essay of empty) {
    const c = contexts.get(essay.slug)!;
    assert.equal(c.atlasEvidence.length + c.chambers.length + c.threads.length, 0);
    assert.equal(essay.threadIds?.length ?? 0, 0);
  }
  assert.ok(empty.length > 0);
});

check("thread-only essays never gain Atlas context from their Threads", () => {
  for (const essay of essays) {
    const c = contexts.get(essay.slug)!;
    const isEvidence = Object.values(ATLAS_V1_SOURCE).some(
      (s) => s.href === `/essays/${essay.slug}`,
    );
    if (!isEvidence) assert.equal(c.atlasEvidence.length, 0, essay.slug);
  }
});

check("essay context never reads the legacy strand graph", () => {
  const src = read("lib/reading/essay-context.ts");
  assert.doesNotMatch(src, /from "@\/lib\/relationships/);
  assert.doesNotMatch(src, /resolveThread|getEdgesFrom|getEdgesTo/);
});

check("essay record: generic Atlas CTA removed; strand stays full-body only", () => {
  assert.doesNotMatch(read("components/newsletter/EssayNewsletterCTA.tsx"), /\/atlas|Continue exploring/);
  const page = read("app/(site)/essays/[slug]/page.tsx");
  assert.match(page, /nodeRef=\{hasBody \? refFromEssay\(essay\) : undefined\}/);
  assert.match(page, /<AtlasJourneyReturn evidenceRoute=/);
});

check("essay record: publication CTA precedes Where this sits and journey return", () => {
  const shell = read("components/world/LanternReadingShell.tsx");
  const order = ["{children}", "{afterContent}", "{afterThread}", "{navBefore}"].map((s) =>
    shell.indexOf(s),
  );
  assert.ok(order.every((i) => i >= 0));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
});

check("Thread bridge: only the five Both Threads reach the Atlas", () => {
  assert.deepEqual(
    THREAD_IDS.filter((id) => atlasBridgeForThread(id)).sort(),
    [...ATLAS_CONNECTED].sort(),
  );
  for (const id of NOT_ATLAS_CONNECTED) assert.equal(atlasBridgeForThread(id), null, id);
});

check("Thread bridge: concept and Territories come from frozen placements", () => {
  for (const conceptId of BOTH_CONCEPT_IDS) {
    const placement = V1_CONCEPT_PLACEMENTS[conceptId];
    const bridge = atlasBridgeForThread(placement.threadId!)!;
    assert.equal(bridge.conceptId, conceptId);
    assert.deepEqual(
      bridge.territories.map((t) => t.id),
      [placement.primaryTerritoryId, ...(placement.secondaryTerritoryId ? [placement.secondaryTerritoryId] : [])],
    );
  }
});

check("Thread bridge copy: relational, never Thread = Territory", () => {
  const src = read("components/reading/ThreadAtlasBridge.tsx");
  assert.match(src, /This pattern is also charted in the Atlas/);
  assert.doesNotMatch(src, /(this|the) thread is|belongs? to the territory|essays in this/i);
});

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log("\nall passed");
