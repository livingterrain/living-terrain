"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  clearTerrainNav,
  type TerrainTransitionIntent,
} from "@/lib/atmosphere/navigation";

interface NavigateOptions {
  intent?: TerrainTransitionIntent;
  atmosphere?: string;
}

interface TerrainNavigationContextValue {
  navigate: (href: string, options?: NavigateOptions) => void;
  veilActive: boolean;
  arrivalIntent: TerrainTransitionIntent | null;
  arriving: boolean;
}

const TerrainNavigationContext =
  createContext<TerrainNavigationContextValue | null>(null);

export function TerrainNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    clearTerrainNav();
  }, [pathname]);

  const navigate = useCallback(
    (href: string) => {
      if (!href || href === pathname) return;
      clearTerrainNav();
      router.push(href);
    },
    [pathname, router],
  );

  const value = useMemo(
    () => ({
      navigate,
      veilActive: false,
      arrivalIntent: null,
      arriving: false,
    }),
    [navigate],
  );

  return (
    <TerrainNavigationContext.Provider value={value}>
      {children}
    </TerrainNavigationContext.Provider>
  );
}

export function useTerrainNavigation(): TerrainNavigationContextValue {
  const ctx = useContext(TerrainNavigationContext);
  if (!ctx) {
    return {
      navigate: (href: string) => {
        if (typeof window !== "undefined") window.location.href = href;
      },
      veilActive: false,
      arrivalIntent: null,
      arriving: false,
    };
  }
  return ctx;
}

/** Internal site paths that should use threshold navigation */
export function isTerrainInternal(href: string): boolean {
  if (!href || href.startsWith("#")) return false;
  if (href.startsWith("http://") || href.startsWith("https://")) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  return href.startsWith("/");
}
