import type { SpiralTrajectory } from "../types";

/**
 * Jesus narrative — a textual / theological trajectory, not an empirical
 * mechanism. Directional, not cyclical: it does not return to its beginning.
 * Movements carry no glosses; none are matched to Spiral operations.
 * Relationships live in `../comparisons/jesus.ts`.
 */
export const JESUS_NARRATIVE_TRAJECTORY: SpiralTrajectory = {
  id: "jesus-narrative",
  lensId: "biblical-textual",
  title: "Jesus narrative",
  inPhrase: "the Jesus narrative",
  description:
    "A textual and theological narrative, not an empirical mechanism. It moves toward new creation rather than returning to its beginning.",
  shape: "directional",
  steps: [
    { id: "arrival", label: "Arrival" },
    { id: "calling", label: "Calling" },
    { id: "ministry", label: "Ministry" },
    { id: "opposition", label: "Opposition" },
    { id: "revelation", label: "Revelation" },
    { id: "way-to-jerusalem", label: "The Way to Jerusalem" },
    { id: "confrontation", label: "Confrontation" },
    { id: "betrayal", label: "Betrayal" },
    { id: "death", label: "Death" },
    { id: "burial-silence", label: "Burial / Silence" },
    { id: "resurrection", label: "Resurrection" },
    { id: "sending", label: "Sending" },
    { id: "spirit-community", label: "Spirit / Community" },
    { id: "new-creation", label: "New Creation" },
  ],
  framing:
    "These movements are read as narrative and theology. Most have no authored relationship with the Spiral; that absence is not a claim that none exists, and not a claim that one does.",
  comparisonBreaks: {
    title: "Direction, not cycle",
    body: "Christian eschatological language can be linear, culminative, and future-oriented in ways that resist a simple cyclical reading.\n\nPreserve that tension.",
  },
};
