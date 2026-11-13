// Adds pages that exist in the code but not yet in the database (e.g. a page
// added after the WordPress import), using PAGE_DEFAULTS and LEGAL_CONTENT, and
// adds a menu link for each one listed in MENU_LINKS. Never changes pages or
// links that exist, except with --legal, which rewrites the legal pages' header
// and text from scripts/legal-pages.mjs (other fields and SEO are kept).
//
//   npm run seed:pages
//   npm run seed:pages -- --legal
//
// Uses DATABASE_URL when set, otherwise the embedded local database.

import { and, eq } from 'drizzle-orm';
import { getDb, schema } from '../app/lib/db/index.js';
import { PAGE_PATHS } from '../app/lib/content-schema.js';
import { PAGE_DEFAULTS } from './page-defaults.mjs';
import { LEGAL_CONTENT } from './legal-pages.mjs';

const UPDATE_LEGAL = process.argv.includes('--legal');
const legalFields = (l) => ({ hero: { title: l.title, subtext: l.subtext }, body: l.body });

const TITLES = { shop: 'Shop', ...Object.fromEntries(Object.entries(LEGAL_CONTENT).map(([k, l]) => [k, l.title])) };
// Menu links to add after the link to `after` (or at the end).
const MENU_LINKS = [{ label: 'Shop', url: '/shop', after: '/blog' }];

const db = await getDb();
const { entries, settings } = schema;

console.log('Pages');
for (const slug of Object.keys(PAGE_PATHS)) {
  const legal = LEGAL_CONTENT[slug];
  const [row] = await db.select({ id: entries.id, fields: entries.fields }).from(entries)
    .where(and(eq(entries.type, 'page'), eq(entries.slug, slug))).limit(1);
  if (row) {
    if (UPDATE_LEGAL && legal) {
      await db.update(entries)
        .set({ title: legal.title, fields: { ...row.fields, ...legalFields(legal) }, updatedAt: new Date() })
        .where(eq(entries.id, row.id));
      console.log(`  ✓ rewrote ${slug}`);
    }
    continue;
  }
  await db.insert(entries).values({
    type: 'page',
    slug,
    title: TITLES[slug] || slug.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()),
    status: 'published',
    publishedAt: new Date(),
    fields: legal ? legalFields(legal) : structuredClone(PAGE_DEFAULTS[slug] || {}),
    seo: {},
  });
  console.log(`  ✓ added ${slug}`);
}

// Legal pages dropped from the code (e.g. the giveaway rules) come out too.
const RETIRED = ['giveaway-rules'];
for (const slug of RETIRED) {
  const gone = await db.delete(entries)
    .where(and(eq(entries.type, 'page'), eq(entries.slug, slug))).returning({ id: entries.id });
  if (gone.length) console.log(`  ✓ removed ${slug}`);
}

console.log('Menu');
const [menuRow] = await db.select().from(settings).where(eq(settings.key, 'main_menu')).limit(1);
const items = Array.isArray(menuRow?.value) ? [...menuRow.value] : [];
let changed = false;
for (const link of MENU_LINKS) {
  if (items.some((i) => i.url === link.url)) continue;
  const at = items.findIndex((i) => i.url === link.after);
  const id = Math.max(0, ...items.map((i) => Number(i.id) || 0)) + 1;
  items.splice(at === -1 ? items.length : at + 1, 0, { id, label: link.label, url: link.url });
  changed = true;
  console.log(`  ✓ added ${link.label}`);
}
if (changed) {
  if (menuRow) await db.update(settings).set({ value: items }).where(eq(settings.key, 'main_menu'));
  else await db.insert(settings).values({ key: 'main_menu', value: items });
}

console.log('Done.');
process.exit(0);
