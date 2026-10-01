# Atlas 2.0 — Phase 0 terminology + Phase 1 mapping (frozen)

**Status:** Phase 0 + Phase 1 **canon frozen** (2026-09-16). Phase 2 **complete** (2026-09-22). Phase 3 **Thread co-occurrence complete** (2026-09-22). Phase 3 **essay archive Thread belonging complete** (2026-09-22). Phase 3 **Theme→Thread continuation links complete** (2026-09-22). Phase 3 **Strand visitor terminology complete** (2026-09-22). Phase 3 **Theme redirect policy decided** (2026-09-22) — keep all `/themes/*` active; no automatic redirects. Phase 3 **Atlas journey-return v1 complete** (2026-09-22). Phase 3 **journey evidence diversification A+D complete** (2026-09-22). Phase 3 **Meaning territory living question complete** (2026-09-22).  
**Branch:** `cursor/atlas-2-0-phase-0-canon-e793`.  
**Still out of scope (remaining Phase 3 / later):** `ConnectionKind` identifier rename, further Shelves belonging surfaces, larger Atlas redesign.

---

## Non-goals (this document / Phase 2)

- Do not replace Void → journey with a four-type dashboard.
- Do not delete legacy data.
- Do not create theme redirects or rename routes.
- Do not invent relationships the corpus does not already support.
- Do not begin remaining Phase 3 items (further Shelves belonging, `ConnectionKind` identifier rename, larger redesign) without approval.
- Do not introduce automatic `/themes/*` → `/threads/*` redirects (policy decided 2026-09-22).

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

Code identifiers may keep old names until an approved rename pass (`LIVING_THREAD_KEY`, `ConnectionKind "thread"`, etc.). Semantics are frozen first. **Visitor Strand terminology** for graph edges is complete (2026-09-22); identifier/`ConnectionKind` rename remains deferred.

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
| `/themes/[slug]` | major-concept / concept pages (immersive realms where applicable) | **Keep active** — no automatic redirects to `/threads/*` (policy 2026-09-22) |
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
| **2** | Typed relationship layer; Trail copy; authored Both-mapping whispers at journey stops. No theme redirects; Void→journey preserved | **Complete** (2026-09-22; visual review PASS) |
| **3** / Later | Theme→Thread navigation; Strand terminology; Thread co-occurrence; Shelves belonging; journey-return; evidence diversification; Meaning living question; larger Atlas redesign | **Thread co-occurrence** + **essay archive belonging** + **Theme→Thread continuation** + **Strand visitor terminology** + **Theme redirect policy** + **journey-return v1** + **journey evidence diversification A+D** + **Meaning territory living question** complete/decided (2026-09-22). Remaining build items require approval; do not begin without Chelsea |

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

Approved with theme redirects deferred. Delivered on this branch (`8fb9602` and docs finalize):

- Typed layer: `lib/atlas/model.ts` (+ `npm run verify:atlas-model`)
- Visitor Trail copy on the session overlay; storage keys unchanged
- Authored whispers at journey stops for Both mappings only (`AtlasThreadWhisper`)
- Void → journey preserved; no four-type dashboard; no theme redirects

**Visual review (2026-09-22):** Both-stop before/after relations; Thread whisper timing; Thread link → `/threads/*`; Trail overlay + session history; journey end; mobile 390×844 — all **PASS**.

### Phase 3 — Thread co-occurrence (complete 2026-09-22)

Approved after Phase 2. Delivered on this branch (`09d86d1` feature; `5fdfd6b` CSS extraction after visual review):

- Quiet co-membership whispers on `/threads/[id]` from `essay-threads.json` only (`lib/threads/co-occurrence.ts`, `ThreadCoOccurrence`)
- Ranking: shared essay count, then label; at most three neighbors; no invented bonds
- Styles live in `components/reading/thread-shelf.css` (outside the giant `@layer utilities` sheet — live LINK CSSOM had been dropping those selectors)
- `npm run verify:threads` covers co-occurrence invariants

**Visual review (2026-09-22):** serif typography; 44px touch targets; `:focus-visible` underline; spacing; desktop + mobile 390 — all **PASS**.

