# Self-hosted fonts (OFL)

Self-hosted so production builds do not call Google Fonts at compile time.
This avoids a Next.js 15.5 `next/font/google` crash when Google returns
extensionless `/l/font?kit=` URLs (vercel/next.js#99114).

Loaders live in `load.ts`. CSS variables are unchanged from the previous
`next/font/google` setup.

| File | Family | License |
|---|---|---|
| `Inter-latin-variable.woff2` | Inter (latin, variable wght) | SIL OFL 1.1 — `Inter-OFL.txt` |
| `SourceSerif4-latin-variable.woff2` | Source Serif 4 (latin, variable wght) | SIL OFL 1.1 — `SourceSerif4-OFL.txt` |
| `NotoSerif-latin-variable.woff2` | Noto Serif (latin, variable wght) | SIL OFL 1.1 — `NotoSerif-OFL.txt` |
| `NotoSerif-greek-variable.woff2` | Noto Serif (greek, variable wght) | SIL OFL 1.1 — `NotoSerif-OFL.txt` |
| `NotoSerifHebrew-hebrew-variable.woff2` | Noto Serif Hebrew (variable wght) | SIL OFL 1.1 — `NotoSerifHebrew-OFL.txt` |

Sources: `@fontsource-variable/*@5.2.5` (OFL redistributions of the upstream families).
