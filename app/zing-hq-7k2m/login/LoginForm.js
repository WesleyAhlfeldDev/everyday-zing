'use client';

import { useActionState } from 'react';
import { login } from '../actions';

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <form action={action}>
      <div className="mb-3">
        <label className="form-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="form-control" autoComplete="username" required autoFocus />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" className="form-control" autoComplete="current-password" required />
      </div>
      {state?.error && <div className="alert alert-danger py-2 small">{state.error}</div>}
      <button type="submit" className="btn btn-primary w-100" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
