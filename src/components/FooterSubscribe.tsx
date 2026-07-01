'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function FooterSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/marketing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not subscribe');

      setStatus('done');
      setMessage(data.alreadySubscribed
        ? "You're already on the list."
        : "You're subscribed. Watch for thoughtful updates from us.");
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h4>Stay in the know</h4>
      <p>Thoughtful guidance and updates.</p>
      <label>
        <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Email address</span>
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={status === 'loading'}
        />
      </label>
      <button type="submit" disabled={status === 'loading'} aria-label="Subscribe">
        ›
      </button>
      {message && (
        <p style={{ margin: '10px 0 0', fontSize: '0.78rem', lineHeight: 1.5, color: status === 'error' ? '#991b1b' : '#594b43' }}>
          {message}
        </p>
      )}
      <p style={{ margin: '10px 0 0', fontSize: '0.72rem', lineHeight: 1.5, color: '#9a7a6a' }}>
        <Link href="/unsubscribe" style={{ color: '#9a7a6a' }}>Unsubscribe</Link>
        {' · '}
        Account holders can also opt out in Settings.
      </p>
    </form>
  );
}
