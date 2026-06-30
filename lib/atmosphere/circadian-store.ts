import {
  applyCircadianTokens,
  getCircadianTokens,
  type CircadianTokens,
} from "./circadian";

let snapshot: CircadianTokens = getCircadianTokens();
const subscribers = new Set<() => void>();

export function getCircadianSnapshot(): CircadianTokens {
  return snapshot;
}

/** Stable SSR snapshot — must return the same reference until syncCircadian updates it */
export const getCircadianServerSnapshot = getCircadianSnapshot;

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
