/**
 * Canonical foundation integrity — does not touch visitor UI.
 * Run: npx tsx scripts/verify-canonical.ts
 *   or: npm run verify:canonical
 */
import assert from "node:assert/strict";
import {
  ATLAS_V1_QUESTIONS,
  relationsFor,
} from "../lib/atlas-v1/content";
import { relatedBooksForConcept } from "../lib/atlas-v1/books";
import {
  TRUSTED_PROVENANCE,
  SUGGESTED_RELATIONS,
  assertCanonicalFoundation,
  countCanonicalObjectsByType,
  essaysWithoutCanonicalRelations,
  getAtlasCanonicalView,
  getCanonicalObject,
  getCanonicalRelations,
  getCanonicalRelationsFrom,
  listCanonicalObjects,
  listCanonicalRelations,
  resolveCanonicalRef,
  validateCanonicalFoundation,
} from "../lib/canonical";

assertCanonicalFoundation();

const counts = countCanonicalObjectsByType();
const objects = listCanonicalObjects();
const relations = listCanonicalRelations();
const disconnected = essaysWithoutCanonicalRelations();
const issues = validateCanonicalFoundation();

assert.equal(counts.BOOK, 8, "8 books including superseded original Biology");
assert.equal(counts.ESSAY, 120, "all 120 essays registered");
assert.equal(counts.OBSERVATION, 3, "3 authenticated Observatory observations");
assert.equal(counts.VISUAL_MAP_COLLECTION, 1);
assert.equal(counts.VISUAL_MAP_PLATE, 7);
assert.equal(counts.CHAMBER, 7);
assert.equal(counts.CONCEPT, 10, "Atlas V1 concepts only");
assert.equal(counts.QUESTION, 6, "Atlas V1 questions only");
assert.equal(counts.EVIDENCE, 11);

assert.equal(getCanonicalObject("b8")?.visibility, "public");
assert.equal(getCanonicalObject("b8")?.supersedesId, "b2");
assert.equal(getCanonicalObject("b2")?.visibility, "superseded");

assert.equal(getCanonicalObject("q1"), undefined, "legacy q1 must not be registered");
assert.equal(getCanonicalObject("th-reality"), undefined, "legacy themes must not be registered");
assert.equal(getCanonicalObject("fn1"), undefined, "field notes must not be registered");

const obs = getCanonicalObject("obs-heart-authority");
assert.equal(obs?.type, "OBSERVATION");
assert.equal(obs?.route, "/observatory");
assert.ok(!("body" in (obs ?? {})));

const plate = getCanonicalObject("astrology-planets");
assert.equal(plate?.type, "VISUAL_MAP_PLATE");
assert.equal(plate?.collectionId, "astrology");
assert.equal(plate?.route, "/visual-maps/astrology/planets");

for (const relation of relations) {
  assert.ok(
    (TRUSTED_PROVENANCE as readonly string[]).includes(relation.provenance),
    `${relation.id} leaked non-canonical provenance into default reads`,
  );
}

const leaked = listCanonicalRelations().filter(
  (relation) =>
    relation.provenance === "INFERRED" || relation.provenance === "SUGGESTED",
);
assert.equal(leaked.length, 0);

const biologyEvidence = getCanonicalRelationsFrom("biology-of-becoming");
assert.ok(
  biologyEvidence.some(
    (relation) => relation.type === "SOURCED_FROM" && relation.to === "b2",
  ),
  "Biology V1 evidence remains a historical citation of b2",
);

const e11Books = getCanonicalRelationsFrom("e11").filter(
  (relation) => relation.type === "RELATES_TO",
);
assert.ok(e11Books.some((relation) => relation.to === "b8"));
assert.ok(!e11Books.some((relation) => relation.to === "b2"));

assert.equal(getCanonicalRelations("obs-action-layer").length, 0);
assert.equal(getCanonicalRelations("obs-power-discernment").length, 0);
assert.ok(getCanonicalRelations("obs-heart-authority").some((r) => r.to === "e1"));

assert.equal(getCanonicalRelations("astrology").length, 0);
assert.equal(getCanonicalRelations("astrology-planets").length, 0);

assert.equal(disconnected.length, 112, "essays without trusted canonical relations");

const why = getCanonicalRelationsFrom("body").find(
  (relation) => relation.to === "feedback" && relation.id.includes("body-react"),
);
assert.equal(
  why?.note,
  "The body is not malfunctioning. It is answering a question you have not finished asking.",
);

assert.equal(SUGGESTED_RELATIONS.length, 0, "review queue must stay empty");

assert.ok(resolveCanonicalRef("obs-heart-authority")?.route === "/observatory");
assert.ok(resolveCanonicalRef("astrology-planets")?.type === "VISUAL_MAP_PLATE");
assert.ok(resolveCanonicalRef("p2")?.type === "CHAMBER");

const atlasView = getAtlasCanonicalView();
let bondCount = 0;
for (const question of ATLAS_V1_QUESTIONS) {
  for (const conceptId of Object.keys(question.relations) as Array<
    keyof typeof question.relations
  >) {
    const local = relationsFor(question, conceptId)[0];
    const bond = atlasView.bonds[`${question.id}::${conceptId}`];
    assert.ok(local, `${question.id}/${conceptId}: local choreography bond`);
    assert.ok(bond, `${question.id}/${conceptId}: canonical bond`);
    assert.equal(bond.to, local.to);
    assert.equal(bond.why, local.why, `${question.id}/${conceptId}: why must be exact`);
    assert.ok(
      bond.provenance === "AUTHORED" || bond.provenance === "SOURCE_GROUNDED",
    );
    bondCount += 1;
  }
}
assert.equal(bondCount, 14, "fourteen authored V1 bonds");

const biologySource = atlasView.evidenceSource["biology-of-becoming"];
assert.equal(biologySource?.id, "b2");
assert.equal(biologySource?.visibility, "superseded");
assert.equal(biologySource?.route, "/atlas/the-biology-of-becoming");

for (const [evidenceId, source] of Object.entries(atlasView.evidenceSource)) {
  assert.ok(source?.route?.startsWith("/"), `${evidenceId}: source route`);
  assert.ok(source.id !== "b8" || evidenceId !== "biology-of-becoming");
}

for (const [evidenceId, books] of Object.entries(atlasView.relatedBooks)) {
  for (const book of books ?? []) {
    assert.notEqual(book.id, "b2", `${evidenceId}: must not recommend superseded Biology`);
    assert.ok(book.route.startsWith("/atlas/"));
  }
}

assert.equal(atlasView.relatedBooks["biology-of-becoming"]?.length ?? 0, 0);
assert.ok((atlasView.relatedBooks["feel-it-in-body"] ?? []).some((b) => b.id === "b8"));
assert.ok((atlasView.relatedBooks["feel-it-in-body"] ?? []).some((b) => b.id === "b3"));

const inferredBiology = relatedBooksForConcept("adaptation").some(
  (book) => book.slug === "the-biology-of-becoming",
);
assert.equal(inferredBiology, true, "legacy helper still exists and still lists b2");
assert.ok(
  !(atlasView.relatedBooks["biology-of-becoming"] ?? []).some((b) => b.id === "b2"),
);

console.log("canonical objects", objects.length, counts);
console.log("canonical relations", relations.length);
console.log("disconnected essays", disconnected.length);
console.log("validation issues", issues.length);
console.log("verify-canonical OK");
