"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { NodeRef } from "@/lib/relationships";
import { ThreadExperience } from "./ThreadExperience";

export interface ThreadSession {
  origin: NodeRef;
  returnHref: string;
  returnLabel?: string;
}

interface ThreadContextValue {
  open: (session: ThreadSession) => void;
  close: () => void;
  session: ThreadSession | null;
  isOpen: boolean;
}

const ThreadContext = createContext<ThreadContextValue | null>(null);

export function ThreadProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<ThreadSession | null>(null);

  const open = useCallback((next: ThreadSession) => {
    setSession(next);
  }, []);

  const close = useCallback(() => {
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      open,
      close,
      session,
      isOpen: session !== null,
    }),
    [open, close, session],
  );

  return (
    <ThreadContext.Provider value={value}>
      {children}
      {session && (
        <ThreadExperience
          session={session}
          onClose={close}
        />
      )}
    </ThreadContext.Provider>
  );
}

export function useThread(): ThreadContextValue {
  const ctx = useContext(ThreadContext);
  if (!ctx) {
    throw new Error("useThread must be used within ThreadProvider");
  }
  return ctx;
}

export function useThreadOptional(): ThreadContextValue | null {
  return useContext(ThreadContext);
}
