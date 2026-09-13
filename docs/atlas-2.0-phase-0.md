# Atlas 2.0 — Phase 0 terminology + Phase 1 mapping (proposal)

**Status:** Working canon for internal architecture. **Not implemented in visitor UI.**  
**Branch:** `cursor/atlas-2.0-phase-0-canon-e793` (docs/canon only).  
**Approval gate:** Mapping tables below are proposals until Chelsea approves. No data migrations, redirects, route renames, or `/atlas` redesign in this phase.

---

## Non-goals (this document)

- Do not redesign `/atlas`.
- Do not delete legacy data.
- Do not create redirects or rename routes.
- Do not implement Phase 2 (relationship surface / connective UI).
- Do not invent relationships the corpus does not already support.

---

## Working canonical model (four types)

Atlas’s distinctive role: **reveal relationships among these four types** without inventing unsupported bonds.

| Type | Definition | Canonical public sources today |
|---|---|---|
| **Territory** | Large-scale geography of the work | Five **Root Territories** in `lib/atlas/architecture.ts` |
| **Thread** | Recurring conceptual path across the work | Ten essay Threads in `lib/threads/vocabulary.ts` + `/threads/{id}` |
| **Artifact** | Concrete work / evidence | Maps (books), chambers, essays, field notes, quotations, plates; Atlas V1 evidence excerpts with provenance |
| **Investigation** | Active question / inquiry | Void / Atlas V1 living questions; Observatory forming work; Shelves ongoing writing |

### Preservation invariants

Preserve all of the following through any later migration:

- Authored Atlas V1 **journeys**, evidence packs, unfinished hints, and branches
- **Canonical bonds** (`lib/canonical/*`) and provenance rules
- **Map plates**, chambers, series catalog, supersession aliases
- Essay Thread assignments (`data/publications/essay-threads.json`)
- Backward-compatible **URLs and redirects** (see § URL freeze)

---

## Terminology freeze — eliminate four meanings of “Thread”

**Public / canonical meaning of Thread:** only the ten essay Threads.

| Current overloaded term | Proposed replacement | Scope | Notes |
|---|---|---|---|
| Essay Threads (`lib/threads`, `/threads/*`) | **Thread** (unchanged) | Public + canon | Sole canonical use of the word Thread |
| Atlas Living Thread / session path (`lib/atlas-v1/living-thread.ts`, UI overlay) | **Trail** (internal: Living Trail / session trail) | Atlas session attention | sessionStorage trail of intentional stops; does not invent relations |
| `ConnectionKind: "thread"` (legacy atlas graph) | **Strand** (internal edge kind) | Legacy registry edges | Curated “why this touches that” edge; not a Thread entity. Visitor copy that says “Follow the Thread” should later become non-Thread language (e.g. “This also touches…”) — UI change deferred |
| Observatory pathway “threads” / `kind: "thread"` events | **Pathway** (investigation pathway) | Observatory | Predetermined investigation sequences; routes already redirect to `/observatory` |

### Related terms that stay (not Thread)

| Term | Meaning |
|---|---|
| **Path** | Progression within a living question / journey (authored) |
| **Branch** | Authored lateral opening between journeys (`lib/atlas/branches.ts`) |
| **Bond / relation** | Trusted canonical link (`lib/canonical`) |
| **Map / plate / chamber** | Artifact forms for completed or charted investigations |
| **Continent** (legacy) | Internal nickname for `major-concept` themes — not visitor canon for Atlas 2.0 geography |

Code identifiers may keep old names until an approved rename pass (`LIVING_THREAD_KEY`, `ConnectionKind "thread"`, etc.). This document freezes **semantic** names first.

---

## Canonical Territories (unchanged)

Source: `ROOT_TERRITORIES` in `lib/atlas/architecture.ts`.

| ID | Label | Depth | Whisper (working) |
|---|---|---|---|
| `r1-living-systems` | Living systems | deep | Body, feedback, adaptation, becoming as organism. |
| `r2-reality-structure` | Reality / structure | deep | What must already be in place for anything to appear as real. |
| `r3-participation` | Participation | forming | Relationship, agency, technology, culture — how we take part. |
| `r4-meaning-orientation` | Meaning / orientation | thin | Language, symbol, spirituality — still gathering as Atlas. |
| `r5-time-emergence` | Time / emergence | forming | Cycles, becoming over time, what forms before a phase turns. |

Living-question placements under roots (`QUESTION_PLACEMENTS`) remain authored truth for journey doors. Phase 0 does not relocate questions.

