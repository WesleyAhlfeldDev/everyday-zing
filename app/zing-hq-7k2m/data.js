import 'server-only';
import { and, asc, count, desc, eq, gte, sql } from 'drizzle-orm';
import { getDb, schema } from '@/app/lib/db';
import { PAGE_PATHS } from '@/app/lib/content-schema';

const { entries, media, settings, submissions } = schema;

const ORDER = {
  page: [asc(entries.id)],
  post: [desc(entries.publishedAt), desc(entries.id)],
  category: [asc(entries.sortOrder), asc(entries.title)],
};

export async function listEntries(type) {
  const db = await getDb();
  const rows = await db.select({
    id: entries.id, slug: entries.slug, title: entries.title, status: entries.status,
    sortOrder: entries.sortOrder, publishedAt: entries.publishedAt, updatedAt: entries.updatedAt,
    fields: entries.fields,
  }).from(entries).where(eq(entries.type, type)).orderBy(...ORDER[type]);

  // Keep pages in site-navigation order.
  if (type === 'page') {
    const order = Object.keys(PAGE_PATHS);
    rows.sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
  }
  // Only the bits the list cards show, not every field.
  return rows.map(({ fields, ...row }) => ({
    ...row,
    thumbnail: fields?.featured_image?.url || fields?.image?.url || null,
    summary: fields?.excerpt || fields?.description || fields?.hero?.subtext || '',
    category: fields?.category || '',
    color: fields?.color || '',
  }));
}

export async function getEntry(type, id) {
  const db = await getDb();
  const [row] = await db.select().from(entries)
    .where(and(eq(entries.type, type), eq(entries.id, id))).limit(1);
  return row ?? null;
}

export async function getMenuItems() {
  const db = await getDb();
  const [row] = await db.select().from(settings).where(eq(settings.key, 'main_menu')).limit(1);
  return Array.isArray(row?.value) ? row.value : [];
}

export async function listMedia() {
  const db = await getDb();
  return db.select().from(media).orderBy(desc(media.createdAt), desc(media.id));
}

export async function listSubmissions() {
  const db = await getDb();
  return db.select().from(submissions).where(eq(submissions.source, 'contact')).orderBy(desc(submissions.createdAt));
}

export async function getOverview() {
  const db = await getDb();
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const categoryOf = sql`${entries.fields}->>'category'`;
  const [byType, [unread], recentPosts, categories, postCats, [subscribers], [newSubscribers], recentMessages] = await Promise.all([
    db.select({ type: entries.type, status: entries.status, n: count() }).from(entries).groupBy(entries.type, entries.status),
    db.select({ n: count() }).from(submissions).where(and(eq(submissions.read, false), eq(submissions.source, 'contact'))),
    db.select().from(entries).where(eq(entries.type, 'post'))
      .orderBy(desc(entries.updatedAt), desc(entries.publishedAt)).limit(6),
    db.select({ slug: entries.slug, title: entries.title, fields: entries.fields }).from(entries)
      .where(eq(entries.type, 'category')).orderBy(asc(entries.sortOrder), asc(entries.title)),
    db.select({ category: categoryOf, n: count() }).from(entries)
      .where(and(eq(entries.type, 'post'), eq(entries.status, 'published')))
      .groupBy(categoryOf),
    db.select({ n: count() }).from(submissions).where(eq(submissions.source, 'newsletter')),
    db.select({ n: count() }).from(submissions).where(and(eq(submissions.source, 'newsletter'), gte(submissions.createdAt, weekAgo))),
    db.select().from(submissions).where(eq(submissions.source, 'contact')).orderBy(desc(submissions.createdAt)).limit(4),
  ]);

  const counts = {};
  for (const r of byType) {
    counts[r.type] ??= { published: 0, draft: 0 };
    counts[r.type][r.status] = Number(r.n);
  }
  const perCategory = Object.fromEntries(postCats.map((r) => [r.category ?? '', Number(r.n)]));

  return {
    counts,
    unread: Number(unread?.n ?? 0),
    recentPosts,
    categories: categories.map((c) => ({ ...c, posts: perCategory[c.slug] || 0 })),
    subscribers: Number(subscribers?.n ?? 0),
    newSubscribers: Number(newSubscribers?.n ?? 0),
    recentMessages,
  };
}

export async function listSubscribers() {
  const db = await getDb();
  return db.select().from(submissions).where(eq(submissions.source, 'newsletter')).orderBy(desc(submissions.createdAt));
}

// Dates as ISO strings, ready for client components and datetime inputs.
export function serializeEntry(row) {
  return {
    ...row,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
