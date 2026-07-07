import fs from "node:fs";
import path from "node:path";
import type { EssayIntake } from "./types";

const INTAKE_ROOT = path.join(process.cwd(), "content/intake/essays");

export function intakePathForSlug(slug: string): string {
  return path.join(INTAKE_ROOT, `${slug}.essay.json`);
}

export function loadEssayIntake(filePath: string): EssayIntake {
  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw) as EssayIntake;
  return data;
}

export function resolveFeaturedImagePath(
  intakePath: string,
  featuredImage: string,
): string {
  if (path.isAbsolute(featuredImage)) return featuredImage;
  return path.resolve(path.dirname(intakePath), featuredImage);
}

export function listIntakeFiles(): string[] {
  if (!fs.existsSync(INTAKE_ROOT)) return [];
  return fs
    .readdirSync(INTAKE_ROOT)
    .filter(
      (name) =>
        name.endsWith(".essay.json") &&
        !name.startsWith("_") &&
        name !== "README.md",
    )
    .map((name) => path.join(INTAKE_ROOT, name));
}

export { INTAKE_ROOT };
