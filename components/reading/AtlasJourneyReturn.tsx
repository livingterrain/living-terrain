"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { peekAtlasJourneyReturn } from "@/lib/atlas-v1/journey-return";

/**
 * Quiet return into an in-progress Atlas journey when a valid snapshot exists.
 */
export function AtlasJourneyReturn() {
  const [ret, setRet] = useState<{ href: string; label: string } | null>(null);

  useEffect(() => {
    setRet(peekAtlasJourneyReturn());
  }, []);

  if (!ret) return null;

  return (
    <Link
      href={ret.href}
      className="lantern-link flex min-h-11 items-center text-[0.875rem]"
    >
      ← {ret.label}
    </Link>
  );
}
