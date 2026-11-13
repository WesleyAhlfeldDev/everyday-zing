// One-time (re-runnable) import of all WordPress content into the site database.
//
//   npm run import:wordpress
//
// Reads NEXT_PUBLIC_WORDPRESS_API_URL / NEXT_PUBLIC_WORDPRESS_URL for the source,
// DATABASE_URL for the target (embedded local DB when unset), and copies every
// image the site uses into Vercel Blob when BLOB_READ_WRITE_TOKEN is set.
// Safe to run repeatedly: entries are upserted by type + slug, and images
// already copied are reused.

import path from 'node:path';
import { and, eq } from 'drizzle-orm';
import { put } from '@vercel/blob';
import { getDb, schema } from '../app/lib/db/index.js';
import { LEGAL_PAGES, PAGE_PATHS, schemaFor } from '../app/lib/content-schema.js';
import { PAGE_DEFAULTS } from './page-defaults.mjs';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const DRY_RUN = process.argv.includes('--dry-run');

if (!API_URL || !WP_URL) {
  console.error('Set NEXT_PUBLIC_WORDPRESS_API_URL and NEXT_PUBLIC_WORDPRESS_URL.');
  process.exit(1);
}

// The WordPress origin over http or https (older content uses http).
const WP_ORIGIN_RE = `https?://${escapeRe(new URL(WP_URL).host)}`;

const db = await getDb();
const { entries, media, settings } = schema;
const stats = { entries: 0, images: 0, reused: 0 };

// ── WordPress fetching ─────────────────────────────────────────────────────

async function wp(endpoint) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} fetching ${url}`);
  return res.json();
}

async function wpAll(endpoint) {
  const sep = endpoint.includes('?') ? '&' : '?';
  const out = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${API_URL}${endpoint}${sep}per_page=100&page=${page}`);
    if (res.status === 400) break; // past the last page
    if (!res.ok) throw new Error(`${res.status} fetching ${endpoint}`);
    const batch = await res.json();
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out;
}

// ── Media ──────────────────────────────────────────────────────────────────

const mediaById = new Map();
const migrated = new Map(); // WordPress URL → new URL

async function mediaInfo(id) {
  if (!mediaById.has(id)) {
    mediaById.set(id, wp(`/media/${id}`).then(
      (m) => ({ url: m.source_url, alt: m.alt_text || '' }),
      () => null,
    ));
  }
  return mediaById.get(id);
}

