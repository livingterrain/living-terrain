import type { ReactNode } from "react";

/** Page content sits above the persistent atmosphere — never remounts the sky */
export function TerrainContentShell({ children }: { children: ReactNode }) {
  return <div className="relative z-[2] min-h-screen">{children}</div>;
}
