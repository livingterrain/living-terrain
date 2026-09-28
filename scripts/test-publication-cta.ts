/**
 * Publication CTA unit tests (no browser).
 * Run: npx tsx scripts/test-publication-cta.ts
 */

import assert from "node:assert/strict";
import {
  getEssayPublicationCta,
  getEssayPublicationHref,
  getEssayPublicationSource,
  isMediumUrl,
  isSubstackPostUrl,
} from "../lib/content/publication-cta";
import type { Essay } from "../lib/content/types";

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

function essay(partial: Partial<Essay> & Pick<Essay, "id" | "slug" | "title">): Essay {
  return {
    publishedAt: "2026-01-01",
    excerpt: "Excerpt.",
    topics: [],
    questionIds: [],
    status: "published",
    ...partial,
  };
}

check("isSubstackPostUrl: accepts exact post", () => {
  assert.equal(
    isSubstackPostUrl(
      "https://livingterrain.substack.com/p/make-a-loop",
    ),
    true,
  );
});

check("isSubstackPostUrl: rejects homepage", () => {
  assert.equal(isSubstackPostUrl("https://livingterrain.substack.com"), false);
  assert.equal(isSubstackPostUrl("https://livingterrain.substack.com/"), false);
});

check("isMediumUrl: accepts medium hosts", () => {
  assert.equal(
    isMediumUrl("https://medium.com/@livingterrain/some-slug-abc123"),
    true,
  );
  assert.equal(
    isMediumUrl("https://chelsea.medium.com/some-slug-abc123"),
    true,
  );
});

check("Substack preference: verified Substack post wins over Medium canonical", () => {
  const e = essay({
    id: "pref-1",
    slug: "pref-substack",
    title: "Prefer Substack",
    canonicalUrl: "https://medium.com/@livingterrain/prefer-substack-abc",
    mediumUrl: "https://medium.com/@livingterrain/prefer-substack-abc",
    substackUrl:
      "https://livingterrain.substack.com/p/prefer-substack",
  });
  assert.equal(
    getEssayPublicationHref(e),
    "https://livingterrain.substack.com/p/prefer-substack",
  );
  assert.equal(getEssayPublicationSource(e), "Substack");
  const cta = getEssayPublicationCta(e);
  assert.equal(cta.readLabel, "Read on Substack");
  assert.equal(cta.sourceLabel, "Substack");
  assert.equal(cta.alsoPublishedLabel, "Also published on Substack");
  assert.equal(cta.isMediumFallback, false);
});

check("Medium fallback: Medium URL used when no Substack post exists", () => {
  const e = essay({
    id: "med-1",
    slug: "medium-only",
    title: "Medium Only",
    canonicalUrl: "https://medium.com/@livingterrain/medium-only-abc",
    mediumUrl: "https://medium.com/@livingterrain/medium-only-abc",
  });
  assert.equal(
    getEssayPublicationHref(e),
    "https://medium.com/@livingterrain/medium-only-abc",
  );
  assert.equal(getEssayPublicationSource(e), "Medium");
  const cta = getEssayPublicationCta(e);
  assert.equal(cta.readLabel, "Read on Medium");
  assert.equal(cta.sourceLabel, "Medium");
  assert.equal(cta.isMediumFallback, true);
});

check("canonical conflict: Medium canonical + Substack field → Substack CTA", () => {
  const e = essay({
    id: "conflict-1",
    slug: "conflict-essay",
    title: "Conflict Essay",
    // SEO / historical field may still name Medium as canonicalUrl
    canonicalUrl: "https://medium.com/illumination/conflict-essay-xyz",
    substackUrl: "https://livingterrain.substack.com/p/conflict-essay",
  });
  const cta = getEssayPublicationCta(e);
  assert.equal(cta.href, "https://livingterrain.substack.com/p/conflict-essay");
  assert.equal(cta.source, "Substack");
  assert.equal(cta.readLabel, "Read on Substack");
  assert.equal(cta.isMediumFallback, false);
});

check("never invents Substack homepage as post stand-in", () => {
  const e = essay({
    id: "none-1",
    slug: "no-external",
    title: "No External",
  });
  assert.equal(getEssayPublicationHref(e), null);
  const cta = getEssayPublicationCta(e);
  assert.equal(cta.href, null);
  assert.equal(cta.readLabel, null);
  assert.equal(cta.sourceLabel, null);
});

check("Substack homepage in fields is ignored for CTAs", () => {
  const e = essay({
    id: "home-1",
    slug: "homepage-trap",
    title: "Homepage Trap",
    substackUrl: "https://livingterrain.substack.com",
    mediumUrl: "https://medium.com/@livingterrain/homepage-trap-abc",
  });
  assert.equal(
    getEssayPublicationHref(e),
    "https://medium.com/@livingterrain/homepage-trap-abc",
  );
  assert.equal(getEssayPublicationSource(e), "Medium");
  assert.equal(getEssayPublicationCta(e).readLabel, "Read on Medium");
});

check("CTA labels reflect actual destination", () => {
  const sub = getEssayPublicationCta(
    essay({
      id: "lab-s",
      slug: "lab-s",
      title: "Lab S",
      substackUrl: "https://livingterrain.substack.com/p/lab-s",
    }),
  );
  const med = getEssayPublicationCta(
    essay({
      id: "lab-m",
      slug: "lab-m",
      title: "Lab M",
      mediumUrl: "https://medium.com/@livingterrain/lab-m-abc",
    }),
  );
  assert.ok(sub.readLabel?.includes("Substack"));
  assert.ok(!sub.readLabel?.includes("Medium"));
  assert.ok(med.readLabel?.includes("Medium"));
  assert.ok(!med.readLabel?.includes("Substack"));
});

if (failed > 0) {
  console.error(`\n${failed} failure(s)`);
  process.exit(1);
}
console.log("\nAll publication CTA tests passed.");
