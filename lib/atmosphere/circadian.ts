export type CircadianPhase = "morning" | "afternoon" | "evening" | "night";

export interface CircadianTokens {
  phase: CircadianPhase;
  /** Star field intensity on the map */
  starMul: number;
  /** Volumetric fog thickness */
  fogMul: number;
  /** Visual sharpness — afternoon peaks */
  clarityMul: number;
  /** >1 = slower particle drift */
  particleMul: number;
  /** Room mist / haze overlay */
  mist: number;
  /** Reading-layer warmth (0–1) */
  warmth: number;
  /** Vignette / shadow depth in rooms */
  shadowDepth: number;
  /** Map ambient gradient center color */
  ambientTop: string;
  /** Distant star tint */
  starColor: string;
  /** Map void base */
  voidBase: string;
  /** Ivory paper tint for reading shell */
  ivoryTint: string;
  ivoryMix: number;
  /** Light pool strength in rooms */
  lightPoolOpacity: number;
  /** Site field diagram visibility */
  fieldOpacity: number;
  /** Fog gold vs cool (0 = cool, 1 = warm) */
  fogWarmth: number;
}

/** V2 circadian — cool depth shifts only; no warm taupe fog. */
const TOKENS: Record<CircadianPhase, Omit<CircadianTokens, "phase">> = {
  morning: {
    starMul: 0.72,
    fogMul: 0.45,
    clarityMul: 0.95,
    particleMul: 1.05,
    mist: 0.12,
    warmth: 0.04,
    shadowDepth: 0.2,
    ambientTop: "#121820",
    starColor: "#d8dce4",
    voidBase: "#030405",
    ivoryTint: "#ebe6dc",
    ivoryMix: 0,
    lightPoolOpacity: 0.35,
    fieldOpacity: 0.55,
    fogWarmth: 0,
  },
  afternoon: {
    starMul: 0.65,
    fogMul: 0.32,
    clarityMul: 1.1,
    particleMul: 1,
    mist: 0.06,
    warmth: 0,
    shadowDepth: 0.16,
    ambientTop: "#0e141c",
    starColor: "#d8dce4",
    voidBase: "#030405",
    ivoryTint: "#ebe6dc",
    ivoryMix: 0,
    lightPoolOpacity: 0.4,
    fieldOpacity: 0.5,
    fogWarmth: 0,
  },
  evening: {
    starMul: 0.95,
    fogMul: 0.4,
    clarityMul: 0.92,
    particleMul: 1.2,
    mist: 0.14,
    warmth: 0.02,
    shadowDepth: 0.28,
    ambientTop: "#0c121c",
    starColor: "#b8c4e0",
    voidBase: "#030405",
    ivoryTint: "#ebe6dc",
    ivoryMix: 0,
    lightPoolOpacity: 0.28,
    fieldOpacity: 0.48,
    fogWarmth: 0,
  },
  night: {
    starMul: 1.2,
    fogMul: 0.28,
    clarityMul: 1,
    particleMul: 1.35,
    mist: 0.04,
    warmth: 0,
    shadowDepth: 0.32,
    ambientTop: "#080c14",
    starColor: "#dce2f4",
    voidBase: "#020304",
    ivoryTint: "#ebe6dc",
    ivoryMix: 0,
    lightPoolOpacity: 0.22,
    fieldOpacity: 0.4,
    fogWarmth: 0,
  },
};

export function getCircadianPhase(date = new Date()): CircadianPhase {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function getCircadianTokens(date = new Date()): CircadianTokens {
  const phase = getCircadianPhase(date);
  return { phase, ...TOKENS[phase] };
}

/** Stable SSR / first-paint tokens — V2 void */
export const CIRCADIAN_SSR_SNAPSHOT: CircadianTokens = {
  phase: "evening",
  ...TOKENS.evening,
  voidBase: "#030405",
};

const CSS_MAP: Record<keyof Omit<CircadianTokens, "phase">, string> = {
  starMul: "--circadian-star-mul",
  fogMul: "--circadian-fog-mul",
  clarityMul: "--circadian-clarity-mul",
  particleMul: "--circadian-particle-mul",
  mist: "--circadian-mist",
  warmth: "--circadian-warmth",
  shadowDepth: "--circadian-shadow-depth",
  ambientTop: "--circadian-ambient-top",
  starColor: "--circadian-star-color",
  voidBase: "--circadian-void-base",
  ivoryTint: "--circadian-ivory-tint",
  ivoryMix: "--circadian-ivory-mix",
  lightPoolOpacity: "--circadian-light-pool",
  fieldOpacity: "--circadian-field-opacity",
  fogWarmth: "--circadian-fog-warmth",
};

export function applyCircadianTokens(
  root: HTMLElement,
  tokens: CircadianTokens,
): void {
  root.dataset.circadian = tokens.phase;
  for (const [key, cssVar] of Object.entries(CSS_MAP)) {
    const value = tokens[key as keyof typeof CSS_MAP];
    root.style.setProperty(cssVar, String(value));
  }
}

/** Poll interval — phase shifts are imperceptible moment to moment */
export const CIRCADIAN_POLL_MS = 60_000;
