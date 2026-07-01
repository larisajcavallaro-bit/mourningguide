'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function ReviewForm() {
  const { user } = useUser();
  const [authorName, setAuthorName] = useState(user?.fullName ?? user?.firstName ?? '');
  const [authorEmail, setAuthorEmail] = useState(user?.primaryEmailAddress?.emailAddress ?? '');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName, authorEmail, rating, title, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not submit review');
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="admin-panel">
        <h2>Thank you</h2>
        <p style={{ margin: 0, color: '#594b43', lineHeight: 1.65 }}>
          Your review was submitted and will appear on our site after our team moderates it.
        </p>
        <Link href="/reviews" style={{ display: 'inline-block', marginTop: 16, color: '#c57b57', fontWeight: 600, textDecoration: 'none' }}>
          Back to reviews →
        </Link>
      </div>
    );
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label htmlFor="authorName">Your name</label>
      <input id="authorName" value={authorName} onChange={e => setAuthorName(e.target.value)} required />

      <label htmlFor="authorEmail">Email</label>
      <input id="authorEmail" type="email" value={authorEmail} onChange={e => setAuthorEmail(e.target.value)} required />

      <label htmlFor="rating">Rating</label>
      <select id="rating" value={rating} onChange={e => setRating(Number(e.target.value))}>
        {[5, 4, 3, 2, 1].map(n => (
          <option key={n} value={n}>{n} star{n === 1 ? '' : 's'}</option>
        ))}
      </select>

      <label htmlFor="title">Headline (optional)</label>
      <input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="What stood out to you?" />

      <label htmlFor="body">Your review</label>
      <textarea id="body" value={body} onChange={e => setBody(e.target.value)} required placeholder="Share what Mourning Guide helped you with…" />

      {error && <p style={{ color: '#991b1b', fontSize: '0.88rem' }}>{error}</p>}

      <button type="submit" className="admin-btn primary" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  );
}