### Phase 3 — Essay archive Thread belonging (complete 2026-09-22)

Approved after Thread co-occurrence. Delivered on this branch (`EssaysArchive` + `thread-shelf.css` archive rules):

- Quiet Thread labels on `/essays` archive rows only, from `getThreadRefs` / `essay-threads.json`
- Links to `/threads/[id]`; unmapped essays show nothing; foyer, essay-page belonging, order/nav/topics preserved
- Nested links avoided (Thread list outside the essay `<Link>`); 44px targets; negative bottom margin for rhythm only
- Styles in `components/reading/thread-shelf.css` (same unlayered sheet as co-occurrence)

**Pre-commit QA (2026-09-22):** real keyboard Tab → Intelligence Thread received `:focus-visible` (underline + forest); negative margin left ~39px gap before next essay — no overlapping click targets — **PASS**.

### Phase 3 — Theme→Thread continuation links (complete 2026-09-22)

Approved after essay archive belonging. **Contextual links only — no automatic redirects.** Theme URLs, canonical metadata, and immersive realm content preserved.

- Exact Phase 1 aliases only: `/themes/relationship` → `/threads/relationship`, `/themes/consciousness` → `/threads/consciousness`
- Quiet line in `RealmShell` title block (both aliases are immersive realms): “This pattern also continues as {Thread}”
- Alias map: `lib/threads/theme-aliases.ts`; UI: `ThemeThreadContinuation`; styles in `thread-shelf.css`
- Other ten Themes unchanged (component returns null); Theme page fallback also wired for hub-miss path
- `npm run verify:threads` asserts the two aliases and non-matches

**Pre-commit QA (2026-09-22):** desktop + mobile navigation to correct Thread pages; Tab `:focus-visible` underline; 44px touch targets; continuation below metaphor / clear of title; Attachment graph click still on Theme; ten control Themes have no continuation — **PASS**.

### Phase 3 — Strand visitor terminology (complete 2026-09-22)

Approved terminology-only pass (Phase A + relevant Phase B CTAs). **No identifier / storage / CSS-class renames. No redirects.**

Approved phrases applied where copy meant graph/Strand edges (not essay Threads):

| From | To |
|---|---|
| Follow the Thread | Follow this strand |
| Follow this thread | Follow this strand |
| Trace this thread on the map | Trace this connection on the map |
| Threads alongside | Related strands |
| Along the same thread as | Connected with |

Surfaces: `Thread.tsx`, `FollowTheThread`, `ThreadTrace`, `ThreadExperience`, `ConnectionWeb`, relationship `phrases`/`rationale`, NotebookConcept CTA, ConceptualMap premise, chamber begin-copy + authored Strand rationales in `data.ts`; lantern `globals.css` aria-label selectors paired.

**Preserved:** essay Thread UI; Trail overlay; Pathway terminology; home “Follow this thread →” (links to `/threads/*`); poetic/newsletter language; inactive legacy ObservatoryHub Pathway CTAs; all `ConnectionKind` values and storage keys.

**Pre-commit QA (2026-09-22):** rendered `aside[aria-label="Follow this strand"]` matches CSS selectors; lantern heading/meta/focus-within colors apply; Theme + chamber accessible names + link destinations — **PASS**.

### Phase 3 — Theme redirect policy (decided 2026-09-22)

**Decision: no automatic redirects.** Themes and Threads remain parallel surfaces.

| Rule | Detail |
|---|---|
| Keep all 12 `/themes/*` routes active | Including immersive realm experiences |
| Preserve canonical metadata | `withCanonical(/themes/{slug})` unchanged |
| Retain continuation links | Relationship + Consciousness only → matching `/threads/*` |
| Do not soft-redirect | No `/themes/*` → `/threads/*` automatic redirects |
| Keep other ten Themes distinct | No invented Thread equivalents |
| Future reconsideration | Only if a Theme experience is **explicitly retired** |

This closes the open redirect-policy decision. Continuation links remain the approved navigation between the two exact slug overlaps.

### Phase 3 — Atlas journey-return v1 (complete 2026-09-22)

**Problem:** Following an authored Thread whisper leaves the Atlas journey. Trail (`lt-atlas-living-thread`) records attention only and cannot restore stop/reveal state. Remounting `/atlas` always booted Void.

