# Atlas 2.0 — Phase 0 terminology + Phase 1 mapping (frozen)

**Status:** Phase 0 + Phase 1 **canon frozen** (2026-09-16). Phase 2 **implemented** on branch (typed layer + Trail copy + Both whispers). Theme redirects and Phase 3 deferred.  
**Branch:** `cursor/atlas-2-0-phase-0-canon-e793`.  
**Still out of scope:** theme redirects, Strand/`ConnectionKind` migration, co-occurrence, Shelves belonging, larger Atlas redesign.

---

## Non-goals (this document / Phase 2)

- Do not replace Void → journey with a four-type dashboard.
- Do not delete legacy data.
- Do not create theme redirects or rename routes.
- Do not invent relationships the corpus does not already support.
- Do not begin Phase 3 (co-occurrence, Shelves belonging, Strand migration, larger redesign).

---

## Canonical model (four types)

Atlas’s distinctive role: **reveal relationships among these four types** without inventing unsupported bonds.

| Type | Definition | Canonical public sources today |
|---|---|---|
| **Territory** | A **region/domain** of the terrain — large-scale geography | Five **Root Territories** in `lib/atlas/architecture.ts` |
| **Thread** | A **recurring pattern** that can be followed **across** territories | Ten essay/content Threads in `lib/threads/vocabulary.ts` + `/threads/{id}` |
| **Artifact** | Concrete work / evidence | Maps (books), chambers, essays, field notes, quotations, plates; Atlas V1 evidence excerpts with provenance |
| **Investigation** | Active question / inquiry | Void / Atlas V1 living questions; Observatory forming work; Shelves ongoing writing |

### Territory ≠ Thread (required distinction)

- **Territory** = where inquiry sits in the terrain (a region/domain).
- **Thread** = a pattern that recurs and can be followed across territories.
- Do **not** infer that every major-concept or Territory requires a corresponding Thread.
- Refused collapses remain refused (see § Explicit non-mappings).

### Preservation invariants

Preserve all of the following through any later migration:

- Authored Atlas V1 **journeys**, evidence packs, unfinished hints, and branches
- **Canonical bonds** (`lib/canonical/*`) and provenance rules
- **Map plates**, chambers, series catalog, supersession aliases
- Essay Thread assignments (`data/publications/essay-threads.json`)
- Backward-compatible **URLs and redirects** (see § URL freeze)

---

## Terminology freeze

| Term | Frozen meaning |
|---|---|
| **Thread** | Essay/content Thread only (`lib/threads`, `/threads/*`) |
| **Trail** | Atlas visitor/session path (`lib/atlas-v1/living-thread.ts` semantics; code names may lag) |
| **Strand** | Connection relationship formerly `ConnectionKind: "thread"` |
| **Pathway** | Observatory pathway only |

### Related terms that stay (not Thread)

| Term | Meaning |
|---|---|
| **Path** | Progression within a living question / journey (authored) |
| **Branch** | Authored lateral opening between journeys (`lib/atlas/branches.ts`) |
| **Bond / relation** | Trusted canonical link (`lib/canonical`) |
| **Map / plate / chamber** | Artifact forms for completed or charted investigations |
| **Continent** (legacy) | Internal nickname for `major-concept` themes — not visitor canon for Atlas 2.0 geography |

Code identifiers may keep old names until an approved rename pass (`LIVING_THREAD_KEY`, `ConnectionKind "thread"`, etc.). Semantics are frozen first; visitor copy that says “Follow the Thread” for Strand edges should later become non-Thread language — UI deferred to Phase 2+.

---

## Canonical Territories

Source: `ROOT_TERRITORIES` in `lib/atlas/architecture.ts`.

| ID | Label | Depth | Whisper (working) |
|---|---|---|---|
| `r1-living-systems` | Living systems | deep | Body, feedback, adaptation, becoming as organism. |
| `r2-reality-structure` | Reality / structure | deep | What must already be in place for anything to appear as real. |
| `r3-participation` | Participation | forming | Relationship, agency, technology, culture — how we take part. |
| `r4-meaning-orientation` | Meaning / orientation | thin | Language, symbol, spirituality — still gathering as Atlas. |
| `r5-time-emergence` | Time / emergence | forming | Cycles, becoming over time, what forms before a phase turns. |

