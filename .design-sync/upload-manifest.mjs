#!/usr/bin/env node
// Regenerates the upload file list from the live ds-bundle/ and chunks it for
// DesignSync.write_files (256 files max per call, smaller for binary dirs).
// Usage: node .design-sync/upload-manifest.mjs [--only <A,B,C>]
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUT = 'ds-bundle';
const only = (() => {
  const i = process.argv.indexOf('--only');
  return i > -1 ? new Set(process.argv[i + 1].split(',')) : null;
})();

const walk = (d, out = []) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};

// What stays local: dot-prefixed root entries and _screenshots/.
const files = walk(OUT)
  .map((p) => relative(OUT, p))
  .filter((p) => !p.startsWith('.') && !p.startsWith('_screenshots/'))
  .filter((p) => {
    if (!only) return true;
    const m = /^components\/[^/]+\/([^/]+)\//.exec(p) ?? /^_preview\/([^.]+)\./.exec(p);
    return m ? only.has(m[1]) : false;
  })
  .sort();

const binary = (p) => /\.(woff2?|ttf|otf|png|jpg|jpeg|gif|webp)$/.test(p);
const chunks = [];
let cur = [], curBinary = 0;
for (const f of files) {
  const cap = binary(f) ? 6 : 200;
  if (cur.length >= cap || (curBinary && !binary(f)) || (!curBinary && binary(f) && cur.length)) {
    chunks.push(cur); cur = []; curBinary = 0;
  }
  cur.push(f); curBinary = binary(f) ? 1 : 0;
}
if (cur.length) chunks.push(cur);

console.log(JSON.stringify({ total: files.length, chunks: chunks.length, files: chunks }, null, 1));
