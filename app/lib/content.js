import { cache } from 'react';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { getDb, schema } from './db';
import { chapterFor } from './chapters';

const { entries, settings } = schema;

function toPublic(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: (row.publishedAt ?? row.createdAt)?.toISOString?.() ?? null,
    fields: row.fields || {},
    seo: row.seo || {},
  };
}

async function getPublished(type, slug) {
  const db = await getDb();
  const [row] = await db.select().from(entries)
    .where(and(eq(entries.type, type), eq(entries.slug, slug), eq(entries.status, 'published')))
    .limit(1);
  return toPublic(row);
}

// Wrapped in cache() so generateMetadata and the page share one query per request.
export const getPage = cache((slug) => getPublished('page', slug));
export const getPost = cache((slug) => getPublished('post', slug));

// Every published post, newest first, without the (large) content field.
export const getPosts = cache(async () => {
  const db = await getDb();
  const rows = await db.select({
    id: entries.id, slug: entries.slug, title: entries.title,
    publishedAt: entries.publishedAt, createdAt: entries.createdAt,
    fields: sql`${entries.fields} - 'content'`,
  }).from(entries)
    .where(and(eq(entries.type, 'post'), eq(entries.status, 'published')))
    .orderBy(desc(entries.publishedAt), desc(entries.id));
  return rows.map(toPublic);
});

// Published posts matching every word of `query` in the title, excerpt or text,
// best matches first (title hits outrank excerpt hits, which outrank body text).
export const searchPosts = cache(async (query = '') => {
  const words = searchWords(query);
  if (!words.length) return [];
  const db = await getDb();
  const body = sql`regexp_replace(coalesce(${entries.fields}->>'content', ''), '<[^>]*>', ' ', 'g')`;
  const excerpt = sql`coalesce(${entries.fields}->>'excerpt', '')`;
  const per = words.map((w) => {
    const like = likePattern(w);
    return {
      match: sql`(${entries.title} ilike ${like} or ${excerpt} ilike ${like} or ${body} ilike ${like})`,
      score: sql`(case when ${entries.title} ilike ${like} then 4 else 0 end
        + case when ${excerpt} ilike ${like} then 2 else 0 end
        + case when ${body} ilike ${like} then 1 else 0 end)`,
    };
  });
  const score = sql.join(per.map((p) => p.score), sql` + `);
  const rows = await db.select({
    id: entries.id, slug: entries.slug, title: entries.title,
    publishedAt: entries.publishedAt, createdAt: entries.createdAt,
    fields: sql`${entries.fields} - 'content'`,
    score: sql`${score}`.mapWith(Number),
  }).from(entries)
    .where(and(eq(entries.type, 'post'), eq(entries.status, 'published'), ...per.map((p) => p.match)))
    .orderBy(desc(sql`${score}`), desc(entries.publishedAt))
    .limit(60);
  return rows.map(toPublic);
});

// Up to six lower-cased words of two letters or more.
export function searchWords(query) {
  return String(query).toLowerCase().slice(0, 100)
    .split(/[^\p{L}\p{N}'’&-]+/u)
    .filter((w) => w.length >= 2)
    .slice(0, 6);
}

// An ILIKE pattern for a word, with %, _ and \ escaped. Apostrophes match
// either the straight or the curly kind.
function likePattern(word) {
  const escaped = word.replace(/[\\%_]/g, (c) => `\\${c}`).replace(/['’]/g, '_');
  return `%${escaped}%`;
}

// Published categories in dashboard order, each with its chapter colour,
// post count and a cover photo (its own, or its newest post's).
export const getCategories = cache(async () => {
  const db = await getDb();
  const [rows, posts] = await Promise.all([
    db.select().from(entries)
      .where(and(eq(entries.type, 'category'), eq(entries.status, 'published')))
      .orderBy(asc(entries.sortOrder), asc(entries.title)),
    getPosts(),
  ]);
  return rows.map(toPublic).map((cat, i) => {
    const own = posts.filter((p) => p.fields.category === cat.slug);
    return {
      ...cat,
      chapter: chapterFor(cat, i),
      count: own.length,
      cover: cat.fields.image?.url ? cat.fields.image : own.find((p) => p.fields.featured_image?.url)?.fields.featured_image || null,
      latest: own[0] || null,
    };
  });
});

export const getCategory = cache(async (slug) => {
  const all = await getCategories();
  return all.find((c) => c.slug === slug) || null;
});

export const getSetting = cache(async (key) => {
  const db = await getDb();
  const [row] = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return row?.value ?? null;
});

export async function getMenu() {
  const items = await getSetting('main_menu');
  return Array.isArray(items) ? items : [];
}

export function formatDate(iso, style = 'long') {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', style === 'short'
    ? { month: 'short', day: 'numeric', year: 'numeric' }
    : { month: 'long', day: 'numeric', year: 'numeric' });
}
