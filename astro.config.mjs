import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://apurba.top',
  trailingSlash: 'always',
  integrations: [sitemap()],
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
    '/blog': '/',
    '/projects': '/portfolio/',
  },
});
