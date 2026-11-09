/**
 * Verifies every internal href/src in the built site, including #fragment ids.
 * Runs after `astro build`, so it catches broken routes, renamed files and
 * anchor drift that the type checker cannot see.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const errors = [];
const pages = new Map(); // url path -> { file, ids }
let linkCount = 0;

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function urlForFile(file) {
  const rel = relative(DIST, file).split('\\').join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

if (!statSync(DIST, { throwIfNoEntry: false })) {
  console.error('dist/ not found. Run `bun run build` first.');
  process.exit(1);
}

for (const file of walk(DIST)) {
  if (!file.endsWith('.html')) continue;
  const html = readFileSync(file, 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  pages.set(urlForFile(file), { file, ids });
}

function resolvePath(pathname) {
  const clean = pathname.replace(/^\//, '');
  if (clean === '') return 'index.html';
  const candidates = [clean];
  if (!/\.[a-z0-9]+$/i.test(clean)) {
    candidates.unshift(join(clean, 'index.html'));
  }
  if (clean.endsWith('/')) candidates.unshift(join(clean, 'index.html'));
  return candidates
    .map((candidate) => join(DIST, candidate))
    .find((candidate) => statSync(candidate, { throwIfNoEntry: false }));
}

for (const [pageUrl, { file }] of pages) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    const raw = match[2];
    if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(raw)) continue;
    if (raw.startsWith('//')) continue;
    linkCount++;

    const [pathname, fragment] = raw.split('#');
    const targetUrl = pathname === '' ? pageUrl : pathname;
    const target = pathname === '' ? file : resolvePath(pathname);

    if (!target) {
      errors.push(`${pageUrl} → ${raw} (file missing)`);
      continue;
    }

    if (fragment) {
      let ids;
      if (pathname === '') ids = pages.get(pageUrl)?.ids;
      else {
        const key = targetUrl.endsWith('/') ? targetUrl : targetUrl;
        ids = pages.get(key)?.ids ?? pages.get(`${key}/`)?.ids;
      }
      if (ids && !ids.has(fragment)) {
        errors.push(`${pageUrl} → ${raw} (missing #${fragment})`);
      }
    }
  }
}

console.log(`Checked ${linkCount} internal links across ${pages.size} pages.`);
if (errors.length) {
  console.error(`\n${errors.length} broken link(s):`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}
console.log('No broken internal links.');
