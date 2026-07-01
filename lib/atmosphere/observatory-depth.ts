/**
 * Observatory depth — re-exported from the world location system.
 */
export {
  depthForPath,
  depthForPath as observatoryDepthForPath,
  locationForPath,
  locationForPath as depthLabelForPath,
  placeForPath,
  whisperForPath,
} from "@/lib/world/location-for-path";

export { WORLD_LOCATIONS, worldLocation } from "@/lib/world/locations";
export type { WorldLocation, WorldLocationId } from "@/lib/world/locations";

import { depthForPath } from "@/lib/world/location-for-path";

export function depthValueForPath(path: string): number {
  return depthForPath(path);
}
