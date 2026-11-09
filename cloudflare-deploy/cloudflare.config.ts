import { defineConfig } from 'cf/config';

// Single deploy target: the `portfolio` Worker serves apurba.top from ./dist.
export default defineConfig(() => ({
  worker: {
    name: 'portfolio',
    compatibilityDate: '2026-10-05',
    compatibilityFlags: [],
    placement: { mode: 'smart' },
    cache: { enabled: true },
    assets: { notFoundHandling: '404-page' },
  },
}));
