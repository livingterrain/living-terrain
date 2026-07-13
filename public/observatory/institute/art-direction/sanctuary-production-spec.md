# Sanctuary Production Spec

**Status:** Active — blocks all other environment work  
**Derived from:** `04-sanctuary.png` (primary), `05-arrival.png` (secondary)  
**Frozen runtime:** Camera spline, FOV, scroll, damping, route — do not change  
**Anchor origin:** World `(0, 0, 0)` · Tree base center `(0, 0, APSE_TREE_Z)` where `APSE_TREE_Z = -53`

---

## Reference cameras (match exactly in Blender)

| Beat | Scroll t | Camera position | Look-at | FOV |
|------|----------|-----------------|---------|-----|
| **04 Sanctuary** | 0.88 | `(0, 2.123, -43.1)` | `(0, 2.09, -49.05)` | 47.2° |
| **05 Arrival** | 1.00 | `(0, 2.18, -50.0)` | `(0, 2.14, -54.0)` | 46.0° |

Aspect ratio: **16:9** (match storyboard frames)  
Filmback equivalent: full-frame horizontal FOV as listed; verify in Blender with sensor fit **horizontal**.

Import these as two named cameras: `CAM_Sanctuary_04` and `CAM_Arrival_05`. All modeling is judged from these views only.

---

## 1. Tree — dimensions, silhouette, placement

### Placement (world space)

| Property | Value | Notes |
|----------|-------|-------|
| Trunk base center | `(0, 0, -53)` | On planter floor, not floating |
| Primary trunk axis | Vertical with **2–5° forward lean** toward rose | Adds life; visible in frame 04 |
| Trunk bifurcation | **Single hero tree** — may split into 2–3 major trunks above 3m | Frame 05 reads as twin trunks **from one root mass**, not two separate trees |

### Scale (approved concept proportions)

| Measure | Target | Frame 04 read | Frame 05 read |
|---------|--------|---------------|---------------|
| **Total height** (ground → highest foliage) | **11.5–12.5 m** | Canopy fills upper 35–45% of frame | Canopy forms overhead ceiling |
| **Trunk base diameter** | **1.4–1.8 m** (flare to 2.2 m with roots) | Massive, monument-like | Trunks frame view left/right |
| **Canopy spread** (widest point) | **9–11 m** | 55–65% of frame width at approach | Branches extend past frame edges |
| **Primary branch count** | **5–8 major limbs** | Clear hierarchy, not radial symmetry | Dappled openings toward rose |
| **Root spread** | **4.5–6 m** radius | Roots flow over planter lip onto steps | Roots anchor tree to stone at ground |

### Silhouette requirements (gray-shade pass)

- Trunk reads as **sculpted organic form**, not cylinder
- Branch hierarchy visible **without leaves**
- Roots **continuous** with trunk — no floating tubers
- Canopy mass asymmetrical — heavier slightly left or right, not perfect sphere
- Tree occupies **40–60% of frame height** at CAM_Sanctuary_04
- Tree must **silhouette against rose** at CAM_Sanctuary_04 — dark organic vs bright glass

### What NOT to build

- Canopy geometry behind camera at CAM_Arrival_05 (only overhead + forward-facing masses)
- Roots, branches, or foliage outside camera frustum at either beat
- Separate decorative trees — one hero only

---

## 2. Architecture — apse, planter, steps, rose, framing

All dimensions relative to tree base `(0, 0, -53)`.

### Planter basin

| Property | Value |
|----------|-------|
| Outer diameter (top lip) | 6.8 m |
| Inner planting area | 5.2 m |
| Rim height | 0.45 m |
| Rim profile | Carved stone, cracked, moss in joints |
| Floor of basin | Y = 0.0 (ground plane) |

Roots emerge from trunk and **flow over rim** onto steps — integrated, not placed on top.

### Sanctuary steps

