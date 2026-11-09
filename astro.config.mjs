import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The sitemap integration only sees final URLs, so build a slug → lastmod map
 * from post frontmatter here. Slugs are matched on the last URL segment, which
 * keeps this independent of the /YYYY/MM/DD/ URL format in lib/utils.ts.
 */
function postLastmods() {
  const dir = 'src/content/blog';
  const map = new Map();
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const raw = readFileSync(join(dir, file), 'utf8');
    if (/^draft:\s*true/m.test(raw)) continue;
    const date = raw.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m)?.[1];
    const updated = raw.match(/^updated:\s*(\d{4}-\d{2}-\d{2})/m)?.[1];
    if (date) map.set(file.replace(/\.md$/, ''), updated ?? date);
  }
  return map;
}

const lastmods = postLastmods();

// https://astro.build/config
export default defineConfig({
  site: 'https://apurba.top',
  trailingSlash: 'always',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/saved/'),
      serialize: (item) => {
        const slug = item.url.replace(/\/$/, '').split('/').pop();
        const lastmod = slug ? lastmods.get(slug) : undefined;
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
      defaultColor: false,
      wrap: true,
    },
  },
  redirects: {
    '/fun': '/portfolio/',
    '/projects': '/portfolio/',
    // The writing index moved; /blog used to point at the homepage.
    '/blog': '/archives/',
    // Removed posts: keep the old dated URLs from 404ing.
    '/2026/07/20/hello-world/': '/archives/',
    '/2026/06/10/building-a-cli-tool-that-stays-useful/': '/archives/',
  },
});
