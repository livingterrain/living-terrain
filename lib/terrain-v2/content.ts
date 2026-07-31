/**
 * Terrain v2 — curated field graph for the NOTICE → TRACE → CROSS → RETURN prototype.
 * Titles and fragments drawn from existing Living Terrain atlas / series material.
 */

export type TerrainPresence = {
  id: string;
  name: string;
  /** Shown after linger */
  fragment: string;
  /** Hint that it connects elsewhere */
  bondWhisper: string;
  /** Field resting position — percent of view (0–100) */
  x: number;
  y: number;
  /** Short introduction when crossed into */
  introduction: string;
  /** In-world writing — kept inside Living Terrain (not Medium) */
  essayTitle: string;
  essayBody: string[];
  /** Optional chamber path if they want the deeper room */
  chamberHref?: string;
  chamberLabel?: string;
};

export type TerrainBond = {
  id: string;
  from: string;
  to: string;
  whisper: string;
};

export const TERRAIN_PRESENCES: TerrainPresence[] = [
  {
    id: "relationship",
    name: "Relationship",
    fragment: "Nothing exists alone.",
    bondWhisper: "touches nearby ideas",
    x: 48,
    y: 42,
    introduction:
      "Relationship is not a topic beside others — it is the medium in which every other inquiry becomes visible.",
    essayTitle: "Nothing exists alone",
    essayBody: [
      "Living Terrain begins from a simple refusal: that ideas can be understood as isolated objects.",
      "What we call a concept is already a set of relationships — to the body, to constraint, to feedback, to time.",
      "To attend to Relationship is to notice the field before the objects in it.",
    ],
    chamberHref: "/themes/relationship",
    chamberLabel: "Enter the Relationship realm",
  },
  {
    id: "constraint",
    name: "Constraint",
    fragment: "Maybe constraints are what make freedom possible.",
    bondWhisper: "leans toward the body",
    x: 28,
    y: 58,
    introduction:
      "The heartbeat does not emerge from complete freedom — it emerges from structure. Constraint is not the opposite of life; it may be the shape life requires.",
    essayTitle: "Constraint Is Not the Opposite of Freedom",
    essayBody: [
      "The heartbeat does not emerge from complete freedom — it emerges from structure.",
      "Maybe constraints are not what stand between us and life. Maybe they are what make freedom possible.",
      "Judgment, discernment, and the architecture of a living system all depend on limits that hold long enough for pattern to appear.",
    ],
    chamberHref: "/themes/freedom",
    chamberLabel: "Enter Freedom",
  },
  {
    id: "body",
    name: "The Body",
    fragment: "The lived body as participant in the real.",
    bondWhisper: "answers before language",
    x: 68,
    y: 62,
    introduction:
      "Embodiment is not metaphor layered onto thought. It is the first instrument through which reality is encountered and reorganized.",
    essayTitle: "If you feel it in the body, start here",
    essayBody: [
      "Before interpretation finishes its work, the body has already organized a response.",
      "Living Terrain treats embodiment as participation — not as a subject to be studied from outside, but as the place where signal becomes experience.",
      "What the nervous system records often arrives earlier than what the mind can name.",
    ],
    chamberHref: "/themes/embodiment",
    chamberLabel: "Enter Embodiment",
  },
  {
    id: "feedback",
    name: "Feedback",
    fragment: "Signal, loop, and the intelligence of return.",
    bondWhisper: "circulates through systems",
    x: 22,
    y: 32,
    introduction:
      "Feedback is how a living system knows itself. Without return, there is only force — never learning.",
    essayTitle: "Feedback Is God",
    essayBody: [
      "Every living system pays attention to what comes back.",
      "Feedback is not merely correction. It is the quiet intelligence by which form maintains itself while everything inside it changes.",
      "In Living Terrain, feedback appears wherever a path curves home — essay to question, body to meaning, constraint to freedom.",
    ],
    chamberHref: "/atlas",
    chamberLabel: "Find this in the Atlas",
  },
  {
    id: "participation",
    name: "Participation",
    fragment: "You are not outside the field you observe.",
    bondWhisper: "binds observer to observed",
    x: 72,
    y: 28,
    introduction:
      "To look is already to join. Participation is the refusal of the false distance between knower and known.",
    essayTitle: "Attention as participation",
    essayBody: [
      "In a relational world, observation is never neutral.",
      "What you attend to gains mass. What you neglect cools. The visitor is not a consumer of ideas — they are a participant in what becomes visible.",
      "This is why Living Terrain treats attention as the first interface.",
    ],
    chamberHref: "/themes/consciousness",
    chamberLabel: "Enter Consciousness",
  },
  {
    id: "evolution",
    name: "Evolution",
    fragment: "Nothing was broken — only adapted.",
    bondWhisper: "opens into becoming",
    x: 56,
    y: 78,
    introduction:
      "Evolution here is not progress as conquest. It is reorganization — capacity taking new form after an old pattern can no longer hold.",
    essayTitle: "The second birth",
    essayBody: [
      "A second birth is not a metaphor layered onto the body. It is the physiological work of reorganization.",
      "Nothing was broken — only adapted. The work is not repair. It is reorganization.",
      "Reconstruction begins as evidence, continues as embodiment, and only then becomes a self that can stay.",
    ],
    chamberHref: "/chambers/the-second-birth",
    chamberLabel: "Enter the chamber",
  },
  {
    id: "technology",
    name: "Technology",
    fragment: "Signal, structure, and what travels between minds.",
    bondWhisper: "extends the reach of relation",
    x: 38,
    y: 18,
    introduction:
      "Technology, in this terrain, is not gadgets first. It is any structure that carries signal between minds — including language, tools, and the architectures we forget to examine.",
    essayTitle: "What travels between minds",
    essayBody: [
      "Information is signal given structure — what can move without losing the pattern that makes it meaningful.",
      "When technology amplifies relation, it belongs to the terrain. When it isolates, the field cools.",
      "The question is never only what a tool does, but what relationships it makes newly possible — or newly invisible.",
    ],
    chamberHref: "/themes/information",
    chamberLabel: "Enter Information",
  },
];

export const TERRAIN_BONDS: TerrainBond[] = [
  {
    id: "b1",
    from: "relationship",
    to: "participation",
    whisper: "to look is already to join",
  },
  {
    id: "b2",
    from: "relationship",
    to: "body",
    whisper: "relation is lived before it is named",
  },
  {
    id: "b3",
    from: "constraint",
    to: "body",
    whisper: "structure makes a pulse possible",
  },
  {
    id: "b4",
    from: "constraint",
    to: "feedback",
    whisper: "limits allow return to teach",
  },
  {
    id: "b5",
    from: "feedback",
    to: "evolution",
    whisper: "what returns can reorganize",
  },
  {
    id: "b6",
    from: "participation",
    to: "technology",
    whisper: "tools extend what attention can hold",
  },
  {
    id: "b7",
    from: "body",
    to: "evolution",
    whisper: "adaptation is embodied first",
  },
  {
    id: "b8",
    from: "technology",
    to: "feedback",
    whisper: "signal needs a loop to become wisdom",
  },
];

export function presenceById(id: string): TerrainPresence | undefined {
  return TERRAIN_PRESENCES.find((p) => p.id === id);
}

export function bondsFor(id: string): TerrainBond[] {
  return TERRAIN_BONDS.filter((b) => b.from === id || b.to === id);
}

export function otherEnd(bond: TerrainBond, id: string): string {
  return bond.from === id ? bond.to : bond.from;
}
