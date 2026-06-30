import type { ViewBox } from "@/lib/concepts/universe-viewport";

const SESSION_KEY = "lt-constellation-session";

export interface ConstellationSession {
  viewBox: ViewBox;
  exploredIds: string[];
  timestamp: number;
}

export function saveConstellationSession(
  viewBox: ViewBox,
  exploredIds: Iterable<string>,
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: ConstellationSession = {
      viewBox,
      exploredIds: [...exploredIds],
      timestamp: Date.now(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  } catch {
    /* storage unavailable */
  }
}

export function loadConstellationSession(): ConstellationSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as ConstellationSession;
    if (!data.viewBox || !Array.isArray(data.exploredIds)) return null;
    if (Date.now() - data.timestamp > 86_400_000) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearConstellationSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
