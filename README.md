# apurba.top

Personal site — engineering case studies, writing, notes, and a résumé that
prints cleanly.

Live at [apurba.top](https://apurba.top). Statically generated with
[Astro](https://astro.build); no client framework, and the only shipped
JavaScript is a handful of small progressive-enhancement scripts (theme,
search, filters, bookmarks, code tools).

## Stack

- **Astro 7** with the Content Layer API (`glob()` loaders, zod-validated schemas)
- **TypeScript** in strict mode, checked with `astro check`
- **Shiki** dual-theme highlighting, **astro-og-canvas** for build-time OG cards
- **Self-hosted fonts** — Source Serif 4 (display and body), IBM Plex Mono
  (code/labels), plus Latin Modern for the résumé replica. Latin subsets only,
  preloaded, with licences in `public/fonts/`.
- **Plain CSS** with custom-property theming (day/night) and a five-step type scale
- **Cloudflare Workers static assets**, deployed with the `cf` CLI

## Layout

```
src/
├── content.config.ts   blog + notes collection schemas
├── content/            markdown (blog/, notes/)
├── components/         .astro components, Icon.astro, inline scripts
├── layouts/            BaseLayout → BlogPost, NoteLayout
├── pages/              routes, RSS feed, OG image route, sitemap input
├── data/               projects.ts, caseStudies.ts, experience.ts, resume.ts
├── lib/                posts.ts, bookmarks.ts, utils.ts
└── styles/global.css   tokens, resets, prose, shared details
scripts/
└── check-links.mjs     post-build internal link + anchor audit
```

## Commands

| Command               | Action                                            |
| --------------------- | ------------------------------------------------- |
| `bun install`         | Install dependencies                              |
| `bun run dev`         | Dev server at `localhost:4321`                    |
| `bun run check`       | Typecheck (required in CI)                        |
| `bun run test`        | Run the `lib/utils.ts` self-check                 |
| `bun run build`       | Production build to `dist/`                       |
| `bun run check:links` | Verify internal links and `#fragments` in `dist/` |
| `bun run format`      | Format with Prettier                              |
| `bun run deploy`      | Build and deploy the `portfolio` Worker with `cf` |

## Content

**Blog posts** live in `src/content/blog/*.md`:

```yaml
---
title: 'Post title'
date: 2026-08-14 # sets the URL: /YYYY/MM/DD/slug/
author: 'Apurba'
description: 'One-line summary, used for SEO and OG cards.'
tags: ['systems', 'backend']
draft: false # true keeps it out of the build, RSS and sitemap
---
```

**Notes** live in `src/content/notes/**.md`, grouped by category and topic:

```yaml
---
title: 'Note title'
category: 'books'
topic: 'ddia'
order: 0
description: 'Optional.'
---
```

Topic pages are generated from tags. `topicLabel()` in `src/lib/posts.ts` owns
the display names, so `ai` renders as “AI” and `distributed-systems` as
“Distributed systems”.

### Code block reveal

A code fence containing a line of just `◊` splits the block into steps that
animate in on scroll:

````markdown
```python
def a():
◊
    def b():
◊
    c()
```
````

The copy button always copies the original source without the markers.

## Fonts

Fonts are self-hosted rather than imported at runtime, so URLs stay stable and
the two critical faces can be preloaded in `BaseLayout.astro`. To refresh one:

```bash
bun add -d @fontsource-variable/source-serif-4
cp node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2 \
   node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-italic.woff2 \
   public/fonts/
```

Each family ships its OFL licence beside the font files. `@font-face` rules live
at the top of `src/styles/global.css`. IBM Plex Mono is a static family, so the
400/500/600 latin files are copied individually; Source Serif 4 is variable.

The résumé page loads the exact LaTeX optical sizes: **Latin Modern Roman 12**
for body text, **17** for the name, and **Caps 10** for section headings
(`public/fonts/lmroman*.woff2`, GUST Font Licence).

## Résumé

`public/resume.pdf` is the LaTeX-built PDF and the source of truth. `/resume/`
is an HTML replica built with the same Latin Modern cuts, A4 proportions and
point sizes; its **Download PDF** button serves that exact file, and printing
the page produces the same one-page document.

To update it, recompile the LaTeX résumé, replace `public/resume.pdf`, and mirror
the changed text in `src/data/resume.ts`. There is no PDF generation step in the
build.

## Deploying

Static output served from the `portfolio` Worker. `bun run deploy` builds the
site, then runs `cf deploy` from `cloudflare-deploy/`, where
`cloudflare.config.ts` sets the Worker name and compatibility date and
`wrangler.config.ts` points the build at `../dist`.

The `cf` login can see more than one account, so non-interactive runs (CI or a
script) need `CLOUDFLARE_ACCOUNT_ID` as well as `CLOUDFLARE_API_TOKEN`.
Interactive `cf deploy` prompts for the account.

- `public/_headers` sets caching, HSTS, `nosniff`, a referrer policy, and a CSP.
  `script-src` still allows `'unsafe-inline'` for the theme bootstrap and
  JSON-LD emitted by Astro; everything else is same-origin.
- `.github/workflows/ci.yml` runs typecheck, unit checks, build, and the link
  audit on every pull request and push to `main`.
- `public/_redirects` turns `/blog`, `/projects`, `/fun` and the retired posts
  into real 301s (Astro also emits meta-refresh pages as a fallback).
- `.github/workflows/deploy.yml` deploys on push to `main` when
  `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are configured; otherwise it
  skips with a notice so a fresh clone stays green.

## Links

- Site: [apurba.top](https://apurba.top)
- Résumé: [public/resume.pdf](public/resume.pdf)