Living-question placements under roots (`QUESTION_PLACEMENTS`) remain authored truth for journey doors.

---

## Canonical Threads

Source: `THREADS` / `THREAD_IDS` in `lib/threads/vocabulary.ts`. Routes: `/threads/{id}`.

| ID | Label |
|---|---|
| `boundary` | Boundary |
| `intelligence` | Intelligence |
| `relationship` | Relationship |
| `logos` | Logos |
| `participation` | Participation |
| `constraint` | Constraint |
| `consciousness` | Consciousness |
| `translation` | Translation |
| `feedback` | Feedback |
| `technology` | Technology |

No new Thread IDs frozen here. Soft affinities noted elsewhere are **not** Thread membership.

---

## Phase 1 frozen — Atlas V1 concept → Territory / Thread

Source: `AtlasV1ConceptId` in `lib/atlas-v1/content.ts` (10).

| Atlas V1 concept | Name | Territory | Thread | Classification |
|---|---|---|---|---|
| `body` | The Body | **Primary:** `r1-living-systems` | — | Territory only |
| `relationship` | Relationship | **Primary:** `r3-participation` | `relationship` | Both |
| `feedback` | Feedback | **Primary:** `r1-living-systems` | `feedback` | Both |
| `technology` | Technology | **Primary:** `r3-participation` | `technology` | Both |
| `adaptation` | Adaptation | **Primary:** `r1-living-systems`; **Secondary:** `r5-time-emergence` | — | Territory only (dual root) |
| `constraint` | Constraint | **Primary:** `r2-reality-structure` | `constraint` | Both |
| `participation` | Participation | **Primary:** `r3-participation`; **Secondary:** `r1-living-systems` | `participation` | Both (dual root) |
| `time` | Time | **Primary:** `r5-time-emergence` | — | Territory only |
| `meaning` | Meaning | **Primary:** `r4-meaning-orientation` | — | Territory only |
| `reality` | Reality | **Primary:** `r2-reality-structure` | — | Territory only |

### Summary

| Outcome | Concepts |
|---|---|
| Both Territory + Thread | `relationship`, `feedback`, `technology`, `constraint`, `participation` (5) |
| Territory only | `body`, `adaptation`, `time`, `meaning`, `reality` (5) |
| Thread only | — (none) |
| Neither | — (none; every V1 concept already sits on a Root Territory) |

### Explicit non-mappings (frozen refusals)

| Concept | Tempting collapse | Why refused |
|---|---|---|
| `body` → Thread `boundary` | Shared edge/embodiment language | Body is site/organism; Boundary is regulatory exchange across the corpus |
| `adaptation` → Thread `feedback` | Loop / change language | Adaptation is becoming under pressure; Feedback is return signal |
| `meaning` → Thread `logos` | Sense / pattern | Meaning-as-orientation ≠ Logos-as-speakable order |
| `meaning` → Thread `translation` | Significance moving | Translation is map-to-map carriage; Meaning is the thin root’s subject |
| `time` → any Thread | None fit | Keep as Territory concept only |
| `reality` → Thread `constraint` | Structure / limit | Reality is the ground; Constraint is one architecture within it |

---

## Phase 1 frozen — major-concept (`th-*`) × Thread

Registry entries in `lib/atlas/data.ts`. Routes today: `/themes/{slug}`. **No redirects or renames until a later approved pass.**

| Entry | Slug | Disposition |
|---|---|---|
| `th-relationship` | `relationship` | **Alias** → Thread `relationship` (keep entry ID for legacy graph) |
| `th-consciousness` | `consciousness` | **Alias** → Thread `consciousness` (keep entry ID) |
| `th-reality` | `reality` | **Remain distinct** |
| `th-meaning` | `meaning` | **Remain distinct** |
| `th-identity` | `identity` | **Remain distinct** |
| `th-language` | `language` | **Remain distinct** |
| `th-freedom` | `freedom` | **Remain distinct** |
| `th-embodiment` | `embodiment` | **Remain distinct** |
| `th-information` | `information` | **Remain distinct** |
| `th-time` | `time` | **Remain distinct** |
| `th-perception` | `perception` | **Remain distinct** (child concept) |
| `th-structure` | `structure` | **Remain distinct** (child concept) |

