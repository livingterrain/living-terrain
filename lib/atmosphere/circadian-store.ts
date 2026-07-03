import {
  applyCircadianTokens,
  CIRCADIAN_SSR_SNAPSHOT,
  getCircadianTokens,
  type CircadianTokens,
} from "./circadian";

let snapshot: CircadianTokens = CIRCADIAN_SSR_SNAPSHOT;
const subscribers = new Set<() => void>();

export function getCircadianSnapshot(): CircadianTokens {
  return snapshot;
}

export function getCircadianServerSnapshot(): CircadianTokens {
  return CIRCADIAN_SSR_SNAPSHOT;
}

export function subscribeCircadian(listener: () => void): () => void {
  subscribers.add(listener);
  return () => subscribers.delete(listener);
}

export function syncCircadian(): CircadianTokens {
  snapshot = getCircadianTokens();
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.classList.add("circadian-active");
    applyCircadianTokens(root, snapshot);
  }
  for (const listener of subscribers) listener();
  return snapshot;
}
