"use client";

import { useSyncExternalStore } from "react";
import {
  getCircadianSnapshot,
  subscribeCircadian,
} from "@/lib/atmosphere/circadian-store";
import type { CircadianTokens } from "@/lib/atmosphere/circadian";

/** React hook — tokens for atmosphere layers; no UI */
export function useCircadian(): CircadianTokens {
  return useSyncExternalStore(
    subscribeCircadian,
    getCircadianSnapshot,
    getCircadianSnapshot,
  );
}
