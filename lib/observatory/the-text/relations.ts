/**
 * Evidence-bearing cross-passage relations for Instrument 01.
 *
 * Phase 2A scope (audit-authoritative):
 * - John 1:1–5 → Genesis 1:1–5 (textual)
 * - Genesis 1:1–5 ↔ Genesis 2:7 (contextual)
 *
 * Terrain / exploratory links do not belong here.
 * Do not add Gen1–Exod, Gen2–Exod, Gen2–John, or Exod–John evidence edges.
 */

import { makeClaim } from "./provenance";
import type {
  EvidenceClaim,
  EvidenceRelationType,
  PassageRelation,
  RelationConfidence,
} from "./types";
import { getPassageBySlug } from "./passages";
import type { Passage } from "./types";

export const EVIDENCE_RELATION_TYPE_LABEL: Record<EvidenceRelationType, string> =
  {
    textual: "Textual relation",
    linguistic: "Linguistic relation",
    contextual: "Contextual relation",
    interpretive: "Interpretive relation",
    conceptual: "Conceptual relation",
  };

export function relationConfidenceLabel(c: RelationConfidence): string {
  switch (c) {
    case "widely-recognized":
      return "Widely recognized";
    case "well-attested":
      return "Well attested";
    case "reasonable":
      return "Reasonable";
    case "disputed":
      return "Disputed";
    case "interpretive":
      return "Interpretive";
    case "research-continues":
      return "Research continues";
  }
}

/** Claims for WHY THIS? — reuse existing provenance / EvidenceInspect. */
export const RELATION_CLAIMS: Record<string, EvidenceClaim> = {
  "rel-claim-john-genesis-echo": makeClaim({
    id: "rel-claim-john-genesis-echo",
    text: "John’s opening strongly echoes Genesis’s language of beginning, creation, light, and darkness. The echo is literary and scriptural — not a claim that John reveals what Genesis secretly meant, and not lexical identity between Greek and Hebrew terms.",
    category: "literary-context",
    confidence: "widely-attested",
    sourceIds: ["nestle-1904", "john-1-1-5", "gen-1-1-5", "wlc"],
    verificationStatus: "verified",
    visitorNote:
      "Direction: John evokes Genesis. Reciprocal navigation (if offered) is later reuse / reception — not reverse textual dependence.",
  }),
  "rel-claim-genesis-john-reception": makeClaim({
    id: "rel-claim-genesis-john-reception",
    text: "The Gospel of John later reuses beginning / creation / life / light language in conversation with Genesis. This is reception / later literary reuse — not Hebrew lexical evidence, and not a claim that Genesis depends on John.",
    category: "interpretive-tradition",
    confidence: "widely-attested",
    sourceIds: ["john-1-1-5", "gen-1-1-5", "nestle-1904", "wlc"],
    verificationStatus: "verified",
    visitorNote:
      "Shown from Genesis as later reuse. The primary textual-echo claim remains John → Genesis.",
  }),
  "rel-claim-gen1-gen2-contextual": makeClaim({
    id: "rel-claim-gen1-gen2-contextual",
    text: "Genesis 1 and Genesis 2 present creation through different literary imagery and organization. Genesis 1 emphasizes ordered creation through divine speech; Genesis 2:7 focuses closely on the forming and animation of the human. This is a contextual / literary relationship — not a claim that Genesis 2 simply retells Genesis 1, explains its “real meaning,” or that the link is primarily lexical.",
    category: "literary-context",
    confidence: "widely-attested",
    sourceIds: ["wlc", "gen-1-1-5", "gen-2-7"],
    verificationStatus: "verified",
    visitorNote:
      "Reuses the cross-narrative contextual basis already verified in the Genesis 2:7 packet. Do not treat shared English themes as linguistic proof.",
  }),
};

/**
 * Authoritative Phase 2A evidence relations.
 * Empty pairs are intentional — do not fill for symmetry.
 */
