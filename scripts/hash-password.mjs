// Prints an ADMIN_USERS entry (and a fresh SESSION_SECRET) for .env.local / Vercel.
// Usage: npm run admin:hash-password
// A new admin can run this themselves and send back only the printed entry,
// so nobody else ever sees their password.
import { randomBytes, scryptSync } from 'node:crypto';
import { createInterface } from 'node:readline/promises';

const rl = createInterface({ input: process.stdin, output: process.stdout });
const email = (await rl.question('Admin email: ')).trim().toLowerCase();
const password = await rl.question('New admin password: ');
rl.close();

if (!/^[^\s@=,]+@[^\s@=,]+$/.test(email)) {
  console.error('That doesn\'t look like an email address.');
  process.exit(1);
}
if (password.length < 12) {
  console.error('Use at least 12 characters.');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);

console.log('\nAdd this to ADMIN_USERS (comma-separated if there are others already):');
console.log(`${email}=scrypt:${salt.toString('base64url')}:${hash.toString('base64url')}`);
console.log('\nOnly if you are setting up SESSION_SECRET for the first time (changing it signs everyone out):');
console.log(`SESSION_SECRET=${randomBytes(32).toString('base64url')}`);
