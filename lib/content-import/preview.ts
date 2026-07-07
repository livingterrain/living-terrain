import type { EssayImportPlan } from "./types";

export function formatImportPlanPreview(plan: EssayImportPlan): string {
  const lines: string[] = [];

  lines.push("═".repeat(60));
  lines.push("ESSAY IMPORT PLAN");
  lines.push("═".repeat(60));
  lines.push("");
  lines.push(`Title:     ${plan.entry.title}`);
  lines.push(`Slug:      ${plan.slug}`);
  lines.push(`ID:        ${plan.id}`);
  lines.push(`Route:     ${plan.entry.route}`);
  lines.push(`Medium:    ${plan.intake.mediumUrl}`);
  lines.push(`Published: ${plan.intake.publishedAt}`);
  lines.push(`Status:    ${plan.entry.status}`);
  lines.push("");

  lines.push("── CHAMBER (lantern reading room) ──");
  lines.push(`  Page:    ${plan.chamber.lanternRoute}`);
  lines.push(`  Chamber: ${plan.chamber.label} (${plan.chamber.route})`);
  lines.push("");

  lines.push("── CONSTELLATION ──");
  lines.push(`  Orbit:   ${plan.constellation.majorConceptTitle} (level ${plan.constellation.orbitLevel})`);
  lines.push(`  Focus:   ${plan.constellation.focusUrl}`);
  lines.push(`  Note:    ${plan.constellation.placementNote}`);
  lines.push("");

  lines.push("── OBSERVATORY ──");
  lines.push(`  Category:  ${plan.observatory.category}`);
  lines.push(
    `  Cluster:   ${plan.observatory.clusterQuestion ?? "Open ground (no question pathway yet)"}`,
  );
  lines.push("");

  lines.push("── THEMES & TOPICS ──");
  lines.push(`  Themes:  ${plan.entry.themes.join(", ")}`);
  lines.push(`  Parents: ${plan.entry.parentConcepts.join(", ")}`);
  lines.push(
    `  Topics:  ${(plan.entry.meta as { topics: string[] }).topics.join(" · ")}`,
  );
  lines.push("");

  lines.push("── WHAT THIS TOUCHES ──");
  if (plan.touches.length === 0) {
    lines.push("  (none inferred)");
  } else {
    for (const touch of plan.touches) {
      lines.push(`  · [${touch.kind}] ${touch.title}`);
      lines.push(`    ${touch.rationale}`);
    }
  }
  lines.push("");

  lines.push("── NEIGHBORING ESSAYS ──");
  if (plan.neighbors.length === 0) {
    lines.push("  (first essay in this orbit — no neighbors yet)");
  } else {
    for (const n of plan.neighbors) {
      lines.push(
        `  · [${n.connectionKind}] ${n.title} (shared: ${n.sharedThemes.join(", ") || "themes"})`,
      );
    }
  }
  lines.push("");

  lines.push("── SUGGESTED OBSERVATORY THREADS ──");
  if (plan.suggestedThreads.length === 0) {
    lines.push("  (no strong thread fit — consider curating a new pathway)");
  } else {
    for (const thread of plan.suggestedThreads) {
      lines.push(`  · ${thread.threadTitle} (fit ${thread.fitScore})`);
      lines.push(`    ${thread.rationale}`);
    }
  }
  lines.push("");

  lines.push(`── CONNECTIONS (${plan.connections.length}) ──`);
  for (const c of plan.connections) {
    lines.push(`  ${c.from} → ${c.to} [${c.kind}]`);
  }
  lines.push("");

  if (plan.featuredImage) {
    lines.push("── FEATURED IMAGE ──");
    lines.push(`  Source: ${plan.featuredImage.sourcePath}`);
    lines.push(`  Public: ${plan.featuredImage.publicPath}`);
    lines.push("");
  }

  if (plan.warnings.length > 0) {
    lines.push("── WARNINGS ──");
    for (const w of plan.warnings) lines.push(`  ! ${w}`);
    lines.push("");
  }

  lines.push("═".repeat(60));
  lines.push("Run: npm run content:essay:apply -- <intake-file>");
  lines.push("═".repeat(60));

  return lines.join("\n");
}
