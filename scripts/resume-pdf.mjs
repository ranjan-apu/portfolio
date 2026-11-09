/**
 * Regenerates public/resume.pdf from the built /resume/ page so the PDF can
 * never drift from src/data/experience.ts. The page already carries print CSS.
 *
 * Usage: bun run build && bun run resume:pdf
 * Override the browser with CHROME_BIN=/path/to/chrome.
 */
import { spawn } from 'node:child_process';
import { createReadStream, existsSync, rmSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { extname, join, resolve, sep } from 'node:path';

const PORT = 4399;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const OUTPUT = resolve('public/resume.pdf');
const DIST = resolve('dist');

const CANDIDATES = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const browser = CANDIDATES.find((candidate) => existsSync(candidate));
if (!browser) {
  console.error('No Chromium-based browser found. Set CHROME_BIN to one.');
  process.exit(1);
}
if (!existsSync(join(DIST, 'resume/index.html'))) {
  console.error('dist/resume/index.html missing. Run `bun run build` first.');
  process.exit(1);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

function fileFor(url) {
  const pathname = decodeURIComponent((url ?? '/').split('?')[0]);
  let file = resolve(join(DIST, pathname));
  if (!file.startsWith(DIST + sep)) return null;
  if (pathname.endsWith('/')) file = join(file, 'index.html');
  if (!existsSync(file) && existsSync(join(file, 'index.html'))) file = join(file, 'index.html');
  return existsSync(file) && statSync(file).isFile() ? file : null;
}

const server = createServer((request, response) => {
  const file = fileFor(request.url);
  if (!file) {
    response.writeHead(404).end('Not found');
    return;
  }
  response.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(response);
});

const profileDir = join(tmpdir(), `astro-resume-pdf-${process.pid}`);

function print() {
  return new Promise((done, fail) => {
    const child = spawn(browser, [
      '--headless=new',
      '--disable-gpu',
      '--no-pdf-header-footer',
      '--virtual-time-budget=3000',
      `--user-data-dir=${profileDir}`,
      `--print-to-pdf=${OUTPUT}`,
      `${ORIGIN}/resume/`,
    ]);
    child.on('error', fail);
    child.on('exit', (code) => (code === 0 ? done() : fail(new Error(`browser exited ${code}`))));
  });
}

try {
  await new Promise((done, fail) => {
    server.once('error', fail);
    server.listen(PORT, '127.0.0.1', done);
  });
  await print();
  const size = statSync(OUTPUT).size;
  if (size < 20_000) throw new Error(`PDF looks empty (${size} bytes)`);
  console.log(`Wrote public/resume.pdf (${Math.round(size / 1024)} KB)`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  server.close();
  rmSync(profileDir, { recursive: true, force: true });
}
