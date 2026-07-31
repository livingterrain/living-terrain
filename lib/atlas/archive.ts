/**
 * Atlas archive taxonomy — charted maps finding aid.
 * Only corpus that exists today: published themes, maps, chambers, essays, questions.
 */

export type AtlasEntryStatus =
  | "Published"
  | "In Progress"
  | "Research"
  | "Field Note"
  | "Draft"
  | "Open Inquiry";

export type AtlasEntryKind =
  | "map"
  | "theme"
  | "essay"
  | "question"
  | "chamber";

export type AtlasArchiveEntry = {
  id: string;
  title: string;
  description: string;
  status: AtlasEntryStatus;
  kind: AtlasEntryKind;
  href: string;
};

export type AtlasDomainDef = {
  id: string;
  title: string;
  whisper: string;
  entries: ReadonlyArray<AtlasArchiveEntry>;
};

/**
 * Finding-aid structure for /atlas/charts.
 * Organized by research domain — not by publish date.
 * Placeholder entries removed; only live corpus remains.
 */
export const ATLAS_DOMAINS: ReadonlyArray<AtlasDomainDef> = [
  {
    id: "first-principles",
    title: "First Principles",
    whisper: "What holds before interpretation begins.",
    entries: [
      {
        id: "reality",
        title: "Reality",
        description: "What is real before interpretation.",
        status: "Published",
        kind: "theme",
        href: "/themes/reality",
      },
      {
        id: "structure",
        title: "Structure",
        description: "What holds form while everything changes.",
        status: "Published",
        kind: "theme",
        href: "/themes/structure",
      },
      {
        id: "map-structure",
        title: "The Structure Beneath Reality",
        description:
          "An inquiry into what holds the world together — the charted map.",
        status: "Published",
        kind: "map",
        href: "/atlas/the-structure-beneath-reality",
      },
    ],
  },
  {
    id: "systems",
    title: "Systems",
    whisper: "Signal, feedback, and the intelligence of loops.",
    entries: [
      {
        id: "information",
        title: "Information",
        description: "Signal, structure, and what travels between minds.",
        status: "Published",
        kind: "theme",
        href: "/themes/information",
      },
      {
        id: "map-feedback",
        title: "Feedback Is God",
        description:
          "Intelligence as relationship — the conversation between action and consequence.",
        status: "Published",
        kind: "map",
        href: "/atlas/feedback-is-god",
      },
      {
        id: "map-criticality",
        title: "Below Criticality",
        description:
          "How modern systems quietly redesign the intensity of a human life.",
        status: "Published",
        kind: "map",
        href: "/atlas/below-criticality",
      },
      {
        id: "essay-maintenance",
        title: "Every Living System Pays a Maintenance Cost",
        description:
          "The invisible work that determines whether living systems merely survive — or become.",
        status: "Published",
        kind: "essay",
        href: "/essays/every-living-system-pays-a-maintenance-cost",
      },
    ],
  },
  {
    id: "biology",
    title: "Biology",
    whisper: "The body as participant in transformation.",
    entries: [
      {
        id: "embodiment",
        title: "Embodiment",
        description: "The lived body as participant in the real.",
        status: "Published",
        kind: "theme",
        href: "/themes/embodiment",
      },
      {
        id: "map-biology",
        title: "The Biology of Becoming",
        description:
          "How the nervous system rewrites identity, perception, and reality.",
        status: "Published",
        kind: "map",
        href: "/atlas/the-biology-of-becoming",
      },
      {
        id: "chamber-biology",
        title: "Chamber · The Biology of Becoming",
        description: "Enter the territory interior of this investigation.",
        status: "Published",
        kind: "chamber",
        href: "/chambers/the-biology-of-becoming",
      },
      {
        id: "essay-body",
        title: "If You Feel It in Your Body, Start Here",
        description: "Orientation into somatic knowing as primary evidence.",
        status: "Published",
        kind: "essay",
        href: "/essays/if-you-feel-it-in-your-body-start-here",
      },
    ],
  },
  {
    id: "consciousness",
    title: "Consciousness",
    whisper: "The texture of awareness itself.",
    entries: [
      {
        id: "consciousness",
        title: "Consciousness",
        description: "The texture of awareness itself.",
        status: "Published",
        kind: "theme",
        href: "/themes/consciousness",
      },
      {
        id: "perception",
        title: "Perception",
        description: "What organizes seeing before interpretation.",
        status: "Published",
        kind: "theme",
        href: "/themes/perception",
      },
      {
        id: "map-field-guide",
        title: "A Field Guide to the Experience",
        description:
          "Orientation to expanded states — clarity without coercion.",
        status: "Published",
        kind: "map",
        href: "/atlas/a-field-guide-to-the-experience",
      },
      {
        id: "essay-reality",
        title: "The Most Important Thing You Never Learned About Reality",
        description:
          "Your perception does not simply observe reality. It helps create the reality you experience.",
        status: "Published",
        kind: "essay",
        href: "/essays/the-most-important-thing-you-never-learned-about-reality",
      },
    ],
  },
  {
    id: "adaptation",
    title: "Adaptation",
    whisper: "How systems reorganize around what they have survived.",
    entries: [
      {
        id: "map-second-birth",
        title: "The Second Birth",
        description:
          "Physiological reconstruction after collapse — evidence, embodiment, becoming.",
        status: "Published",
        kind: "map",
        href: "/atlas/the-second-birth",
      },
      {
        id: "chamber-second-birth",
        title: "Chamber · The Second Birth",
        description: "Enter the territory interior of this investigation.",
        status: "Published",
        kind: "chamber",
        href: "/chambers/the-second-birth",
      },
      {
        id: "identity",
        title: "Identity",
        description: "The self as ongoing inquiry.",
        status: "Published",
        kind: "theme",
        href: "/themes/identity",
      },
    ],
  },
  {
    id: "energy",
    title: "Energy",
    whisper: "Constraint, pressure, and measurable life.",
    entries: [
      {
        id: "map-embodied-physics",
        title: "Embodied Physics",
        description:
          "How the body organizes itself in response to pressure, constraint, and signal.",
        status: "Published",
        kind: "map",
        href: "/atlas/embodied-physics",
      },
      {
        id: "freedom",
        title: "Freedom",
        description: "Constraint, choice, and the shape of a life.",
        status: "Published",
        kind: "theme",
        href: "/themes/freedom",
      },
      {
        id: "essay-constraint",
        title: "Constraint Is Not the Opposite of Freedom",
        description:
          "What the heart taught about judgment, discernment, and the structure of life.",
        status: "Published",
        kind: "essay",
        href: "/essays/constraint-is-not-the-opposite-of-freedom",
      },
    ],
  },
  {
    id: "relationships",
    title: "Relationships",
    whisper: "Nothing exists alone.",
    entries: [
      {
        id: "relationship",
        title: "Relationship",
        description: "Nothing exists alone.",
        status: "Published",
        kind: "theme",
        href: "/themes/relationship",
      },
      {
        id: "meaning",
        title: "Meaning",
        description: "How significance accumulates.",
        status: "Published",
        kind: "theme",
        href: "/themes/meaning",
      },
      {
        id: "essay-restriction",
        title: "The Goal Was Never Restriction",
        description:
          "Healing was supposed to help us participate in life — not become afraid of it.",
        status: "Published",
        kind: "essay",
        href: "/essays/the-goal-was-never-restriction",
      },
      {
        id: "essay-tragedy",
        title: "What Happens Before the Tragedy?",
        description: "On fragmentation, formation, and the patterns we fail to see.",
        status: "Published",
        kind: "essay",
        href: "/essays/what-happens-before-the-tragedy",
      },
    ],
  },
  {
    id: "civilization",
    title: "Civilization",
    whisper: "The infrastructures that quietly shape a life.",
    entries: [
      {
        id: "essay-image",
        title: "There Is a Cost to Becoming an Image",
        description:
          "On visibility, personhood, and the temptation to trade being known for being consumed.",
        status: "Published",
        kind: "essay",
        href: "/essays/there-is-a-cost-to-becoming-an-image",
      },
      {
        id: "essay-sacrifice",
        title: "When Sacrifice Stops Leading Somewhere",
        description:
          "People aren't just questioning wages. They're questioning the exchange itself.",
        status: "Published",
        kind: "essay",
        href: "/essays/when-sacrifice-stops-leading-somewhere",
      },
    ],
  },
  {
    id: "language",
    title: "Language",
    whisper: "What words can carry — and what they cannot.",
    entries: [
      {
        id: "language",
        title: "Language",
        description: "What can be carried in words — and what cannot.",
        status: "Published",
        kind: "theme",
        href: "/themes/language",
      },
      {
        id: "q-language",
        title: "Can language hold the unsayable?",
        description: "On silence, metaphor, and the edge of expression.",
        status: "Open Inquiry",
        kind: "question",
        href: "/questions/can-language-hold-the-unsayable",
      },
    ],
  },
  {
    id: "open-questions",
    title: "Open Questions",
    whisper: "Gateways that refuse to close.",
    entries: [
      {
        id: "q-perception",
        title: "What lies beneath perception?",
        description: "On the structures we inherit before we notice them.",
        status: "Open Inquiry",
        kind: "question",
        href: "/questions/what-lies-beneath-perception",
      },
      {
        id: "q-time",
        title: "How do we inhabit time?",
        description: "Memory, rhythm, and the texture of duration.",
        status: "Open Inquiry",
        kind: "question",
        href: "/questions/how-do-we-inhabit-time",
      },
      {
        id: "time",
        title: "Time",
        description: "Duration as lived, not merely measured.",
        status: "Published",
        kind: "theme",
        href: "/themes/time",
      },
      {
        id: "essay-looking-up",
        title: "The Ancient Purpose of Looking Up",
        description:
          "Why have human beings returned to this moment in the sky for thousands of years?",
        status: "Published",
        kind: "essay",
        href: "/essays/the-ancient-purpose-of-looking-up",
      },
      {
        id: "essay-loop",
        title: "You Have to Go Far Enough to Make a Loop",
        description:
          "Existential questions wearing everyday clothes — and the return that changes the asker.",
        status: "Published",
        kind: "essay",
        href: "/essays/you-have-to-go-far-enough-to-make-a-loop",
      },
    ],
  },
];
