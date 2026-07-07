import type { AtlasConnection, AtlasEntry } from "../atlas/types";
import type { EssayIntake } from "./types";

const FLAGSHIP_CHAMBER_ID = "p1";
const FLAGSHIP_VOLUME_ID = "b1";

function conn(
  from: string,
  to: string,
  kind: AtlasConnection["kind"],
  source: AtlasConnection["source"] = "inferred",
  weight = 5,
  rationale?: string,
): AtlasConnection {
  return {
    id: `${from}→${to}:${kind}`,
    from,
    to,
    kind,
    source,
    weight,
    ...(rationale ? { rationale } : {}),
  };
}

function themeRationale(concept: AtlasEntry): string {
  return `this inquiry also touches ${concept.title.toLowerCase()} — ${concept.description.toLowerCase()}.`;
}

function pathwayRationale(question: AtlasEntry): string {
  return `asks the same living question from a different angle: ${question.title.replace(/\?$/, "")}.`;
}

function echoRationale(essay: AtlasEntry): string {
  return `echoes nearby work — ${essay.title}.`;
}

function parentRationale(essay: AtlasEntry): string {
  return `grows from the earlier essay ${essay.title}.`;
}

function scoreQuestionOverlap(
  question: AtlasEntry,
  themeIds: string[],
): number {
  const overlap = question.themes.filter((t) => themeIds.includes(t)).length;
  const parentOverlap = question.parentConcepts.filter((t) =>
    themeIds.includes(t),
  ).length;
  return overlap * 3 + parentOverlap * 2;
}

export function generateEssayConnections(
  essayId: string,
  intake: EssayIntake,
  themeIds: string[],
  allEntries: AtlasEntry[],
): AtlasConnection[] {
  const connections: AtlasConnection[] = [];
  const concepts = allEntries.filter(
    (e) => e.type === "major-concept" || e.type === "concept",
  );
  const questions = allEntries.filter((e) => e.type === "question");
  const essays = allEntries.filter((e) => e.type === "essay" && e.id !== essayId);

  if (!intake.overrides?.skipChamber) {
    connections.push(
      conn(
        essayId,
        FLAGSHIP_CHAMBER_ID,
        "chamber",
        "inferred",
        9,
        "returns to the chamber where this inquiry began.",
      ),
    );
  }

  const volumeThemes = new Set(["th-reality", "th-structure", "th-consciousness"]);
  if (
    !intake.overrides?.skipVolume &&
    themeIds.some((t) => volumeThemes.has(t))
  ) {
    connections.push(
      conn(
        essayId,
        FLAGSHIP_VOLUME_ID,
        "volume",
        "inferred",
        7,
        "extends the argument first made in the published volume.",
      ),
    );
  }

  for (const themeId of themeIds) {
    const concept = concepts.find((c) => c.id === themeId);
    if (!concept) continue;
    connections.push(
      conn(essayId, themeId, "theme", "inferred", 7, themeRationale(concept)),
    );
  }

  const questionIds =
    intake.overrides?.questionIds ??
    questions
      .map((q) => ({ q, score: scoreQuestionOverlap(q, themeIds) }))
      .filter((row) => row.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((row) => row.q.id);

  for (const qid of questionIds) {
    const question = questions.find((q) => q.id === qid);
    if (!question) continue;
    connections.push(
      conn(essayId, qid, "pathway", "inferred", 8, pathwayRationale(question)),
    );
  }

  const relatedIds = intake.overrides?.relatedEssayIds ?? [];
  const themeSet = new Set(themeIds);

  const echoCandidates = essays
    .map((essay) => ({
      essay,
      shared: essay.themes.filter((t) => themeSet.has(t)),
    }))
    .filter((row) => row.shared.length > 0)
    .sort((a, b) => b.shared.length - a.shared.length);

  for (const row of echoCandidates.slice(0, 3)) {
    if (relatedIds.includes(row.essay.id)) continue;
    connections.push(
      conn(
        essayId,
        row.essay.id,
        "echo",
        "inferred",
        6,
        echoRationale(row.essay),
      ),
    );
  }

  for (const rid of relatedIds) {
    if (!essays.some((e) => e.id === rid)) continue;
    const related = essays.find((e) => e.id === rid)!;
    connections.push(
      conn(essayId, rid, "echo", "explicit", 7, echoRationale(related)),
    );
  }

  const essayEntry = allEntries.find((e) => e.id === essayId);
  const publishedAt = essayEntry?.publishedAt ?? intake.publishedAt;
  const prior = essays
    .filter((e) => {
      if (!e.publishedAt) return false;
      return e.publishedAt < publishedAt;
    })
    .filter((e) => e.themes.some((t) => themeSet.has(t)))
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))[0];

  if (prior && !relatedIds.includes(prior.id)) {
    connections.push(
      conn(essayId, prior.id, "parent", "inferred", 8, parentRationale(prior)),
    );
  }

  return connections;
}

export function neighborsFromConnections(
  essayId: string,
  connections: AtlasConnection[],
  entries: AtlasEntry[],
): Array<{
  id: string;
  title: string;
  slug: string;
  sharedThemes: string[];
  connectionKind: "echo" | "parent" | "child";
}> {
  const essay = entries.find((e) => e.id === essayId);
  if (!essay) return [];

  return connections
    .filter((c) => c.from === essayId)
    .filter((c) => ["echo", "parent", "child"].includes(c.kind))
    .map((c) => {
      const target = entries.find((e) => e.id === c.to);
      if (!target) return null;
      const sharedThemes = essay.themes.filter((t) => target.themes.includes(t));
      return {
        id: target.id,
        title: target.title,
        slug: target.slug,
        sharedThemes,
        connectionKind: c.kind as "echo" | "parent" | "child",
      };
    })
    .filter((n): n is NonNullable<typeof n> => n !== null);
}

export function touchesFromConnections(
  essayId: string,
  connections: AtlasConnection[],
  entries: AtlasEntry[],
): Array<{
  id: string;
  title: string;
  kind: string;
  route: string;
  rationale: string;
}> {
  return connections
    .filter((c) => c.from === essayId)
    .map((c) => {
      const target = entries.find((e) => e.id === c.to);
      if (!target) return null;
      return {
        id: target.id,
        title: target.title,
        kind: c.kind,
        route: target.route,
        rationale: c.rationale ?? "",
      };
    })
    .filter((t): t is NonNullable<typeof t> => t !== null);
}