| Property | Value |
|----------|-------|
| Front edge (lowest tread) | Z ≈ **-46.5** |
| Tread count | 3 visible from camera |
| Rise / run | 0.14 m / 0.45 m per tread |
| Width | 8.5 m (narrows toward tree) |
| Side profile | Worn, chipped edges; moss in corners |

Visible at frame 04 as foreground horizontal lines leading to tree.

### Apse framing (camera-visible only)

Build **half-apse** — only what appears in frames 04 and 05:

| Element | Position | Notes |
|---------|----------|-------|
| Curved apse wall (left + right segments) | X ± **3.8–5.2 m**, Z **-52 to -55** | Carved niches, ivy; **no back wall behind camera** |
| Transverse arch / hood | Z ≈ **-42** (existing `APSE_ENTRANCE_Z`) | Visible at approach edge of frame 04 top |
| Side statue niches | X ± **4.0 m**, Y **1.5–3.0 m** | Optional silhouettes; low detail OK in shadow |
| Apse vault suggestion | Above rose, Y **7–10 m** | 3–4 rib curves converging toward rose — **not full vault** |

### Rose window

| Property | Value |
|----------|-------|
| Center | `(0, 6.8, -54.5)` |
| Outer diameter | **5.8 m** |
| Frame depth (recess into wall) | **0.65 m** |
| Tracery | Gothic radial + cusped ring — **modeled stone** |
| Glass plane | Single or 3 radial segments; emissive celestial blue |
| Vertical alignment | Rose center **above** canopy mass; tree branches overlap lower 20–30% of rose |

Rose is **behind** tree (more negative Z). Tree at -53, rose at -54.5 — backlit silhouette.

---

## 3. Foreground / midground / background

### Frame 04 — Sanctuary (t = 0.88)

| Layer | Z range (approx) | Contents | Build priority |
|-------|------------------|----------|----------------|
| **Foreground** | -46 to -48 | Step treads (top surfaces), root tips crossing steps, water reflection edge | Hero geo |
| **Midground** | -48 to -53 | Tree trunk, major branches, planter rim, lower foliage | **Hero geo — maximum detail** |
| **Background** | -53 to -56 | Rose window + tracery, apse curve, upper canopy, haze | Hero rose + apse; canopy cards OK |

### Frame 05 — Arrival (t = 1.00)

| Layer | Z range (approx) | Contents | Build priority |
|-------|------------------|----------|----------------|
| **Foreground** | -49 to -50 | Water surface (runtime shader), root bases at feet, step edge | Water = runtime; roots = hero |
| **Midground** | -50 to -53 | Trunk mass rising, branch forks framing view | Hero geo |
| **Background** | -53 to -56 | Rose through branch gaps, god-ray volume, apse silhouettes | Rose + atmosphere |

---

## 4. Lighting intent — warm / cool

### Cool (primary in sanctuary — frames 04 & 05)

| Source | Color | Role |
|--------|-------|------|
| Rose window emissive | `#6a9ec8` → `#98c8f0` | **Key light** — backlights tree, fills apse |
| Side apse ambient bounce | `#4a6878` | Soft fill on stone |
| Volumetric god-rays | `#88b0d8` at 8–15% opacity | Dust reveals light shafts (runtime + Blender volume) |

### Warm (memory only — not primary here)

Sanctuary frames carry **threshold warmth as memory**, not as local source. No warm lamp in sanctuary hero assets. Nave behind camera may still carry warm bounce from runtime lights — do not add hero warm lights to sanctuary GLB.

### Contrast rule

Tree trunk silhouette: **dark warm-neutral** (`#1a1410` albedo) against **cool bright** rose (`#7090b8` emissive). This contrast is mandatory in pass/fail.

### Runtime lighting note (frozen rig — tune values only after GLB)

Existing crossing cool directional + rose point light remain. Adjust intensity to match concept **after** GLB import — do not restructure light rig.

---

## 5. Geometry vs cards / textures / runtime effects

