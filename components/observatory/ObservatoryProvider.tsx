"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useThreadOptional } from "@/components/thread/ThreadProvider";
import {
  composeReflection,
  journeyEventFromPath,
  loadJourney,
  recordPathVisit,
  subscribeJourney,
  type ObservatoryReflection,
} from "@/lib/observatory";
import { ObservatoryReflectionWhisper } from "./ObservatoryReflectionWhisper";

const SUPPRESSED_PREFIXES = ["/concepts"];

function isSuppressedPath(path: string): boolean {
  return SUPPRESSED_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export function ObservatoryProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const thread = useThreadOptional();
  const [reflection, setReflection] = useState<ObservatoryReflection | null>(null);
  const evaluateTimer = useRef<number | null>(null);

  const evaluate = useCallback(
    (path: string) => {
      if (thread?.isOpen || isSuppressedPath(path) || path === "/observatory") {
        setReflection(null);
        return;
      }
      const journey = loadJourney();
      const next = composeReflection(journey, path);
      setReflection(next);
    },
    [thread?.isOpen],
  );

  const scheduleEvaluate = useCallback(
    (path: string) => {
      if (evaluateTimer.current) window.clearTimeout(evaluateTimer.current);
      evaluateTimer.current = window.setTimeout(() => evaluate(path), 800);
    },
    [evaluate],
  );

  useEffect(() => {
    const path = pathname.split("?")[0] || "/";
    if (isSuppressedPath(path)) return;

    const event = journeyEventFromPath(pathname);
    if (event) recordPathVisit(pathname, event);
    scheduleEvaluate(path);

    return () => {
      if (evaluateTimer.current) window.clearTimeout(evaluateTimer.current);
    };
  }, [pathname, scheduleEvaluate]);

  useEffect(() => {
    return subscribeJourney(() => {
      const path = pathname.split("?")[0] || "/";
      scheduleEvaluate(path);
    });
  }, [pathname, scheduleEvaluate]);

  useEffect(() => {
    if (thread?.isOpen) setReflection(null);
  }, [thread?.isOpen]);

  const dismiss = useCallback(() => setReflection(null), []);

  return (
    <>
      {children}
      <ObservatoryReflectionWhisper reflection={reflection} onDismiss={dismiss} />
    </>
  );
}
