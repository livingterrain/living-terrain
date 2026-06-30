import type { NodeRef } from "./types";
import { getPeerRefs } from "./graph";

/** Number of distinct ideas connected in the terrain graph (excluding self) */
export function countConnectedIdeas(ref: NodeRef): number {
  return Math.max(0, getPeerRefs(ref).length - 1);
}
