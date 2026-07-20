/**
 * Content contract for the reusable editorial chamber.
 * Biology of Becoming remains a custom prototype; other volumes use this.
 */

export type EditorialMargin = {
  label: string;
  text: string;
  href?: string;
};

export type EditorialPassage = {
  body: string;
  /** left = text then margin; right = margin then text */
  align?: "left" | "right";
  margin?: EditorialMargin;
};

export type EditorialFigureStage = {
  name: string;
  gloss: string;
};

export type EditorialFigure = {
  number: string;
  title: string;
  stages: ReadonlyArray<EditorialFigureStage>;
  caption: string;
};

export type EditorialQuote = {
  text: string;
  attribution?: string;
};

export type EditorialReference = {
  kind: string;
  invitation: string;
  title: string;
  href: string;
};

export type EditorialChamberSpec = {
  volume: string;
  catalog: string;
  coverSrc: string;
  coverWidth?: number;
  coverHeight?: number;
  /** Optional override; falls back to project.introduction */
  introduction?: string;
  inquiry: string;
  passages: ReadonlyArray<EditorialPassage>;
  figure?: EditorialFigure;
  quote?: EditorialQuote;
  /** Large stacked silence lines */
  silence?: ReadonlyArray<string>;
  /** Quieter italic pause */
  pause?: string;
  methodNote?: { label?: string; body: string };
  fieldNote?: string;
  methodMargin?: EditorialMargin;
  catalogSlipLabel?: string;
  references: ReadonlyArray<EditorialReference>;
};
