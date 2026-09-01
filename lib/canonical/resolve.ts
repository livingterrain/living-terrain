import type {
  CanonicalObjectType,
  CanonicalVisibility,
} from "./types";
import { getCanonicalObject } from "./objects";

/**
 * Minimal public identity for a canonical object.
 * Does not copy bodies, excerpts, fragments, or images.
 */
export type CanonicalRef = {
  id: string;
  type: CanonicalObjectType;
  title: string;
  route: string;
  visibility: CanonicalVisibility;
};

export function resolveCanonicalRef(id: string): CanonicalRef | undefined {
  const object = getCanonicalObject(id);
  if (!object) return undefined;
  return {
    id: object.id,
    type: object.type,
    title: object.title,
    route: object.route,
    visibility: object.visibility,
  };
}

export function requireCanonicalRef(id: string): CanonicalRef {
  const ref = resolveCanonicalRef(id);
  if (!ref) {
    throw new Error(`Unknown canonical object: ${id}`);
  }
  return ref;
}
