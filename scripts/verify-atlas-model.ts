/**
 * Verify Atlas 2.0 typed model against frozen Phase 1 canon.
 * Run: npm run verify:atlas-model
 */
import assert from "node:assert/strict";
import {
  BOTH_CONCEPT_IDS,
  MAJOR_CONCEPT_THREAD_ALIASES,
  V1_CONCEPT_PLACEMENTS,
  assertAtlasModelIntegrity,
  authoredThreadWhisperForConcept,
  investigationForQuestion,
  primaryTerritoryForConcept,
  threadAliasForMajorConceptId,
} from "../lib/atlas/model";
import type { AtlasV1ConceptId } from "../lib/atlas-v1/content";
import { ATLAS_V1_CONCEPTS } from "../lib/atlas-v1/content";
import { VOID_QUESTIONS } from "../lib/atlas-v1/questions";

const TERRITORY_ONLY = [
  "body",
  "adaptation",
  "time",
  "meaning",
  "reality",
] as const satisfies readonly AtlasV1ConceptId[];

function main(): void {
  assertAtlasModelIntegrity();

  const conceptIds = Object.keys(ATLAS_V1_CONCEPTS) as AtlasV1ConceptId[];
  assert.equal(conceptIds.length, 10);
  for (const id of conceptIds) {
    assert.ok(V1_CONCEPT_PLACEMENTS[id], `placement for ${id}`);
  }

  for (const id of BOTH_CONCEPT_IDS) {
    const whisper = authoredThreadWhisperForConcept(id);
    assert.ok(whisper, `whisper for ${id}`);
    assert.equal(whisper.id, id);
  }

  for (const id of TERRITORY_ONLY) {
    assert.equal(
      authoredThreadWhisperForConcept(id),
      null,
      `no whisper for territory-only ${id}`,
    );
    assert.equal(V1_CONCEPT_PLACEMENTS[id].classification, "territory-only");
  }

  assert.equal(
    V1_CONCEPT_PLACEMENTS.participation.primaryTerritoryId,
    "r3-participation",
  );
  assert.equal(
    V1_CONCEPT_PLACEMENTS.participation.secondaryTerritoryId,
    "r1-living-systems",
  );
  assert.equal(
    V1_CONCEPT_PLACEMENTS.adaptation.primaryTerritoryId,
    "r1-living-systems",
  );
  assert.equal(
    V1_CONCEPT_PLACEMENTS.adaptation.secondaryTerritoryId,
    "r5-time-emergence",
  );

  assert.equal(primaryTerritoryForConcept("body").id, "r1-living-systems");
  assert.equal(threadAliasForMajorConceptId("th-relationship"), "relationship");
  assert.equal(threadAliasForMajorConceptId("th-consciousness"), "consciousness");
  assert.equal(threadAliasForMajorConceptId("th-reality"), null);
  assert.equal(MAJOR_CONCEPT_THREAD_ALIASES["th-relationship"], "relationship");

  for (const q of VOID_QUESTIONS) {
    const inv = investigationForQuestion(q.id);
    assert.equal(inv.kind, "investigation");
    assert.equal(inv.questionId, q.id);
    assert.ok(inv.territoryId);
  }

  console.log("verify:atlas-model OK");
}

main();
