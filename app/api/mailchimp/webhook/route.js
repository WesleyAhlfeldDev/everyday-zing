import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { applyMailchimpChange, changeEmail } from '@/app/lib/mailchimp';
import { ADMIN_PATH } from '@/app/lib/admin-path';

// Mailchimp calls this whenever the audience changes, so the Zingers list
// updates within seconds. Set it up in Mailchimp under Audience → Settings →
// Webhooks with the URL
//   https://everyday-zing.com/api/mailchimp/webhook?secret=<MAILCHIMP_WEBHOOK_SECRET>
// ticking subscribes, unsubscribes, profile updates, cleaned addresses and
// email changes, from all three sources.

function authorised(request) {
  const expected = process.env.MAILCHIMP_WEBHOOK_SECRET;
  const given = new URL(request.url).searchParams.get('secret') || '';
  if (!expected || given.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

// Mailchimp checks the URL with a GET when the webhook is saved.
export function GET(request) {
  if (!authorised(request)) return new NextResponse('Not found', { status: 404 });
  return new NextResponse('OK');
}

export async function POST(request) {
  if (!authorised(request)) return new NextResponse('Not found', { status: 404 });

  let form;
  try {
    form = await request.formData();
  } catch {
    return new NextResponse('Bad request', { status: 400 });
  }
  const get = (key) => form.get(key)?.toString() || '';
  const type = get('type');
  const email = get('data[email]');
  const names = { firstName: get('data[merges][FNAME]').trim(), lastName: get('data[merges][LNAME]').trim() };
  // fired_at is "YYYY-MM-DD HH:MM:SS" in UTC.
  const firedAt = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(get('fired_at')) ? new Date(`${get('fired_at').replace(' ', 'T')}Z`) : null;

  try {
    if (type === 'subscribe') await applyMailchimpChange({ email, status: 'subscribed', ...names, at: firedAt });
    else if (type === 'unsubscribe') await applyMailchimpChange({ email, status: get('data[action]') === 'delete' ? 'archived' : 'unsubscribed' });
    else if (type === 'cleaned') await applyMailchimpChange({ email, status: 'cleaned' });
    else if (type === 'profile') await applyMailchimpChange({ email, ...names, overwriteNames: true });
    else if (type === 'upemail') await changeEmail(get('data[old_email]'), get('data[new_email]'));
    // 'campaign' events need nothing.
  } catch (err) {
    console.error('[Mailchimp webhook error]', type, err.message);
    // A 500 makes Mailchimp retry later.
    return new NextResponse('Error', { status: 500 });
  }

  revalidatePath(ADMIN_PATH, 'layout');
  return new NextResponse('OK');
}
