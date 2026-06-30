import { getAtlas, getLegacyThemes, getLegacyQuotations, getLegacyObservations } from "../atlas";
import type { Theme, Quotation, Observation } from "../content/types";

/** All themes — major concepts plus granular threads (from atlas) */
export function getCatalogThemes(): Theme[] {
  return getLegacyThemes(getAtlas());
}

export function getCatalogQuotations(): Quotation[] {
  return getLegacyQuotations(getAtlas());
}

export function getCatalogObservations(): Observation[] {
  return getLegacyObservations(getAtlas());
}

/** @deprecated Use getCatalogThemes() */
export const themes = getCatalogThemes();
/** @deprecated Use getCatalogQuotations() */
export const quotations = getCatalogQuotations();
/** @deprecated Use getCatalogObservations() */
export const observations = getCatalogObservations();