---

## Canonical Threads (unchanged)

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

No new Thread IDs in Phase 0–1. Affinities noted below are **not** Thread membership.

---

## Phase 1 — Atlas V1 concept → Territory / Thread mapping (proposal)

Source concepts: `AtlasV1ConceptId` in `lib/atlas-v1/content.ts` (10).  
Territory membership today is already listed on roots in `architecture.ts`. Phase 1 **records** that geography and proposes Thread mapping without forcing distortion.

Legend:

- **Territory:** primary / secondary from existing `conceptIds` lists
- **Thread:** exact ID match only for “maps to Thread”; affinities are informational
- **both** = has Territory placement **and** maps to a canonical Thread
- **neither (Thread)** = no Thread mapping (Territory may still apply)

| Atlas V1 concept | Name | Territory (existing) | Thread mapping | Classification | Rationale |
|---|---|---|---|---|---|
| `body` | The Body | **Primary:** `r1-living-systems` | **Neither** | Territory only | Embodied living-systems geography; no essay Thread named body. Soft affinity only: `boundary`, `feedback` — do not force |
| `relationship` | Relationship | **Primary:** `r3-participation` | **`relationship`** | **Both** | Exact Thread ID + root membership |
| `feedback` | Feedback | **Primary:** `r1-living-systems` | **`feedback`** | **Both** | Exact Thread ID + root membership |
| `technology` | Technology | **Primary:** `r3-participation` | **`technology`** | **Both** | Exact Thread ID + root membership |
| `adaptation` | Adaptation | **Primary:** `r1-living-systems`; **Secondary:** `r5-time-emergence` | **Neither** | Territory only (dual root) | Authored on two roots; no Thread. Affinity to `feedback` / living process — do not collapse |
| `constraint` | Constraint | **Primary:** `r2-reality-structure` | **`constraint`** | **Both** | Exact Thread ID + root membership |
| `participation` | Participation | **Primary:** `r3-participation`; **Secondary:** `r1-living-systems` | **`participation`** | **Both** (dual root) | Exact Thread ID; dual root already authored. Primary = r3 (territory named Participation) |
| `time` | Time | **Primary:** `r5-time-emergence` | **Neither** | Territory only | Root geography of duration/emergence; no Thread `time`. Do not map to a Thread |
| `meaning` | Meaning | **Primary:** `r4-meaning-orientation` | **Neither** | Territory only | Thin root still gathering. Affinity to `logos` / `translation` — forcing either would distort |
| `reality` | Reality | **Primary:** `r2-reality-structure` | **Neither** | Territory only | Structural geography of the real; not a recurring Thread path |

### Summary counts (proposed)

| Outcome | Concepts |
|---|---|
| Both Territory + Thread | `relationship`, `feedback`, `technology`, `constraint`, `participation` (5) |
| Territory only | `body`, `adaptation`, `time`, `meaning`, `reality` (5) |
| Thread only | — (none) |
| Neither | — (none; every V1 concept already sits on a Root Territory) |

### Explicit non-mappings (do not invent)

| Concept | Tempting collapse | Why refused |
|---|---|---|
| `body` → Thread `boundary` | Shared edge/embodiment language | Body is site/organism; Boundary is regulatory exchange across the corpus |
| `adaptation` → Thread `feedback` | Loop / change language | Adaptation is becoming under pressure; Feedback is return signal |
| `meaning` → Thread `logos` | Sense / pattern | Meaning-as-orientation ≠ Logos-as-speakable order |
| `meaning` → Thread `translation` | Significance moving | Translation is map-to-map carriage; Meaning is the thin root’s subject |
| `time` → any Thread | None fit | Keep as Territory concept only |
| `reality` → Thread `constraint` | Structure / limit | Reality is the ground; Constraint is one architecture within it |

---

## Phase 1 — major-concept (`th-*`) × canonical Thread (proposal)

Registry “continents” in `lib/atlas/data.ts` (`type: "major-concept"` + two `concept` children).  
Routes today: `/themes/{slug}`. **Do not rename or redirect in this phase.**

