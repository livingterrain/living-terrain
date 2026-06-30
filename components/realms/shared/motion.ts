export const realmEase = [0.45, 0.05, 0.55, 0.95] as const;

export const realmFade = {
  duration: 1.8,
  ease: realmEase,
} as const;

export const realmSlow = {
  duration: 2.4,
  ease: realmEase,
} as const;

/** Realm entry — atmosphere before nodes (600–1200ms arc) */
export const realmEntry = {
  atmosphere: { duration: 0.55, ease: realmEase },
  header: { duration: 0.65, delay: 0.42, ease: realmEase },
  title: { duration: 0.7, delay: 0.55, ease: realmEase },
  terrain: { duration: 0.8, delay: 0.82, ease: realmEase },
} as const;
