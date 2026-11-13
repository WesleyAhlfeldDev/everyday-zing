import { NextResponse } from 'next/server';
import { EMAIL_RE, cleanStrings, saveLead } from '@/app/lib/leads';

const LIMITS = {
  firstName: 100, lastName: 100, email: 254, service: 100, budget: 100, timeline: 100,
  subject: 200, message: 5000,
};
const REQUIRED = ['firstName', 'lastName', 'email', 'subject', 'message'];

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  // Honeypot filled in: pretend success so bots don't retry.
  if (body?.website) return NextResponse.json({ ok: true });

  const entry = cleanStrings(body, LIMITS);
  const missing = REQUIRED.filter((key) => !entry[key]);
  if (missing.length || !EMAIL_RE.test(entry.email)) {
    return NextResponse.json({ message: 'Please fill in all required fields.' }, { status: 400 });
  }

  try {
    await saveLead({ ...entry, source: 'contact' }, { title: '📬 New contact form submission' });
  } catch (err) {
    console.error('[Contact submission error]', err);
    return NextResponse.json({ message: 'Submission failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
