import type { RealmConfig, RealmSlug } from "./types";

export const INITIAL_REALM_SLUGS: RealmSlug[] = [
  "reality",
  "relationship",
  "meaning",
  "identity",
  "language",
  "time",
  "embodiment",
  "freedom",
  "consciousness",
];

export const REALM_CONFIGS: Record<RealmSlug, RealmConfig> = {
  reality: {
    slug: "reality",
    themeId: "th-reality",
    whisper: "The world changes. Something remains.",
    mood: "Deep blue · quiet · observational",
    palette: {
      bg: "#060a12",
      bgGradient:
        "radial-gradient(ellipse 80% 60% at 50% 20%, #0c1830 0%, #060a12 55%, #040608 100%)",
      glow: "rgba(100, 140, 200, 0.35)",
      accent: "#7a9ec8",
      accentSoft: "rgba(122, 158, 200, 0.15)",
      text: "#d8e4f0",
      textMuted: "rgba(200, 216, 232, 0.45)",
      particle: "#8aacd4",
      line: "rgba(122, 158, 200, 0.22)",
    },
    topics: [
      { id: "essays", label: "Essays", whisper: "Arguments traced slowly in light." },
      { id: "models", label: "Models", whisper: "Structures that hold while things change." },
      { id: "perception", label: "Perception", whisper: "What organizes seeing before interpretation." },
      { id: "systems", label: "Systems", whisper: "Patterns larger than their parts." },
      { id: "truth", label: "Truth", whisper: "What remains when interpretation falls away." },
      { id: "emergence", label: "Emergence", whisper: "The whole that was not in the parts." },
    ],
  },
  relationship: {
    slug: "relationship",
    themeId: "th-relationship",
    whisper: "Nothing exists alone.",
    mood: "Warm gold · relational · luminous",
    palette: {
      bg: "#0f0c08",
      bgGradient:
        "radial-gradient(ellipse 75% 55% at 50% 25%, #1a1408 0%, #0f0c08 50%, #080604 100%)",
      glow: "rgba(200, 160, 80, 0.3)",
      accent: "#c4a060",
      accentSoft: "rgba(196, 160, 96, 0.12)",
      text: "#f0e8d8",
      textMuted: "rgba(224, 208, 184, 0.42)",
      particle: "#d4b878",
      line: "rgba(196, 160, 96, 0.28)",
    },
    topics: [
      { id: "attachment", label: "Attachment", whisper: "What binds without imprisoning." },
      { id: "family-systems", label: "Family systems", whisper: "Patterns inherited before memory." },
      { id: "culture", label: "Culture", whisper: "Shared meaning made visible." },
      { id: "biology", label: "Biology", whisper: "Life recognizing life." },
      { id: "ecology", label: "Ecology", whisper: "Nothing exists out of context." },
      { id: "society", label: "Society", whisper: "Many selves, one fabric." },
    ],
  },
  meaning: {
    slug: "meaning",
    themeId: "th-meaning",
    whisper: "Meaning exists between things.",
    mood: "Deep amber · cathedral · contemplative",
    palette: {
      bg: "#100a06",
      bgGradient:
        "radial-gradient(ellipse 60% 80% at 50% 0%, #201008 0%, #100a06 45%, #080504 100%)",
      glow: "rgba(180, 120, 60, 0.28)",
      accent: "#b88850",
      accentSoft: "rgba(184, 136, 80, 0.14)",
      text: "#ece0d0",
      textMuted: "rgba(220, 200, 176, 0.4)",
      particle: "#c89858",
      line: "rgba(184, 136, 80, 0.2)",
    },
    topics: [
      { id: "symbolism", label: "Symbolism", whisper: "The visible carrying the invisible." },
      { id: "myth", label: "Myth", whisper: "Stories that outlive their tellers." },
      { id: "religion", label: "Religion", whisper: "The sacred as lived experience." },
      { id: "philosophy", label: "Philosophy", whisper: "Questions that refuse to settle." },
      { id: "consciousness", label: "Consciousness", whisper: "Awareness as the medium of meaning." },
    ],
  },
  identity: {
    slug: "identity",
    themeId: "th-identity",
    whisper: "Identity is stabilized memory.",
    mood: "Muted violet · intimate · unfolding",
    palette: {
      bg: "#0a0810",
      bgGradient:
        "radial-gradient(ellipse 70% 65% at 50% 30%, #14101c 0%, #0a0810 55%, #060508 100%)",
      glow: "rgba(140, 120, 180, 0.28)",
      accent: "#9888b8",
      accentSoft: "rgba(152, 136, 184, 0.12)",
      text: "#e8e0f0",
      textMuted: "rgba(208, 200, 224, 0.42)",
      particle: "#a898c8",
      line: "rgba(152, 136, 184, 0.22)",
    },
    topics: [
      { id: "embodiment", label: "Embodiment", whisper: "The body participates in who we are." },
      { id: "nervous-system", label: "Nervous system", whisper: "The architecture of response." },
      { id: "transformation", label: "Transformation", whisper: "Becoming without losing thread." },
      { id: "becoming", label: "Becoming", whisper: "The self as verb, not noun." },
      { id: "memory", label: "Memory", whisper: "The past that stabilizes the present." },
    ],
  },
  language: {
    slug: "language",
    themeId: "th-language",
    whisper: "Words reveal and conceal.",
    mood: "Ivory and charcoal · textual · precise",
    palette: {
      bg: "#0c0c0a",
      bgGradient:
        "radial-gradient(ellipse 85% 50% at 50% 15%, #181816 0%, #0c0c0a 55%, #060606 100%)",
      glow: "rgba(220, 212, 196, 0.12)",
      accent: "#d5cbb8",
      accentSoft: "rgba(213, 203, 184, 0.08)",
      text: "#e9e0d0",
      textMuted: "rgba(200, 192, 176, 0.45)",
      particle: "#8a847a",
      line: "rgba(213, 203, 184, 0.15)",
    },
    topics: [
      { id: "metaphor", label: "Metaphor", whisper: "One thing speaking as another." },
      { id: "silence", label: "Silence", whisper: "What words leave in reserve." },
      { id: "translation", label: "Translation", whisper: "Meaning crossing boundaries." },
      { id: "naming", label: "Naming", whisper: "To name is to reveal and reduce." },
    ],
  },
  time: {
    slug: "time",
    themeId: "th-time",
    whisper: "Change makes continuity visible.",
    mood: "Dark bronze · temporal · accumulating",
    palette: {
      bg: "#0a0806",
      bgGradient:
        "radial-gradient(ellipse 90% 45% at 50% 100%, #181008 0%, #0a0806 50%, #050404 100%)",
      glow: "rgba(160, 120, 80, 0.25)",
      accent: "#a08058",
      accentSoft: "rgba(160, 128, 88, 0.12)",
      text: "#e0d4c4",
      textMuted: "rgba(192, 176, 160, 0.42)",
      particle: "#b89068",
      line: "rgba(160, 128, 88, 0.24)",
    },
    topics: [
      { id: "duration", label: "Duration", whisper: "Time as lived, not measured." },
      { id: "memory", label: "Memory", whisper: "The past kept present." },
      { id: "return", label: "Return", whisper: "Loops that deepen understanding." },
      { id: "accumulation", label: "Accumulation", whisper: "Ideas gathered across years." },
    ],
  },
  embodiment: {
    slug: "embodiment",
    themeId: "th-embodiment",
    whisper: "The body participates in who we are.",
    mood: "Deep rose · somatic · pulsing",
    palette: {
      bg: "#0c0608",
      bgGradient:
        "radial-gradient(ellipse 70% 80% at 50% 85%, #1a0c10 0%, #0c0608 50%, #050304 100%)",
      glow: "rgba(180, 100, 110, 0.22)",
      accent: "#c48890",
      accentSoft: "rgba(196, 136, 144, 0.1)",
      text: "#f0e4e6",
      textMuted: "rgba(220, 192, 196, 0.42)",
      particle: "#b87888",
      line: "rgba(196, 136, 144, 0.2)",
    },
    topics: [
      { id: "nervous-system", label: "Nervous system", whisper: "The architecture of response." },
      { id: "sensation", label: "Sensation", whisper: "What the body knows first." },
      { id: "movement", label: "Movement", whisper: "Thought made kinetic." },
      { id: "vitality", label: "Vitality", whisper: "Life force through tissue." },
      { id: "boundary", label: "Boundary", whisper: "Where self meets world." },
      { id: "heartbeat", label: "Heartbeat", whisper: "Rhythm that structures aliveness." },
    ],
  },
  freedom: {
    slug: "freedom",
    themeId: "th-freedom",
    whisper: "Maybe constraints make freedom possible.",
    mood: "Pale dawn · open · geometric tension",
    palette: {
      bg: "#080a0c",
      bgGradient:
        "radial-gradient(ellipse 90% 55% at 72% 50%, #101820 0%, #080a0c 55%, #040506 100%)",
      glow: "rgba(140, 170, 200, 0.18)",
      accent: "#98b8d0",
      accentSoft: "rgba(152, 184, 208, 0.08)",
      text: "#e4ecf4",
      textMuted: "rgba(192, 208, 224, 0.4)",
      particle: "#88a8c0",
      line: "rgba(152, 184, 208, 0.18)",
    },
    topics: [
      { id: "choice", label: "Choice", whisper: "What opens when structure holds." },
      { id: "constraint", label: "Constraint", whisper: "What makes freedom possible." },
      { id: "structure", label: "Structure", whisper: "The heartbeat's discipline." },
      { id: "discernment", label: "Discernment", whisper: "Judgment that serves life." },
      { id: "path", label: "Path", whisper: "Where choice becomes visible." },
      { id: "embodiment", label: "Embodiment", whisper: "Freedom lived in the body." },
    ],
  },
  consciousness: {
    slug: "consciousness",
    themeId: "th-consciousness",
    whisper: "Awareness as the medium of experience.",
    mood: "Soft indigo · field · overlapping",
    palette: {
      bg: "#080810",
      bgGradient:
        "radial-gradient(ellipse 80% 70% at 48% 48%, #12102a 0%, #080810 55%, #040408 100%)",
      glow: "rgba(120, 100, 200, 0.25)",
      accent: "#9890d8",
      accentSoft: "rgba(152, 144, 216, 0.1)",
      text: "#e8e4f8",
      textMuted: "rgba(200, 196, 224, 0.42)",
      particle: "#a898d0",
      line: "rgba(152, 144, 216, 0.22)",
    },
    topics: [
      { id: "awareness", label: "Awareness", whisper: "The texture of experience itself." },
      { id: "perception", label: "Perception", whisper: "What organizes seeing before interpretation." },
      { id: "presence", label: "Presence", whisper: "Here, before the story begins." },
      { id: "field", label: "Field", whisper: "Overlapping spheres of influence." },
      { id: "interoception", label: "Interoception", whisper: "Sensing from within." },
    ],
  },
};

export function getRealmConfig(slug: string): RealmConfig | undefined {
  return REALM_CONFIGS[slug as RealmSlug];
}

export function isImmersiveRealm(slug: string): boolean {
  return INITIAL_REALM_SLUGS.includes(slug as RealmSlug);
}
