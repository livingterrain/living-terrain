import type { EdgeKind } from "./types";

/** Organic phrases — never "Related Posts" */
export const GROUP_PHRASES: Record<EdgeKind, string> = {
  parent: "Rooted in",
  child: "Opens into",
  pathway: "Neighboring paths",
  thread: "Threads alongside",
  echo: "Echoes elsewhere",
  volume: "In the archive",
  observation: "Field observations",
  quotation: "Voices in the margin",
  theme: "This inquiry also touches",
  chamber: "The deep chamber",
};

export const PANEL_HEADINGS: Record<string, string> = {
  question: "This inquiry also touches",
  essay: "This inquiry also touches",
  book: "This volume also touches",
  "field-note": "This observation also touches",
  quotation: "This voice also touches",
  observation: "This signal also touches",
  project: "This chamber also touches",
  theme: "Ideas gathered here",
};

export function phraseForGroup(kind: EdgeKind): string {
  return GROUP_PHRASES[kind];
}

export function headingForOrigin(kind: string): string {
  return PANEL_HEADINGS[kind] ?? "This inquiry also touches";
}

export function groupId(kind: EdgeKind, index: number): string {
  return `${kind}-${index}`;
}
