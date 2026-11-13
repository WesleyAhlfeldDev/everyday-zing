// Applies pending migrations from ./drizzle. Runs before every build.
// Locally without DATABASE_URL, getDb() migrates the embedded database itself.
import path from 'node:path';
import { getDb } from '../app/lib/db/index.js';

const db = await getDb();

if (process.env.DATABASE_URL) {
  const { migrate } = await import('drizzle-orm/neon-http/migrator');
  await migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') });
}

console.log('Database migrations are up to date.');
process.exit(0);
