# Perception First

**The governing constraint for the entire Observatory project**

---

## The goal

The browser experience should feel **impossible**.

Not: *"This is a nice WebGL scene."*  
But: *"How is this running in a browser?"*

Every technical decision supports **the illusion**, not architectural completeness.

---

## The rule

**If 90% of the emotional impact comes from 10% of the geometry, we build the 10%.**

If lighting, silhouettes, fog, reflections, composition, and carefully placed hero assets create the perception of a massive sacred space — we lean into that.

We do **not** build an entire cathedral.

---

## The question

Before any build decision, ask:

> **What is the cheapest way to produce the most beautiful frame?**

This project is about **perception**, not polygon count.

---

## The director

**The camera is the director.**

The environment exists only to support what the camera sees.

- If the camera never sees it, it does not exist.
- If a silhouette reads from fog, do not model what fog hides.
- If a reflection doubles the rose, the water does more work than a back wall.
- If one hero tree carries the sanctuary, the apse behind it can be a curved flat with depth, not a full structural simulation.

Impossible-in-browser is achieved by **composition and craft**, not by simulating reality.

---

## What we optimize for

| Optimize | Do not optimize |
|----------|-----------------|
| Screenshot quality at scroll stops | Total scene triangle count |
| Silhouette and overlap | Structural correctness |
| Light behavior (warm/cool, god-rays) | Complete vault geometry |
| Hero asset craft | Modular bay coverage |
| Atmospheric depth (fog, haze, dust) | Geometry behind fog |
| Reflection and glass color on surfaces | Full interior behind camera |
| Load time and frame time | Asset library completeness |

---

## Cheap tricks that are allowed (when they serve the frame)

These are not compromises — they are the craft:

- **Set flats** — sculpted pier faces seen from one angle, not full volumes
- **Impostors** — billboard foliage or distant mass where parallax is minimal
- **Card clusters** — canopy, ivy, hanging vines
- **Shader water** — one plane that mirrors what matters
- **Fog as geometry** — dissolve what would cost thousands of tris
- **Emissive glass** — luminous without full path-traced caustics
- **Single hero mesh** — one tree, not a forest system
- **Baked lighting hints** — vertex color, AO, lightmap where runtime light is thin
- **Asymmetric dressing** — one side detailed, one side in shadow

If the frame matches the storyboard and the visitor feels the place is real, the trick succeeded.

---

## What we refuse (even if it is "correct")

- Building full nave symmetry because cathedrals have it
- Modeling vaults the camera never looks up to see
- High-poly stone everywhere when midground heroes carry the read
- Procedural systems that scale but do not photograph well
- Adding geometry where fog, light, or reflection already sell depth
- Optimizing for engine metrics over storyboard comparison

---

## How this connects to other documents

| Document | Role |
|----------|------|
| **Perception First** (this document) | Governing constraint — how we spend effort |
| **Visual Language Guide** | Artistic DNA — what the world feels like |
| **Storyboard frames 01–05** | What each frame must look like |
| **Sanctuary production spec** | First hero build, judged against all of the above |

**Order when deciding what to build:**

1. Does the camera see it? (Perception First)
2. Does it match the visual language? (Visual Language Guide)
3. Does it match the approved frame? (Storyboards)
4. What is the minimum geometry to pass? (Production spec)

---

## One sentence

**Build only what the camera photographs beautifully — and make that so convincing the browser disappears.**
