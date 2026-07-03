/**
 * Verify Threshold → Terrain crossing 20 times without freeze.
 * Run: node scripts/verify-threshold-crossing.mjs
 * Requires: npx playwright install chromium (once)
 */
import { chromium } from "playwright";

const URL = process.env.LT_URL ?? "http://localhost:3000";
const RUNS = 20;
const WAIT_MS = 5000;

async function checkMapReady(page) {
  return page.evaluate(() => {
    const pane = document.querySelector(".isolation-isolate");
    const paneOpacity = pane ? parseFloat(getComputedStyle(pane).opacity) : 0;
    const svg = document.querySelector(".constellation-graph");
    const circles = svg?.querySelectorAll("circle").length ?? 0;
    const thresholdVisible = !!document.querySelector('[class*="hero-foreground"]');
    return {
      paneOpacity,
      circles,
      thresholdVisible,
      ok: paneOpacity > 0.5 && circles >= 8 && !thresholdVisible,
    };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  const failures = [];

  for (let i = 1; i <= RUNS; i++) {
    await page.goto(URL, { waitUntil: "networkidle" });
    await page.evaluate(() => sessionStorage.removeItem("lt-constellation-session"));

    const enterBtn = page.getByRole("button", { name: /step onto the terrain/i });
    await enterBtn.click();

    await page.waitForTimeout(WAIT_MS);

    const state = await checkMapReady(page);
    if (!state.ok) {
      failures.push({ run: i, ...state });
      console.error(`FAIL run ${i}:`, state);
    } else {
      console.log(`PASS run ${i}: circles=${state.circles} opacity=${state.paneOpacity}`);
    }
  }

  await browser.close();

  if (failures.length > 0) {
    console.error(`\n${failures.length}/${RUNS} runs failed`);
    process.exit(1);
  }

  console.log(`\nAll ${RUNS} runs passed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
