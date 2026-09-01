/**
 * Canonical object registry — identity and routing only.
 *
 * Do not store essay bodies, book descriptions, Observatory fragments,
 * or Visual Map images here. Those remain in their source modules.
 *
 * Not registered (deliberate):
 * - legacy q1–q4
 * - legacy th-* themes / theme hubs
 * - fn1–fn5 field notes
 * - visitor observations
 * - quotations
 */

import { ATLAS_DATA } from "@/lib/atlas/data";
import {
  ATLAS_V1_CONCEPTS,
  ATLAS_V1_ESSAYS,
  ATLAS_V1_QUESTIONS,
  ATLAS_V1_SOURCE,
} from "@/lib/atlas-v1/content";
import { BIOLOGY_REVISED_EXPANDED } from "@/lib/atlas/imports/books/series-catalog";
import { OBSERVATIONS } from "@/lib/observatory/observations";
import {
  collectionHref,
  getVisualMapCollections,
  plateHref,
} from "@/lib/visual-maps";
import type { CanonicalObject } from "./types";

const ATLAS_CONTENT_MODULE = "lib/atlas/data.ts";
const ATLAS_V1_MODULE = "lib/atlas-v1/content.ts";
const OBSERVATORY_MODULE = "lib/observatory/observations.ts";
const VISUAL_MAPS_MODULE = "lib/visual-maps/collections.ts";
const SERIES_MODULE = "lib/atlas/imports/books/series-catalog.ts";

function observationLabel(id: string): string {
  if (id.startsWith("obs-")) {
    return id
      .slice(4)
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }
  return id;
}

function atlasIdForRoute(route: string): string | undefined {
  return ATLAS_DATA.entries.find(
    (entry) =>
      entry.route === route &&
      (entry.type === "book" || entry.type === "essay"),
  )?.id;
}

function buildRegistry(): CanonicalObject[] {
  const objects: CanonicalObject[] = [];

  for (const entry of ATLAS_DATA.entries) {
    if (entry.type === "book") {
      const isSuperseded = entry.id === "b2";
      objects.push({
        id: entry.id,
        type: "BOOK",
        title: entry.title,
        route: entry.route,
        sourceModule:
          entry.id === "b1" ? ATLAS_CONTENT_MODULE : SERIES_MODULE,
        visibility: isSuperseded ? "superseded" : "public",
        ...(entry.id === BIOLOGY_REVISED_EXPANDED.id
          ? { supersedesId: BIOLOGY_REVISED_EXPANDED.supersedesId }
          : {}),
      });
      continue;
    }

    if (entry.type === "essay") {
      objects.push({
        id: entry.id,
        type: "ESSAY",
        title: entry.title,
        route: entry.route,
        sourceModule: ATLAS_CONTENT_MODULE,
        visibility: "public",
      });
      continue;
    }

    if (entry.type === "chamber") {
      objects.push({
        id: entry.id,
        type: "CHAMBER",
        title: entry.title,
        route: entry.route,
        sourceModule: ATLAS_CONTENT_MODULE,
        visibility: "public",
      });
    }
  }

  for (const observation of OBSERVATIONS) {
    objects.push({
      id: observation.id,
      type: "OBSERVATION",
      title: observationLabel(observation.id),
      route: "/observatory",
      sourceModule: OBSERVATORY_MODULE,
      visibility: "public",
    });
  }

  for (const collection of getVisualMapCollections()) {
    objects.push({
      id: collection.slug,
      type: "VISUAL_MAP_COLLECTION",
      title: collection.title,
      route: collectionHref(collection.slug),
      sourceModule: VISUAL_MAPS_MODULE,
      visibility: "public",
    });
    for (const plate of collection.items) {
      objects.push({
        id: plate.id,
        type: "VISUAL_MAP_PLATE",
        title: plate.title,
        route: plateHref(collection.slug, plate.slug),
        sourceModule: VISUAL_MAPS_MODULE,
        visibility: "public",
        collectionId: collection.slug,
      });
    }
  }

  for (const concept of Object.values(ATLAS_V1_CONCEPTS)) {
    objects.push({
      id: concept.id,
      type: "CONCEPT",
      title: concept.name,
      route: "/atlas",
      sourceModule: ATLAS_V1_MODULE,
      visibility: "public",
    });
  }

  for (const question of ATLAS_V1_QUESTIONS) {
    objects.push({
      id: question.id,
      type: "QUESTION",
      title: question.text,
      route: "/atlas",
      sourceModule: ATLAS_V1_MODULE,
      visibility: "public",
    });
  }

  for (const evidence of Object.values(ATLAS_V1_ESSAYS)) {
    const source = ATLAS_V1_SOURCE[evidence.id];
    const sourceObjectId = atlasIdForRoute(source.href);
    objects.push({
      id: evidence.id,
      type: "EVIDENCE",
      title: evidence.title,
      route: source.href,
      sourceModule: ATLAS_V1_MODULE,
      visibility: "public",
      ...(sourceObjectId ? { sourceObjectId } : {}),
    });
  }

  return objects;
}

const REGISTRY: readonly CanonicalObject[] = buildRegistry();
const BY_ID = new Map(REGISTRY.map((object) => [object.id, object]));

export function listCanonicalObjects(): readonly CanonicalObject[] {
  return REGISTRY;
}

export function getCanonicalObject(id: string): CanonicalObject | undefined {
  return BY_ID.get(id);
}

export function getCanonicalObjectsByType(
  type: CanonicalObject["type"],
): CanonicalObject[] {
  return REGISTRY.filter((object) => object.type === type);
}

export function requireCanonicalObject(id: string): CanonicalObject {
  const object = BY_ID.get(id);
  if (!object) {
    throw new Error(`Unknown canonical object: ${id}`);
  }
  return object;
}
