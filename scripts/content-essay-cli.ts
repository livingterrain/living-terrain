#!/usr/bin/env npx tsx
/**
 * Medium essay content import CLI
 *
 *   npm run content:essay:new -- "My Essay Title"
 *   npm run content:essay:preview -- content/intake/essays/my-essay.essay.json
 *   npm run content:essay:apply -- content/intake/essays/my-essay.essay.json
 *   npm run content:essay:list
 */
import fs from "node:fs";
import path from "node:path";
import {
  applyEssayImportPlan,
  formatImportPlanPreview,
  generateEssayImportPlan,
  intakePathForSlug,
  listIntakeFiles,
  loadEssayIntake,
  slugifyTitle,
  INTAKE_ROOT,
} from "../lib/content-import";

const [, , command, ...args] = process.argv;

async function main(): Promise<void> {
  switch (command) {
    case "new":
      await cmdNew(args.join(" ").trim());
      break;
    case "preview":
      await cmdPreview(args[0]);
      break;
    case "apply":
      await cmdApply(args[0]);
      break;
    case "list":
      cmdList();
      break;
    default:
      printHelp();
      process.exit(command ? 1 : 0);
  }
}

function printHelp(): void {
  console.log(`
Medium essay import workflow

  new <title>     Create intake file from template
  preview <file>  Show generated atlas plan (no writes)
  apply <file>    Write to lib/atlas/imports/ and archive intake
  list            List pending intake files

Examples:
  npm run content:essay:new -- "The Weight of Attention"
  npm run content:essay:preview -- content/intake/essays/the-weight-of-attention.essay.json
  npm run content:essay:apply -- content/intake/essays/the-weight-of-attention.essay.json
`);
}

async function cmdNew(title: string): Promise<void> {
  if (!title) {
    console.error("Usage: npm run content:essay:new -- \"Essay Title\"");
    process.exit(1);
  }

  fs.mkdirSync(INTAKE_ROOT, { recursive: true });
  const slug = slugifyTitle(title);
  const dest = intakePathForSlug(slug);

  if (fs.existsSync(dest)) {
    console.error(`Intake already exists: ${dest}`);
    process.exit(1);
  }

  const template = {
    title,
    mediumUrl: "",
    subtitle: "",
    publishedAt: new Date().toISOString().slice(0, 10),
    featuredImage: null,
    status: "draft",
  };

  fs.writeFileSync(dest, `${JSON.stringify(template, null, 2)}\n`, "utf8");
  console.log(`Created intake: ${dest}`);
  console.log("Fill in mediumUrl, subtitle, and optional featuredImage path.");
}

async function cmdPreview(fileArg?: string): Promise<void> {
  const filePath = resolveIntakePath(fileArg);
  const intake = loadEssayIntake(filePath);
  const plan = await generateEssayImportPlan(intake, { intakePath: filePath });
  console.log(formatImportPlanPreview(plan));
}

async function cmdApply(fileArg?: string): Promise<void> {
  const filePath = resolveIntakePath(fileArg);
  const intake = loadEssayIntake(filePath);
  const plan = await generateEssayImportPlan(intake, { intakePath: filePath });

  console.log(formatImportPlanPreview(plan));
  console.log("");

  const result = await applyEssayImportPlan(plan, {
    intakePath: filePath,
    archiveIntake: true,
    copyImage: true,
  });

  console.log(`Applied: ${result.entryFile}`);
  if (result.imageCopied) console.log(`Image: public/images/essays/${plan.slug}.jpg`);
  if (result.intakeArchivedTo) console.log(`Archived intake: ${result.intakeArchivedTo}`);
  console.log("\nRestart dev server if running. Deploy when ready.");
}

function cmdList(): void {
  const files = listIntakeFiles();
  if (files.length === 0) {
    console.log("No pending intake files.");
    return;
  }
  for (const file of files) console.log(file);
}

function resolveIntakePath(fileArg?: string): string {
  if (!fileArg) {
    console.error("Provide path to .essay.json intake file");
    process.exit(1);
  }
  const filePath = path.resolve(process.cwd(), fileArg);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  return filePath;
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
