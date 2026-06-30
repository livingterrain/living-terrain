export type ConceptSlug =
  | "constellation"
  | "drawers"
  | "notebook"
  | "mycelium"
  | "field";

export interface ConceptMeta {
  slug: ConceptSlug;
  title: string;
  tagline: string;
  philosophy: string;
  interaction: string;
  mood: string;
}

export const concepts: ConceptMeta[] = [
  {
    slug: "constellation",
    title: "The Constellation",
    tagline: "You arrive under a sky of questions.",
    philosophy:
      "Ideas are not pages — they are stars. Distance is thematic, brightness is relevance, lines appear only when you look closely enough.",
    interaction:
      "Move through the dark. Hover a star and its relations draw themselves in light. Click to descend into an inquiry.",
    mood: "Vast, quiet, cosmic curiosity",
  },
  {
    slug: "drawers",
    title: "The Archive",
    tagline: "Every question has a drawer.",
    philosophy:
      "Knowledge lives in physical space before it lives on screens. You don't browse — you open, peek, pull out what calls to you.",
    interaction:
      "A wall of labeled drawers. Pull one open and its contents spill into view — essays, notes, volumes nested inside.",
    mood: "Tactile, secret, museum-after-hours",
  },
  {
    slug: "notebook",
    title: "The Observatory Log",
    tagline: "Someone is still writing in here.",
    philosophy:
      "Living Terrain is an ongoing field record — not a finished site. The homepage is an open notebook with fresh signals in the margin.",
    interaction:
      "Turn pages. Tap a signal. Marginalia reveals what connects — threads written in another hand.",
    mood: "Intimate, alive, ink-and-glass",
  },
  {
    slug: "mycelium",
    title: "The Living Network",
    tagline: "Nothing here is alone.",
    philosophy:
      "Ideas grow underground before they surface. The whole terrain is one organism — touch any node and the network responds.",
    interaction:
      "A breathing web of nodes. Hover to illuminate threads. The chamber pulses at the center. Follow the glow.",
    mood: "Organic, relational, slightly uncanny",
  },
  {
    slug: "field",
    title: "The Field Journal",
    tagline: "Walk the terrain.",
    philosophy:
      "Inquiry is movement through landscape — not a menu. Essays and observations are waypoints on a map you explore with your cursor.",
    interaction:
      "Pan across contour lines. Discover pins left by prior walks. Click a waypoint — a journal entry opens like a found object.",
    mood: "Expedition, wonder, slow discovery",
  },
];

export function getConcept(slug: string): ConceptMeta | undefined {
  return concepts.find((c) => c.slug === slug);
}
