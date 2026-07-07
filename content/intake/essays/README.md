# Medium essay import

Add essays to Living Terrain with **five fields**. The import workflow generates everything else.

## What you provide

Create `content/intake/essays/<slug>.essay.json`:

| Field | Required | Example |
|-------|----------|---------|
| `title` | yes | `"Constraint Is Not the Opposite of Freedom"` |
| `mediumUrl` | yes | `"https://medium.com/illumination/..."` |
| `subtitle` | yes | One-line description / deck |
| `publishedAt` | yes | `"2026-06-24"` |
| `featuredImage` | no | `"./images/my-essay.jpg"` (path relative to intake file) |

Optional `overrides` for curation (themes, questions, rationales) — see `_template.essay.json`.

## What gets generated

| Output | Where it lives |
|--------|----------------|
| **Chamber page** (lantern reading room) | `/essays/<slug>` — auto from atlas |
| **Constellation node** | Home sky, orbits major concept at level 3 |
| **Neighboring concepts** | Theme + echo/parent connections |
| **"What this touches"** | Relationship panel via `theme`, `pathway`, `chamber`, `volume` edges |
| **Suggested threads** | Observatory pathway fit scores |
| **Observatory category** | Major concept cluster |
| **Return to constellation** | `/?focus=<essay-id>` ("On the map" link) |

Imported essays merge into the atlas via `lib/atlas/imports/` — **no edits to `lib/atlas/data.ts` per essay**.

## Commands

```bash
# 1. Create intake file from a title
npm run content:essay:new -- "My Essay Title"

# 2. Edit the JSON — fill mediumUrl, subtitle, date, optional image

# 3. Preview the full import plan (no writes)
npm run content:essay:preview -- content/intake/essays/my-essay-title.essay.json

# 4. Apply when the plan looks right
npm run content:essay:apply -- content/intake/essays/my-essay-title.essay.json

# List pending intakes
npm run content:essay:list
```

After `apply`:
- Essay module written to `lib/atlas/imports/essays/<slug>.ts`
- Manifest regenerated at `lib/atlas/imports/index.ts`
- Intake archived to `content/intake/essays/applied/`
- Featured image copied to `public/images/essays/<slug>.jpg`
- Preview saved to `content/intake/essays/preview/<slug>.plan.json`

## Working with Cursor

Paste essay details into chat and ask Cursor to:

1. Create or fill the intake JSON
2. Run `content:essay:preview` and refine `overrides` if themes or questions need adjustment
3. Run `content:essay:apply` when you approve

See `.cursor/rules/medium-essay-import.mdc` for agent instructions.

## Design principles

- **Intake schema is frozen** — only optional `overrides` extend it
- **Core atlas stays hand-curated** — imported essays are additive modules
- **IDs auto-increment** (`e3`, `e4`, …) from existing essays
- **Slugs auto-generate** from title with collision handling
- **Inference is overridable** — you curate; the system proposes

## Not imported automatically

This workflow does **not** fetch Medium content. Full essay text stays on Medium; Living Terrain holds metadata, relationships, and the chamber landing page.
