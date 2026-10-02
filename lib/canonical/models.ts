/**
 * Canonical MODEL / Instrument registry.
 *
 * Models are first-class intellectual objects. They are not a fourth primary
 * room (Atlas / Shelves / Observatory). They may later be discoverable through
 * Atlas, Chambers, the homepage, or a dedicated models surface — visitor UI
 * is out of scope for Phase M0.
 *
 * Relationship rule: conceptual resemblance to a Territory, Thread, Chamber,
 * Essay, Evidence pack, Concept, or another Model is not a bond. Only
 * explicitly authored CANONICAL_RELATIONS connect Models to other objects.
 * A Model may legitimately have zero relations.
 */

import type { CanonicalObject } from "./types";

const SPIRAL_MODULE = "lib/evolutionary-spiral/index.ts";

/**
 * Hand-authored MODEL identities only.
 * Do not auto-derive from chambers, concepts, or figure components.
 */
export const CANONICAL_MODELS: readonly CanonicalObject[] = [
  {
    id: "evolutionary-spiral",
    type: "MODEL",
    title: "The Evolutionary Spiral",
    route: "/evolutionary-spiral",
    sourceModule: SPIRAL_MODULE,
    visibility: "public",
  },
] as const;
