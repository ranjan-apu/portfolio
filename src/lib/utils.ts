import type { CollectionEntry } from 'astro:content';

export function slugFromId(id: string): string {
  return id.replace(/\.md$/, '');
}

/** Turn a post URL like /2026/08/14/my-post/ into the [...slug] route param. */
export function routeFromUrl(url: string): string {
  return url.replace(/^\//, '').replace(/\/$/, '');
}

export function postUrl(entry: CollectionEntry<'blog'>): string {
  const d = new Date(entry.data.date);
  const slug = slugFromId(entry.id);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `/${year}/${month}/${day}/${slug}/`;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateISO(date: Date | string): string {
  return new Date(date).toISOString();
}

export function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

// Tiny self-check; run with: bun run src/lib/utils.ts
if (import.meta.main) {
  const sample = {
    id: 'load-balancer-and-rate-limiter.md',
    data: { date: new Date('2026-08-14') },
  } as CollectionEntry<'blog'>;

  const url = postUrl(sample);
  if (url !== '/2026/08/14/load-balancer-and-rate-limiter/') {
    throw new Error(`Unexpected URL: ${url}`);
  }
  if (routeFromUrl(url) !== '2026/08/14/load-balancer-and-rate-limiter') {
    throw new Error(`Unexpected route: ${routeFromUrl(url)}`);
  }
  if (slugFromId('books/ddia/chapter-1.md') !== 'books/ddia/chapter-1') {
    throw new Error('slugFromId did not strip the extension');
  }
  console.log('✓ utils self-check passed:', url);
}
