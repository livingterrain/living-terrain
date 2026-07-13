/**
 * Slice an approved storyboard frame into depth planes for 2.5D runtime.
 * Usage: node scripts/slice-cinematic-beat.mjs 03-observatory
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const beatId = process.argv[2];
if (!beatId) {
  console.error("Usage: node scripts/slice-cinematic-beat.mjs <beat-id>");
  console.error("Example: node scripts/slice-cinematic-beat.mjs 03-observatory");
  process.exit(1);
}

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(
  ROOT,
  `public/observatory/institute/art-direction/${beatId}.png`,
);
const OUT = path.join(ROOT, `public/observatory/cinematic/layers/beat-${beatId.slice(0, 2)}`);

const CANVAS = { width: 1536, height: 1024 };

const LAYERS = {
  back: { top: 0, left: 0, width: 1536, height: 620, featherBottom: 120 },
  "mid-nave": {
    top: 100,
    left: 180,
    width: 1176,
    height: 780,
    featherTop: 90,
    featherLeft: 100,
    featherRight: 100,
    featherBottom: 140,
  },
  "fore-left": {
    top: 0,
    left: 0,
    width: 300,
    height: 1024,
    featherRight: 90,
  },
  "fore-right": {
    top: 0,
    left: 1236,
    width: 300,
    height: 1024,
    featherLeft: 90,
  },
  "fore-floor": {
    top: 680,
    left: 0,
    width: 1536,
    height: 344,
    featherTop: 100,
  },
};

function featherMask(w, h, spec) {
  const pixels = Buffer.alloc(w * h * 4, 255);
  const {
    featherTop = 0,
    featherBottom = 0,
    featherLeft = 0,
    featherRight = 0,
  } = spec;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let a = 255;
      if (featherTop > 0 && y < featherTop) {
        a = Math.min(a, Math.round((y / featherTop) * 255));
      }
      if (featherBottom > 0 && y >= h - featherBottom) {
        const d = h - 1 - y;
        a = Math.min(a, Math.round((d / featherBottom) * 255));
      }
      if (featherLeft > 0 && x < featherLeft) {
        a = Math.min(a, Math.round((x / featherLeft) * 255));
      }
      if (featherRight > 0 && x >= w - featherRight) {
        const d = w - 1 - x;
        a = Math.min(a, Math.round((d / featherRight) * 255));
      }
      const i = (y * w + x) * 4;
      pixels[i + 3] = a;
    }
  }
  return pixels;
}

async function buildLayer(outPath, layerName, spec) {
  const { top, left, width, height, ...feather } = spec;

  const crop = await sharp(SRC)
    .extract({ left, top, width, height })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const mask = featherMask(crop.info.width, crop.info.height, feather);
  const data = Buffer.from(crop.data);
  for (let i = 0; i < data.length; i += 4) {
    data[i + 3] = Math.round((data[i + 3] * mask[i + 3]) / 255);
  }

  const layer = await sharp(data, {
    raw: { width: crop.info.width, height: crop.info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: CANVAS.width,
      height: CANVAS.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: layer, left, top }])
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  console.log(`  ✓ ${layerName}`);
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`Source not found: ${SRC}`);
    process.exit(1);
  }

  for (const variant of ["desktop", "mobile"]) {
    const outDir = path.join(OUT, variant);
    fs.mkdirSync(outDir, { recursive: true });
    console.log(`\n${beatId} / ${variant}`);
    for (const [layerName, spec] of Object.entries(LAYERS)) {
      await buildLayer(path.join(outDir, `${layerName}.png`), layerName, spec);
    }
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
