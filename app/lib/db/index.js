import fs from 'node:fs';
import path from 'node:path';
import * as schema from './schema.js';

export { schema };

let dbPromise;

// Returns the Drizzle client.
// - DATABASE_URL set (Vercel + Neon): Neon's HTTP driver.
// - DATABASE_URL unset (local only): an embedded PGlite database in .data/pglite,
//   migrated automatically, so local edits never touch production content.
export function getDb() {
  dbPromise ??= createDb();
  return dbPromise;
}

async function createDb() {
  const url = process.env.DATABASE_URL;

  if (url) {
    const { neon } = await import('@neondatabase/serverless');
    const { drizzle } = await import('drizzle-orm/neon-http');
    return drizzle(neon(url), { schema });
  }

  if (process.env.VERCEL) {
    throw new Error('DATABASE_URL is not set. Connect a Neon database to this Vercel project.');
  }

  const { drizzle } = await import('drizzle-orm/pglite');
  // Next.js bundles route handlers and pages separately, so the client lives on
  // globalThis: two PGlite instances on one folder would not see each other's writes.
  globalThis.__pgliteClient ??= openPglite();
  return drizzle(await globalThis.__pgliteClient, { schema });
}

async function openPglite() {
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  const { migrate } = await import('drizzle-orm/pglite/migrator');
  const dataDir = path.join(process.cwd(), '.data', 'pglite');
  fs.mkdirSync(dataDir, { recursive: true });
  const client = new PGlite(dataDir);
  await migrate(drizzle(client), { migrationsFolder: path.join(process.cwd(), 'drizzle') });
  return client;
}
