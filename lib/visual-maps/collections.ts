import type { VisualMapCollection, VisualMapPlate } from "./types";

const ASTROLOGY_BASE = "/images/maps/astrology";

/**
 * Astrology — A Symbolic Language
 * Sequence teaches decoding: planets → … → master sheet.
 * Image titles confirmed by inspecting plate contents.
 */
export const ASTROLOGY_COLLECTION: VisualMapCollection = {
  slug: "astrology",
  title: "Astrology — A Symbolic Language",
  description:
    "A visual framework for reading astrology as a pattern language rather than a list of isolated meanings.",
  whisper:
    "A visual system for reading planets, signs, elements, modalities, aspects, and houses together.",
  items: [
    {
      id: "astrology-planets",
      slug: "planets",
      title: "Planets",
      alt: "Planets astrology reference sheet showing each planet’s symbolic role and keywords.",
      image: `${ASTROLOGY_BASE}/planets.png`,
      width: 1024,
      height: 1536,
      order: 1,
    },
    {
      id: "astrology-signs",
      slug: "signs",
      title: "Signs",
      alt: "Signs astrology reference sheet showing all twelve zodiac signs, elements, modalities, and key patterns.",
      image: `${ASTROLOGY_BASE}/signs.png`,
      width: 1024,
      height: 1536,
      order: 2,
    },
    {
      id: "astrology-elements",
      slug: "elements",
      title: "Elements",
      alt: "Elements astrology reference sheet showing Fire, Earth, Air, and Water as layers of reality.",
      image: `${ASTROLOGY_BASE}/elements.png`,
      width: 1122,
      height: 1402,
      order: 3,
    },
    {
      id: "astrology-modalities",
      slug: "modalities",
      title: "Modalities",
      alt: "Modalities astrology reference sheet showing Cardinal, Fixed, and Mutable as stages of a process.",
      image: `${ASTROLOGY_BASE}/modalities.png`,
      width: 1199,
      height: 1312,
      order: 4,
    },
    {
      id: "astrology-aspects",
      slug: "aspects",
      title: "Aspects",
      alt: "Aspects astrology reference sheet showing how two planetary processes interact by angle.",
      image: `${ASTROLOGY_BASE}/aspects.png`,
      width: 1536,
      height: 1024,
      order: 5,
    },
    {
      id: "astrology-houses",
      slug: "houses",
      title: "Houses",
      alt: "Houses astrology reference sheet showing where patterns manifest across twelve life arenas.",
      image: `${ASTROLOGY_BASE}/houses.png`,
      width: 1536,
      height: 1024,
      order: 6,
    },
    {
      id: "astrology-master",
      slug: "master-decoding-sheet",
      title: "Master Decoding Sheet",
      alt: "Master decoding sheet synthesizing planets, signs, elements, modalities, aspects, and houses into one reading formula.",
      image: `${ASTROLOGY_BASE}/master-decoding-sheet.png`,
      width: 1024,
      height: 1536,
      order: 7,
    },
  ],
};

/** Live collections — add another entry here when a new set exists */
export const VISUAL_MAP_COLLECTIONS: VisualMapCollection[] = [
  ASTROLOGY_COLLECTION,
];

export function getVisualMapCollections(): VisualMapCollection[] {
  return VISUAL_MAP_COLLECTIONS;
}

export function getVisualMapCollection(
  slug: string,
): VisualMapCollection | undefined {
  return VISUAL_MAP_COLLECTIONS.find((c) => c.slug === slug);
}

export function getVisualMapPlate(
  collectionSlug: string,
  plateSlug: string,
): { collection: VisualMapCollection; plate: VisualMapPlate; index: number } | undefined {
  const collection = getVisualMapCollection(collectionSlug);
  if (!collection) return undefined;
  const index = collection.items.findIndex((p) => p.slug === plateSlug);
  if (index < 0) return undefined;
  return { collection, plate: collection.items[index]!, index };
}

export function plateHref(collectionSlug: string, plateSlug: string): string {
  return `/visual-maps/${collectionSlug}/${plateSlug}`;
}

export function collectionHref(collectionSlug: string): string {
  return `/visual-maps/${collectionSlug}`;
}
