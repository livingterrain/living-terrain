/**
 * Build lean mobile cinematic plates — one JPEG per beat.
 * Portrait center-crop from approved art direction at 768×1152.
 *
 * Run: node scripts/build-cinematic-mobile-plates.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public/observatory/cinematic/plates/mobile");

const WIDTH = 768;
const HEIGHT = 1152;

const BEATS = [
  "01-threshold",
  "02-first-reveal",
  "03-observatory",
  "04-sanctuary",
  "05-arrival",
];

async function buildPlate(beatId) {
  const src = path.join(
    ROOT,
    `public/observatory/institute/art-direction/${beatId}.png`,
  );
  if (!fs.existsSync(src)) {
    throw new Error(`Missing source: ${src}`);
  }

  const meta = await sharp(src).metadata();
  const srcW = meta.width ?? 1536;
  const srcH = meta.height ?? 1024;

  // Scale to cover portrait canvas, then center-crop.
  const scale = Math.max(WIDTH / srcW, HEIGHT / srcH);
  const resizedW = Math.round(srcW * scale);
  const resizedH = Math.round(srcH * scale);
  const left = Math.max(0, Math.round((resizedW - WIDTH) / 2));
  const top = Math.max(0, Math.round((resizedH - HEIGHT) / 2));

  const outPath = path.join(OUT, `${beatId}.jpg`);
  await sharp(src)
    .resize({ width: resizedW, height: resizedH })
    .extract({ left, top, width: WIDTH, height: HEIGHT })
    .jpeg({ quality: 72, mozjpeg: true, progressive: true })
    .toFile(outPath);

  const size = fs.statSync(outPath).size;
  console.log(`  ✓ ${beatId}.jpg (${(size / 1024).toFixed(0)} KB)`);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  console.log(`\nMobile plates → ${OUT}`);
  for (const beat of BEATS) {
    await buildPlate(beat);
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