**No retirements.** Alias entries stay in the registry.

---

## Artifact & Investigation (named, not migrated)

| Type | Includes (existing) | Atlas relationship role |
|---|---|---|
| **Artifact** | `book` maps (`/atlas/[slug]`), chambers (`/chambers/[slug]`), essays, field notes, quotations, Atlas V1 evidence + `ATLAS_V1_SOURCE` / canonical `SOURCED_FROM` | Concrete evidence nodes; never invent links between them |
| **Investigation** | Void questions (`VOID_QUESTIONS` / `QUESTION_PLACEMENTS`), Observatory forming work, Shelves ongoing inquiry | Active doors; journeys remain authored |

Registry questions `q1`–`q4` remain data; visitor routes already resolve/redirect to `/atlas`.

---

## URL & redirect freeze (preserve)

| URL pattern | Current behavior | Freeze |
|---|---|---|
| `/atlas` | Live atlas-v1 entrance | Keep |
| `/atlas/[slug]` | Map plate | Keep |
| `/atlas/charts` | Charts finding aid | Keep |
| `/chambers/[slug]` | Territory interior | Keep |
| `/themes/[slug]` | major-concept / concept pages | Keep (alias UX later, not now) |
| `/threads/[id]` | Canonical Threads | Keep — sole Thread URLs |
| `/library`, `/library/[slug]` | Soft redirect → atlas | Keep |
| `/questions`, `/questions/:slug` | Permanent → `/atlas` | Keep |
| `/atlas-map` | → `/atlas` | Keep |
| `/atlas-v1` | → `/atlas` | Keep |
| `/observatory/threads/:slug` | → `/observatory` | Keep |
| Essay / field-note / observatory observation routes | Unchanged | Keep |

sessionStorage key `lt-atlas-living-thread` may keep its string until an explicit rename pass; semantics = **Trail**.

---

## Layers (reference)

```
Territory (5 roots) ── architecture.ts
Thread (10 essay)   ── vocabulary.ts + essay-threads.json
Artifact            ── maps, chambers, essays, plates, evidence
Investigation       ── Void questions, Observatory, Shelves inquiry

/atlas UI today     ── atlas-v1 + Void + canonical bonds + Trail overlay
lib/atlas registry  ── content + LEGACY connections (Strand edges)
```

Essay Threads do **not** feed Atlas journeys today (`toEssay` clears `threadIds` before merge). Phase 1 mapping records geography/identity only; it does not require wiring Threads into journeys.

---

## Phase boundaries

| Phase | Scope | Status |
|---|---|---|
| **0** | Terminology freeze; four-type model; eliminate Thread ambiguity | **Frozen** |
| **1** | Concept ↔ Territory/Thread tables; major-concept aliases | **Frozen** (this document) |
| **2** | Typed relationship layer; Trail copy; authored Both-mapping whispers at journey stops. No theme redirects; Void→journey preserved | **Implemented** (this branch) |
| Later | Theme→Thread alias redirects; Strand renames; Thread co-occurrence; Shelves belonging; larger Atlas redesign | Not started |

---

## Approval record

Frozen 2026-09-16 by Chelsea:

1. Terminology: Thread / Trail / Strand / Pathway as above.
2. Territory-only V1: `body`, `adaptation`, `time`, `meaning`, `reality`.
3. Both mappings: `relationship`, `feedback`, `technology`, `constraint`, `participation`.
4. Aliases: `th-relationship` → `relationship`; `th-consciousness` → `consciousness`.
5. All other listed major-concepts remain distinct; no retirements.
6. Dual-root primaries: `participation` → r3 primary / r1 secondary; `adaptation` → r1 primary / r5 secondary.
7. Territory = region/domain; Thread = recurring pattern across territories; no forced Thread for every Territory or major-concept.

### Phase 2 implementation record

Approved with theme redirects deferred. Delivered on this branch:

- Typed layer: `lib/atlas/model.ts` (+ `npm run verify:atlas-model`)
- Visitor Trail copy on the session overlay; storage keys unchanged
- Authored whispers at journey stops for Both mappings only (`AtlasThreadWhisper`)
- Void → journey preserved; no four-type dashboard; no theme redirects
