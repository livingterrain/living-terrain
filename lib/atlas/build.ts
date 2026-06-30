import type {
  AtlasConnection,
  AtlasData,
  AtlasEntry,
  AtlasEntryType,
  AtlasIndexes,
} from "./types";

export interface AtlasBuildResult {
  entries: AtlasEntry[];
  connections: AtlasConnection[];
  indexes: AtlasIndexes;
  warnings: string[];
}

export function buildAtlas(data: AtlasData): AtlasBuildResult {
  const warnings: string[] = [];
  const byId = new Map<string, AtlasEntry>();

  for (const entry of data.entries) {
    if (byId.has(entry.id)) {
      warnings.push(`Duplicate atlas id: ${entry.id}`);
      continue;
    }
    byId.set(entry.id, { ...entry, connectedItems: [] });
  }

  for (const connection of data.connections) {
    if (!byId.has(connection.from)) {
      warnings.push(`Connection from unknown id: ${connection.from}`);
    }
    if (!byId.has(connection.to)) {
      warnings.push(`Connection to unknown id: ${connection.to}`);
    }
    for (const conceptId of [...(byId.get(connection.from)?.themes ?? [])]) {
      if (!byId.has(conceptId)) {
        warnings.push(`Theme ref missing on ${connection.from}: ${conceptId}`);
      }
    }
  }

  const connectionsByFrom = new Map<string, AtlasConnection[]>();
  const connectionsByTo = new Map<string, AtlasConnection[]>();

  for (const connection of data.connections) {
    if (!connectionsByFrom.has(connection.from)) {
      connectionsByFrom.set(connection.from, []);
    }
    if (!connectionsByTo.has(connection.to)) {
      connectionsByTo.set(connection.to, []);
    }
    connectionsByFrom.get(connection.from)!.push(connection);
    connectionsByTo.get(connection.to)!.push(connection);

    const fromEntry = byId.get(connection.from);
    const toEntry = byId.get(connection.to);
    if (fromEntry && !fromEntry.connectedItems.includes(connection.to)) {
      fromEntry.connectedItems.push(connection.to);
    }
    if (toEntry && !toEntry.connectedItems.includes(connection.from)) {
      toEntry.connectedItems.push(connection.from);
    }
  }

  const entries = [...byId.values()];
  const bySlug = new Map<string, AtlasEntry>();
  const byType = new Map<AtlasEntryType, AtlasEntry[]>();

  for (const entry of entries) {
    bySlug.set(`${entry.type}:${entry.slug}`, entry);
    const list = byType.get(entry.type) ?? [];
    list.push(entry);
    byType.set(entry.type, list);
  }

  const majorConcepts = entries
    .filter((e) => e.type === "major-concept" && e.status === "published")
    .sort(
      (a, b) =>
        ((a.meta as { order?: number }).order ?? 0) -
        ((b.meta as { order?: number }).order ?? 0),
    );

  const published = entries.filter((e) => e.status === "published");

  const indexes: AtlasIndexes = {
    byId,
    bySlug,
    byType,
    connectionsByFrom,
    connectionsByTo,
    majorConcepts,
    published,
  };

  if (process.env.NODE_ENV === "development" && warnings.length > 0) {
    console.warn("[Living Terrain Atlas]", warnings.join("\n"));
  }

  return {
    entries,
    connections: data.connections,
    indexes,
    warnings,
  };
}

export function getConnectionsFor(
  id: string,
  indexes: AtlasIndexes,
): AtlasConnection[] {
  const outgoing = indexes.connectionsByFrom.get(id) ?? [];
  const incoming = indexes.connectionsByTo.get(id) ?? [];
  return [...outgoing, ...incoming];
}

export function getConnectedEntries(
  id: string,
  indexes: AtlasIndexes,
): AtlasEntry[] {
  const entry = indexes.byId.get(id);
  if (!entry) return [];
  return entry.connectedItems
    .map((cid) => indexes.byId.get(cid))
    .filter((e): e is AtlasEntry => e !== undefined);
}

export function getConnectionsByKind(
  id: string,
  kind: AtlasConnection["kind"],
  indexes: AtlasIndexes,
  direction: "out" | "in" | "both" = "both",
): AtlasConnection[] {
  const results: AtlasConnection[] = [];
  if (direction === "out" || direction === "both") {
    for (const c of indexes.connectionsByFrom.get(id) ?? []) {
      if (c.kind === kind) results.push(c);
    }
  }
  if (direction === "in" || direction === "both") {
    for (const c of indexes.connectionsByTo.get(id) ?? []) {
      if (c.kind === kind) results.push(c);
    }
  }
  return results;
}

export function getConnectedIdsByKind(
  id: string,
  kind: AtlasConnection["kind"],
  indexes: AtlasIndexes,
  direction: "out" | "in" | "both" = "both",
): string[] {
  const ids = new Set<string>();
  for (const c of getConnectionsByKind(id, kind, indexes, direction)) {
    if (direction === "out" || direction === "both") {
      if (c.from === id) ids.add(c.to);
    }
    if (direction === "in" || direction === "both") {
      if (c.to === id) ids.add(c.from);
    }
  }
  return [...ids];
}
