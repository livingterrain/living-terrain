/**
 * NON-RENDERED — human review only.
 * Do not import into Observatory UI.
 *
 * Audit trail of material removed from the live Observatory.
 * “Exists in the repository / Atlas corpus” is not sufficient provenance.
 */

export const UNVERIFIED_OBSERVATORY_REVIEW = [
  {
    id: "obs-creek-light",
    classification: "UNCERTAIN — Atlas corpus only; Chelsea does not recognize",
    sourceHint: "fn1 Light on Water — atlas field note",
    renderedBodyWas:
      "The creek catches afternoon sun in fragments. Each fragment is complete — a small world — and gone before you can name it.\n\nPerception as mosaic, not photograph.",
    reason:
      "Removed 2026-08-11. Presence in earlier AI-assisted Atlas corpus is not authentication. Reads as synthetic poetic field-note material.",
  },
  {
    id: "obs-threshold",
    classification: "UNCERTAIN — Atlas corpus only; Chelsea does not recognize",
    sourceHint: "fn3 Threshold — atlas field note",
    renderedBodyWas:
      "Doorways matter. The pause on the threshold — neither inside nor out — is its own geography.",
    reason:
      "Removed 2026-08-11. Presence in earlier AI-assisted Atlas corpus is not authentication.",
  },
  {
    id: "obs-after-reading",
    classification: "UNCERTAIN — Atlas corpus only; Chelsea does not recognize",
    sourceHint: "fn4 After Reading — atlas field note",
    renderedBodyWas:
      "Finished a chapter. Closed the book. The room looked slightly different — as if the words had adjusted the light.",
    reason:
      "Removed 2026-08-11. Presence in earlier AI-assisted Atlas corpus is not authentication.",
  },
  {
    id: "obs-familiar-path",
    classification: "UNCERTAIN — Atlas corpus only; Chelsea does not recognize",
    sourceHint: "fn5 Familiar Path — atlas field note",
    renderedBodyWas:
      "Walked the same path for the hundredth time. Noticed, for the first time, a stone that must have been there always.",
    reason:
      "Removed 2026-08-11. Presence in earlier AI-assisted Atlas corpus is not authentication.",
  },
  {
    id: "obs-creek-light-paraphrase",
    classification: "GENERATED paraphrase",
    sourceHint: "fn1 — earlier Observatory rewrite",
    renderedBodyWas:
      "Creek.\nSun in pieces on the water.\nEach one complete.\nGone before I could name it.\n\nI was seeing in fragments.\nNot one picture.",
    reason: "AI-rewritten notebook voice; not Chelsea’s wording.",
  },
  {
    id: "obs-threshold-paraphrase",
    classification: "GENERATED paraphrase",
    sourceHint: "fn3 — earlier Observatory rewrite",
    renderedBodyWas:
      "Doorway.\nNeither in nor out.\n\nThat pause is a place.\nDidn’t have that before.",
    reason: "AI paraphrase; invented closing line.",
  },
  {
    id: "obs-after-reading-paraphrase",
    classification: "GENERATED paraphrase",
    sourceHint: "fn4 — earlier Observatory rewrite",
    renderedBodyWas:
      "Finished the chapter.\nClosed the book.\n\nRoom looked different.\nSame room.",
    reason: "AI-compressed paraphrase.",
  },
  {
    id: "obs-familiar-path-paraphrase",
    classification: "GENERATED paraphrase",
    sourceHint: "fn5 — earlier Observatory rewrite",
    renderedBodyWas:
      "Same path. Hundredth time.\n\nStone I never saw.\nMust have always been there.\n\nWhat else am I walking past.",
    reason: "AI paraphrase; closing question not in source.",
  },
  {
    id: "obs-heart-rhythm",
    classification: "GENERATED paraphrase of grounded source",
    sourceHint: "e1 Constraint essay body",
    renderedBodyWas:
      "Heart doesn’t wait for the brain to beat.\nHas its own cells for that.\n\nI kept assuming something had to be in charge.\nThat assumption just broke.",
    reason:
      "AI-summarized. Live feed keeps exact essay sentences instead (obs-heart-authority).",
  },
  {
    id: "obs-waiting-room",
    classification: "UNCERTAIN — Atlas corpus only",
    sourceHint: "fn2 Waiting Room — atlas field note",
    reason: "Removed earlier; not restored. Same corpus-only provenance issue.",
  },
] as const;