| Element | Real geometry | Cards / texture / runtime |
|---------|---------------|---------------------------|
| Trunk + major branches (≤ 6 cm dia) | ✅ Sculpted mesh | — |
| Small twigs (< 6 cm) | Optional geo | Alpha cards acceptable |
| Canopy foliage | Base volumes for shadow | **80% foliage cards** with alpha |
| Roots on planter + steps | ✅ Sculpted | Moss = texture overlay |
| Planter + steps + apse stone | ✅ Sculpted | Moss/ grime = PBR + vertex paint |
| Rose tracery stone frame | ✅ Sculpted | — |
| Rose glass | Thin mesh or plane | Emissive + stained texture |
| Apse vault ribs (visible portion) | ✅ Low-poly geo | — |
| Statues in niches | Silhouette blocks OR skip | Detail not readable |
| Ivy hanging | 30% geo vines | 70% alpha cards on stone |
| God-rays / haze | — | Runtime `InstituteAtmosphere` |
| Dust motes | — | Runtime `InstituteLife` |
| Water reflection | — | Runtime `InstituteWater` shader |
| Floor beyond steps | — | Existing runtime floor (unchanged until later pass) |

**Gray-shade rule:** Trunk, roots, branches, planter, steps, apse curve, rose frame must read in **flat gray render** before any PBR.

---

## 6. Minimum GLB asset breakdown

Deliver as **one primary assembly** plus optional glass split for transparency sorting.

### `sanctuary-hero.glb` (required)

Single file, origin at `(0, 0, 0)`, tree base at `(0, 0, -53)`.

| Node name | Contents | Approx tris (desktop) |
|-----------|----------|----------------------|
| `SANCTUARY_ApseStone` | Planter, steps, curved apse walls (camera-visible), transverse hood edge | 18k–28k |
| `SANCTUARY_RoseFrame` | Stone tracery, mullions, recess | 8k–12k |
| `SANCTUARY_TreeTrunk` | Trunk + major branches + roots | 25k–40k |
| `SANCTUARY_FoliageCards` | Canopy card clusters (LODs grouped) | 12k–20k |
| `SANCTUARY_Ivy` | Vine cards + key geo strands | 4k–8k |

**Total target:** 70k–100k tris (desktop hero)

### `sanctuary-rose-glass.glb` (optional split)

| Node | Contents |
|------|----------|
| `SANCTUARY_RoseGlass` | Emissive glass planes only |

Use if transparency sorting conflicts with stone in single draw call.

### Materials (embedded or sidecar)

| Slot | Maps |
|------|------|
| `M_Stone_Apse` | albedo, normal, roughness, AO (2K) |
| `M_Bark_Hero` | albedo, normal, roughness (2K) |
| `M_Foliage_Hero` | atlas alpha + normal (2K) |
| `M_Rose_Glass` | emissive + subtle albedo (1K) |
| `M_Moss_Overlay` | alpha mask blended in shader |

Export: **glTF 2.0 + Draco compression**, Y-up, meters, embedded textures or `/textures/` sibling folder.

### Runtime integration (after approval only)

- Load at origin `(0, 0, 0)`
- Disable: `InstituteCrossingApse` procedural meshes, `InstituteSanctuaryTree`, `InstituteRoseWindow` procedural meshes
- Keep: camera, water, atmosphere, dust, floor, lighting rig
- Single swap — no other journey changes

---

## 7. Performance targets

### Desktop

| Metric | Target |
|--------|--------|
| Sanctuary GLB (Draco) | ≤ **8 MB** on wire |
| Textures (embedded) | ≤ **12 MB** total |
| Draw calls (sanctuary) | ≤ **12** |
| Visible tris (sanctuary only) | 70k–100k |
| Frame time budget (sanctuary in view) | ≤ **4 ms** GPU on M1 / equivalent |
| Load add to journey | ≤ **500 ms** after first byte |

### Mobile

