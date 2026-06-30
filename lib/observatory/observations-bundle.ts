import observationData from "@/data/visitor-observations.json";
import type { ObservationStore, VisitorObservation } from "./types";
import { sortObservationsNewest } from "./display";

/** Client-safe read of bundled observations — no Node fs */
export function getBundledObservations(): VisitorObservation[] {
  const store = observationData as ObservationStore;
  if (!Array.isArray(store.observations)) return [];
  return sortObservationsNewest(store.observations);
}