// Copies one WordPress file into Vercel Blob (once) and returns its new URL.
// Without a Blob token the original URL is kept so the import still works.
async function migrateFile(sourceUrl, alt = '') {
  if (!sourceUrl) return null;
  sourceUrl = sourceUrl.replace(/^http:/, 'https:');
  if (!BLOB || !sourceUrl.startsWith(WP_URL)) return sourceUrl;
  if (migrated.has(sourceUrl)) return migrated.get(sourceUrl);

  const promise = (async () => {
    const [existing] = await db.select().from(media).where(eq(media.sourceUrl, sourceUrl)).limit(1);
    if (existing) {
      stats.reused++;
      return existing.url;
    }
    if (DRY_RUN) return sourceUrl;

    const res = await fetch(sourceUrl);
    if (!res.ok) {
      console.warn(`  ! could not download ${sourceUrl} (${res.status}); keeping original URL`);
      return sourceUrl;
    }
    const body = Buffer.from(await res.arrayBuffer());
    const filename = decodeURIComponent(path.posix.basename(new URL(sourceUrl).pathname));
    const contentType = res.headers.get('content-type') || undefined;
    // Pass the token explicitly: otherwise the SDK prefers a pulled VERCEL_OIDC_TOKEN,
    // which Vercel rejects outside its own environments.
    const blob = await put(`uploads/${filename}`, body, {
      access: 'public', addRandomSuffix: true, contentType, token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    await db.insert(media).values({
      url: blob.url, pathname: blob.pathname, filename, contentType, size: body.length, alt, sourceUrl,
    }).onConflictDoNothing();
    stats.images++;
    console.log(`  ↑ ${filename}`);
    return blob.url;
  })();

  migrated.set(sourceUrl, promise);
  return promise;
}

async function toImage(value) {
  let info = null;
  if (typeof value === 'number') info = await mediaInfo(value);
  else if (value && typeof value === 'object' && value.url) info = { url: value.url, alt: value.alt || '' };
  if (!info?.url) return null;
  return { url: await migrateFile(info.url, info.alt), alt: info.alt };
}

// Copies images referenced in HTML and points links at the new site.
async function migrateHtml(html) {
  if (!html) return '';
  let out = html.replace(/\s(?:srcset|sizes)="[^"]*"/g, '');

  const uploadUrls = new Set(out.match(new RegExp(`${WP_ORIGIN_RE}/wp-content/uploads/[^"'\\s)]+`, 'g')) || []);
  for (const url of uploadUrls) {
    out = out.split(url).join(await migrateFile(url));
  }
  // Remaining links to the WordPress domain become site-relative.
  return out.replace(new RegExp(`(href=")${WP_ORIGIN_RE}/?`, 'g'), '$1/');
}

function escapeRe(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── Field conversion ───────────────────────────────────────────────────────

// Converts ACF values to the dashboard's field shapes, keeping only the
// fields defined in content-schema.js.
async function convertFields(defs, source) {
  const src = source && typeof source === 'object' ? source : {};
  const out = {};
  for (const def of defs) {
    if (def.flatten) {
      Object.assign(out, await convertFields(def.fields, src));
      continue;
    }
    const value = src[def.name];
    switch (def.type) {
      case 'group':
        out[def.name] = await convertFields(def.fields, value);
        break;
      case 'repeater':
        out[def.name] = Array.isArray(value)
          ? await Promise.all(value.map((item) => convertFields(def.fields, item)))
          : [];
        break;
      case 'image':
        out[def.name] = await toImage(value);
        break;
      case 'link':
        out[def.name] = value && typeof value === 'object' && (value.url || value.title)
          ? { title: value.title || '', url: relativeUrl(value.url || ''), target: value.target || '' }
          : null;
        break;
      case 'html':
        out[def.name] = await migrateHtml(value || '');
        break;
      case 'toggle':
        out[def.name] = Boolean(value);
        break;
      default:
        out[def.name] = value == null ? '' : String(value);
    }
  }
  return out;
}

function relativeUrl(url) {
  return url.replace(new RegExp(`^${WP_ORIGIN_RE}`), '') || '/';
}

function decodeEntities(str = '') {
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&hellip;/g, '…').replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function excerptText(html = '') {
  return decodeEntities(
    html.replace(/<a[^>]*class="more-link"[\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, ''),
  ).replace(/\s+/g, ' ').trim();
}

async function convertSeo(yoast) {
  if (!yoast) return {};
  const seo = {};
  if (yoast.title) seo.title = decodeEntities(yoast.title);
  if (yoast.description) seo.description = decodeEntities(yoast.description);
  const og = yoast.og_image?.[0]?.url;
  if (og) seo.og_image = await toImage({ url: og, alt: '' });
  if (yoast.robots?.index === 'noindex') seo.noindex = true;
  return seo;
}

// ── Upsert ─────────────────────────────────────────────────────────────────

async function upsert(type, item, { fields, sortOrder = 0 }) {
  const row = {
    type,
    slug: item.slug,
    title: decodeEntities(item.title?.rendered || ''),
    status: item.status === 'publish' || item.status === undefined ? 'published' : 'draft',
    sortOrder,
    publishedAt: item.date_gmt ? new Date(`${item.date_gmt}Z`) : null,
    fields,
    seo: await convertSeo(item.yoast_head_json),
    updatedAt: new Date(),
  };
  stats.entries++;
  console.log(`  ✓ ${type}: ${row.slug}`);
  if (DRY_RUN) return;
  await db.insert(entries).values(row).onConflictDoUpdate({
    target: [entries.type, entries.slug],
    set: { ...row, type: undefined, slug: undefined },
  });
}

// ── Run ────────────────────────────────────────────────────────────────────

console.log(`Importing from ${WP_URL}${DRY_RUN ? ' (dry run)' : ''}`);
if (!BLOB) console.warn('BLOB_READ_WRITE_TOKEN is not set: images will keep their WordPress URLs.\n');

// Elementor pages carry their layout in Elementor data, not in fields, so the
// home, about, blog and contact pages start from PAGE_DEFAULTS (copied from the
// live site) and keep any fields already edited in the dashboard.
async function existingFields(type, slug) {
  const [row] = await db.select({ fields: entries.fields }).from(entries)
    .where(and(eq(entries.type, type), eq(entries.slug, slug))).limit(1);
  return row?.fields && Object.keys(row.fields).length ? row.fields : null;
}

// Removes Elementor's inline <style> blocks and wrapper noise from page HTML.
function cleanElementor(html = '') {
  return html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<link[^>]*>/g, '');
}

console.log('Pages');
const wpPages = await wpAll('/pages?status=publish');
for (const page of wpPages) {
  const slug = page.slug === 'welcome' ? 'home' : page.slug;
  if (!(slug in PAGE_PATHS)) {
    console.log(`  – skipping page "${page.slug}" (no matching route)`);
    continue;
  }
  let fields = await existingFields('page', slug);
  if (!fields) {
    fields = structuredClone(PAGE_DEFAULTS[slug] || {});
    if (LEGAL_PAGES.includes(slug)) {
      fields.hero = { title: decodeEntities(page.title?.rendered || ''), subtext: '' };
      fields.body = await migrateHtml(cleanElementor(page.content?.rendered));
    }
    for (const key of ['image', 'welcome']) {
      if (fields[key]?.url) fields[key] = await toImage(fields[key]);
    }
    if (fields.welcome) {
      for (const key of ['image', 'image_2']) {
        if (fields.welcome[key]?.url) fields.welcome[key] = await toImage(fields.welcome[key]);
      }
    }
  }
  await upsert('page', { ...page, slug }, { fields });
}

console.log('Categories');
const wpCategories = (await wpAll('/categories')).filter((c) => c.slug !== 'uncategorized');
const CHAPTER_ORDER = ['pink', 'orange', 'aqua', 'lemon', 'leaf', 'lime', 'night'];
const CATEGORY_COLOURS = {
  'shopping-finds': 'pink',
  'the-recipe-box': 'orange',
  'body-soul': 'aqua',
  'zingy-finds': 'lemon',
  'the-money-tree': 'leaf',
  'favorite-places-spaces': 'lime',
  'down-the-rabbit-hole': 'night',
};
// WordPress has no category descriptions; these are starting text to edit in the dashboard.
const CATEGORY_DESCRIPTIONS = {
  'body-soul': 'Skincare, wellness and the small habits that keep body and mind in good shape.',
  'down-the-rabbit-hole': 'Curious finds, deep dives and the things I couldn’t stop reading about.',
  'favorite-places-spaces': 'Home projects, makeovers and the places I love to spend time.',
  'shopping-finds': 'Outfits, try-ons and the pieces I’m actually wearing, from Amazon to Nordstrom.',
  'the-money-tree': 'Practical tips for saving, spending smarter and planning ahead.',
  'the-recipe-box': 'Easy, crowd-pleasing recipes for weeknights, holidays and get-togethers.',
  'zingy-finds': 'Books, gadgets and little discoveries that add a bit of zing.',
};
for (const [i, cat] of wpCategories.entries()) {
  const kept = await existingFields('category', cat.slug);
  await upsert('category', { slug: cat.slug, title: { rendered: cat.name } }, {
    fields: kept || {
      color: CATEGORY_COLOURS[cat.slug] || CHAPTER_ORDER[i % CHAPTER_ORDER.length],
      description: decodeEntities(cat.description || '') || CATEGORY_DESCRIPTIONS[cat.slug] || '',
      image: null,
    },
    sortOrder: (i + 1) * 10,
  });
}
const categorySlug = new Map(wpCategories.map((c) => [c.id, c.slug]));

console.log('Posts');
for (const post of await wpAll('/posts?_embed=true')) {
  const fields = await convertFields(schemaFor('post'), {
    ...post.acf,
    excerpt: excerptText(post.excerpt?.rendered),
    content: cleanElementor(post.content?.rendered),
  });
  fields.category = (post.categories || []).map((id) => categorySlug.get(id)).find(Boolean) || '';
  const featured = post._embedded?.['wp:featuredmedia']?.[0];
  fields.featured_image = featured?.source_url
    ? await toImage({ url: featured.source_url, alt: featured.alt_text || '' })
    : null;
  await upsert('post', post, { fields });
}

console.log('Menu');
// WordPress exposes no menu endpoint here; start from the live site's links once.
const [menuRow] = await db.select().from(settings).where(eq(settings.key, 'main_menu')).limit(1);
if (!menuRow && !DRY_RUN) {
  const items = [
    { id: 1, label: 'Blog', url: '/blog' },
    { id: 2, label: 'About', url: '/about' },
    { id: 3, label: 'Contact', url: '/contact' },
  ];
  await db.insert(settings).values({ key: 'main_menu', value: items });
  console.log(`  ✓ ${items.length} links`);
} else {
  console.log('  – kept the existing menu');
}

console.log(`\nDone: ${stats.entries} entries, ${stats.images} images copied, ${stats.reused} already copied.`);
process.exit(0);
