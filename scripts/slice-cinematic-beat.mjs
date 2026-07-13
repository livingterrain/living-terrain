/**
 * Slice an approved storyboard frame into depth planes for 2.5D runtime.
 * Desktop: landscape 1536×1024. Mobile: portrait 1024×1536 center-crop.
 *
 * Usage: node scripts/slice-cinematic-beat.mjs 03-observatory
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const beatId = process.argv[2];
if (!beatId) {
  console.error("Usage: node scripts/slice-cinematic-beat.mjs <beat-id>");
  process.exit(1);
}

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(
  ROOT,
  `public/observatory/institute/art-direction/${beatId}.png`,
);
const OUT = path.join(
  ROOT,
  `public/observatory/cinematic/layers/beat-${beatId.slice(0, 2)}`,
);

const DESKTOP_CANVAS = { width: 1536, height: 1024 };

const DESKTOP_LAYERS = {
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

const MOBILE_CANVAS = { width: 1024, height: 1536 };

/** Portrait layers — aligned with threshold mobile slices */
const MOBILE_LAYERS = {
  back: { top: 0, left: 0, width: 1024, height: 1180, featherBottom: 160 },
  "mid-nave": {
    top: 200,
    left: 0,
    width: 1024,
    height: 980,
    featherTop: 100,
    featherBottom: 180,
  },
  "fore-left": {
    top: 0,
    left: 0,
    width: 160,
    height: 1536,
    featherRight: 50,
  },
  "fore-right": {
    top: 0,
    left: 864,
    width: 160,
    height: 1536,
    featherLeft: 50,
  },
  "fore-floor": {
    top: 980,
    left: 0,
    width: 1024,
    height: 556,
    featherTop: 140,
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

async function portraitSource() {
  const scaledW = Math.round(1536 * (MOBILE_CANVAS.height / 1024));
  const left = Math.round((scaledW - MOBILE_CANVAS.width) / 2);
  return sharp(SRC)
    .resize({ height: MOBILE_CANVAS.height })
    .extract({
      left,
      top: 0,
      width: MOBILE_CANVAS.width,
      height: MOBILE_CANVAS.height,
    })
    .ensureAlpha()
    .png()
    .toBuffer();
}

async function buildLayer(source, canvas, outPath, layerName, spec) {
  const { top, left, width, height, ...feather } = spec;

  const crop = await sharp(source)
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
      width: canvas.width,
      height: canvas.height,
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

  const mobileSrc = await portraitSource();

  console.log(`\n${beatId} / desktop`);
  const desktopDir = path.join(OUT, "desktop");
  fs.mkdirSync(desktopDir, { recursive: true });
  for (const [layerName, spec] of Object.entries(DESKTOP_LAYERS)) {
    await buildLayer(
      SRC,
      DESKTOP_CANVAS,
      path.join(desktopDir, `${layerName}.png`),
      layerName,
      spec,
    );
  }

  console.log(`\n${beatId} / mobile (portrait)`);
  const mobileDir = path.join(OUT, "mobile");
  fs.mkdirSync(mobileDir, { recursive: true });
  for (const [layerName, spec] of Object.entries(MOBILE_LAYERS)) {
    await buildLayer(
      mobileSrc,
      MOBILE_CANVAS,
      path.join(mobileDir, `${layerName}.png`),
      layerName,
      spec,
    );
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
