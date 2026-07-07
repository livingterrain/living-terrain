/** Quiet phrases for the physical field journal — never commerce language */
export const FIELD_JOURNAL_WHISPERS = [
  "View the original field journal",
  "Obtain the printed record",
  "The complete investigation exists in print",
  "Hold the bound record",
] as const;

export function fieldJournalWhisper(slug: string): string {
  let index = 0;
  for (let i = 0; i < slug.length; i++) {
    index = (index + slug.charCodeAt(i)) % FIELD_JOURNAL_WHISPERS.length;
  }
  return FIELD_JOURNAL_WHISPERS[index]!;
}
