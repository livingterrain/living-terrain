/** Faint map whispers — discovered, never announced */
export const MAP_WHISPERS = [
  "Relationship precedes identity.",
  "Every inquiry changes the observer.",
  "The ordinary becomes extraordinary when seen in relationship.",
  "Nothing exists alone.",
  "Meaning exists between things.",
  "The body participates in the real.",
  "Constraint can make freedom possible.",
  "What we do not notice has already organized our seeing.",
  "Identity is stabilized memory.",
  "Words reveal and conceal.",
] as const;

export function pickMapWhisper(seed: number): string {
  return MAP_WHISPERS[Math.abs(seed) % MAP_WHISPERS.length];
}
