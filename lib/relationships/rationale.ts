import type { ContentKind } from "../content/types";
import type { RelationshipEdge, ResolvedNode } from "./types";

const TYPE_LABELS: Record<ContentKind, string> = {
  question: "Question",
  essay: "Essay",
  book: "Volume",
  "book-chapter": "Chapter",
  "field-note": "Field note",
  quotation: "Voice",
  observation: "Observation",
  project: "Chamber",
  theme: "Concept",
  "timeline-event": "Milestone",
};

export function typeLabelForKind(kind: ContentKind): string {
  return TYPE_LABELS[kind] ?? "Idea";
}

export function strengthFromWeight(weight: number): "whisper" | "thread" | "woven" | "root" {
  if (weight >= 9) return "root";
  if (weight >= 7) return "woven";
  if (weight >= 5) return "thread";
  return "whisper";
}

function snippet(node: ResolvedNode, max = 72): string {
  const text = node.subtitle ?? node.excerpt ?? "";
  if (!text) return "";
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trim()}…`;
}

function lowerFirst(value: string): string {
  if (!value) return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
}

/**
 * Compose a contemplative rationale when none is authored on the edge.
 */
export function composeRationale(
  origin: ResolvedNode,
  target: ResolvedNode,
  edge: RelationshipEdge,
  direction: "incoming" | "outgoing",
): string {
  if (edge.rationale) return edge.rationale;

  const targetLine = snippet(target);
  const originLine = snippet(origin);

  switch (edge.kind) {
    case "theme":
      if (target.ref.kind === "theme") {
        return targetLine
          ? `extends into ${target.title} — ${lowerFirst(targetLine)}`
          : `extends into ${target.title}, where this inquiry gathers weight.`;
      }
      return `touches ${target.title} as part of the wider terrain.`;

    case "thread":
      if (direction === "incoming") {
        return originLine
          ? `arrives here from ${origin.title} — ${lowerFirst(originLine)}`
          : `arrives here along the same thread as ${origin.title}.`;
      }
      return targetLine
        ? `continues through ${target.title} — ${lowerFirst(targetLine)}`
        : `continues this question through ${target.title}.`;

    case "pathway":
      return targetLine
        ? `neighbors this inquiry — ${lowerFirst(targetLine)}`
        : `walks beside this inquiry toward ${target.title}.`;

    case "parent":
      return targetLine
        ? `rooted in ${target.title} — ${lowerFirst(targetLine)}`
        : `grows from ${target.title}.`;

    case "child":
      return targetLine
        ? `opens into ${target.title} — ${lowerFirst(targetLine)}`
        : `opens further into ${target.title}.`;

    case "echo":
      return `echoes elsewhere in ${target.title}, as if the same question were asked twice.`;

    case "volume":
      return targetLine
        ? `held in the archive of ${target.title} — ${lowerFirst(targetLine)}`
        : `belongs to the volume ${target.title}.`;

    case "observation":
      return targetLine
        ? `grounded in the field — ${lowerFirst(targetLine)}`
        : `grounded in a field observation near ${target.title}.`;

    case "quotation":
      return `carries a voice from ${target.title || "the margin"}.`;

    case "chamber":
      return targetLine
        ? `returns to the deep chamber — ${lowerFirst(targetLine)}`
        : `returns to the chamber where this inquiry began.`;

    default:
      return targetLine
        ? `connects to ${target.title} — ${lowerFirst(targetLine)}`
        : `connects to ${target.title}.`;
  }
}
