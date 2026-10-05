# portfolio

Personal site — blog, notes, and portfolio.

Live at [apurba.top](https://apurba.top).

Built with [Astro](https://astro.build) 7, statically generated. No client
framework; the only JavaScript is a few small inline scripts (theme toggle,
project filter, code-block reveal).

## Stack

- **Astro 7** with the Content Layer API (`glob()` loaders, zod-validated schemas)
- **TypeScript** in strict mode, checked with `astro check`
- **Shiki** for syntax highlighting, **astro-og-canvas** for build-time OG images
- **Sass-free** — plain CSS with custom-property theming (day/night)

## Layout

```
src/
├── content.config.ts   blog + notes collection schemas
├── content/            markdown (blog/, notes/)
├── components/         .astro components + inline scripts
├── layouts/            BaseLayout → BlogPost, NoteLayout
├── pages/              routes, RSS feed, OG image route
├── data/               projects.ts, experience.ts
├── lib/utils.ts        URL, date, and reading-time helpers
└── styles/global.css   design tokens and resets
```

## Commands

| Command         | Action                                        |
| --------------- | --------------------------------------------- |
| `bun install`   | Install dependencies                          |
| `bun run dev`   | Dev server at `localhost:4321`                |
| `bun run check` | Typecheck (must pass before pushing)          |
| `bun run test`  | Run the `lib/utils.ts` self-check             |
| `bun run build` | Production build to `dist/`                   |
| `bun run preview` | Preview the production build locally        |

## Content

**Blog posts** live in `src/content/blog/*.md` and require this frontmatter:

```yaml
---
title: "Post title"
date: 2026-08-14          # sets the URL: /YYYY/MM/DD/slug/
author: "Apurba"
description: "One-line summary, used for SEO and OG cards."
tags: ["systems", "backend"]
draft: false               # true keeps it out of the build
---
```

**Notes** live in `src/content/notes/**.md`, grouped by category and topic:

```yaml
---
title: "Note title"
category: "books"
topic: "ddia"
order: 0
description: "Optional."
---
```

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

## Deploying

Static output — build to `dist/` and serve it from any host or CDN. The build
expects `site` in `astro.config.mjs` to be set for canonical URLs, sitemap, and
RSS.

## Links

- Site: [apurba.top](https://apurba.top)
- Résumé: [public/resume.pdf](public/resume.pdf)
<!-- dummy PR check -->
