// Run with: node --test app/lib/body-html.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bodyHtml } from './body-html.js';

const blob = 'https://abc.public.blob.vercel-storage.com/uploads/a.png';

test('blob images go through the optimiser, lazily', () => {
  const out = bodyHtml(`<img fetchpriority="high" width="1024" src="${blob}" srcset="${blob} 1024w" alt="x" />`);
  assert.match(out, /src="\/_next\/image\?url=https%3A%2F%2Fabc\.public\.blob\.vercel-storage\.com%2Fuploads%2Fa\.png&amp;w=1080&amp;q=75"/);
  assert.match(out, / 640w, /);
  assert.match(out, /loading="lazy"/);
  assert.doesNotMatch(out, /fetchpriority|1024w/);
});

test('other hosts are left alone', () => {
  const tag = '<img src="https://example.com/a.png" alt="" />';
  assert.equal(bodyHtml(tag), tag);
});

test('image-only links get a name', () => {
  assert.match(bodyHtml(`<a href="https://amzn.to/x"><img src="${blob}" alt="" /></a>`), /<a href="https:\/\/amzn\.to\/x" aria-label="Shop on Amazon">/);
  assert.match(bodyHtml('<a href="https://www.target.com/p"><img src="/a.png" alt="" /></a>'), /aria-label="Visit target\.com"/);
  const named = '<a href="https://amzn.to/x"><img src="/a.png" alt="Cake" /></a>';
  assert.equal(bodyHtml(named), named);
});