**Contract:**
1. On Thread whisper activation only → write versioned short-lived `sessionStorage` snapshot (`lt-atlas-journey-return-v1`, TTL 2h).
2. Thread pages show **Return to the Atlas** only when the snapshot validates → `/atlas?resume=journey`.
3. Resume validates authored trail order (not merely known concept IDs), filters `essaysOpened` against the current essay corpus (stale IDs dropped, journey kept), forces `activeEssayId: null`, restores the same stop with relations revealed, no bond replay, no Trail re-append.
4. Bare `/atlas` without resume → Void. Snapshot key stays separate from Trail.

**Intentional limits (documented):**
- **Back-to-Void:** Browser Back without `?resume=journey` remounts Void; the snapshot is **preserved** so the Thread return link still works.
- **Strict Mode handshake (dev):** After stripping `?resume=`, a module handshake + `setTimeout(0)` covers synchronous React Strict Mode remount. A remount after that tick can miss handshake and Void on bare `/atlas` (development-only).

**Surfaces:** `lib/atlas-v1/journey-return.ts`, `AtlasV1`, `AtlasJourneyLayer` / `LivingBond` settled restore, `AtlasThreadWhisper` save, `AtlasJourneyReturn` + Thread page / `LanternReadingShell` `navBefore`.

**Tests:** `scripts/test-journey-return.ts` (authored path, TTL, stale/valid `essaysOpened`); browser regression for return-link visibility + history preservation.

### Phase 3 — Journey evidence diversification A+D (complete 2026-09-22)

**Problem:** Three living journeys reused one evidence pack at every stop, and several bond “why” lines restated the core reframe instead of turning the relationship.

**Editorial contract (approved):**
1. Keep existing questions, concept sequences, core reframes, and closing questions.
2. Distinct evidence per stop within each revised journey; cross-journey reuse allowed.
3. Bond copy must add a conceptual turn at every transition (not reframe echo).
4. On `relationships-difficult` at **reality**, *The Structure Beneath Reality* is offered as **further-reading** — optional philosophical orientation, not direct evidence for relational-truth claims. Visitor cue: “A wider reading”; evidence view states the distinction.
5. Do not expand Meaning territory, resolve `before-collapse`, or reconcile site questions in this pass.

**Revised journeys:**

| Journey | Evidence sequence | Notes |
|---|---|---|
| `technology-change` | `cost-of-image` → `before-tragedy` → `make-a-loop` | First bond broadened to attention → relation |
| `relationships-difficult` | `before-tragedy` → `constraint-freedom` → `structure-beneath` | Reality = further-reading |
| `inhabit-time` | `make-a-loop` → `looking-up` → `never-restriction` | As proposed |

**Surfaces:** `lib/atlas-v1/content.ts` (`evidenceRole`, bond/evidence maps); `AtlasJourneyLayer` further-reading cue + framing.

**Tests:** `scripts/test-atlas-journey-editorial.ts`; `npm run verify:atlas` / journey-return; desktop + mobile browser QA through closing questions.

**Publication:** Nine Atlas-linked Medium-only essays remain in the republication backlog. Atlas evidence packs treated as potentially abbreviated until compared with original full text. No republication in this pass.

### Phase 3 — Meaning territory living question (complete 2026-09-22)

**Problem:** Meaning had no living Void question; the territory opened without a first path into the survey.

**Editorial contract (approved):**
1. New question under Meaning / orientation: *When do our symbols stop helping us live?*
2. Path: **meaning → constraint → participation**.
3. Core reframe: *Symbols help us share a world — and can quietly replace contact with it.*
4. Closing: *Where am I still living inside a name instead of a life?*
5. Distinct evidence per stop; bond copy turns at each transition (not reframe echo).
6. Do not substitute *The Fragmentation of Attention* for Constraint evidence without a separate editorial pass (Constraint pack retained after Substack comparison).

**Journey:**

| Journey | Evidence sequence | Bonds |
|---|---|---|
| `symbols-stop-helping` | `looking-up` → `constraint-freedom` → `never-restriction` | Meaning→Constraint: distinctions that bound what we're willing to see; Constraint→Participation: leave the map and enter the territory |

