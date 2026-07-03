/**
 * Production first-load check — samples threshold layer opacity over time.
 * Run: node scripts/verify-threshold-first-load.mjs [baseUrl]
 */
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://127.0.0.1:3000";
const runs = Number(process.argv[3] ?? 5);

async function sample(page) {
  return page.evaluate(() => {
    const layer = document.querySelector('[class*="z-30"]');
    const h1 = document.querySelector("h1");
    const voidBg = document.querySelector(".threshold-page-atmosphere > div");
    const layerOpacity = layer ? getComputedStyle(layer).opacity : null;
    const h1Opacity = h1 ? getComputedStyle(h1).opacity : null;
    const voidColor = voidBg ? getComputedStyle(voidBg).backgroundColor : null;
    const htmlVoid = getComputedStyle(document.documentElement).getPropertyValue(
      "--circadian-void-base",
    );
    return {
      layerOpacity,
      h1Opacity,
      h1Text: h1?.textContent?.trim() ?? null,
      voidColor,
      htmlVoid: htmlVoid.trim(),
      circadianActive: document.documentElement.classList.contains(
        "circadian-active",
      ),
    };
  });
}

let browser;
try {
  browser = await chromium.launch();
  let failures = 0;

  for (let run = 1; run <= runs; run++) {
    const context = await browser.newContext();
    const page = await context.newPage();

    const timeline = [];
    const marks = [0, 16, 50, 100, 200, 400, 900, 1200, 1500];

    await page.goto(base, { waitUntil: "load" });
    let elapsed = 0;
    for (const ms of marks) {
      await page.waitForTimeout(ms - elapsed);
      elapsed = ms;
      timeline.push({ ms, ...(await sample(page)) });
    }

    const first = timeline[0];
    const at900 = timeline.find((t) => t.ms === 900);
    const at1500 = timeline.find((t) => t.ms === 1500);

    const ok =
      first?.h1Text === "Living Terrain" &&
      Number(first?.layerOpacity) <= 0.05 &&
      Number(at900?.layerOpacity) >= 0.5 &&
      Number(at1500?.layerOpacity) >= 0.95 &&
      first?.voidColor === "rgb(6, 8, 12)";

    if (!ok) {
      failures++;
      console.error(`Run ${run} FAILED`, { first, at900, at1500, timeline });
    } else {
      console.log(`Run ${run} OK — fade ${first.layerOpacity} → ${at1500.layerOpacity}`);
    }

    await context.close();
  }

  if (failures > 0) {
    console.error(`${failures}/${runs} runs failed`);
    process.exit(1);
  }
  console.log(`All ${runs} runs passed`);
} catch (err) {
  console.error(err);
  process.exit(1);
} finally {
  await browser?.close();
}
