"use client";

import Link from "next/link";
import { TerrainLink, isTerrainInternal } from "@/components/navigation";
import { cn } from "@/lib/utils";

interface PathwayLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  rich?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Navigation as pathway — a line into the terrain, not a menu item.
 */
export function PathwayLink({
  href,
  children,
  active = false,
  rich = false,
  className,
  onClick,
}: PathwayLinkProps) {
  const LinkComponent = isTerrainInternal(href) ? TerrainLink : Link;

  return (
    <LinkComponent
      href={href}
      onClick={onClick}
      className={cn(
        "threshold-pathway group inline-flex flex-col touch-manipulation",
        "max-w-full",
        active && "threshold-pathway--active",
        className,
      )}
    >
      <span
        className={cn(
          "threshold-pathway__label",
          rich && "threshold-pathway__label--rich",
        )}
      >
        {children}
      </span>
    </LinkComponent>
  );
}
