import { getAtlas } from "@/lib/atlas";
import { atlasTypeToContentKind } from "@/lib/atlas/routes";
import { isImmersiveRealm } from "@/lib/realms/config";
import { getNode } from "@/lib/relationships/graph";
import type { NodeRef } from "@/lib/relationships";
import type { JourneyEvent, JourneyKind } from "./types";

function themesForRef(ref: NodeRef): string[] {
  const node = getNode(ref);
  if (!node) return [];
  return node.themes.filter(Boolean);
}

function atlasEntryEvent(
  kind: JourneyKind,
  entry: { id: string; title: string; route: string },
  themes: string[] = [],
): JourneyEvent {
  return {
    at: Date.now(),
    kind,
    id: entry.id,
    title: entry.title,
    path: entry.route,
    themes,
  };
}

export function journeyEventFromPath(pathname: string): JourneyEvent | null {
  const path = pathname.split("?")[0] || "/";
  const atlas = getAtlas();

  if (path === "/" || path === "") {
    return {
      at: Date.now(),
      kind: "map",
      id: "map",
      title: "The map",
      path: "/",
      themes: [],
    };
  }

  if (path === "/observatory") {
    return {
      at: Date.now(),
      kind: "observatory",
      id: "observatory",
      title: "Observatory",
      path,
      themes: [],
    };
  }

  if (path === "/chambers/the-structure-beneath-reality" || path === "/structure-beneath-reality") {
    const chamber = atlas.getChamber();
    if (!chamber) return null;
    return atlasEntryEvent("chamber", chamber, themesForRef({ kind: "project", id: chamber.id }));
  }

  const themeMatch = path.match(/^\/themes\/([^/]+)$/);
  if (themeMatch) {
    const slug = themeMatch[1];
    const entry =
      atlas.getPublished("major-concept").find((e) => e.slug === slug) ??
      atlas.getPublished("concept").find((e) => e.slug === slug);
    if (!entry) return null;
    const kind: JourneyKind = isImmersiveRealm(slug) ? "realm" : "concept";
    return atlasEntryEvent(kind, entry, [entry.title]);
  }

  const routes: Array<{
    pattern: RegExp;
    type: Parameters<typeof atlas.getBySlug>[0];
    kind: JourneyKind;
  }> = [
    { pattern: /^\/essays\/([^/]+)$/, type: "essay", kind: "essay" },
    { pattern: /^\/questions\/([^/]+)$/, type: "question", kind: "question" },
    { pattern: /^\/field-notes\/([^/]+)$/, type: "field-note", kind: "field-note" },
    { pattern: /^\/atlas\/([^/]+)$/, type: "book", kind: "book" },
    { pattern: /^\/library\/([^/]+)$/, type: "book", kind: "book" },
    { pattern: /^\/quotations\/([^/]+)$/, type: "quotation", kind: "quotation" },
  ];

  for (const route of routes) {
    const match = path.match(route.pattern);
    if (!match) continue;
    const entry = atlas.getBySlug(route.type, match[1]);
    if (!entry) return null;
    const ref: NodeRef = {
      kind: atlasTypeToContentKind(entry.type),
      id: entry.id,
    };
    return atlasEntryEvent(route.kind, entry, themesForRef(ref));
  }

  return null;
}
