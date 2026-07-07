import Link from "next/link";
import type { ComponentProps } from "react";

type TerrainLinkProps = ComponentProps<typeof Link>;

/**
 * Internal terrain navigation — native Link for Next.js prefetch + soft routing.
 * (Custom veil transitions are disabled; router.push added no benefit over Link.)
 */
export function TerrainLink({ prefetch = true, ...props }: TerrainLinkProps) {
  return <Link prefetch={prefetch} {...props} />;
}