**Surfaces:** `lib/atlas-v1/content.ts`, `lib/atlas-v1/questions.ts`, `lib/atlas/architecture.ts` (`QUESTION_PLACEMENTS`); Void count 7; authored bonds 16.

**Tests:** `scripts/test-atlas-journey-editorial.ts`; `verify-canonical` QUESTION=7; desktop + mobile browser QA (1280 / 390) through closing, evidence round-trip, Thread whisper restore, Trail uniqueness; regression on `technology-change` PASS.

### Phase 3 / Later (remaining — not approved to build)

Bundled deferred work. **Do not implement without explicit approval.**

| Item | Intent | Depends on |
|---|---|---|
| `ConnectionKind` / identifier Strand rename | Rename serialized `ConnectionKind: "thread"` → `"strand"` and related symbols | Visitor terminology complete; high-risk data migration — separate approval |
| Further Shelves belonging | Any belonging beyond `/essays` archive rows | Archive belonging complete; `/inquiry` foyer audit below — requires new scope approval |
| Larger Atlas redesign | Any four-type relationship surface beyond journey whispers; not a dashboard | Phase 0–2 canon; must preserve Void→journey, bonds, plates, chambers |

### Audit — `/inquiry` foyer Thread belonging (proposal only; not approved)

**Surface today:** `ShelvesFoyer` — three type doors (Books → `/books`, Essays → `/essays`, Visual Maps → `/visual-maps`). Essays door shows newest title/date only. No Thread list. Quiet Thread labels already live on `/essays` archive rows.

**Possible treatments considered (not built):**
1. Thread labels under the foyer’s newest-essay whisper  
2. A fourth “Threads” door on the foyer  
3. Thread chips beside the Essays signal  

**Recommendation: do not add Thread belonging to the foyer.** It would mostly duplicate the one-step-away `/essays` archive treatment and either nest links inside the Essays door or change the foyer from media-type orientation into pattern navigation. Discovery of Threads is already served by archive belonging, `/threads/*`, Theme continuation, and home “Currently Investigating.” Prefer leaving `/inquiry` as a quiet threshold into those rooms.

**Unresolved design decisions (gate remaining Phase 3):**

1. Whether to ever rename `ConnectionKind: "thread"` / storage keys / component names (visitor Strand copy is done; Theme redirects decided).
2. Further Shelves belonging: essay-page loudness only, or other Shelves lists — foyer Thread belonging **not recommended**.
3. Observatory Pathways: `/observatory/threads/*` still redirects to `/observatory` — restore Pathway destinations or leave collapsed?
4. Questions hubs: `/questions` → `/atlas` freeze — rebuild Investigation hubs or keep Void as sole living-question door?
5. Sequencing: further Shelves belonging (if any) vs identifier rename vs larger Atlas redesign next.

---

## Site cohesion program (release checkpoint 2026-09-28)

Numbered separately from the Atlas 2.0 phases above. "Cohesion Phase 1/2/3" refers to this program only.

### Cohesion Phase 1 — Identity + Substack (complete, approved)

Commits `eb27111`, `e6fd618`, `526caee`.

- **Identity:** Chelsea M. Thacker is the author; Living Terrain is the evolving body of work; chelseathacker.com is the durable home. Quiet byline on essay records, homepage author line, author metadata + Article / WebSite JSON-LD.
- **Substack named before subscription:** "Follow on Substack", "Subscribe on Substack", new-tab disclosure. `/join` titled "Follow Living Terrain on Substack".
- **Publication CTA:** verified Substack `/p/` post → Medium (earlier essays, stated as such) → other. Never falls back to the Substack homepage. SEO canonicals stay on chelseathacker.com.
- **Live stale terminology** replaced (archive / volume / constellation) where copy was reader-facing.
- **Indexing:** sitemap no longer lists `/questions*` or `/concepts*`; `/concepts/*` prototypes are `noindex, nofollow`. No routes deleted.

### Cohesion Phase 2 — Authored circulation (complete, approved)

Commits `9ae7ca1`, `ec4cbbb`, `cbb28f5`. Governing rule: **only expose relationships that have actually been authored.**

