"use client";

import type { ReactNode } from "react";

/** Pass-through wrapper — route transitions disabled for reliable navigation */
export function SiteTransition({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
