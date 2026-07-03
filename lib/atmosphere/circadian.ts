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

const TOKENS: Record<CircadianPhase, Omit<CircadianTokens, "phase">> = {
  morning: {
    starMul: 0.82,
    fogMul: 1.38,
    clarityMul: 0.88,
    particleMul: 1.1,
    mist: 0.52,
    warmth: 0.14,
    shadowDepth: 0.24,
    ambientTop: "#2a2218",
    starColor: "#e8d8b8",
    voidBase: "#080706",
    ivoryTint: "#e8dcc8",
    ivoryMix: 0.07,
    lightPoolOpacity: 0.78,
    fieldOpacity: 0.92,
    fogWarmth: 0.72,
  },
  afternoon: {
    starMul: 0.72,
    fogMul: 0.68,
    clarityMul: 1.18,
    particleMul: 1,
    mist: 0.1,
    warmth: 0,
    shadowDepth: 0.18,
    ambientTop: "#161c24",
    starColor: "#d8dce4",
    voidBase: "#040506",
    ivoryTint: "#e9e0d0",
    ivoryMix: 0,
    lightPoolOpacity: 0.88,
    fieldOpacity: 1,
    fogWarmth: 0.2,
  },
  evening: {
    starMul: 1.02,
    fogMul: 1.08,
    clarityMul: 0.9,
    particleMul: 1.32,
    mist: 0.38,
    warmth: 0.04,
    shadowDepth: 0.48,
    ambientTop: "#12182c",
    starColor: "#b8c4e0",
    voidBase: "#030408",
    ivoryTint: "#e0dcd4",
    ivoryMix: 0.04,
    lightPoolOpacity: 0.62,
    fieldOpacity: 0.82,
    fogWarmth: 0.15,
  },
  night: {
    starMul: 1.38,
    fogMul: 0.48,
    clarityMul: 1.02,
    particleMul: 1.48,
    mist: 0.04,
    warmth: 0,
    shadowDepth: 0.36,
    ambientTop: "#0c0e1a",
    starColor: "#dce2f4",
    voidBase: "#020204",
    ivoryTint: "#ddd8cc",
    ivoryMix: 0.06,
    lightPoolOpacity: 0.48,
    fieldOpacity: 0.68,
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

/** Stable SSR / first-paint tokens — matches threshold void (#06080c) atmosphere */
export const CIRCADIAN_SSR_SNAPSHOT: CircadianTokens = {
  phase: "evening",
  ...TOKENS.evening,
  voidBase: "#06080c",
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
