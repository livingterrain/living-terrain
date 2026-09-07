import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ATLAS_DATA } from "../lib/atlas/data";
import { generateEssayImportPlan, validateIntake } from "../lib/content-import";
import { compareEssaysWithSubstack, parseSubstackFeed } from "../lib/content-migration/substack-inventory";
import { subscribeToWaitlist } from "../lib/newsletter";

async function main(): Promise<void> {
assert.equal(ATLAS_DATA.site.url, "https://chelseathacker.com");
assert.equal(ATLAS_DATA.site.substackUrl, "https://livingterrain.substack.com");
assert.equal(ATLAS_DATA.site.substackSubscribeUrl, "https://livingterrain.substack.com/subscribe");

const base = {
  title: "A Test Essay",
  subtitle: "A subtitle",
  publishedAt: "2026-09-01",
};
assert.deepEqual(
  validateIntake({
    ...base,
    substackUrl: "https://livingterrain.substack.com/p/a-test",
  }),
  [],
);
assert.deepEqual(
  validateIntake({
    ...base,
    mediumUrl: "https://medium.com/@livingterrain/a-test",
  }),
  [],
);
assert.ok(validateIntake({ ...base }).some((error) => error.includes("canonicalUrl")));
const substackPlan = await generateEssayImportPlan({
  ...base,
  substackUrl: "https://livingterrain.substack.com/p/a-test",
  mediumUrl: "https://medium.com/@livingterrain/a-test",
  status: "draft",
  publicationStatus: "scheduled",
});
const substackMeta = substackPlan.entry.meta as Record<string, unknown>;
assert.equal(substackMeta.canonicalUrl, "https://livingterrain.substack.com/p/a-test");
assert.equal(substackMeta.substackUrl, "https://livingterrain.substack.com/p/a-test");
assert.equal(substackMeta.mediumUrl, "https://medium.com/@livingterrain/a-test");
assert.equal(substackMeta.publicationStatus, "scheduled");
assert.equal(substackMeta.externalUrl, undefined);

const legacyPlan = await generateEssayImportPlan({
  ...base,
  mediumUrl: "https://medium.com/@livingterrain/a-legacy-test",
});
const legacyMeta = legacyPlan.entry.meta as Record<string, unknown>;
assert.equal(legacyMeta.externalUrl, "https://medium.com/@livingterrain/a-legacy-test");
assert.equal(legacyMeta.canonicalUrl, undefined);

const legacyIntakeDir = path.join(process.cwd(), "content/intake/essays/applied");
for (const name of fs.readdirSync(legacyIntakeDir).filter((file) => file.endsWith(".json"))) {
  const intake = JSON.parse(fs.readFileSync(path.join(legacyIntakeDir, name), "utf8"));
  assert.deepEqual(validateIntake(intake), [], `${name} remains valid`);
}

const waitlist = await subscribeToWaitlist({ email: "reader@example.com", source: "newsletter" });
assert.equal(waitlist.success, false);
assert.match(waitlist.message, /not available/i);

const posts = parseSubstackFeed(`<rss><channel>
  <item><title><![CDATA[A Test Essay]]></title><link>https://livingterrain.substack.com/p/a-test</link><pubDate>Tue, 01 Sep 2026 12:00:00 GMT</pubDate></item>
  <item><title>Duplicate</title><link>https://livingterrain.substack.com/p/d1</link><pubDate>Tue, 01 Sep 2026 12:00:00 GMT</pubDate></item>
  <item><title>Duplicate</title><link>https://livingterrain.substack.com/p/d2</link><pubDate>Wed, 02 Sep 2026 12:00:00 GMT</pubDate></item>
</channel></rss>`);
const report = compareEssaysWithSubstack([
  { ...base, id: "e-test", slug: "a-test", excerpt: "", topics: [], questionIds: [], title: base.title, status: "published" },
], posts, "fixture", "2026-09-03T00:00:00.000Z");
assert.equal(report.counts.matches, 1);
assert.equal(report.counts.possibleDuplicates, 1);
assert.equal(report.counts.dateConflicts, 0);
console.log("verify-publication-foundation OK");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
