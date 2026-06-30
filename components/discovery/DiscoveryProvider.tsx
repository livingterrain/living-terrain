"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface DiscoveryContextValue {
  activeId: string | null;
  peerIds: Set<string>;
  setActive: (id: string | null, peers?: string[]) => void;
}

const DiscoveryContext = createContext<DiscoveryContextValue | null>(null);

export function useDiscovery() {
  return useContext(DiscoveryContext);
}

interface DiscoveryProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export function DiscoveryProvider({
  children,
  enabled = true,
}: DiscoveryProviderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [peerIds, setPeerIds] = useState<Set<string>>(new Set());

  const setActive = useCallback((id: string | null, peers: string[] = []) => {
    setActiveId(id);
    setPeerIds(new Set(peers));
  }, []);

  const value = useMemo(
    () => ({ activeId, peerIds, setActive }),
    [activeId, peerIds, setActive],
  );

  if (!enabled) return <>{children}</>;

  return (
    <DiscoveryContext.Provider value={value}>{children}</DiscoveryContext.Provider>
  );
}

interface DiscoveryNodeProps {
  id: string;
  peers?: string[];
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}

export function DiscoveryNode({
  id,
  peers = [],
  children,
  className,
  as: Tag = "div",
}: DiscoveryNodeProps) {
  const discovery = useDiscovery();
  const allPeers = useMemo(() => [id, ...peers], [id, peers]);

  const isActive = discovery?.activeId === id;
  const isPeer = Boolean(
    discovery &&
      discovery.activeId !== null &&
      discovery.activeId !== id &&
      discovery.peerIds.has(id),
  );

  return (
    <Tag
      data-discovery-id={id}
      className={cn(
        "discovery-node transition-[box-shadow,background-color,border-color] duration-[900ms]",
        isActive && "discovery-active",
        isPeer && "discovery-peer",
        className,
      )}
      onMouseEnter={() => discovery?.setActive(id, allPeers)}
      onMouseLeave={() => discovery?.setActive(null)}
      onFocus={() => discovery?.setActive(id, allPeers)}
      onBlur={() => discovery?.setActive(null)}
    >
      {children}
    </Tag>
  );
}
