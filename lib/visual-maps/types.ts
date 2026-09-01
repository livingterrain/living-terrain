/**
 * Visual Maps — reference / learning plates nested under The Shelves.
 * Not Observatory observations. Not Atlas cartography.
 */

export interface VisualMapPlate {
  id: string;
  slug: string;
  title: string;
  /** Purpose-based alt text — not a full transcription */
  alt: string;
  /** Public path under /images/maps/... */
  image: string;
  width: number;
  height: number;
  order: number;
}

export interface VisualMapCollection {
  slug: string;
  title: string;
  /** One short factual sentence for the collection page */
  description: string;
  /** Quiet whisper on The Shelves listing */
  whisper?: string;
  items: VisualMapPlate[];
}
