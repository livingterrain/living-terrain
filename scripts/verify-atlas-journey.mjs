/**
 * Atlas journey regression — unfinished edge, Rest here, blank-state recovery.
 * Run: npx tsx scripts/verify-atlas-journey.mjs [baseUrl]
 *   or: npm run verify:atlas
 * Requires: playwright + local/prod server
 */
import { chromium } from "playwright";
import assert from "node:assert/strict";
import {
  getQuestion,
  resolveEvidenceEssayId,
  resolveUnfinishedEdge,
  getEssay,
  ATLAS_V1_QUESTIONS,
} from "../lib/atlas-v1/content.ts";
import { VOID_QUESTIONS } from "../lib/atlas-v1/questions.ts";

const base = process.argv[2] ?? "http://127.0.0.1:3001";

function unitUnfinished() {
  const q = getQuestion("body-react");
  assert.ok(q, "body-react question exists");

  // From is on trail, to is not → unfinished is available (Rest here / pause content).
  const open = resolveUnfinishedEdge(q, ["body"]);
  assert.equal(open?.to, "feedback");
  assert.ok(open?.why);

  // Corpus adjacency must NOT clear unfinished — only walking `to` does.
  assert.equal(resolveUnfinishedEdge(q, ["body"])?.to, "feedback");

  // After the visitor walks to the unfinished target, pause content is gone.
  assert.equal(resolveUnfinishedEdge(q, ["body", "feedback"]), null);

  // Before reaching `from`, no unfinished edge.
  assert.equal(resolveUnfinishedEdge(q, ["technology"]), null);

  console.log("unit: resolveUnfinishedEdge OK");
}

function unitEvidenceCoverage() {
  for (const vq of VOID_QUESTIONS) {
    const q = getQuestion(vq.id);
    assert.equal(q.id, vq.id);
    const startId = resolveEvidenceEssayId(q, q.startConceptId);
    assert.ok(startId, `${q.id}: start concept has evidence`);
    assert.ok(getEssay(startId).body.length > 0, `${q.id}: essay body present`);

    // Every mapped evidence id resolves.
    for (const [conceptId, essayId] of Object.entries(q.evidence)) {
      const essay = getEssay(essayId);
      assert.ok(essay.title, `${q.id}/${conceptId}: essay title`);
      assert.ok(essay.body.length > 0, `${q.id}/${conceptId}: essay body`);
    }
  }

  // Book-representing excerpts remain reachable by id.
  assert.match(getEssay("second-birth").title, /Second Birth/i);
  assert.match(getEssay("biology-of-becoming").title, /Biology of Becoming/i);
  assert.match(getEssay("structure-beneath").title, /Structure Beneath/i);

  assert.equal(ATLAS_V1_QUESTIONS.length, VOID_QUESTIONS.length);
  console.log("unit: evidence coverage OK");
}