**Threads are the primary broad circulation layer.** They are the only authored layer with breadth (112 of 159 essays; every Thread holds 10–23 essays). Other authored essay-level relationships are sparse (8 evidence, 5 chamber, 2 explicit essay pairs). The legacy strand graph is mostly inferred and is not used for circulation; "Follow this strand" remains on full-body essays only.

**Essay record — "Where this sits"** (`lib/reading/essay-context.ts`, `EssayWhereThisSits`). Sits below the primary "Read the full essay on Substack/Medium" link and above subscription. Relationship-specific sentences, strongest first:

1. Atlas evidence — "Charted in the Atlas as evidence in *[living question]* — at [stop]." Open journeys only; per-question authored evidence (no concept-default fallback); route from canonical `SOURCED_FROM`.
2. Chamber — "Held within the chamber(s) of [chamber]." Explicit chamber links only, symmetric with chamber pages.
3. Threads — "Also belongs to [Threads]." From `essay-threads.json`.

Essays with no authored relationship show no section, no empty state, no exploration CTA — they end with subscription and "Return to the shelf". The generic "Continue exploring →" link to `/atlas` was removed from every essay.

**Essay context counts (159 essays at `cbb28f5`):**

| Context | Essays |
|---|---|
| Atlas evidence | 8 |
| Chamber | 5 |
| Thread | 112 (104 Thread-only) |
| No authored context | 46 |

One essay without a Thread (*You Have to Go Far Enough to Make a Loop*) still shows evidence + chamber. Substack posts added later by the automatic sync appear with no authored context until explicitly classified; that is intentional, not a gap to fill.

**Thread → Atlas** (`atlasBridgeForThread` in `lib/atlas/model.ts`, `ThreadAtlasBridge`). The frozen Both placement read in reverse: "This pattern is also charted in the Atlas — through [concept], within [Territory]." Link lands at the Atlas threshold (no deep link).

| Connected to Atlas (Both) | Charted through / within |
|---|---|
| relationship | Relationship / Participation |
| feedback | Feedback / Living systems |
| technology | Technology / Participation |
| constraint | Constraint / Reality / structure |
| participation | Participation / Participation + Living systems |

**Not connected (legitimately):** boundary, intelligence, logos, consciousness, translation — no Atlas section.

**Thread → Atlas does NOT place essays in Territories.** A Thread's Both mapping says where the *pattern* is charted. It does not mean every essay in that Thread belongs to that Territory, and no essay page infers Territory membership from its Threads. Only the 8 evidence essays name the Atlas, because each is authored evidence at a specific stop.

**Evidence → essay → journey return.** Following "Where this came from" from Atlas evidence saves the existing journey-return snapshot (`lt-atlas-journey-return-v1`) with an evidence-route origin; a snapshot records exactly one origin (Thread whisper or evidence essay). The essay record shows "Return to the Atlas" in its footer only when the visitor left through that essay's evidence → `/atlas?resume=journey` restores the same question, stop, and trail; the snapshot is consumed. Thread pages still accept any valid snapshot. Unrelated essays, fresh sessions, and Thread-whisper snapshots never show the return on essay records. Limits: restore always settles the stop with its bond revealed; book evidence sources (`/atlas/[slug]`) do not save a snapshot.

**Tests:** `npm run test:circulation`; `scripts/test-journey-return.ts`; browser QA 1280 / 390 PASS.

### Corpus model (Cohesion Phase 3A audit, 2026-09-29)

Three layers, named precisely. "Site registry" is retired as ambiguous.

| Layer | Source | Nature | Count (2026-09-29) |
|---|---|---|---|
| **Atlas essay records** | `lib/atlas` imports (e1–e120) + `lib/canonical` ESSAY objects | Hand-authored conceptual/editorial layer | 120 |
| **Publication registry** | `data/publications/substack-posts.json` | Generated Substack publication layer (sync bot on `main`) | 95 |
| **Rendered corpus** | `getAllEssays()` | Atlas records + registry posts not claimed by an Atlas record (by essay id or slug) | 169 = 120 + 49 |

