import "server-only";

import { getAtlas } from "@/lib/atlas";
import { getNode, getPeerRefs } from "@/lib/relationships/graph";
import type { NodeRef } from "@/lib/relationships";
import { sortObservationsNewest } from "./display";
import { readObservationStore, writeObservationStore } from "./persistence.server";
import type {
  QuietDiscovery,
  SubmitObservationInput,
  SubmitObservationResult,
  UnexpectedConnection,
  VisitorObservation,
} from "./types";

export type {
  VisitorObservation,
  UnexpectedConnection,
  QuietDiscovery,
  SubmitObservationInput,
  SubmitObservationResult,
} from "./types";

export function getAllVisitorObservations(): VisitorObservation[] {
  return sortObservationsNewest(readObservationStore().observations);
}

export function getVisitorObservationBySlug(
  slug: string,
): VisitorObservation | undefined {
  return getAllVisitorObservations().find((o) => o.slug === slug);
}

export function getVisitorObservationById(
  id: string,
): VisitorObservation | undefined {
  return getAllVisitorObservations().find((o) => o.id === id);
}

export function getRecentObservations(limit = 5): VisitorObservation[] {
  return getAllVisitorObservations().slice(0, limit);
}

export function getUnexpectedConnections(limit = 3): UnexpectedConnection[] {
  const observations = getAllVisitorObservations();
  const atlas = getAtlas();
  const results: UnexpectedConnection[] = [];

  for (let i = 0; i < observations.length; i++) {
    for (let j = i + 1; j < observations.length; j++) {
      const a = observations[i];
      const b = observations[j];
      const shared = a.themeIds.find((id) => b.themeIds.includes(id));
      if (!shared) continue;
      if (a.terrainLocation === b.terrainLocation && a.terrainLocation) continue;

      const concept = atlas.getById(shared)?.title ?? "the same inquiry";
      results.push({
        id: `${a.id}-${b.id}`,
        observationA: a,
        observationB: b,
        sharedConcept: concept,
        phrase: `Two observations converge on ${concept} — from different places in the terrain.`,
      });
    }
  }

  return results.slice(0, limit);
}

export function getQuietDiscoveries(limit = 3): QuietDiscovery[] {
  const observations = getAllVisitorObservations();
  const atlas = getAtlas();
  const discoveries: QuietDiscovery[] = [];

  for (const observation of observations) {
    const ref: NodeRef = { kind: "observation", id: observation.id };
    const peers = getPeerRefs(ref)
      .filter((p) => p.id !== observation.id && p.kind !== "theme")
      .map((p) => getNode(p))
      .filter((n): n is NonNullable<typeof n> => Boolean(n));

    let peer = peers[0];

    if (!peer) {
      for (const themeId of observation.themeIds) {
        const connected = atlas
          .getConnected(themeId)
          .filter((e) => e.type === "essay" || e.type === "question");
        if (connected[0]) {
          const entry = connected[0];
          const found = getNode({
            kind: entry.type === "essay" ? "essay" : "question",
            id: entry.id,
          });
          if (found) {
            peer = found;
            break;
          }
        }
      }
    }

    if (!peer) continue;

    discoveries.push({
      id: `qd-${observation.id}-${peer.ref.id}`,
      observation,
      connectedTitle: peer.title,
      connectedHref: peer.href,
      phrase: `An observation here touches ${peer.title} — quietly, without forcing the connection.`,
    });
  }

  return discoveries.slice(0, limit);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function uniqueSlug(base: string, existing: Set<string>): string {
  let slug = base || `observation-${Date.now()}`;
  let n = 1;
  while (existing.has(slug)) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

export function submitVisitorObservation(
  input: SubmitObservationInput,
): SubmitObservationResult {
  const body = input.body.trim();
  if (body.length < 20) {
    return { success: false, message: "An observation needs a little more substance." };
  }
  if (body.length > 2400) {
    return { success: false, message: "Please keep the observation under 2,400 characters." };
  }
  if (!input.themeIds.length) {
    return { success: false, message: "Choose at least one concept this observation touches." };
  }

  const atlas = getAtlas();
  const validThemes = input.themeIds.filter((id) => atlas.getById(id));
  if (!validThemes.length) {
    return { success: false, message: "Those concepts could not be found on the terrain." };
  }

  const store = readObservationStore();
  const slugs = new Set(store.observations.map((o) => o.slug));
  const baseSlug = slugify(input.title?.trim() || body.slice(0, 40));
  const id = `vo-${Date.now().toString(36)}`;
  const anonymous = input.anonymous !== false;

  const observation: VisitorObservation = {
    id,
    slug: uniqueSlug(baseSlug, slugs),
    title: input.title?.trim() || null,
    body,
    themeIds: validThemes,
    terrainLocation: input.terrainLocation?.trim() || null,
    createdAt: new Date().toISOString(),
    anonymous,
    contributorName: anonymous ? null : input.contributorName?.trim() || null,
  };

  store.observations.unshift(observation);
  writeObservationStore(store);

  return {
    success: true,
    message: "Your observation has been added to the terrain.",
    observation,
  };
}