| Entry | Slug | Overlap with Thread | Proposal | Notes |
|---|---|---|---|---|
| `th-relationship` | `relationship` | **Duplicate slug/name** with Thread `relationship` | **Become alias** of Thread `relationship` | Same public name; theme page should eventually defer to Thread identity (implementation later). Keep entry ID for legacy graph |
| `th-consciousness` | `consciousness` | **Duplicate slug/name** with Thread `consciousness` | **Become alias** of Thread `consciousness` | Same as above |
| `th-reality` | `reality` | None | **Remain distinct** | Aligns with Territory `r2` / V1 `reality`, not a Thread |
| `th-meaning` | `meaning` | Soft: `logos`, `translation` | **Remain distinct** | Aligns with thin Territory `r4`; not an alias |
| `th-identity` | `identity` | None | **Remain distinct** | No Thread; do not invent |
| `th-language` | `language` | Soft: `translation` | **Remain distinct** | Language-as-continent ≠ Translation Thread |
| `th-freedom` | `freedom` | Soft: `constraint` | **Remain distinct** | Freedom theme includes constraint but is not the Constraint Thread |
| `th-embodiment` | `embodiment` | Soft: V1 `body`; Thread `boundary` | **Remain distinct** | Do not alias to a Thread |
| `th-information` | `information` | Soft: `intelligence` | **Remain distinct** | Signal/structure ≠ Intelligence Thread |
| `th-time` | `time` | None (matches V1 `time` / `r5`) | **Remain distinct** | Territory-aligned theme, not Thread |
| `th-perception` | `perception` | Soft: consciousness | **Remain distinct** (child concept) | Keep under consciousness theme until a later theme pass |
| `th-structure` | `structure` | Soft: reality / constraint | **Remain distinct** (child concept) | Keep under reality theme |

### Retire?

**No retireals in Phase 0–1.** Alias candidates stay in the registry for graph/search compatibility. A later phase may hide theme pages that are pure Thread aliases behind quiet redirects — **only after approval**, preserving URLs via redirects.

---

## Artifact & Investigation (placement notes — not a migration)

These types are already present as content; Phase 0 names them in the four-type model.

| Type | Includes (existing) | Atlas relationship role |
|---|---|---|
| **Artifact** | `book` maps (`/atlas/[slug]`), chambers (`/chambers/[slug]`), essays, field notes, quotations, Atlas V1 evidence + `ATLAS_V1_SOURCE` / canonical `SOURCED_FROM` | Concrete evidence nodes; never invent links between them |
| **Investigation** | Void questions (`VOID_QUESTIONS` / `QUESTION_PLACEMENTS`), Observatory forming work, Shelves ongoing inquiry | Active doors; journeys remain authored |

Registry questions `q1`–`q4` remain data; visitor routes already resolve/redirect to `/atlas`. No change in this phase.

---

## URL & redirect freeze (preserve)

Do not alter in Phase 0–1. Documented for migration safety:

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

sessionStorage key `lt-atlas-living-thread` may keep its string until an explicit rename pass (optional later); semantics = **Trail**.

---

## Layers (reference — active vs legacy)

```
Territory (5 roots) ── architecture.ts
Thread (10 essay)   ── vocabulary.ts + essay-threads.json
Artifact            ── maps, chambers, essays, plates, evidence
Investigation       ── Void questions, Observatory, Shelves inquiry

/atlas UI today     ── atlas-v1 + Void + canonical bonds + Trail overlay
lib/atlas registry  ── content + LEGACY connections (Strand edges)
```

Essay Threads do **not** feed Atlas journeys today (`toEssay` clears `threadIds` before merge). Phase 1 mapping does not require wiring them into journeys; it only records where V1 concepts sit relative to Territories/Threads.

---

## Phase boundaries

| Phase | Scope | This document |
|---|---|---|
| **0** | Terminology freeze; four-type model; eliminate Thread ambiguity | **Done as proposal** |
| **1** | Concept ↔ Territory/Thread tables; major-concept alias proposals | **Tables above — awaiting approval** |
| **2** | Atlas room as relationship view among the four types | **Out of scope** |
| Later | Optional Trail rename in code; Strand edge rename; theme→Thread alias redirects; connective whispers that only use supported bonds | Not started |

---

## Review checklist (Chelsea)

Please confirm or correct:

1. Trail / Strand / Pathway terminology replacements.
2. Five V1 concepts as Territory-only (`body`, `adaptation`, `time`, `meaning`, `reality`).
3. Five V1 concepts as Both (exact Thread ID matches).
4. `th-relationship` and `th-consciousness` as **aliases** (not retire).
5. All other major-concepts **remain distinct**.
6. Dual-root primaries for `participation` (r3) and `adaptation` (r1).

Until approved: **no data migrations**, no UI changes, no merges required beyond reviewing this canon branch.
