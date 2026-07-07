#!/usr/bin/env npx tsx
/**
 * Crawl a public Medium profile RSS feed and generate essay intake JSON files.
 *
 *   npx tsx scripts/crawl-medium-profile.ts
 *   npx tsx scripts/crawl-medium-profile.ts --profile https://medium.com/@livingterrain
 */
import fs from "node:fs";
import path from "node:path";
import {
  formatImportPlanPreview,
  generateEssayImportPlan,
  intakePathForSlug,
  slugifyTitle,
  INTAKE_ROOT,
} from "../lib/content-import";

const EXISTING_URLS = new Set([
  "https://medium.com/illumination/constraint-is-not-the-opposite-of-freedom-5e0d1b6eac28",
  "https://medium.com/illumination/you-have-to-go-far-enough-to-make-a-loop-f21aec4f8d4f",
]);

/** Pinned / older posts not always in the 10-item RSS window */
const SUPPLEMENTAL_ARTICLES: MediumArticle[] = [
  {
    title: "If You Feel It in Your Body, Start Here",
    mediumUrl:
      "https://medium.com/illumination/if-you-feel-it-in-your-body-start-here-7595993ec1fc",
    subtitle: "On Who My Work Is For — And Why I Wrote These Books",
    publishedAt: "2026-02-25",
  },
];

interface MediumArticle {
  title: string;
  mediumUrl: string;
  subtitle: string;
  publishedAt: string;
}

function parseArgs(): { profile: string; dryRun: boolean } {
  const args = process.argv.slice(2);
  let profile = "https://medium.com/@livingterrain";
  let dryRun = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--profile" && args[i + 1]) profile = args[++i];
    if (args[i] === "--dry-run") dryRun = true;
  }
  return { profile, dryRun };
}

