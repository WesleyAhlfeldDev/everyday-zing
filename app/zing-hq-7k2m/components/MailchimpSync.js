'use client';

import { useState, useTransition } from 'react';
import { syncMailchimp } from '../actions';
import styles from '../admin.module.scss';

// Full catch-up with Mailchimp. Day to day the webhook keeps things current;
// this is for the first connection, or after Mailchimp was unreachable.
export default function MailchimpSync() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState('');

  const run = () => startTransition(async () => {
    setMessage('');
    const r = await syncMailchimp();
    if (!r.ok) { setMessage(r.error); return; }
    const parts = [
      r.added && `${r.added} added from Mailchimp`,
      r.sent && `${r.sent} sent to Mailchimp`,
      r.failed && `${r.failed} Mailchimp wouldn't take`,
    ].filter(Boolean);
    setMessage(parts.length ? `Synced: ${parts.join(', ')}.` : 'Synced: already up to date.');
  });

  return (
    <>
      {message && <span className={styles.muted} role="status">{message}</span>}
      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={run} disabled={pending}>
        {pending ? 'Syncing…' : 'Sync with Mailchimp'}
      </button>
    </>
  );
}
