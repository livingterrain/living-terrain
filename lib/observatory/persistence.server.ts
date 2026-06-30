import "server-only";

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { ObservationStore } from "./types";

const STORE_PATH = join(process.cwd(), "data/visitor-observations.json");

export function readObservationStore(): ObservationStore {
  if (!existsSync(STORE_PATH)) {
    return { version: 1, observations: [] };
  }
  try {
    const raw = readFileSync(STORE_PATH, "utf-8");
    const data = JSON.parse(raw) as ObservationStore;
    if (!Array.isArray(data.observations)) return { version: 1, observations: [] };
    return data;
  } catch {
    return { version: 1, observations: [] };
  }
}

export function writeObservationStore(store: ObservationStore): void {
  writeFileSync(STORE_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf-8");
}
