import { ATLAS_DATA } from "./data";
import {
  buildAtlas,
  getConnectedEntries,
  getConnectedIdsByKind,
  getConnectionsFor,
  type AtlasBuildResult,
} from "./build";
import type {
  AtlasConnection,
  AtlasEntry,
  AtlasEntryType,
  AtlasIndexes,
  AtlasSearchResult,
  AtlasSiteConfig,
} from "./types";

export class LivingTerrainAtlas {
  readonly site: AtlasSiteConfig;
  readonly entries: AtlasEntry[];
  readonly connections: AtlasConnection[];
  readonly indexes: AtlasIndexes;
  readonly warnings: string[];

  constructor(result: AtlasBuildResult) {
    this.site = ATLAS_DATA.site;
    this.entries = result.entries;
    this.connections = result.connections;
    this.indexes = result.indexes;
    this.warnings = result.warnings;
  }

  getById(id: string): AtlasEntry | undefined {
    return this.indexes.byId.get(id);
  }

  getBySlug(type: AtlasEntryType, slug: string): AtlasEntry | undefined {
    return this.indexes.bySlug.get(`${type}:${slug}`);
  }

  getByType(type: AtlasEntryType): AtlasEntry[] {
    return this.indexes.byType.get(type) ?? [];
  }

  getPublished(type?: AtlasEntryType): AtlasEntry[] {
    if (!type) return this.indexes.published;
    return this.getByType(type).filter((e) => e.status === "published");
  }

  getMajorConcepts(): AtlasEntry[] {
    return this.indexes.majorConcepts;
  }

  getChamber(): AtlasEntry | undefined {
    return this.getPublished("chamber")[0];
  }

  getConnections(id: string): AtlasConnection[] {
    return getConnectionsFor(id, this.indexes);
  }

  getConnected(id: string): AtlasEntry[] {
    return getConnectedEntries(id, this.indexes);
  }

  getConnectedIds(
    id: string,
    kind?: AtlasConnection["kind"],
    direction: "out" | "in" | "both" = "both",
  ): string[] {
    if (!kind) {
      return this.getById(id)?.connectedItems ?? [];
    }
    return getConnectedIdsByKind(id, kind, this.indexes, direction);
  }

  search(query: string): AtlasSearchResult[] {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return this.indexes.published
      .filter((entry) => entry.type !== "chamber")
      .filter((entry) => {
        const haystack = [
          entry.title,
          entry.description,
          entry.aiSummary ?? "",
          searchMetaText(entry),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalized);
      })
      .map((entry) => ({
        id: entry.id,
        type: entry.type,
        title: entry.title,
        excerpt: entry.description.slice(0, 160),
        route: entry.route,
      }));
  }

  buildSearchIndex(): AtlasSearchResult[] {
    return this.indexes.published
      .filter((entry) => entry.type !== "chamber")
      .map((entry) => ({
        id: entry.id,
        type: entry.type,
        title: entry.title,
        excerpt: searchExcerpt(entry),
        route: entry.route,
      }));
  }
}

function searchMetaText(entry: AtlasEntry): string {
  if (entry.type === "essay" && "topics" in entry.meta) {
    return (entry.meta as { topics: string[] }).topics.join(" ");
  }
  if (entry.type === "quotation" && "text" in entry.meta) {
    return (entry.meta as { text: string }).text;
  }
  if (entry.type === "field-note" && "body" in entry.meta) {
    return (entry.meta as { body: string }).body;
  }
  return "";
}

function searchExcerpt(entry: AtlasEntry): string {
  if (entry.type === "essay" && "excerpt" in entry.meta) {
    const meta = entry.meta as { excerpt: string; topics?: string[] };
    return [meta.excerpt, ...(meta.topics ?? [])].join(" ");
  }
  if (entry.type === "field-note" && "body" in entry.meta) {
    return (entry.meta as { body: string }).body.slice(0, 120);
  }
  if (entry.type === "quotation" && "text" in entry.meta) {
    const meta = entry.meta as { text: string; attribution?: string };
    return meta.attribution ?? meta.text;
  }
  return entry.description.slice(0, 160);
}

let atlasInstance: LivingTerrainAtlas | null = null;

export function getAtlas(): LivingTerrainAtlas {
  if (!atlasInstance) {
    atlasInstance = new LivingTerrainAtlas(buildAtlas(ATLAS_DATA));
  }
  return atlasInstance;
}

export function invalidateAtlas(): void {
  atlasInstance = null;
}