- Every verified public Substack post (95 as of 2026-10-01; paid "FIELD NOTE" posts excluded) is in the registry and rendered. The 49 **registry-only** essays are not missing from the site; they have no Atlas or canonical record.
- Destinations: Substack 95 (46 Atlas records + 49 registry-only), Medium 120 (every Atlas record), Medium-only 74, neither 0.
- **Publication does not imply** a canonical relation, Atlas membership, an evidence role, a chamber role, or Territory membership. A registry-only essay renders with none of these until an explicit, approved editorial step authors them.
- **Thread assignments are locally authored editorial metadata** (`essay-threads.json`, keyed by rendered route slug). The sync never writes them; 30 registry-only essays carry authored Threads, 19 carry none.

**Field authority.** Publication metadata may follow Substack: external Substack URL, Substack post ID, cover image, and (for registry-only essays) title, date, excerpt. Locally authored metadata is never overwritten by publication sync: route slug (`essaySlug` / Atlas slug), essay id, Atlas titles/dates/excerpts, Medium URL, Thread assignments, evidence roles, chamber relationships, canonical relations. Differences between Atlas-authored and Substack publication metadata are reported (`npm run report:publication-drift`), never applied automatically.

### Cohesion Phase 3B — Publication data integrity (implemented 2026-09-29; pending review)

Data integrity only; no Atlas, Thread, canonical, or page changes.

- **Route identity is separate from publication identity.** A registered post's `essayId` and `essaySlug` never change; the sync updates the verified Substack URL, Substack slug, title, and cover while keeping prior URLs in `sourceUrls`. `assertRouteStability` (`lib/content-sync/post-identity.ts`) fails the sync if a registered post disappears, changes route slug, or changes Substack post ID.
- **Stable Substack post IDs.** All 95 registry records carry a post ID (13 RSS-created records backfilled by exact URL from the public archive; *The Shape a Relationship Makes Around Truth*, 2026-09-29, received post ID `217999790` from the sync itself; `npm run content:substack:backfill-post-ids`, dry run unless `--write`; evidence in `reports/substack-backfill/post-id-backfill.json`). The sync attaches post IDs to RSS items from the archive when an exact URL identifies one post, so a known post that changes both URL and title keeps its identity. If the archive is unreachable the sync proceeds by URL, as before. A resolved record whose post ID disagrees fails as `CONFLICT_REVIEW_REQUIRED`.
- **Thread slug integrity.** `npm run verify:thread-slugs` fails if any `essay-threads.json` slug does not resolve to a rendered essay (it never edits assignments). Runs in the Substack sync workflow before the registry is committed.
- **Publication drift report.** `npm run report:publication-drift` → `reports/publication-drift.{json,md}`: 46 Atlas records with a Substack counterpart; 36 in sync, 10 publication evolution (date differences under human-reviewed aliases), 0 identity-review-suggested.
- **Identity decisions.** `data/publications/identity-decisions.json` records pairs awaiting a human `same-work` / `distinct-work` decision. Pending: e66 ↔ `substack-186514312` (*The Signal Everyone Is Trying to Replace* / *The Missing Signal Isn't Metabolic*) and e92 ↔ `substack-180506588` (*Chronic Illness Is a Paused Process*). A decision is validated by `verify:substack-sync` but does not merge, alias, or re-route anything; acting on it is a separate reviewed step. The five older date-only candidates (e7, e67, e71, e74, e96) have no identity evidence and are not recorded as matches.
- **Tests:** `npm run test:publication-integrity`, `test:substack-sync`, `verify:substack-sync`, `verify:thread-slugs`.

### Cohesion Phase 3 — Deferred (not started; requires approval)

- Editorial integration of the 49 registry-only essays (canonical records, Threads for the 19 without, any Atlas role); classify newer writing.
- Human decisions on the two pending identity pairs; 74 Medium-only essays in the republication backlog.
- Meaning / Time density; Territory status labels.
- Swapped concept-default evidence for `time` / `meaning` (not reader-visible: every open journey authors its own evidence).
- Deep links from Threads / essays into Territory, concept, or question positions in the Atlas.
- Journey return from book evidence sources.
- Plus the Atlas 2.0 remaining items above (`ConnectionKind` rename, further Shelves belonging, larger Atlas redesign).
