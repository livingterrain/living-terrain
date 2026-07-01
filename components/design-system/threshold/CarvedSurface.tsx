import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CarvedSurfaceProps {
  children: ReactNode;
  className?: string;
  /** Carve direction — top edge like stone threshold */
  edge?: "top" | "none";
  as?: "div" | "section" | "article" | "li";
}

/**
 * Content carved into the landscape — never a boxed card.
 */
export function CarvedSurface({
  children,
  className,
  edge = "top",
  as: Tag = "div",
}: CarvedSurfaceProps) {
  return (
    <Tag
      className={cn(
        "threshold-carved relative",
        edge === "top" && "threshold-carved--edge",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
