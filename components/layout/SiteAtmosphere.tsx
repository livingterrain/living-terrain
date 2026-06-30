"use client";

import { usePathname } from "next/navigation";
import { FieldTexture } from "@/components/design-system";
import { roomForPath } from "@/lib/rooms";

/** Site-wide atmosphere — omitted where rooms provide their own environment */
export function SiteAtmosphere() {
  const pathname = usePathname();
  if (pathname === "/" || roomForPath(pathname)) return null;
  return <FieldTexture />;
}
