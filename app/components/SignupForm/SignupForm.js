'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './SignupForm.module.scss';

// "Become a Zinger" newsletter sign-up. `layout="row"` lines the fields up
// side by side (the band); `layout="stack"` stacks them (the post sidebar).
export default function SignupForm({ layout = 'row', idPrefix = 'join' }) {
  const pathname = usePathname();
  const [state, setState] = useState({ status: 'idle', message: '' });

  async function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState({ status: 'sending', message: '' });
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, page: pathname }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Something went wrong. Please try again.');
      setState({ status: 'done', message: `You’re in, ${data.firstName}. Welcome to the Zingers!` });
    } catch (err) {
      setState({ status: 'error', message: err.message });
    }
  }

  if (state.status === 'done') {
    return <p className={styles.done} role="status">{state.message}</p>;
  }

  return (
    <form className={`${styles.form} ${layout === 'stack' ? styles.stack : ''}`} onSubmit={submit} action="/api/subscribe" method="post">
      <label htmlFor={`${idPrefix}-first`}>
        <span>First name</span>
        <input id={`${idPrefix}-first`} name="firstName" autoComplete="given-name" required maxLength={100} />
      </label>
      <label htmlFor={`${idPrefix}-email`}>
        <span>Email</span>
        <input id={`${idPrefix}-email`} name="email" type="email" autoComplete="email" required maxLength={254} />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" className={styles.trap} aria-hidden="true" />
      <button type="submit" className="btn-zing" disabled={state.status === 'sending'}>
        {state.status === 'sending' ? 'Joining…' : 'Count me in'}
      </button>
      <p className={styles.fine}>
        Emails about new posts, giveaways and partner deals. Unsubscribe any time.{' '}
        <Link href="/privacy-policy">Privacy Policy</Link>
      </p>
      {state.status === 'error' && <p className={styles.error} role="alert">{state.message}</p>}
    </form>
  );
}
