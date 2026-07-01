'use client';

import { FormEvent, useState } from 'react';

export default function UnsubscribeForm({ initialToken }: { initialToken?: string }) {
  const [email, setEmail] = useState('');
  const [token] = useState(initialToken ?? '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(payload: { email?: string; token?: string }) {
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/marketing/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not unsubscribe');

      setStatus('done');
      setMessage(
        data.found
          ? `We've removed ${data.email} from product update emails.`
          : `${data.email} was not on our marketing list, but you're all set.`,
      );
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit({ email, token: token || undefined });
  }

  return (
    <div className="admin-panel">
      {status === 'done' ? (
        <>
          <h2>You&apos;re unsubscribed</h2>
          <p style={{ margin: 0, color: '#594b43', lineHeight: 1.65 }}>{message}</p>
          <p style={{ margin: '16px 0 0', fontSize: '0.86rem', color: '#9a7a6a', lineHeight: 1.6 }}>
            You&apos;ll still receive important account, billing, and security emails if you have a Mourning Guide account.
          </p>
        </>
      ) : (
        <>
          <h2>Unsubscribe from product updates</h2>
          <p style={{ margin: '0 0 18px', color: '#594b43', lineHeight: 1.65 }}>
            Stop receiving thoughtful guidance and product news from Mourning Guide. This does not affect billing receipts,
            activation notices, or other essential account messages.
          </p>
          <form className="admin-form" onSubmit={handleSubmit}>
            {!token && (
              <>
                <label htmlFor="unsubscribe-email">Email address</label>
                <input
                  id="unsubscribe-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  disabled={status === 'loading'}
                />
              </>
            )}
            {token && (
              <p style={{ margin: '0 0 14px', fontSize: '0.88rem', color: '#594b43' }}>
                Confirm you want to unsubscribe using your email link.
              </p>
            )}
            {message && status === 'error' && (
              <p style={{ color: '#991b1b', fontSize: '0.88rem' }}>{message}</p>
            )}
            <button type="submit" className="admin-btn primary" disabled={status === 'loading'}>
              {status === 'loading' ? 'Unsubscribing…' : 'Unsubscribe'}
            </button>
          </form>
          <p style={{ margin: '16px 0 0', fontSize: '0.82rem', color: '#9a7a6a', lineHeight: 1.6 }}>
            Signed in? You can also opt out anytime under Settings → Communications.
          </p>
        </>
      )}
    </div>
  );
}