| Metric | Target |
|--------|--------|
| Sanctuary GLB (Draco) | ≤ **4 MB** |
| Textures | 1K versions, ≤ **4 MB** |
| Visible tris | ≤ **35k** (LOD1 auto-switch) |
| Foliage cards | 50% count vs desktop |
| Rose glass | Single plane, no parallax |

### LOD strategy

| LOD | Distance trigger | Tris |
|-----|------------------|------|
| LOD0 | Camera t > 0.75 | Full |
| LOD1 | Camera t ≤ 0.75 (approach from mid-nave) | 40% tris, simplified cards |

Only one sanctuary assembly — LOD groups inside GLB.

---

## 8. Pass / fail checklist

Compare Blender render (then runtime screenshot) against `04-sanctuary.png` and `05-arrival.png`.

### Silhouette pass (gray shade, no materials)

- [ ] Tree occupies 40–60% of frame height at CAM_Sanctuary_04
- [ ] Branch hierarchy readable without foliage
- [ ] Roots flow continuously from trunk over planter rim
- [ ] Rose circle clearly defined behind tree mass
- [ ] Apse curve frames tree left and right — not a flat wall
- [ ] Steps visible as foreground horizontals at frame 04
- [ ] No obvious primitive shapes (cylinder, icosahedron, box wall)
- [ ] Cover render with flat `#808080` — composition still matches storyboard

### Frame 04 — Sanctuary match

- [ ] Tree reads as **monument**, not prop
- [ ] Rose backlight creates bright halo around foliage edges
- [ ] Carved stone depth visible at planter and apse
- [ ] Layered depth: steps → tree → rose
- [ ] Cool dominant palette; no warm lamp source
- [ ] Ivy/moss breaks stone regularity
- [ ] Emotional read: sacred destination, not hallway end

### Frame 05 — Arrival match

- [ ] Canopy overhead creates natural ceiling
- [ ] Rose visible through branch gaps
- [ ] Water (runtime) reflects rose + tree at camera feet
- [ ] God-rays / dust visible in light shafts
- [ ] Stillness — no clutter, no symmetric props
- [ ] Human-scale camera vs monumental tree scale

### Runtime integration pass

- [ ] Camera at t=0.88 and t=1.0 matches Blender cameras **without moving spline**
- [ ] Tree anchor at `APSE_TREE_Z = -53` — no z-fighting with water or floor
- [ ] No prototype geometry visible (crossing apse boxes, icosahedron foliage)
- [ ] Random screenshot at t ≥ 0.88 usable as website hero image
- [ ] Side-by-side with storyboard: **"recreation"** not **"interpretation"**

### Fail conditions (stop and revise)

- Tree reads as low-poly primitive or single blob
- Flat end wall instead of curved apse + rose
- Rose appears as flat ring, not recessed tracery
- Roots float or disconnect from trunk
- Architecture symmetric and empty
- Scene only works with materials — silhouette failed

---

## Production sequence (Sanctuary only)

```
1. Import CAM_Sanctuary_04 + CAM_Arrival_05 into Blender
2. Gray-shade blockout → render vs 04-sanctuary.png → APPROVAL GATE A
3. PBR materials + lighting → render vs frames 04 + 05 → APPROVAL GATE B
4. Export sanctuary-hero.glb (+ optional rose-glass)
5. Runtime swap (single integration PR) → screenshot vs frames → APPROVAL GATE C
6. Only then: threshold hero (frame 01)
```

**No work on frames 01–03 until Gate C approved.**

---

## Files

| Asset | Path |
|-------|------|
| Locked storyboards | `public/observatory/institute/art-direction/01–05*.png` |
| Storyboard manifest | `public/observatory/institute/art-direction/frames.json` |
| This spec | `public/observatory/institute/art-direction/sanctuary-production-spec.md` |
| Future GLB | `public/observatory/institute/glb/sanctuary-hero.glb` |