async function probe(page, label) {
  await page.goto(`${base}/atlas`, { waitUntil: "load", timeout: 45000 });
  await page.waitForSelector(".the-void", { timeout: 15000 });

  const initial = await page.evaluate(() => ({
    locked: document.querySelector(".the-void")?.classList.contains("the-void--locked"),
    attend: !!document.querySelector(".the-void-attend"),
    questions: document.querySelectorAll(".the-void-question").length,
    inquiry: (document.body?.innerText || "").includes("What are you trying to understand?"),
    textLen: (document.body?.innerText || "").trim().length,
  }));
  assert.equal(initial.locked, false, `${label}: no threshold lock`);
  assert.equal(initial.attend, false, `${label}: no attend gate`);
  assert.equal(initial.inquiry, true, `${label}: inquiry on first paint`);
  assert.ok(initial.questions >= 6, `${label}: questions on first paint`);

  const questionCount = await page.locator(".the-void-question").count();
  assert.ok(questionCount >= 6, `${label}: six questions usable immediately`);

  await page.locator(".the-void-question").first().click();
  await page.waitForSelector(".atlas-v1-concept", { timeout: 10000 });

  // Reduced motion → relations auto-visible; wait for Rest here (unfinished open).
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll("button")].some((b) =>
        /Rest here/i.test(b.textContent || ""),
      ),
    null,
    { timeout: 8000 },
  );

  // Evidence / reading path from the opening concept.
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll("button")].some((b) =>
        /This lives in the writing/i.test(b.textContent || ""),
      ),
    null,
    { timeout: 8000 },
  );
  await page.getByRole("button", { name: "This lives in the writing" }).click();
  await page.waitForSelector(".atlas-v1-prose h2", { timeout: 5000 });
  const evidenceTitle = (await page.locator(".atlas-v1-prose h2").innerText()).trim();
  const evidenceBody = (await page.locator(".atlas-v1-prose").innerText()).trim();
  assert.ok(evidenceTitle.length > 0, `${label}: evidence title`);
  assert.ok(evidenceBody.length > 80, `${label}: evidence body`);
  await page.getByRole("button", { name: "Return to what you noticed" }).click();
  await page.waitForSelector(".atlas-v1-concept", { timeout: 8000 });

  await page.getByRole("button", { name: "Rest here" }).click();
  await page.waitForSelector(".atlas-v1-pause", { timeout: 5000 });
  const pauseText = await page.locator(".atlas-v1-pause").innerText();
  assert.match(pauseText, /Feedback|body|not malfunctioning/i);
  assert.ok(pauseText.trim().length > 40, `${label}: pause is not empty`);

  // Follow unfinished edge away, then Rest here must disappear.
  await page.getByRole("button", { name: "Begin again" }).click();
  await page.waitForSelector(".the-void-question", { timeout: 8000 });
  await page.locator(".the-void-question").first().click();
  await page.waitForSelector(".atlas-v1-concept", { timeout: 10000 });
  await page.waitForSelector(".atlas-bond-dest:not([disabled])", {
    timeout: 8000,
  });
  await page.locator(".atlas-bond-dest").click();
  const notice = page.getByRole("button", { name: "Continue" });
  if (await notice.count()) {
    await notice.click();
  }
  await page.waitForSelector(".atlas-v1-concept", { timeout: 8000 });
  const restAfterWalk = await page.evaluate(() =>
    [...document.querySelectorAll("button")].some((b) =>
      /Rest here/i.test(b.textContent || ""),
    ),
  );
  assert.equal(
    restAfterWalk,
    false,
    `${label}: Rest here hidden after unfinished edge walked`,
  );

  // Stale history: non-void view + null journey must not blank the realm.
  await page.evaluate(() => {
    const bad = { view: "journey", journey: null, relationsVisible: false };
    history.pushState(bad, "", "/atlas");
    window.dispatchEvent(new PopStateEvent("popstate", { state: bad }));
  });
  await page.waitForTimeout(400);
  const recovered = await page.evaluate(() => ({
    textLen: (document.body?.innerText || "").trim().length,
    questions: document.querySelectorAll(".the-void-question").length,
    restSurface: document
      .querySelector(".the-void")
      ?.classList.contains("the-void--rest"),
    concept: !!document.querySelector(".atlas-v1-concept"),
  }));
  assert.ok(
    recovered.questions >= 1 || recovered.concept,
    `${label}: recovered from null-journey history (got usable UI)`,
  );
  assert.equal(
    recovered.restSurface && recovered.textLen === 0,
    false,
    `${label}: must not remain on blank rest surface`,
  );
  assert.ok(recovered.textLen > 0, `${label}: recovered UI has text`);

  // Pause with unfinished already walked → must not stay empty.
  await page.evaluate(() => {
    const bad = {
      view: "pause",
      journey: {
        questionId: "body-react",
        currentConceptId: "feedback",
        trail: ["body", "feedback"],
        essaysOpened: [],
        activeEssayId: null,
        noticedWhy: "x",
      },
      relationsVisible: false,
    };
    history.pushState(bad, "", "/atlas");
    window.dispatchEvent(new PopStateEvent("popstate", { state: bad }));
  });
  await page.waitForTimeout(500);
  const pauseRecovered = await page.evaluate(() => ({
    pause: !!document.querySelector(".atlas-v1-pause"),
    concept: !!document.querySelector(".atlas-v1-concept"),
    questions: document.querySelectorAll(".the-void-question").length,
    textLen: (document.body?.innerText || "").trim().length,
  }));
  assert.equal(pauseRecovered.pause, false, `${label}: empty pause not kept`);
  assert.ok(
    pauseRecovered.concept || pauseRecovered.questions > 0,
    `${label}: invalid pause recovers to journey or questions`,
  );
  assert.ok(pauseRecovered.textLen > 0, `${label}: invalid pause not blank`);

  // Evidence without activeEssayId must recover (not blank).
  await page.evaluate(() => {
    const bad = {
      view: "evidence",
      journey: {
        questionId: "body-react",
        currentConceptId: "body",
        trail: ["body"],
        essaysOpened: [],
        activeEssayId: null,
        noticedWhy: null,
      },
      relationsVisible: true,
    };
    history.pushState(bad, "", "/atlas");
    window.dispatchEvent(new PopStateEvent("popstate", { state: bad }));
  });
  await page.waitForTimeout(500);
  const evidenceRecovered = await page.evaluate(() => ({
    prose: !!document.querySelector(".atlas-v1-prose"),
    concept: !!document.querySelector(".atlas-v1-concept"),
    questions: document.querySelectorAll(".the-void-question").length,
    textLen: (document.body?.innerText || "").trim().length,
  }));
  assert.equal(
    evidenceRecovered.prose,
    false,
    `${label}: empty evidence view not kept`,
  );
  assert.ok(
    evidenceRecovered.concept || evidenceRecovered.questions > 0,
    `${label}: invalid evidence recovers to journey or questions`,
  );
  assert.ok(evidenceRecovered.textLen > 0, `${label}: invalid evidence not blank`);

  console.log(`${label}: OK`);
}

let browser;
try {
  unitUnfinished();
  unitEvidenceCoverage();
  browser = await chromium.launch({ headless: true });

  for (const [label, viewport] of [
    ["desktop", { width: 1280, height: 800 }],
    ["mobile-390", { width: 390, height: 844 }],
  ]) {
    const context = await browser.newContext({
      viewport,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.on("pageerror", (err) => {
      console.error(`${label} pageerror:`, err);
      throw err;
    });
    await probe(page, label);
    await context.close();
  }

  console.log("All Atlas journey checks passed");
} catch (err) {
  console.error(err);
  process.exit(1);
} finally {
  await browser?.close();
}