function profileToFeedUrl(profile: string): string {
  const match = profile.match(/medium\.com\/@([^/?#]+)/);
  if (!match) throw new Error(`Invalid Medium profile URL: ${profile}`);
  return `https://medium.com/feed/@${match[1]}`;
}

function extractCdata(block: string, tag: string): string {
  const open = `<${tag}><![CDATA[`;
  const start = block.indexOf(open);
  if (start === -1) {
    const plain = block.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
    return plain?.[1]?.trim() ?? "";
  }
  const contentStart = start + open.length;
  const end = block.indexOf(`]]></${tag}>`, contentStart);
  return end === -1 ? "" : block.slice(contentStart, end).trim();
}

function extractSubtitle(html: string): string {
  const h4Match = html.match(/<h4>([\s\S]*?)<\/h4>/i);
  if (h4Match) {
    return h4Match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  }
  const pMatch = html.match(/<p>([\s\S]*?)<\/p>/i);
  if (pMatch) {
    const text = pMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    return text.slice(0, 200);
  }
  return "";
}

function parseRss(xml: string): MediumArticle[] {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);

  return items.map((block) => {
    const title = extractCdata(block, "title");
    const link = extractCdata(block, "link").split("?")[0];
    const updated =
      block.match(/<atom:updated>([^<]+)<\/atom:updated>/)?.[1] ?? "";
    const pubDate = block.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1] ?? "";
    const content = extractCdata(block, "content:encoded");
    const subtitle = extractSubtitle(content);
    const publishedAt = updated
      ? updated.slice(0, 10)
      : pubDate
        ? new Date(pubDate).toISOString().slice(0, 10)
        : "";

    return {
      title,
      mediumUrl: link,
      subtitle,
      publishedAt,
    };
  });
}

async function fetchFeed(feedUrl: string): Promise<string> {
  const res = await fetch(feedUrl, {
    headers: { "User-Agent": "LivingTerrainContentImport/1.0" },
  });
  if (!res.ok) throw new Error(`Feed fetch failed: ${res.status} ${feedUrl}`);
  return res.text();
}

async function main(): Promise<void> {
  const { profile, dryRun } = parseArgs();
  const feedUrl = profileToFeedUrl(profile);

  console.log(`Fetching ${feedUrl}...`);
  const xml = await fetchFeed(feedUrl);
  const articles = [...parseRss(xml), ...SUPPLEMENTAL_ARTICLES]
    .filter((a) => a.title && a.mediumUrl)
    .filter(
      (a, i, arr) => arr.findIndex((b) => b.mediumUrl === a.mediumUrl) === i,
    );

  const newArticles = articles.filter((a) => !EXISTING_URLS.has(a.mediumUrl));
  const skipped = articles.filter((a) => EXISTING_URLS.has(a.mediumUrl));

  console.log(`Found ${articles.length} articles (${skipped.length} already in atlas, ${newArticles.length} new)\n`);

  fs.mkdirSync(INTAKE_ROOT, { recursive: true });
  fs.mkdirSync(path.join(INTAKE_ROOT, "preview"), { recursive: true });

  const plans: Awaited<ReturnType<typeof generateEssayImportPlan>>[] = [];

  const { ATLAS_DATA } = await import("../lib/atlas/data");
  let nextId = `e${Math.max(2, ...ATLAS_DATA.entries.filter((e) => e.type === "essay").map((e) => Number(e.id.slice(1)) || 0)) + 1}`;

  for (const article of newArticles) {
    const slug = slugifyTitle(article.title);
    const intakePath = intakePathForSlug(slug);

    const intake = {
      title: article.title,
      mediumUrl: article.mediumUrl,
      subtitle: article.subtitle || article.title,
      publishedAt: article.publishedAt,
      featuredImage: null,
      status: "draft" as const,
      source: "medium-rss",
      crawledAt: new Date().toISOString(),
    };

    if (!dryRun) {
      fs.writeFileSync(intakePath, `${JSON.stringify(intake, null, 2)}\n`, "utf8");
      console.log(`Wrote intake: ${intakePath}`);
    }

    const plan = await generateEssayImportPlan(
      {
        title: intake.title,
        mediumUrl: intake.mediumUrl,
        subtitle: intake.subtitle,
        publishedAt: intake.publishedAt,
        status: intake.status,
        overrides: { id: nextId },
      },
      { intakePath },
    );
    plans.push(plan);
    nextId = `e${Number(nextId.slice(1)) + 1}`;

    const previewPath = path.join(INTAKE_ROOT, "preview", `${slug}.plan.json`);
    if (!dryRun) {
      fs.writeFileSync(previewPath, JSON.stringify(plan, null, 2), "utf8");
    }
  }

  // Summary report
  const reportPath = path.join(INTAKE_ROOT, "preview", "_medium-crawl-summary.md");
  const lines: string[] = [
    "# Medium crawl — relationship mapping preview",
    "",
    `Profile: ${profile}`,
    `Crawled: ${new Date().toISOString()}`,
    "",
    `**${newArticles.length} new essays** · ${skipped.length} already in atlas`,
    "",
    "## Already in Living Terrain",
    "",
  ];

  for (const a of skipped) {
    lines.push(`- ✓ ${a.title}`);
  }

  lines.push("", "## New essays — proposed mapping", "");

  for (const plan of plans) {
    lines.push(`### ${plan.entry.title}`);
    lines.push("");
    lines.push(`- **Slug:** \`${plan.slug}\` · **ID:** \`${plan.id}\``);
    lines.push(`- **Route:** ${plan.entry.route}`);
    lines.push(`- **Published:** ${plan.intake.publishedAt}`);
    lines.push(`- **Medium:** ${plan.intake.mediumUrl}`);
    lines.push(`- **Constellation:** orbits **${plan.constellation.majorConceptTitle}** · [return](${plan.constellation.focusUrl})`);
    lines.push(`- **Observatory:** ${plan.observatory.category}${plan.observatory.clusterQuestion ? ` · cluster: ${plan.observatory.clusterQuestion}` : ""}`);
    lines.push(`- **Themes:** ${plan.entry.themes.join(", ")}`);
    lines.push(`- **Questions:** ${plan.connections.filter((c) => c.kind === "pathway").map((c) => c.to).join(", ") || "none"}`);
    lines.push(`- **Neighbors:** ${plan.neighbors.map((n) => `${n.title} (${n.connectionKind})`).join("; ") || "none yet"}`);
    if (plan.suggestedThreads.length > 0) {
      lines.push(`- **Threads:** ${plan.suggestedThreads.map((t) => t.threadTitle).join("; ")}`);
    }
  }

  lines.push("", "## Notes", "");
  lines.push("- Medium RSS returns the **10 most recent** posts; older pinned articles are supplemented manually.");
  lines.push("- **Signals I'm Watching** is a field-note style digest — confirm before applying.");
  lines.push("- Review theme/question inference; use `overrides` in intake JSON to curate.");
  lines.push("", "## Approve", "");
  lines.push("Review intake files in `content/intake/essays/`. When ready:");
  lines.push("```bash");
  for (const plan of plans) {
    lines.push(`npm run content:essay:apply -- content/intake/essays/${plan.slug}.essay.json`);
  }
  lines.push("```");

  if (!dryRun) {
    fs.writeFileSync(reportPath, lines.join("\n"), "utf8");
    console.log(`\nSummary: ${reportPath}`);
  }

  console.log("\n" + lines.join("\n"));
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
