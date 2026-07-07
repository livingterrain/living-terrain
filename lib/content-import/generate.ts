import { OBSERVATORY_THREADS } from "../observatory/threads-data";
import type { AtlasEntry } from "../atlas/types";
import { resolveAtlasRoute } from "../atlas/routes";
import {
  generateEssayConnections,
  neighborsFromConnections,
  touchesFromConnections,
} from "./connections";
import { nextEssayId } from "./ids";
import { ensureUniqueSlug, slugifyTitle } from "./slug";
import { inferThemes } from "./theme-inference";
import type {
  EssayImportPlan,
  EssayIntake,
  SuggestedThread,
} from "./types";

async function allEntries(): Promise<AtlasEntry[]> {
  const { ATLAS_DATA } = await import("../atlas/data");
  return ATLAS_DATA.entries;
}

function validateMediumUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("medium.com")) {
      return "mediumUrl should be a medium.com link";
    }
    return null;
  } catch {
    return "mediumUrl must be a valid URL";
  }
}

function validateDate(date: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return "publishedAt must be YYYY-MM-DD";
  }
  return null;
}

export function validateIntake(intake: EssayIntake): string[] {
  const errors: string[] = [];
  if (!intake.title?.trim()) errors.push("title is required");
  if (!intake.mediumUrl?.trim()) errors.push("mediumUrl is required");
  if (!intake.subtitle?.trim()) errors.push("subtitle is required");
  if (!intake.publishedAt?.trim()) errors.push("publishedAt is required");
  const urlErr = intake.mediumUrl ? validateMediumUrl(intake.mediumUrl) : null;
  if (urlErr) errors.push(urlErr);
  const dateErr = intake.publishedAt ? validateDate(intake.publishedAt) : null;
  if (dateErr) errors.push(dateErr);
  return errors;
}

function suggestThreads(
  slug: string,
  title: string,
  themeIds: string[],
  majorConceptId: string,
  concepts: AtlasEntry[],
): SuggestedThread[] {
  const majorSlug =
    concepts.find((c) => c.id === majorConceptId)?.slug ?? "reality";

  return OBSERVATORY_THREADS.map((thread) => {
    const themeSteps = thread.steps.filter((s) => s.kind === "theme");
    const overlap = themeSteps.filter((step) => {
      const concept = concepts.find((c) => c.slug === step.slug);
      return concept && themeIds.includes(concept.id);
    }).length;
    const majorOverlap = themeSteps.some((step) => step.slug === majorSlug);
    const fitScore = overlap * 2 + (majorOverlap ? 3 : 0);

    return {
      threadId: thread.id,
      threadTitle: thread.title,
      threadSlug: thread.slug,
      premise: thread.premise,
      fitScore,
      suggestedStep: { kind: "essay" as const, slug, title },
      rationale:
        fitScore > 0
          ? `Fits the "${thread.title}" pathway — ${thread.premise}`
          : `Could extend "${thread.title}" if you add a theme step later.`,
    };
  })
    .filter((t) => t.fitScore > 0)
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 3);
}

export async function generateEssayImportPlan(
  intake: EssayIntake,
  options: { intakePath?: string } = {},
): Promise<EssayImportPlan> {
  const warnings: string[] = [];
  const errors = validateIntake(intake);
  if (errors.length > 0) {
    throw new Error(`Invalid intake:\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  }

  const entries = await allEntries();
  const concepts = entries.filter(
    (e) => e.type === "major-concept" || e.type === "concept",
  );
  const takenSlugs = new Set(entries.map((e) => e.slug));

  const baseSlug =
    intake.overrides?.slug ?? slugifyTitle(intake.title);
  const slug = ensureUniqueSlug(baseSlug, takenSlugs);
  if (slug !== baseSlug) {
    warnings.push(`Slug "${baseSlug}" taken — using "${slug}"`);
  }

  const id = intake.overrides?.id ?? nextEssayId(entries);
  const { themes, parentConcepts, topics, majorConceptId } = inferThemes(
    intake,
    concepts,
  );

  const description =
    intake.overrides?.description?.trim() || intake.subtitle.trim();
  const excerpt = intake.overrides?.excerpt?.trim() || description;

  const majorConcept = concepts.find((c) => c.id === majorConceptId);
  const chamber = entries.find((e) => e.type === "chamber");

  const entry: AtlasEntry = {
    id,
    slug,
    type: "essay",
    title: intake.title.trim(),
    description,
    themes,
    parentConcepts,
    connectedItems: [],
    publishedAt: intake.publishedAt,
    route: resolveAtlasRoute("essay", slug),
    status: intake.status ?? "published",
    meta: {
      subtitle: intake.subtitle.trim(),
      excerpt,
      topics,
      externalUrl: intake.mediumUrl.trim(),
      style: intake.style ?? "essay",
      ...(intake.featuredImage
        ? { featuredImage: `/images/essays/${slug}.jpg` }
        : {}),
    },
  };

  const connections = generateEssayConnections(id, intake, themes, [
    ...entries,
    entry,
  ]);

  const combinedEntries = [...entries, entry];
  const touches = touchesFromConnections(id, connections, combinedEntries);
  const neighbors = neighborsFromConnections(id, connections, combinedEntries);

  const pathwayConnections = connections.filter((c) => c.kind === "pathway");
  const firstQuestion = pathwayConnections
    .map((c) => combinedEntries.find((e) => e.id === c.to))
    .find((e) => e?.type === "question");

  const suggestedThreads = suggestThreads(
    slug,
    intake.title,
    themes,
    majorConceptId,
    concepts,
  );

  let featuredImage: EssayImportPlan["featuredImage"];
  if (intake.featuredImage) {
    const { resolveFeaturedImagePath } = await import("./load-intake");
    const sourcePath = options.intakePath
      ? resolveFeaturedImagePath(options.intakePath, intake.featuredImage)
      : intake.featuredImage;
    featuredImage = {
      sourcePath,
      publicPath: `/images/essays/${slug}.jpg`,
    };
  }

  return {
    intake,
    slug,
    id,
    entry,
    connections,
    chamber: {
      route: chamber?.route ?? "/chambers/the-structure-beneath-reality",
      label: chamber?.title ?? "The inner chamber",
      lanternRoute: entry.route,
    },
    constellation: {
      majorConceptId,
      majorConceptTitle: majorConcept?.title ?? "Reality",
      orbitLevel: 3,
      focusUrl: `/?focus=${id}`,
      placementNote: `Orbits ${majorConcept?.title ?? "the sky"} at supporting-idea depth (level 3).`,
    },
    touches,
    neighbors,
    suggestedThreads,
    observatory: {
      category: majorConcept?.title ?? "Reality",
      majorConceptSlug: majorConcept?.slug ?? "reality",
      clusterQuestion: firstQuestion?.title ?? null,
      signalKind: "essay",
    },
    featuredImage,
    warnings,
  };
}
