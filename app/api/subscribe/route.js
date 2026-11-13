import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { getDb, schema } from '@/app/lib/db';
import { EMAIL_RE, cleanStrings, saveLead } from '@/app/lib/leads';

const LIMITS = { firstName: 100, lastName: 100, email: 254, page: 200 };

// "Become a Zinger" newsletter sign-up. Stored with the contact submissions
// (source = 'newsletter') and listed under Zingers in the dashboard.
export async function POST(request) {
  let body;
  try {
    body = request.headers.get('content-type')?.includes('application/json')
      ? await request.json()
      : Object.fromEntries(await request.formData());
  } catch {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  // Honeypot filled in: pretend success so bots don't retry.
  if (body?.website) return NextResponse.json({ ok: true });

  const entry = cleanStrings(body, LIMITS);
  entry.email = entry.email.toLowerCase();
  if (!entry.firstName || !EMAIL_RE.test(entry.email)) {
    return NextResponse.json({ message: 'Please add your first name and a valid email.' }, { status: 400 });
  }

  try {
    const db = await getDb();
    const { submissions } = schema;
    const [existing] = await db.select({ id: submissions.id }).from(submissions)
      .where(and(eq(submissions.source, 'newsletter'), eq(submissions.email, entry.email))).limit(1);
    if (!existing) {
      await saveLead({
        firstName: entry.firstName,
        lastName: entry.lastName,
        email: entry.email,
        subject: 'Newsletter sign-up',
        message: '',
        source: 'newsletter',
        details: { page: entry.page },
      }, { title: '🍋 New Zinger' });
    }
  } catch (err) {
    console.error('[Subscribe error]', err);
    return NextResponse.json({ message: 'Sign-up failed. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
