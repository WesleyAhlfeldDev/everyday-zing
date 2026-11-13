'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Contact.module.scss';

export default function ContactForm() {
  const [state, setState] = useState({ status: 'idle', message: '' });

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ status: 'sending', message: '' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Something went wrong. Please try again.');
      form.reset();
      setState({ status: 'done', message: 'Thank you! Your message is on its way, and I’ll reply soon.' });
    } catch (err) {
      setState({ status: 'error', message: err.message });
    }
  }

  if (state.status === 'done') {
    return <p className={styles.done} role="status">{state.message}</p>;
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label>
        <span>First name</span>
        <input name="firstName" autoComplete="given-name" required maxLength={100} />
      </label>
      <label>
        <span>Last name</span>
        <input name="lastName" autoComplete="family-name" required maxLength={100} />
      </label>
      <label className={styles.full}>
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required maxLength={254} />
      </label>
      <label className={styles.full}>
        <span>Subject</span>
        <input name="subject" required maxLength={200} />
      </label>
      <label className={styles.full}>
        <span>Message</span>
        <textarea name="message" rows={7} required maxLength={5000} />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" className={styles.trap} aria-hidden="true" />
      <div className={styles.full}>
        <button type="submit" className="btn-zing" disabled={state.status === 'sending'}>
          {state.status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p className={styles.fine}>
          I only use your details to reply. See the <Link href="/privacy-policy">Privacy Policy</Link>.
        </p>
        {state.status === 'error' && <p className={styles.error} role="alert">{state.message}</p>}
      </div>
    </form>
  );
}