export const PASSAGE_RELATIONS: readonly PassageRelation[] = [
  {
    id: "rel-john-1-1-5-genesis-1-1-5",
    sourceSlug: "john-1-1-5",
    targetSlug: "genesis-1-1-5",
    type: "textual",
    title: "Genesis 1:1–5",
    claim:
      "John’s opening strongly echoes Genesis’s language of beginning, creation, light, and darkness.",
    reverseClaim:
      "John 1 later reuses beginning / creation / life / light language in conversation with Genesis. This is reception / later literary reuse — not reverse textual dependence, and not Hebrew lexical evidence.",
    confidence: "widely-recognized",
    verificationStatus: "verified",
    symmetricNav: true,
    evidenceClaimIds: [
      "rel-claim-john-genesis-echo",
      "rel-claim-genesis-john-reception",
    ],
    sourceIds: ["nestle-1904", "john-1-1-5", "gen-1-1-5", "wlc"],
    relatedWordIds: [
      { passageSlug: "john-1-1-5", wordId: "arche" },
      { passageSlug: "john-1-1-5", wordId: "phos" },
      { passageSlug: "john-1-1-5", wordId: "skotia" },
      { passageSlug: "genesis-1-1-5", wordId: "bereshit" },
      { passageSlug: "genesis-1-1-5", wordId: "or" },
    ],
    relatedConceptIds: ["beginning", "creation", "light", "darkness"],
    status: "ready",
  },
  {
    id: "rel-genesis-1-1-5-genesis-2-7",
    sourceSlug: "genesis-1-1-5",
    targetSlug: "genesis-2-7",
    type: "contextual",
    title: "Genesis 2:7",
    claim:
      "Genesis 1 and Genesis 2 present creation through different literary imagery and organization. Genesis 1 emphasizes ordered creation through divine speech; Genesis 2:7 focuses closely on the forming and animation of the human.",
    confidence: "widely-recognized",
    verificationStatus: "verified",
    symmetricNav: true,
    evidenceClaimIds: ["rel-claim-gen1-gen2-contextual"],
    sourceIds: ["wlc", "gen-1-1-5", "gen-2-7"],
    relatedConceptIds: ["creation", "human", "speech"],
    status: "ready",
  },
];

export type ResolvedPassageRelation = {
  relation: PassageRelation;
  /** Passage currently being viewed. */
  fromSlug: string;
  /** Destination of Follow relation. */
  target: Passage;
  /** True when viewing from the relation’s sourceSlug. */
  fromSource: boolean;
  visitorClaim: string;
  kindLabel: string;
  inspectClaim: EvidenceClaim;
};

function inspectClaimForView(
  relation: PassageRelation,
  fromSource: boolean,
): EvidenceClaim {
  const preferredId = fromSource
    ? relation.evidenceClaimIds?.[0]
    : (relation.evidenceClaimIds?.[1] ?? relation.evidenceClaimIds?.[0]);
  if (preferredId && RELATION_CLAIMS[preferredId]) {
    return RELATION_CLAIMS[preferredId]!;
  }
  return makeClaim({
    id: `${relation.id}-inspect`,
    text: fromSource
      ? relation.claim
      : (relation.reverseClaim ?? relation.claim),
    category: "literary-context",
    confidence: "widely-attested",
    sourceIds: relation.sourceIds ?? [],
    verificationStatus: relation.verificationStatus,
  });
}

/**
 * Ready evidence relations visible from a passage — before the Terrain boundary.
 * Includes reverse views when symmetricNav is set.
 */
export function getEvidenceRelationsForPassage(
  passageSlug: string,
): ResolvedPassageRelation[] {
  const out: ResolvedPassageRelation[] = [];

  for (const relation of PASSAGE_RELATIONS) {
    if (relation.status !== "ready") continue;

    const asSource = relation.sourceSlug === passageSlug;
    const asTarget =
      relation.symmetricNav === true && relation.targetSlug === passageSlug;

    if (!asSource && !asTarget) continue;

    const destinationSlug = asSource
      ? relation.targetSlug
      : relation.sourceSlug;
    const target = getPassageBySlug(destinationSlug);
    if (!target || target.status === "forming") continue;

    const fromSource = asSource;
    const visitorClaim = fromSource
      ? relation.claim
      : (relation.reverseClaim ?? relation.claim);
    const kindLabel =
      !fromSource && relation.reverseClaim
        ? "Later reuse"
        : EVIDENCE_RELATION_TYPE_LABEL[relation.type];

    out.push({
      relation,
      fromSlug: passageSlug,
      target,
      fromSource,
      visitorClaim,
      kindLabel,
      inspectClaim: inspectClaimForView(relation, fromSource),
    });
  }

  // Prefer directed-from-this-passage claims before reverse/later-reuse views.
  out.sort((a, b) => Number(b.fromSource) - Number(a.fromSource));

  return out;
}
