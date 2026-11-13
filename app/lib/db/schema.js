import {
  pgTable, serial, text, integer, boolean, jsonb, timestamp, uniqueIndex, index,
} from 'drizzle-orm/pg-core';

// One table for every editable content type: pages, posts, categories.
// Type-specific fields live in `fields` (shape defined in app/lib/content-schema.js)
// so new fields never need a migration.
export const entries = pgTable('entries', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(), // 'page' | 'post' | 'category'
  slug: text('slug').notNull(),
  title: text('title').notNull().default(''),
  status: text('status').notNull().default('draft'), // 'draft' | 'published'
  sortOrder: integer('sort_order').notNull().default(0),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  fields: jsonb('fields').notNull().default({}),
  seo: jsonb('seo').notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('entries_type_slug_idx').on(t.type, t.slug),
  index('entries_type_status_idx').on(t.type, t.status),
]);

// Site-wide key/value settings, e.g. the main navigation menu.
export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  url: text('url').notNull().unique(),
  pathname: text('pathname').notNull(),
  filename: text('filename').notNull(),
  contentType: text('content_type'),
  size: integer('size'),
  alt: text('alt').notNull().default(''),
  // Original WordPress URL for imported files, so re-running the import is idempotent.
  sourceUrl: text('source_url').unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  service: text('service').notNull().default(''),
  subject: text('subject').notNull().default(''),
  message: text('message').notNull(),
  budget: text('budget').notNull().default(''),
  timeline: text('timeline').notNull().default(''),
  // 'contact' (contact form) | 'newsletter' ("Become a Zinger" sign-up)
  source: text('source').notNull().default('contact'),
  // Extra context, e.g. where on the site a sign-up came from.
  details: jsonb('details').notNull().default({}),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('submissions_created_at_idx').on(t.createdAt),
]);

