# Substack-first essay import

Substack is the canonical first publication for Living Terrain. The website keeps a chamber for each essay with metadata, excerpt, concepts, questions, and relationships. Medium is optional secondary distribution; full essay text is not duplicated here.

## Intake fields

Create `content/intake/essays/<slug>.essay.json` with:

- `title`, `subtitle`, and `publishedAt` (`YYYY-MM-DD`)
- `canonicalUrl`: the canonical published URL, normally the Substack post
- `substackUrl`: the same Substack post URL (may be used alone and becomes canonical)
- `mediumUrl`: optional Medium mirror
- `publicationStatus`: `draft`, `scheduled`, `published`, or `archived`
- optional `featuredImage` and curation `overrides`

During migration, an existing intake containing only `mediumUrl` remains valid. It produces a legacy Medium-only chamber and does not imply that a Substack post exists.

## Commands

```bash
npm run content:essay:new -- "My Essay Title"
npm run content:essay:preview -- content/intake/essays/my-essay-title.essay.json
npm run content:essay:apply -- content/intake/essays/my-essay-title.essay.json
npm run content:essay:list
```

Preview before applying. Applying writes the atlas module, regenerates the manifest, archives the intake, and copies an optional image. It does not fetch full prose.

## Read-only migration inventory

```bash
npm run content:substack:inventory
npm run content:substack:inventory -- https://livingterrain.substack.com/feed /tmp/substack-inventory.json
```

The inventory compares all website essay titles and dates with the public Substack RSS feed. It reports exact matches, uncertain title matches, feed-missing essays, date conflicts, and duplicate post titles. RSS may expose only a recent window, so “missing” never means confirmed unpublished. The command changes no essay records; an output file is written only when explicitly supplied.

## Content invariants

- Preserve existing essay IDs, slugs, routes, and relationships.
- Do not add inferred Atlas relationships during publication migration.
- Do not duplicate full Substack prose in the website record.
- Never infer publication status from a title match.
