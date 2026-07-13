/**
 * Slice Master B into depth planes for beat 01 threshold runtime.
 * Run: node scripts/slice-observatory-layers.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "public/observatory");

const VARIANTS = {
  desktop: {
    master: "living-terrain-master-desktop.png",
    width: 1536,
    height: 1024,
    layers: {
      back: { top: 0, left: 0, width: 1536, height: 820, featherBottom: 140 },
      "mid-nave": {
        top: 140,
        left: 0,
        width: 1536,
        height: 720,
        featherTop: 80,
        featherBottom: 160,
      },
      "fore-left": {
        top: 0,
        left: 0,
        width: 220,
        height: 1024,
        featherRight: 60,
      },
      "fore-right": {
        top: 0,
        left: 1280,
        width: 256,
        height: 1024,
        featherLeft: 80,
      },
      "fore-desk": {
        top: 640,
        left: 0,
        width: 1536,
        height: 384,
        featherTop: 120,
      },
    },
  },
  mobile: {
    master: "living-terrain-master-mobile.png",
    width: 1024,
    height: 1536,
    layers: {
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
      "fore-desk": {
        top: 980,
        left: 0,
        width: 1024,
        height: 556,
        featherTop: 140,
      },
    },
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

async function buildLayer(masterPath, outPath, variant, layerName, spec) {
  const { width: canvasW, height: canvasH } = variant;
  const { top, left, width, height, ...feather } = spec;

  const crop = await sharp(masterPath)
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
      width: canvasW,
      height: canvasH,
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
  for (const [variantName, variant] of Object.entries(VARIANTS)) {
    const masterPath = path.join(SRC, variant.master);
    const outDir = path.join(SRC, "layers", variantName);
    fs.mkdirSync(outDir, { recursive: true });

    console.log(`\n${variantName} ← ${variant.master}`);
    for (const [layerName, spec] of Object.entries(variant.layers)) {
      await buildLayer(
        masterPath,
        path.join(outDir, `${layerName}.png`),
        variant,
        layerName,
        spec,
      );
    }
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
