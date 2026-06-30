"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useTerrainNavigation } from "./TerrainNavigationProvider";

type TerrainLinkProps = ComponentProps<typeof Link>;

/**
 * Link that crosses thresholds — never an abrupt page change.
 */
export function TerrainLink({ href, onClick, ...props }: TerrainLinkProps) {
  const { navigate } = useTerrainNavigation();
  const target = typeof href === "string" ? href : (href.pathname ?? "/");

  return (
    <Link
      href={href}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (!target || target === "#") return;
        e.preventDefault();
        navigate(target);
      }}
    />
  );
}
