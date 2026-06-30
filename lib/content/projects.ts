import { getAtlas, getLegacyProject } from "../atlas";

export function getFlagshipProjectFromAtlas() {
  return getLegacyProject(getAtlas());
}
