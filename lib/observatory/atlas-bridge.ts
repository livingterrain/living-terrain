import type { NodeRef, RelationshipEdge, ResolvedNode } from "@/lib/relationships/types";
import { nodeKey } from "@/lib/relationships/types";
import { getAtlas } from "@/lib/atlas";
import {
  displayTitle,
  themeTitlesForObservation,
} from "./display";
import { getBundledObservations } from "./observations-bundle";
import type { VisitorObservation } from "./types";

export function observationNodeRef(id: string): NodeRef {
  return { kind: "observation", id };
}

export function resolveVisitorObservationNode(
  observation: VisitorObservation,
): ResolvedNode {
  const themes = themeTitlesForObservation(observation);
  return {
    ref: observationNodeRef(observation.id),
    title: displayTitle(observation),
    subtitle: observation.terrainLocation ?? undefined,
    excerpt: observation.body,
    href: `/observatory/observations/${observation.slug}`,
    themes,
  };
}

export function registerVisitorObservations(
  nodes: Map<string, ResolvedNode>,
  edges: RelationshipEdge[],
): void {
  const atlas = getAtlas();

  for (const observation of getBundledObservations()) {
    const ref = observationNodeRef(observation.id);
    nodes.set(nodeKey(ref), resolveVisitorObservationNode(observation));

    for (const themeId of observation.themeIds) {
      const themeEntry = atlas.getById(themeId);
      if (!themeEntry) continue;
      const themeRef: NodeRef = { kind: "theme", id: themeEntry.id };

      edges.push({
        from: ref,
        to: themeRef,
        kind: "theme",
        source: "explicit",
        weight: 7,
        rationale: "this observation extends the inquiry.",
      });
      edges.push({
        from: themeRef,
        to: ref,
        kind: "theme",
        source: "inverse",
        weight: 6,
      });
    }

    edges.push({
      from: { kind: "project", id: "p1" },
      to: ref,
      kind: "observation",
      source: "inferred",
      weight: 5,
      rationale: "recorded at the Observatory.",
    });
  }
}
